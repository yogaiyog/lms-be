import type { NextFunction, Request, Response } from "express";

/**
 * Rate limiter fixed-window di memori.
 * Cukup untuk 1 proses (PM2 fork, instances: 1). Jika nanti scale ke >1 instance,
 * ganti store-nya ke Redis / tabel DB.
 *
 * IP diambil dari `req.ip`, yang bergantung pada `trust proxy` (env.TRUST_PROXY).
 */
type Bucket = { count: number; resetAt: number };

type RateLimitOptions = {
  /** Nama unik limiter (dipakai sebagai prefix key). */
  name: string;
  windowMs: number;
  max: number;
  /** Bagian tambahan key, mis. email yang dicoba login. */
  keyExtra?: (req: Request) => string | undefined;
  message?: string;
};

const buckets = new Map<string, Bucket>();

// Bersihkan bucket kedaluwarsa tiap 5 menit supaya Map tidak tumbuh terus.
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}, 5 * 60 * 1000).unref();

export function rateLimit({ name, windowMs, max, keyExtra, message }: RateLimitOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    const extra = keyExtra?.(req)?.toLowerCase().trim();
    const key = `${name}:${req.ip ?? "unknown"}${extra ? `:${extra}` : ""}`;
    const now = Date.now();

    let bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(key, bucket);
    }
    bucket.count += 1;

    const remaining = Math.max(max - bucket.count, 0);
    const retryAfterSec = Math.ceil((bucket.resetAt - now) / 1000);
    res.setHeader("RateLimit-Limit", String(max));
    res.setHeader("RateLimit-Remaining", String(remaining));
    res.setHeader("RateLimit-Reset", String(retryAfterSec));

    if (bucket.count > max) {
      res.setHeader("Retry-After", String(retryAfterSec));
      return res.status(429).json({
        success: false,
        message: message ?? `Terlalu banyak percobaan. Coba lagi dalam ${Math.ceil(retryAfterSec / 60)} menit.`,
        code: "RATE_LIMITED",
      });
    }

    return next();
  };
}

/** Hanya untuk test. */
export function __resetRateLimits() {
  buckets.clear();
}
