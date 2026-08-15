import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const baseScriptSrc = [
  "'self'",
  "'unsafe-inline'",
  // 'wasm-unsafe-eval' lets the background-removal model (onnxruntime-web)
  // compile WebAssembly. blob: covers its wasm loader, which it fetches
  // and then dynamically import()s from a blob: URL (see ort.min.mjs).
  "'wasm-unsafe-eval'",
  "blob:",
  "https://staticimgly.com",
];

const sharedDirectives = [
  "default-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.r2.dev https://*.r2.cloudflarestorage.com",
  // The hero background video is served from the same R2 host as images —
  // <video src> falls under media-src, which is NOT covered by img-src.
  "media-src 'self' blob: https://*.r2.dev https://*.r2.cloudflarestorage.com",
  "font-src 'self' data:",
  // Background removal also spawns a Web Worker (from a blob: URL) and
  // fetches its model weights from staticimgly.com.
  "worker-src 'self' blob:",
  // onnxruntime-web fetches its wasm loader via fetch(blobUrl) (confirmed
  // via the browser console: "Fetch API cannot load blob:... connect-src")
  // — blob: has to be allowed here too, not just in script-src/worker-src.
  "connect-src 'self' https: blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
];

const contentSecurityPolicy = [`script-src ${baseScriptSrc.join(" ")}`, ...sharedDirectives].join("; ");

// The admin's background-removal pipeline additionally needs 'unsafe-eval':
// onnxruntime-web's non-cross-origin-isolated (single-threaded) fallback
// path evaluates a string as JS during init — confirmed via the exact
// browser CSP violation message — and 'wasm-unsafe-eval' alone doesn't
// cover that. 'unsafe-eval' is a real XSS-severity amplifier, so it's
// scoped to /admin only instead of loosening the whole storefront's CSP.
const adminContentSecurityPolicy = [
  `script-src ${[...baseScriptSrc, "'unsafe-eval'"].join(" ")}`,
  ...sharedDirectives,
].join("; ");

function securityHeadersFor(csp: string) {
  return [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    // CSP/HSTS are production-only: React dev mode relies on eval() for its
    // debugging tools (never used in production builds), and HSTS is
    // meaningless over plain http on localhost.
    ...(process.env.NODE_ENV === "production"
      ? [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Content-Security-Policy", value: csp },
        ]
      : []),
  ];
}

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "*.r2.dev" },
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
    ],
  },
  experimental: {
    serverActions: {
      // Admin product forms can upload several images per submit (each up to
      // 5MB per lib/security/validate-upload.ts), and the hero background
      // video can be up to 50MB — the 1MB Server Action default is far too
      // small for either.
      bodySizeLimit: "60mb",
    },
  },
  async headers() {
    return [
      // When two rules match the same path, Next.js applies the LAST
      // matching one — the admin-specific rule must come after the general
      // one so it actually wins for /admin paths instead of being
      // overridden back to the stricter storefront CSP.
      {
        source: "/:path*",
        headers: securityHeadersFor(contentSecurityPolicy),
      },
      {
        source: "/:locale(ar|en)/admin/:path*",
        headers: securityHeadersFor(adminContentSecurityPolicy),
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(nextConfig);
