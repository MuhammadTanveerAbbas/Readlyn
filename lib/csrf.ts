export function checkCsrfOrigin(request: Request): { valid: boolean; reason?: string } {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin) {
    return { valid: false, reason: "Missing Origin header" };
  }

  try {
    const originUrl = new URL(origin);
    if (!host) {
      return { valid: false, reason: "Missing Host header" };
    }

    const allowedOrigins = [
      `http://${host}`,
      `https://${host}`,
      process.env.NEXT_PUBLIC_APP_URL,
    ].filter(Boolean) as string[];

    const isAllowed = allowedOrigins.some((allowed) => {
      try {
        const allowedUrl = new URL(allowed);
        return allowedUrl.origin === originUrl.origin;
      } catch {
        return false;
      }
    });

    if (!isAllowed) {
      return { valid: false, reason: "Origin mismatch" };
    }

    return { valid: true };
  } catch {
    return { valid: false, reason: "Invalid Origin URL" };
  }
}
