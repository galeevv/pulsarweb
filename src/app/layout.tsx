import { Inter, Geist_Mono } from "next/font/google"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
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
      className={cn(inter.variable, mono.variable, "font-sans antialiased")}
    >
      <body className="flex min-h-dvh flex-col">
        <a href="#main" className="skip-link">
          Перейти к содержимому
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}
