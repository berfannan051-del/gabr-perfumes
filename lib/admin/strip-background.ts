export async function stripBackground(file: File): Promise<File> {
  try {
    const { removeBackground } = await import("@imgly/background-removal");
    const blob = await removeBackground(file);
    const cutout = new File([blob], file.name.replace(/\.\w+$/, ".png"), { type: "image/png" });
    return await trimTransparentMargin(cutout);
  } catch (err) {
    // Background removal is a nice-to-have — never block the upload if it fails
    // (e.g. offline, model download blocked, unsupported browser). Logged
    // (not swallowed silently) so a real failure is visible in devtools
    // instead of just looking like "nothing happened".
    console.error("Background removal failed, keeping original image:", err);
    return file;
  }
}

/**
 * Crops a transparent-background image down to its subject's bounding box
 * (plus a small breathing margin) so the subject fills the frame instead of
 * floating in the middle of whatever empty canvas the source photo had.
 */
async function trimTransparentMargin(file: File, marginRatio = 0.06): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0);

    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const alphaThreshold = 10;
    let minX = canvas.width;
    let minY = canvas.height;
    let maxX = -1;
    let maxY = -1;
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        if (data[(y * canvas.width + x) * 4 + 3] > alphaThreshold) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (maxX < minX || maxY < minY) return file;

    const boxW = maxX - minX + 1;
    const boxH = maxY - minY + 1;
    const padX = Math.round(boxW * marginRatio);
    const padY = Math.round(boxH * marginRatio);
    const cropX = Math.max(0, minX - padX);
    const cropY = Math.max(0, minY - padY);
    const cropW = Math.min(canvas.width - cropX, boxW + padX * 2);
    const cropH = Math.min(canvas.height - cropY, boxH + padY * 2);

    const out = document.createElement("canvas");
    out.width = cropW;
    out.height = cropH;
    const octx = out.getContext("2d");
    if (!octx) return file;
    octx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

    const blob = await new Promise<Blob | null>((resolve) => out.toBlob(resolve, "image/png"));
    if (!blob) return file;
    return new File([blob], file.name, { type: "image/png" });
  } catch {
    return file;
  }
}

/**
 * Caps an image to a max dimension (and optionally center-crops it to a
 * square) so uploads from wildly different source photos come out at a
 * consistent, predictable size instead of whatever the admin's camera/phone
 * produced.
 */
export async function resizeImage(
  file: File,
  { maxDimension, square = false }: { maxDimension: number; square?: boolean }
): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    let sx = 0;
    let sy = 0;
    let sw = bitmap.width;
    let sh = bitmap.height;

    if (square) {
      const side = Math.min(sw, sh);
      sx = (sw - side) / 2;
      sy = (sh - side) / 2;
      sw = side;
      sh = side;
    }

    const scale = Math.min(1, maxDimension / Math.max(sw, sh));
    const outW = Math.max(1, Math.round(sw * scale));
    const outH = Math.max(1, Math.round(sh * scale));

    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, outW, outH);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.\w+$/, ".png"), { type: "image/png" });
  } catch {
    return file;
  }
}

/** Resize then strip the background — the standard pipeline for every admin image upload. */
export async function processUploadImage(
  file: File,
  opts: { maxDimension: number; square?: boolean }
): Promise<File> {
  const resized = await resizeImage(file, opts);
  return stripBackground(resized);
}
