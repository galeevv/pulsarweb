import { serviceCatalog, resolveRequestService } from "@/config/service-catalog"
export const projectRequestConfig = serviceCatalog
export function projectRequestHref(service?: string) {
  const selected = resolveRequestService(service)
  const query = new URLSearchParams()
  if (selected) query.set("service", selected)
  if (service) query.set("source", `/services/${service}`)
  return `/start${query.size ? `?${query}` : ""}`
}
