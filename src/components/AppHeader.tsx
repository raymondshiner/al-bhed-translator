import { Languages } from "lucide-react"

export function AppHeader() {
  return (
    <header className="flex items-center gap-3 px-2 sm:px-0">
      <div
        className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-xl bg-gradient-to-br from-[#0a1620] to-[#163046] text-[var(--color-gold)] glow-gold"
        aria-hidden="true"
      >
        <Languages className="h-5 w-5 sm:h-6 sm:w-6" />
      </div>
      <div className="min-w-0">
        <h1 className="font-semibold tracking-tight text-xl sm:text-2xl">
          Al Bhed{" "}
          <span className="font-mono text-[var(--color-cipher)]">
            Ym Pat
          </span>{" "}
          Translator
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Translate the cipher language of Spira&apos;s desert tribe — instant, offline, mobile-friendly.
        </p>
      </div>
    </header>
  )
}
