import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { homeMetadata, pageMetadata, rootMetadata, websiteJsonLd } from "./index"
import { publishedProjects } from "@/config/projects"
import { serviceSeo } from "@/config/service-seo"
import { primaryServiceIds, serviceCatalog } from "@/config/service-catalog"
import sitemap from "@/app/sitemap"
import robots from "@/app/robots"

vi.mock("@/lib/env/server", () => ({
  getServerEnv: () => ({ SITE_URL: "https://studio.example" }),
}))

describe("SEO foundation", () => {
  beforeEach(() => vi.stubEnv("NEXT_PUBLIC_DEMO_MODE", "false"))
  afterEach(() => vi.unstubAllEnvs())

  it("keeps homepage search and social titles aligned", () => {
    const metadata = homeMetadata()
    expect(metadata.title).toEqual({ absolute: metadata.openGraph?.title })
    expect(metadata.twitter?.title).toEqual(metadata.openGraph?.title)
    expect(metadata.alternates?.canonical).toBe("/")
    expect(metadata.robots).toBeUndefined()
  })

  it("lets crawlers read demo noindex without advertising indexable URLs", () => {
    vi.stubEnv("NEXT_PUBLIC_DEMO_MODE", "true")
    expect(rootMetadata().robots).toEqual({ index: false, follow: false })
    expect(pageMetadata("Test", "Test page", "/projects").robots).toEqual({ index: false, follow: false })
    expect(sitemap()).toEqual([])
    expect(robots()).toEqual({ rules: { userAgent: "*", allow: "/", disallow: ["/api/"] } })
  })

  it("includes every published case and keeps service prices in sync", () => {
    const urls = sitemap().map(({ url }) => new URL(url).pathname)
    for (const project of publishedProjects) expect(urls).toContain(project.href)
    expect(urls).not.toContain("/projects/pulsar-cloud")
    expect(urls).not.toContain("/projects/form")
    for (const slug of primaryServiceIds) {
      expect(serviceSeo(slug).description).toContain(serviceCatalog[slug].priceLabel)
    }
    expect(new Set(primaryServiceIds.map((slug) => serviceSeo(slug).title)).size).toBe(primaryServiceIds.length)
  })

  it("keeps child canonicals and social metadata specific to the page", () => {
    const metadata = pageMetadata(
      "Контакты",
      "Обсудим вашу задачу.",
      "/contacts"
    )
    expect(metadata.alternates?.canonical).toBe("/contacts")
    expect(metadata.openGraph).toMatchObject({
      url: "/contacts",
      title: "Контакты — PulsarWeb",
    })
    expect(metadata.twitter).toMatchObject({
      title: "Контакты — PulsarWeb",
      description: "Обсудим вашу задачу.",
    })
    expect(rootMetadata().metadataBase?.toString()).toBe(
      "https://studio.example/"
    )
  })

  it("lists unique same-origin pages and excludes APIs and unpublished content", () => {
    const urls = sitemap().map(({ url }) => new URL(url))
    expect(new Set(urls.map((url) => url.href)).size).toBe(urls.length)
    expect(urls.every((url) => url.origin === "https://studio.example")).toBe(
      true
    )
    expect(urls.some((url) => /^\/(api|legal)\//.test(url.pathname))).toBe(
      false
    )
    expect(urls.some((url) => url.pathname === "/services/ecommerce")).toBe(
      true
    )
    for (const slug of [
      "websites",
      "web-systems",
      "desktop",
      "infrastructure",
      "other",
    ])
      expect(urls.some((url) => url.pathname === `/services/${slug}`)).toBe(
        false
      )
    for (const slug of ["landing-pages", "corporate-websites", "telegram", "support"])
      expect(urls.some((url) => url.pathname === `/services/${slug}`)).toBe(
        true
      )
    expect(urls.some((url) => url.pathname === "/projects/pulsar-vpn")).toBe(
      true
    )
    expect(robots().rules).toMatchObject({ disallow: ["/api/"] })
  })

  it("publishes website identity without fictional organization details", () => {
    expect(JSON.parse(websiteJsonLd())).toMatchObject({
      "@type": "WebSite",
      url: "https://studio.example",
      inLanguage: "ru",
    })
    expect(websiteJsonLd()).not.toContain("legalName")
    expect(websiteJsonLd()).not.toContain("taxID")
  })
})
