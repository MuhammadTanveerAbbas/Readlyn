export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://readlyn.app";
  const now = new Date().toISOString();

  const pages = [
    { url: "/", priority: "1.0", changefreq: "weekly" },
    { url: "/login", priority: "0.5", changefreq: "monthly" },
    { url: "/signup", priority: "0.7", changefreq: "monthly" },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${appUrl}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
