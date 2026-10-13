"use client"

import { GradFlow, type GradientConfigInput } from "gradflow"

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
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-[linear-gradient(150deg,#FFE2B0,#F4843E_45%,#1A1032)]"
    >
      <GradFlow config={dunes} />
    </div>
  )
}
