import Image from "next/image"
import { HomeProjectCard } from "@/components/shared/home-project-card"

export function LatestProjects() {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <HomeProjectCard
          id="project-pulsar-vpn"
          href="/projects/pulsar-cloud"
          title="PULSAR VPN"
          description="VPN-сервис с личным кабинетом, подпиской и интеграцией с Telegram."
          status="Запущен"
          category="Цифровой сервис"
          cover={
            <Image
              src="/images/projects/pulsar-vpn-diagonal-16x9.webp"
              alt="Личный кабинет Pulsar VPN на смартфоне, лежащем по диагонали на металлической поверхности с синей подсветкой."
              fill
              unoptimized
              sizes="(max-width: 767px) 100vw, 50vw"
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
              src="/images/projects/pulsar-web-16x9.webp"
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
