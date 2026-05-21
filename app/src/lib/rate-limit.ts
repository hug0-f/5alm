type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();

const CLEANUP_EVERY = 200;
let opsSinceCleanup = 0;

function pruneExpired(now: number): void {
  for (const [key, bucket] of store) {
    if (now >= bucket.resetAt) store.delete(key);
  }
}

export type RateLimitResult = { allowed: boolean; retryAfter: number };

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();

  if (++opsSinceCleanup >= CLEANUP_EVERY) {
    opsSinceCleanup = 0;
    pruneExpired(now);
  }

  const bucket = store.get(key);

  if (!bucket || now >= bucket.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfter: 0 };
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
