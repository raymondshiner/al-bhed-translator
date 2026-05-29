import { Card } from "@/components/ui/card"
import { cipherTable } from "@/lib/al-bhed"

type Props = {
  /** Optional: highlight a particular English letter (uppercase) in the table. */
  highlightEnglish?: string
}

const ROTATION_CYCLES: Array<{ id: string; label: string; letters: string[] }> = [
  { id: "vowels", label: "Vowel ring", letters: ["a", "y", "o", "u", "i", "e"] },
  { id: "soft", label: "5-cycle", letters: ["f", "v", "j", "z", "w"] },
  { id: "mid", label: "4-cycle", letters: ["c", "l", "m", "s"] },
  { id: "nasal", label: "3-cycle", letters: ["h", "r", "n"] },
]

const SWAPS: Array<[string, string]> = [
  ["b", "p"],
  ["d", "t"],
  ["g", "k"],
  ["q", "x"],
]

function CycleRing({ id, letters, label, size = 150 }: { id: string; letters: string[]; label: string; size?: number }) {
  const cx = size / 2
  const cy = size / 2
  const letterR = size / 2 - 16
  const arcR = letterR - 22
  const n = letters.length
  const angles = letters.map((_, i) => -Math.PI / 2 + (i * 2 * Math.PI) / n)
  const gap = Math.min(0.32, Math.PI / n - 0.05)
  const arcs: string[] = []
  for (let i = 0; i < n; i++) {
    const start = angles[i] + gap
    let end = angles[(i + 1) % n] - gap
    if (end < start) end += 2 * Math.PI
    const sx = cx + arcR * Math.cos(start)
    const sy = cy + arcR * Math.sin(start)
    const ex = cx + arcR * Math.cos(end)
    const ey = cy + arcR * Math.sin(end)
    const largeArc = end - start > Math.PI ? 1 : 0
    arcs.push(`M ${sx} ${sy} A ${arcR} ${arcR} 0 ${largeArc} 1 ${ex} ${ey}`)
  }
  const markerId = `cycle-arrow-${id}`

  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`${label} cycle: ${letters.join(" → ")} → ${letters[0]}`}>
        <defs>
          <marker id={markerId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-cipher)" />
          </marker>
        </defs>
        {arcs.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="var(--color-cipher)"
            strokeOpacity="0.55"
            strokeWidth="1.5"
            markerEnd={`url(#${markerId})`}
          />
        ))}
        {angles.map((a, i) => {
          const x = cx + letterR * Math.cos(a)
          const y = cy + letterR * Math.sin(a)
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="17"
              className="font-mono font-semibold fill-foreground"
            >
              {letters[i].toUpperCase()}
            </text>
          )
        })}
      </svg>
      <span className="text-xs text-muted-foreground">{label} · {letters.length} letters</span>
    </div>
  )
}

function SwapPair({ a, b }: { a: string; b: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-card/60 px-3 py-2">
      <span className="font-mono text-base font-semibold leading-none">{a.toUpperCase()}</span>
      <span className="text-[var(--color-cipher)] text-lg leading-none">⇌</span>
      <span className="font-mono text-base font-semibold leading-none">{b.toUpperCase()}</span>
    </div>
  )
}

export function CipherReference({ highlightEnglish }: Props) {
  const rows = cipherTable()
  const hl = highlightEnglish?.toUpperCase()

  return (
    <Card className="p-4 sm:p-6 gap-6 glow-gold">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold">Cipher reference</h2>
        <p className="text-sm text-muted-foreground">
          Al Bhed is a simple substitution cipher. Every English letter maps to one Al Bhed letter, and vice versa.
        </p>
      </header>

      <section className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold">Patterns inside the cipher</h3>
          <p className="text-xs text-muted-foreground">
            The 26 letters break into four rotation cycles and four direct swaps. Follow an arrow once for English → Al Bhed; follow it once more to decode back.
          </p>
        </div>

        <div className="flex flex-wrap items-start justify-center gap-x-6 gap-y-4">
          {ROTATION_CYCLES.map((c) => (
            <CycleRing key={c.id} id={c.id} letters={c.letters} label={c.label} />
          ))}
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Direct swaps</h4>
          <div className="flex flex-wrap gap-2">
            {SWAPS.map(([a, b]) => (
              <SwapPair key={`${a}${b}`} a={a} b={b} />
            ))}
          </div>
        </div>
      </section>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Full mapping</h3>
      </div>

      <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-13 gap-2">
        {rows.map((r) => {
          const active = hl === r.english
          return (
            <div
              key={r.english}
              className={[
                "flex flex-col items-center rounded-lg border px-2 py-2 transition-colors",
                active
                  ? "border-[var(--color-gold)] bg-[color-mix(in_oklab,var(--color-gold)_15%,transparent)]"
                  : "border-border bg-card/60",
              ].join(" ")}
            >
              <span className="font-mono text-base font-semibold leading-none">
                {r.english}
              </span>
              <span className="text-muted-foreground text-[10px] leading-none my-1">↓</span>
              <span className="font-mono text-base font-semibold leading-none text-[var(--color-cipher)]">
                {r.alBhed}
              </span>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        The mapping was created by translator Alexander O. Smith to render Al Bhed playable in English versions of FFX.
      </p>
    </Card>
  )
}
