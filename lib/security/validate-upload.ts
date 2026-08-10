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
