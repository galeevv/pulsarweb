"use client"

import { useState } from "react"
import { GradFlow, type GradientConfigInput } from "gradflow"
import { Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

const dunes: GradientConfigInput = {
  type: "dunes",
  color1: "#F4843E",
  color2: "#1A1032",
  color3: "#FFE2B0",
  speed: 0.6,
  scale: 1,
  noise: 0.14,
}

export function DunesBackground() {
  const [paused, setPaused] = useState(false)

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(150deg,#FFE2B0,#F4843E_45%,#1A1032)]"
      >
        <GradFlow config={dunes} paused={paused} />
      </div>
      <div className="absolute right-5 bottom-5 z-10 motion-reduce:hidden">
        <Button
          variant="outline"
          size="icon"
          className="size-11"
          aria-label={
            paused ? "Включить анимацию фона" : "Приостановить анимацию фона"
          }
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
        </Button>
      </div>
    </>
  )
}
