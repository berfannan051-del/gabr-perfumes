/**
 * Only allows same-site relative paths ("/account") as post-login redirect
 * targets. Rejects absolute URLs and protocol-relative paths ("//evil.com")
 * so a crafted `?callbackUrl=` query param can't send an authenticated user
 * off-site (open redirect / phishing vector).
 */
export function safeRedirectPath(target: string | null | undefined, fallback: string): string {
  if (!target) return fallback;
  if (!target.startsWith("/") || target.startsWith("//") || target.startsWith("/\\")) {
    return fallback;
  }
  return target;
}
