"use client"

import { useEffect, useRef, type ReactNode } from "react"

export function SupportConversation({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = root.current
    if (!node) return
    let visible = false
    const sync = () => {
      node.dataset.playing = String(visible && !document.hidden)
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    observer.observe(node)
    document.addEventListener("visibilitychange", sync)
    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", sync)
    }
  }, [])

  return <div ref={root} className="support-conversation flex flex-col items-start gap-3 text-sm leading-relaxed" aria-label="Пример обращения после запуска">{children}</div>
}
