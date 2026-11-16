import Image from "next/image"

export type ApproachVisual = "structure" | "mobile" | "speed"

/** Shared decorative illustrations, not performance measurements. */
export function ServiceApproachVisual({ kind }: { kind: ApproachVisual }) {
  return (
    <div
      aria-hidden="true"
      className="relative flex aspect-[2/1] max-h-56 items-center justify-center overflow-hidden rounded-3xl bg-background/50 sm:rounded-[2rem]"
    >
        <Image
          src={`/images/approach/${kind}.webp`}
          alt=""
          fill
          sizes="(max-width: 639px) 100vw, 420px"
          className="object-contain px-8 py-4 sm:px-10 sm:py-5"
        />
    </div>
  )
}
