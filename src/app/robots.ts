import type { MetadataRoute } from "next"
import { getServerEnv } from "@/lib/env/server"
export default function robots(): MetadataRoute.Robots {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") return { rules: { userAgent: "*", disallow: "/" } }
  return {
    // Legal drafts remain crawlable so their page-level noindex is visible.
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: new URL("/sitemap.xml", getServerEnv().SITE_URL).href,
  }
}
