import { FolderOpen, Info, Layers3, MessageSquare } from "lucide-react"

export const navigation = [
  { label: "Услуги", href: "/services", icon: Layers3 },
  { label: "Проекты", href: "/projects", icon: FolderOpen },
  { label: "О студии", href: "/about", icon: Info },
  { label: "Контакты", href: "/contacts", icon: MessageSquare },
] as const

export const legalNavigation = [
  { label: "Конфиденциальность", href: "/legal/privacy" },
  { label: "Обработка данных", href: "/legal/personal-data-consent" },
  { label: "Cookies", href: "/legal/cookies" },
] as const
