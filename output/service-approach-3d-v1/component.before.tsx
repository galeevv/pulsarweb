export type ApproachVisual = "structure" | "mobile" | "speed"

/** Decorative diagrams: illustrative layouts, not performance measurements. */
export function ServiceApproachVisual({ kind }: { kind: ApproachVisual }) {
  return (
    <div aria-hidden="true" className="flex aspect-[2/1] items-center justify-center overflow-hidden bg-background/50">
      <svg viewBox="0 0 400 210" fill="none" className="h-full w-full max-w-md text-foreground" focusable="false">
        {kind === "structure" && (
          <>
            <path d="M200 76v25M96 130v-29h208v29M200 101v29" className="stroke-border" strokeWidth="2" />
            <rect x="139" y="27" width="122" height="49" rx="12" className="fill-primary/15 stroke-primary/50" />
            <path d="M159 46h62M159 57h38" className="stroke-primary" strokeWidth="4" strokeLinecap="round" />
            {[51, 155, 259].map((x) => (
              <g key={x}>
                <rect x={x} y="130" width="90" height="56" rx="12" className="fill-card stroke-border" />
                <rect x={x + 15} y="145" width="29" height="5" rx="2.5" fill="currentColor" opacity=".5" />
                <rect x={x + 15} y="158" width="59" height="4" rx="2" fill="currentColor" opacity=".13" />
                <rect x={x + 15} y="168" width="42" height="4" rx="2" fill="currentColor" opacity=".13" />
              </g>
            ))}
          </>
        )}
        {kind === "mobile" && (
          <>
            <rect x="89" y="46" width="194" height="126" rx="12" className="fill-card stroke-border" />
            <path d="M89 67h194" className="stroke-border" />
            <circle cx="102" cy="57" r="2" fill="currentColor" opacity=".3" />
            <circle cx="110" cy="57" r="2" fill="currentColor" opacity=".3" />
            <rect x="107" y="84" width="90" height="7" rx="3" fill="currentColor" opacity=".6" />
            <rect x="107" y="100" width="65" height="7" rx="3" fill="currentColor" opacity=".6" />
            <rect x="107" y="120" width="93" height="4" rx="2" fill="currentColor" opacity=".15" />
            <rect x="107" y="137" width="55" height="18" rx="9" className="fill-primary" />
            <rect x="229" y="23" width="82" height="169" rx="17" className="fill-background stroke-muted-foreground" />
            <rect x="255" y="31" width="30" height="4" rx="2" fill="currentColor" opacity=".2" />
            <rect x="239" y="47" width="62" height="54" rx="7" className="fill-primary/15" />
            <path d="m249 87 14-20 12 12 12-17" className="stroke-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="239" y="112" width="51" height="5" rx="2" fill="currentColor" opacity=".6" />
            <rect x="239" y="125" width="58" height="4" rx="2" fill="currentColor" opacity=".15" />
            <rect x="239" y="135" width="43" height="4" rx="2" fill="currentColor" opacity=".15" />
            <rect x="239" y="154" width="62" height="23" rx="11" className="fill-primary" />
          </>
        )}
        {kind === "speed" && (
          <>
            <path d="M100 151a100 100 0 0 1 200 0" className="stroke-border" strokeWidth="12" strokeLinecap="round" />
            <path d="M100 151a100 100 0 0 1 165-76" className="stroke-primary" strokeWidth="12" strokeLinecap="round" />
            <path d="m200 151 62-52" className="stroke-foreground" strokeWidth="4" strokeLinecap="round" />
            <circle cx="200" cy="151" r="9" className="fill-foreground" />
            <path d="M127 175h146" className="stroke-border" strokeWidth="2" strokeLinecap="round" />
          </>
        )}
      </svg>
    </div>
  )
}
