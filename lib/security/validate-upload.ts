const ALLOWED_TYPES: Record<string, number[]> = {
  "image/png": [0x89, 0x50, 0x4e, 0x47],
  "image/jpeg": [0xff, 0xd8, 0xff],
  "image/webp": [0x52, 0x49, 0x46, 0x46],
};

const MAX_SIZE = 5 * 1024 * 1024;

export async function validateUploadFile(
  file: File
): Promise<{ ok: true } | { ok: false; reason: "type" | "size" | "content" }> {
  const signature = ALLOWED_TYPES[file.type];
  if (!signature) return { ok: false, reason: "type" };
  if (file.size === 0 || file.size > MAX_SIZE) return { ok: false, reason: "size" };

  const head = Buffer.from(await file.slice(0, 8).arrayBuffer());
  const matches = signature.every((byte, i) => head[i] === byte);
  if (!matches) return { ok: false, reason: "content" };

  return { ok: true };
}

const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

// mp4's signature ("ftyp") sits at byte offset 4, not 0 — its first 4 bytes
// are a box-size field that varies per file, so unlike the image formats
// above there's no fixed byte 0 to check.
const MP4_SIGNATURE = [0x66, 0x74, 0x79, 0x70];
const WEBM_SIGNATURE = [0x1a, 0x45, 0xdf, 0xa3];

export async function validateVideoUploadFile(
  file: File
): Promise<{ ok: true } | { ok: false; reason: "type" | "size" | "content" }> {
  if (file.type !== "video/mp4" && file.type !== "video/webm") return { ok: false, reason: "type" };
  if (file.size === 0 || file.size > MAX_VIDEO_SIZE) return { ok: false, reason: "size" };

  const head = Buffer.from(await file.slice(0, 12).arrayBuffer());
  const isMp4 = file.type === "video/mp4" && MP4_SIGNATURE.every((byte, i) => head[i + 4] === byte);
  const isWebm = file.type === "video/webm" && WEBM_SIGNATURE.every((byte, i) => head[i] === byte);
  if (!isMp4 && !isWebm) return { ok: false, reason: "content" };

  return { ok: true };
}
