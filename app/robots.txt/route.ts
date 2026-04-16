export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://readlyn.app";
  const body = `User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /editor
Disallow: /app
Disallow: /api/

Sitemap: ${appUrl}/sitemap.xml
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
}
