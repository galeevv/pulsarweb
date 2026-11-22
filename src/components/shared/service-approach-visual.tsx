import Image from "next/image"

export type ApproachVisual = "structure" | "mobile" | "speed"

/** Shared decorative illustrations, not performance measurements. */
export function ServiceApproachVisual({
  kind,
  image,
}: {
  kind?: ApproachVisual
  image?: string
}) {
  const src = image ?? (kind && `/images/services/approach/${kind}.webp`)

  return (
    <div
      aria-hidden="true"
      className="relative flex aspect-[2/1] max-h-56 items-center justify-center overflow-hidden rounded-3xl bg-background/50 sm:rounded-[2rem]"
    >
      {src && (
        <Image
          src={src}
          alt=""
          fill
          sizes="(max-width: 639px) 100vw, 420px"
          className="object-contain px-8 py-4 sm:px-10 sm:py-5"
        />
      )}
    </div>
  )
}
