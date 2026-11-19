import { Inter, Geist_Mono } from "next/font/google"
import { SiteHeader } from "@/components/layout/site-header"
import { FooterVisibility } from "@/components/layout/footer-visibility"
import { SiteFooter } from "@/components/layout/site-footer"
import { AttributionCapture } from "@/components/layout/attribution-capture"
import { rootMetadata } from "@/lib/seo"
import { cn } from "@/lib/utils"
import { site } from "@/config/site"
import "./globals.css"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
})
const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})
export const generateMetadata = rootMetadata

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang={site.language}
      className={cn(
        inter.variable,
        mono.variable,
        "dark font-sans antialiased"
      )}
    >
      <body className="flex min-h-dvh flex-col">
        {process.env.NEXT_PUBLIC_DEMO_MODE === "true" && (
          <div className="pointer-events-none fixed bottom-4 left-4 z-50 rounded-full border border-white/15 bg-background/40 px-4 py-2 font-mono text-xs tracking-widest text-foreground backdrop-blur-xl" aria-label="Демонстрационная версия">DEMO</div>
        )}
        <AttributionCapture />
        <a href="#main" className="skip-link">
          Перейти к содержимому
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
          {children}
        </main>
        <FooterVisibility>
          <SiteFooter />
        </FooterVisibility>
      </body>
    </html>
  )
}
