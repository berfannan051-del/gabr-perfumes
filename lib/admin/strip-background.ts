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
