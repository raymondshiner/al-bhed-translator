import { useMemo, useState } from "react"
import { ArrowRight, Search } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DICTIONARY } from "@/lib/al-bhed"

type Props = {
  onLoad: (englishText: string) => void
}

export function Dictionary({ onLoad }: Props) {
  const [q, setQ] = useState("")
  const query = q.trim().toLowerCase()

  const results = useMemo(() => {
    if (!query) return DICTIONARY
    return DICTIONARY.filter(
      (d) =>
        d.en.toLowerCase().includes(query) ||
        d.ab.toLowerCase().includes(query) ||
        d.note?.toLowerCase().includes(query),
    )
  }, [query])

  return (
    <Card className="p-4 sm:p-6 gap-4">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold">Dictionary</h2>
        <p className="text-sm text-muted-foreground">
          Canon Al Bhed vocabulary from FFX. Tap any entry to load it into the translator.
        </p>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search English or Al Bhed…"
          aria-label="Search dictionary"
          className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        />
      </div>

      <div className="text-xs text-muted-foreground">
        {results.length} {results.length === 1 ? "entry" : "entries"}
      </div>

      <ul className="grid gap-2 sm:grid-cols-2">
        {results.map((d) => (
          <li key={d.en}>
            <button
              onClick={() => onLoad(d.en)}
              className="group w-full text-left rounded-lg border border-border bg-card/60 hover:bg-card hover:border-[var(--color-gold)]/40 px-3 py-2.5 transition-colors"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium">{d.en}</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-[var(--color-gold)] transition-colors" />
                <Badge variant="outline" className="font-mono text-[var(--color-cipher)]">
                  {d.ab}
                </Badge>
              </div>
              {d.note && (
                <div className="text-xs text-muted-foreground mt-1">{d.note}</div>
              )}
            </button>
          </li>
        ))}
        {results.length === 0 && (
          <li className="col-span-full text-sm text-muted-foreground py-6 text-center">
            No matches. Try the translator for any other word.
          </li>
        )}
      </ul>

      <div className="flex justify-end">
        <Button
          variant="link"
          size="sm"
          onClick={() => setQ("")}
          disabled={!q}
          className="text-xs"
        >
          Clear search
        </Button>
      </div>
    </Card>
  )
}
