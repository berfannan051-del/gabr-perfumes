import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const contentSecurityPolicy = [
  "default-src 'self'",
  // 'wasm-unsafe-eval' is required for the background-removal model
  // (onnxruntime-web) to compile its WebAssembly — without it every
  // background-removal call in the admin fails and silently falls back to
  // the original, unprocessed image.
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://staticimgly.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.r2.dev https://*.r2.cloudflarestorage.com",
  "font-src 'self' data:",
  // Background removal also spawns a Web Worker (from a blob: URL) and
  // fetches its model weights from staticimgly.com.
  "worker-src 'self' blob:",
  "connect-src 'self' https:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
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
        { key: "Content-Security-Policy", value: contentSecurityPolicy },
      ]
    : []),
];

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
      // 5MB per lib/security/validate-upload.ts) — the 1MB Server Action
      // default is too small for that.
      bodySizeLimit: "20mb",
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(nextConfig);
