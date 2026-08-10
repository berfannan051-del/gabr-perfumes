const buckets = new Map<string, { count: number; resetAt: number }>();

/**
 * Dev-grade in-memory fixed-window rate limiter, keyed per process.
 * Swap for a durable store (e.g. Upstash Redis) before scaling past one instance.
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) return false;

  bucket.count += 1;
  return true;
}
