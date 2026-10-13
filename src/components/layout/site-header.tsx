import { ArrowUpRight } from "lucide-react"
import { Container } from "@/components/layout/container"
import { MobileNavigation } from "@/components/layout/mobile-navigation"
import { Logo } from "@/components/shared/logo"
import { ButtonLink } from "@/components/shared/button-link"
import { NavigationLinks } from "@/components/layout/navigation-links"

export function SiteHeader() {
  return (
    <header className="sticky top-4 z-40 mt-4 shrink-0">
      <Container>
        <div className="glass-panel flex h-20 items-center justify-between gap-4 px-4 sm:px-6">
          <Logo />
          <nav
            aria-label="Основная навигация"
            className="hidden items-center gap-6 lg:flex"
          >
            <NavigationLinks />
          </nav>
          <div className="hidden md:block">
            <ButtonLink href="/contacts" size="lg" className="min-h-11">
              Обсудить проект
              <ArrowUpRight data-icon="inline-end" />
            </ButtonLink>
          </div>
          <div className="lg:hidden">
            <MobileNavigation />
          </div>
        </div>
      </Container>
    </header>
  )
}
