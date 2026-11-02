import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { logError } from "@/lib/logging";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

type RateLimitResult = {
  allowed: boolean;
  available: boolean;
  resetAt: number;
};

const localBuckets = new Map<string, { count: number; resetAt: number }>();
const limiters = new Map<string, Ratelimit>();
let requestCount = 0;

function localLimit(key: string, max: number, windowSeconds: number): RateLimitResult {
  const now = Date.now();
  const current = localBuckets.get(key);
  const bucket = !current || current.resetAt <= now
    ? { count: 0, resetAt: now + windowSeconds * 1000 }
    : current;
  bucket.count += 1;
  localBuckets.set(key, bucket);

  requestCount += 1;
  if (requestCount % 256 === 0) {
    for (const [existingKey, entry] of localBuckets) {
      if (entry.resetAt <= now) localBuckets.delete(existingKey);
    }
  }

  return { allowed: bucket.count <= max, available: true, resetAt: bucket.resetAt };
}

export async function enforceRateLimit(
  bucket: string,
  identifier: string,
  max: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const key = `${bucket}:${identifier}`;
  if (!redis) return localLimit(key, max, windowSeconds);

  const limiterKey = `${bucket}:${max}:${windowSeconds}`;
  let limiter = limiters.get(limiterKey);
  if (!limiter) {
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(max, `${windowSeconds} s`),
      prefix: `eksathe:${bucket}`,
      analytics: false,
    });
    limiters.set(limiterKey, limiter);
  }

  try {
    const result = await limiter.limit(identifier);
    return { allowed: result.success, available: true, resetAt: result.reset };
  } catch (error) {
    logError("rate_limit.shared_storage_failed", error);
    return { allowed: false, available: false, resetAt: Date.now() + windowSeconds * 1000 };
  }
}

export const authSecondaryStorage = redis ? {
  get: async (key: string) => redis.get<string>(key),
  getAndDelete: async (key: string) => redis.getdel<string>(key),
  increment: async (key: string, ttl: number) => {
    const [count] = await redis.multi().incr(key).expire(key, ttl, "NX").exec();
    return Number(count);
  },
  set: async (key: string, value: string, ttl?: number) => {
    await redis.set(key, value, ttl ? { ex: ttl } : undefined);
  },
  delete: async (key: string) => {
    await redis.del(key);
  },
} : undefined;
