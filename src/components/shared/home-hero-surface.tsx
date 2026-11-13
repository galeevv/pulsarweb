"use client"

import dynamic from "next/dynamic"
import { useCallback, useState, type ReactNode } from "react"

const PrismaticSlats = dynamic(
  () => import("@/components/react-bits/prismatic-slats"),
  { ssr: false }
)

export function HomeHeroSurface({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const handleReady = useCallback(() => setReady(true), [])
  return (
    <div className="relative isolate">
      <div
        className="hero-webgl-layer absolute inset-0"
        data-ready={ready}
        aria-hidden="true"
      >
        <PrismaticSlats
          className="h-full w-full"
          colors={["#0071E3", "#7DD3FC"]}
          dpr={1}
          onReady={handleReady}
        />
      </div>
      <div className="pointer-events-none relative bg-linear-to-t from-background/80 via-background/20 to-transparent [&_a]:pointer-events-auto">
        {children}
      </div>
    </div>
  )
}
