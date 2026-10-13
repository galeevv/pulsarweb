import type { MetadataRoute } from "next"
import { getServerEnv } from "@/lib/env/server"
export default function robots(): MetadataRoute.Robots {
  return {
    // Legal drafts remain crawlable so their page-level noindex is visible.
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: new URL("/sitemap.xml", getServerEnv().SITE_URL).href,
  }
}
