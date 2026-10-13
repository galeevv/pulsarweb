import type { MetadataRoute } from "next"
import { getServerEnv } from "@/lib/env/server"
import { services } from "@/config/services"
import { navigation } from "@/config/navigation"
import { pulsarCloud } from "@/config/projects"
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "/",
    ...navigation.map(({ href }) => href),
    ...services.map((service) => `/services/${service.slug}`),
    ...(pulsarCloud.casePublished ? [pulsarCloud.href] : []),
  ].map((path) => ({ url: new URL(path, getServerEnv().SITE_URL).href }))
}
