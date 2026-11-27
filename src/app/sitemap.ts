import type { MetadataRoute } from "next"
import { getServerEnv } from "@/lib/env/server"
import { services } from "@/config/services"
import { navigation } from "@/config/navigation"
import { publishedProjects } from "@/config/projects"
export default function sitemap(): MetadataRoute.Sitemap {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") return []
  const paths = [
    "/",
    "/start",
    "/services/support",
    ...navigation.map(({ href }) => href),
    ...services.map((service) => `/services/${service.slug}`),
    ...publishedProjects.map((project) => project.href),
  ]
  return [...new Set(paths)].map((path) => ({ url: new URL(path, getServerEnv().SITE_URL).href }))
}
