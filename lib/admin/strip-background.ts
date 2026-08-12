export async function stripBackground(file: File): Promise<File> {
  try {
    const { removeBackground } = await import("@imgly/background-removal");
    const blob = await removeBackground(file);
    return new File([blob], file.name.replace(/\.\w+$/, ".png"), { type: "image/png" });
  } catch {
    // Background removal is a nice-to-have — never block the upload if it fails
    // (e.g. offline, model download blocked, unsupported browser).
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
