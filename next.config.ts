import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { qualities: [75, 100] },
  serverExternalPackages: ["better-sqlite3"],
  async redirects() {
    return [
      {
        source: "/projects/pulsar-cloud",
        destination: "/projects/pulsar-vpn",
        permanent: true,
      },
      {
        source: "/services/websites",
        destination: "/services/landing-pages",
        permanent: true,
      },
      {
        source: "/services/infrastructure",
        destination: "/services",
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          ...(process.env.NEXT_PUBLIC_DEMO_MODE === "true" ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] : []),
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'",
          },
        ],
      },
    ]
  },
}

export default nextConfig
