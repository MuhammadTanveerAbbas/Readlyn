const rateMap = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitConfig {
  interval: number;
  maxRequests: number;
}

export function checkRateLimit(
  key: string,
  config: RateLimitConfig,
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = rateMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + config.interval });
    return { allowed: true, remaining: config.maxRequests - 1, resetIn: config.interval };
  }

  entry.count++;

  if (entry.count > config.maxRequests) {
    return { allowed: false, remaining: 0, resetIn: entry.resetAt - now };
  }

  return { allowed: true, remaining: config.maxRequests - entry.count, resetIn: entry.resetAt - now };
}

export const RATE_LIMITS = {
  auth: { interval: 60_000, maxRequests: 10 },
  generate: { interval: 60_000, maxRequests: 15 },
  checkout: { interval: 60_000, maxRequests: 5 },
  api: { interval: 60_000, maxRequests: 30 },
} as const;
