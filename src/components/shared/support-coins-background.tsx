"use client"

import dynamic from "next/dynamic"
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react"

const GlassCoins = dynamic(() => import("@/components/glass-coins"), { ssr: false })

// A failed decoration must never reach the page error boundary.
class CoinsBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? null : this.props.children }
}

function CoinsLayer() {
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const layer = useRef<HTMLDivElement>(null)
  const onReady = useCallback(() => setReady(true), [])
  const onError = useCallback(() => setFailed(true), [])
  useEffect(() => {
    const node = layer.current
    node?.addEventListener("webglcontextlost", onError, true)
    return () => node?.removeEventListener("webglcontextlost", onError, true)
  }, [onError])
  return <div ref={layer} className="hero-webgl-layer absolute inset-0" data-ready={ready && !failed}>
    {!failed && <GlassCoins onReady={onReady} onError={onError} className="h-full w-full" backgroundColor="#fafafa" colors={["#0071e3", "#a1c9ee"]} pattern="float" count={6} size={0.3} speed={0.35} quality={0.65} interactive={false} glow={0.25} centerX={0.4} />}
  </div>
}

export function SupportCoinsBackground() {
  const root = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const node = root.current
    if (!node) return
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let near = false
    const sync = () => setEnabled(near && !motion.matches && !document.hidden)
    const observer = new IntersectionObserver(([entry]) => {
      near = entry.isIntersecting
      sync()
    }, { rootMargin: "160px" })
    observer.observe(node)
    motion.addEventListener("change", sync)
    document.addEventListener("visibilitychange", sync)
    return () => {
      observer.disconnect()
      motion.removeEventListener("change", sync)
      document.removeEventListener("visibilitychange", sync)
    }
  }, [])

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit] bg-foreground">
      {enabled && <CoinsBoundary><CoinsLayer /></CoinsBoundary>}
      <div className="absolute inset-0 z-10 bg-linear-to-b from-foreground/75 via-foreground/30 to-foreground" />
    </div>
  )
}

