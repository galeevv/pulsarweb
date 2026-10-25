"use client"

import { useEffect, useRef, type ReactNode } from "react"

// Progressive enhancement: server-rendered content stays visible without JS.
export function HomeMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = root.current
    if (!element) return
    const preference = matchMedia("(prefers-reduced-motion: reduce)")
    const animations = new Set<Animation>()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (!entry.isIntersecting) return
          observer.unobserve(entry.target)
          if (preference.matches) return
          const heading = entry.target.matches("h1, h2, [data-home-heading]")
          const animation = entry.target.animate(
            heading
              ? [
                  {
                    opacity: 0,
                    transform: "translateY(28px)",
                    clipPath: "inset(0 0 100% 0)",
                  },
                  {
                    opacity: 1,
                    transform: "translateY(0)",
                    clipPath: "inset(0)",
                  },
                ]
              : [
                  {
                    opacity: 0,
                    transform: "translateY(32px)",
                    clipPath: "inset(8% 3% 0 round 24px)",
                  },
                  {
                    opacity: 1,
                    transform: "translateY(0)",
                    clipPath: "inset(0 round 24px)",
                  },
                ],
            {
              duration: heading ? 1050 : 1000,
              delay: Math.min(index, 3) * 110,
              easing: "cubic-bezier(.22,1,.36,1)",
              fill: "backwards",
            }
          )
          animations.add(animation)
          animation.onfinish = () => animations.delete(animation)
        })
      },
      { threshold: 0.08 }
    )
    element
      .querySelectorAll(
        "[data-home-reveal], [data-home-heading], h1, h2, section p, #technologies > div > ul > li, #process ol > li, section [data-slot=button], section [data-slot=badge]"
      )
      .forEach((node) => {
        // The hero is visible in the server HTML; never hide it after hydration.
        if (node.closest("[data-home-static]")) return
        // Animate each card/group once, not its nested text and badges again.
        if (
          node.parentElement?.closest(
            "[data-home-reveal], #technologies > div > ul > li, #process ol > li"
          )
        )
          return
        observer.observe(node)
      })
    function preferencesChanged() {
      if (preference.matches)
        animations.forEach((animation) => animation.cancel())
    }
    preference.addEventListener("change", preferencesChanged)
    return () => {
      observer.disconnect()
      animations.forEach((animation) => animation.cancel())
      preference.removeEventListener("change", preferencesChanged)
    }
  }, [])
  return (
    <div ref={root} className="home-motion">
      {children}
    </div>
  )
}
