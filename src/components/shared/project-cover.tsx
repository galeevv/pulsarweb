import { Cloud, Orbit } from "lucide-react"
import { pulsarCloud } from "@/config/projects"

export function ProjectCover() {
  return (
    <div className="relative flex min-h-80 flex-col justify-between overflow-hidden rounded-xl bg-foreground p-7 text-background sm:min-h-[28rem] sm:p-12">
      <div className="relative flex items-center justify-between gap-4">
        <span className="font-mono text-xs tracking-widest">
          PULSAR / CLOUD
        </span>
        <Cloud className="size-7" aria-hidden="true" />
      </div>
      <div
        className="pointer-events-none absolute top-1/2 right-[-5rem] size-80 -translate-y-1/2 rounded-full border border-background/20 sm:right-8 sm:size-[26rem]"
        aria-hidden="true"
      >
        <div className="absolute inset-10 rounded-full border border-background/20" />
        <div className="absolute inset-20 rounded-full border border-background/20" />
        <div className="absolute inset-32 flex items-center justify-center rounded-full border border-background/20">
          <Orbit className="size-10 text-background/60" strokeWidth={1} />
        </div>
      </div>
      <div className="relative mt-32 flex flex-col gap-5">
        <p className="text-[clamp(3rem,8vw,7rem)] leading-[0.95] font-medium tracking-[-0.065em]">
          Pulsar
          <br />
          Cloud.
        </p>
        <p className="font-mono text-xs tracking-wider text-background/70">
          {pulsarCloud.alternateName}
        </p>
      </div>
    </div>
  )
}
