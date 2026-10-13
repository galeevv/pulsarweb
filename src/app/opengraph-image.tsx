import { ImageResponse } from "next/og"
import { site } from "@/config/site"
import { PulsarMark } from "@/components/shared/logo"
export const alt = `${site.name} — ${site.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        width: "100%",
        height: "100%",
        background: "#171717",
        color: "#fafafa",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 36 }}
      >
        <PulsarMark size={38} />
        {site.name}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 76,
          lineHeight: 1.1,
          letterSpacing: -4,
          maxWidth: 1000,
        }}
      >
        {site.tagline}
      </div>
      <div style={{ display: "flex", fontSize: 24, color: "#a3a3a3" }}>
        Digital products, thoughtfully built.
      </div>
    </div>,
    size
  )
}
