// Publish only confirmed facts. Add verified case material here when supplied.
export const pulsarCloud = {
  casePublished: true,
  name: "Pulsar VPN",
  alternateName: "Pulsar VPN",
  href: "/projects/pulsar-vpn",
  status: "Запущен",
  cover: {
    src: "/images/projects/pulsar-vpn/home.webp",
    alt: "Главный экран кабинета Pulsar VPN на смартфоне",
  },
  description:
    "VPN-сервис с личным кабинетом и интеграцией с Telegram.",
} as const

export type ProjectSummary = {
  id: string
  href: string
  title: string
  description: string
  badges: readonly string[]
  releaseYear: number
  casePublished: boolean
  cover: { src: string; alt: string }
}

// Add published cases here: the homepage, project catalog and sitemap share this list.
export const projects: readonly ProjectSummary[] = [
  {
    ...pulsarCloud,
    id: "pulsar-vpn",
    title: "PULSAR VPN",
    badges: ["VPN-Сервис", "Web-Приложение", "Telegram bot"],
    releaseYear: 2026,
  },
  {
    id: "pulsar-web",
    href: "/projects/pulsar-web",
    title: "PULSAR WEB",
    description: "Сайт студии: услуги, проекты и удобный путь от знакомства до заявки.",
    badges: ["Сайт студии"],
    releaseYear: 2026,
    casePublished: true,
    cover: {
      src: "/images/projects/pulsar-web/cover-card.webp",
      alt: "Главная страница PulsarWeb на ноутбуке в металлической студийной сцене",
    },
  },
]

export const publishedProjects = projects.filter((project) => project.casePublished)
