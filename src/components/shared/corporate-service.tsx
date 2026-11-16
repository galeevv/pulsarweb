import { ServicePageTemplate } from "@/components/shared/service-page-template"
import { additionalServiceContent } from "@/config/service-page-content"

export function CorporateService() {
  return <ServicePageTemplate content={additionalServiceContent["corporate-websites"]} />
}
