import type { Metadata } from "next"
import { site } from "@/config/site"
import { getServerEnv } from "@/lib/env/server"

function socialMetadata(
  title: string,
  description: string,
  path: string
): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      locale: site.locale,
      siteName: site.name,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${site.name} — ${site.seoTitle}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        { url: "/opengraph-image", alt: `${site.name} — ${site.seoTitle}` },
      ],
    },
  }
}

export function pageMetadata(
  title: string,
  description: string,
  path: string
): Metadata {
  return {
    title,
    description,
    ...(process.env.NEXT_PUBLIC_DEMO_MODE === "true"
      ? { robots: { index: false, follow: false } }
      : {}),
    alternates: { canonical: path },
    ...socialMetadata(`${title} — ${site.name}`, description, path),
  }
}

export function homeMetadata(): Metadata {
  const title = `${site.name} — ${site.seoTitle}`
  return {
    ...pageMetadata(site.seoTitle, site.description, "/"),
    title: { absolute: title },
    ...socialMetadata(title, site.description, "/"),
  }
}

export function rootMetadata(): Metadata {
  return {
    ...homeMetadata(),
    metadataBase: new URL(getServerEnv().SITE_URL),
    title: {
      default: `${site.name} — ${site.seoTitle}`,
      template: `%s — ${site.name}`,
    },
    description: site.description,
    applicationName: site.name,
    alternates: { canonical: "/" },
    ...socialMetadata(`${site.name} — ${site.seoTitle}`, site.description, "/"),
  }
}

export function websiteJsonLd(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: getServerEnv().SITE_URL,
    description: site.description,
    inLanguage: site.language,
  }).replace(/</g, "\\u003c")
}
