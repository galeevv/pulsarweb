import { describe, expect, it, vi } from "vitest"
import { pageMetadata, rootMetadata, websiteJsonLd } from "./index"
import sitemap from "@/app/sitemap"
import robots from "@/app/robots"

vi.mock("@/lib/env/server", () => ({
  getServerEnv: () => ({ SITE_URL: "https://studio.example" }),
}))

describe("SEO foundation", () => {
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
    expect(urls.some((url) => url.pathname === "/services/web-systems")).toBe(
      true
    )
    expect(urls.some((url) => url.pathname === "/projects/pulsar-cloud")).toBe(
      false
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
