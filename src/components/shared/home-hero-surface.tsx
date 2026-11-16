"use client"

import dynamic from "next/dynamic"
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react"

const PrismaticSlats = dynamic(
  () => import("@/components/react-bits/prismatic-slats"),
  { ssr: false }
)

// Only the decoration belongs inside this boundary, never content or links.
class BackgroundBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

export function HomeHeroSurface({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const handleReady = useCallback(() => setReady(true), [])
  useEffect(() => {
    const node = backgroundRef.current
    const handleContextLoss = () => setUnavailable(true)
    // Context loss does not bubble; capture it before the Canvas listener.
    node?.addEventListener("webglcontextlost", handleContextLoss, true)
    return () =>
      node?.removeEventListener("webglcontextlost", handleContextLoss, true)
  }, [])
  return (
    <div className="relative isolate">
      <div
        ref={backgroundRef}
        className="absolute inset-0"
        aria-hidden="true"
      >
        <div
          data-hero-fallback=""
          className="absolute inset-0"
          style={{
            background:
              "repeating-linear-gradient(120deg, transparent 0 12%, #0071e314 16%, transparent 24%), radial-gradient(ellipse at top right, #0071e326, transparent 65%)",
          }}
        />
        {!unavailable && (
          <BackgroundBoundary>
            <div className="hero-webgl-layer absolute inset-0" data-ready={ready}>
              <PrismaticSlats
                className="h-full w-full"
                colors={["#0071E3", "#7DD3FC"]}
                dpr={1}
                onReady={handleReady}
              />
            </div>
          </BackgroundBoundary>
        )}
      </div>
      <div className="pointer-events-none relative bg-linear-to-t from-background/80 via-background/20 to-transparent [&_a]:pointer-events-auto">
        {children}
      </div>
    </div>
  )
}
