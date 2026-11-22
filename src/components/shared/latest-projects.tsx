import Image from "next/image"
import { pulsarCloud } from "@/config/projects"
import { HomeProjectCard } from "@/components/shared/home-project-card"

export function LatestProjects() {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <HomeProjectCard
          id="project-pulsar-vpn"
          href={pulsarCloud.href}
          title="PULSAR VPN"
          description="VPN-сервис с личным кабинетом, подпиской и интеграцией с Telegram."
          status="Запущен"
          category="Цифровой сервис"
          cover={
            <Image
              src={pulsarCloud.cover.src}
              alt={pulsarCloud.cover.alt}
              quality={100}
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1399px) 50vw, 656px"
              className="object-cover"
            />
          }
        />
        <HomeProjectCard
          id="project-pulsar-web"
          href="/projects/pulsar-web"
          title="PULSAR WEB"
          description="Сайт студии: услуги, проекты и удобный путь от знакомства до заявки."
          category="Сайт студии"
          status="Свой проект"
          cover={
            <Image
              src="/images/projects/pulsar-web/cover-card.webp"
              alt="Главная страница PulsarWeb на ноутбуке в металлической студийной сцене."
              fill
              unoptimized
              sizes="(max-width: 767px) 100vw, 50vw"
              className="object-cover"
            />
          }
        />
      </div>
    </>
  )
}
