import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const hasUpstash = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

let upstashRatelimit: {
  auth: Ratelimit;
  generate: Ratelimit;
  api: Ratelimit;
} | null = null;

if (hasUpstash) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  upstashRatelimit = {
    auth: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "60 s"),
      analytics: true,
      prefix: "ratelimit:auth",
    }),
    generate: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(15, "60 s"),
      analytics: true,
      prefix: "ratelimit:generate",
    }),
    api: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, "60 s"),
      analytics: true,
      prefix: "ratelimit:api",
    }),
  };
}

const fallbackMap = new Map<string, { count: number; resetAt: number }>();

const FALLBACK_CONFIGS = {
  auth: { interval: 60_000, maxRequests: 10 },
  generate: { interval: 60_000, maxRequests: 15 },
  api: { interval: 60_000, maxRequests: 30 },
} as const;

export async function checkRateLimit(
  key: string,
  limitType: keyof typeof FALLBACK_CONFIGS,
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  if (upstashRatelimit) {
    const limiter = upstashRatelimit[limitType];
    const { success, remaining, reset } = await limiter.limit(key);
    return {
      allowed: success,
      remaining,
      resetIn: Math.ceil((reset - Date.now()) / 1000),
    };
  }

  const config = FALLBACK_CONFIGS[limitType];
  const now = Date.now();
  const entry = fallbackMap.get(key);

  if (!entry || now > entry.resetAt) {
    fallbackMap.set(key, { count: 1, resetAt: now + config.interval });
    return { allowed: true, remaining: config.maxRequests - 1, resetIn: config.interval };
  }

  entry.count++;

  if (entry.count > config.maxRequests) {
    return { allowed: false, remaining: 0, resetIn: entry.resetAt - now };
  }

  return { allowed: true, remaining: config.maxRequests - entry.count, resetIn: entry.resetAt - now };
}
