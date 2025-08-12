export default function robots() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5174'
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${appUrl}/sitemap.xml`,
    host: appUrl,
  }
}
