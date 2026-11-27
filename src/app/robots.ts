import type { MetadataRoute } from "next"
import { getServerEnv } from "@/lib/env/server"
export default function robots(): MetadataRoute.Robots {
  // Crawlers must be able to read the demo's noindex meta and X-Robots-Tag.
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return { rules: { userAgent: "*", allow: "/", disallow: ["/api/"] } }
  }
  return {
    // Legal drafts remain crawlable so their page-level noindex is visible.
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: new URL("/sitemap.xml", getServerEnv().SITE_URL).href,
  }
}
