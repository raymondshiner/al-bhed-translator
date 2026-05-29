import { Card } from "@/components/ui/card"
import { cipherTable } from "@/lib/al-bhed"

type Props = {
  /** Optional: highlight a particular English letter (uppercase) in the table. */
  highlightEnglish?: string
}

export function CipherReference({ highlightEnglish }: Props) {
  const rows = cipherTable()
  const hl = highlightEnglish?.toUpperCase()

  return (
    <Card className="p-4 sm:p-6 gap-4 glow-gold">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold">Cipher reference</h2>
        <p className="text-sm text-muted-foreground">
          Al Bhed is a simple substitution cipher. Every English letter maps to one Al Bhed letter, and vice versa.
        </p>
      </header>

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
