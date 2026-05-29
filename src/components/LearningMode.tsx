import { useEffect, useRef, useState } from "react"
import { Pause, Play, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { CipherReference } from "@/components/CipherReference"
import { toAlBhed } from "@/lib/al-bhed"

const DEFAULT_TEXT = "I am Al Bhed and this is my language."

export function LearningMode() {
  const [text, setText] = useState(DEFAULT_TEXT)
  const [revealed, setRevealed] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [delayMs, setDelayMs] = useState(220)
  const timer = useRef<number | null>(null)

  const translated = toAlBhed(text)
  const total = text.length

  useEffect(() => {
    setRevealed(0)
    setPlaying(false)
  }, [text])

  useEffect(() => {
    if (timer.current !== null) {
      clearTimeout(timer.current)
      timer.current = null
    }
    if (!playing) return
    if (revealed >= total) {
      setPlaying(false)
      return
    }
    timer.current = window.setTimeout(() => {
      setRevealed((r) => r + 1)
    }, delayMs)
    return () => {
      if (timer.current !== null) {
        clearTimeout(timer.current)
        timer.current = null
      }
    }
  }, [playing, revealed, total, delayMs])

  // find the most recent revealed *letter* to highlight in the cipher
  const lastLetter = (() => {
    for (let i = revealed - 1; i >= 0; i--) {
      const ch = text[i]
      if (/[a-zA-Z]/.test(ch)) return ch.toUpperCase()
    }
    return undefined
  })()

  const reset = () => {
    setRevealed(0)
    setPlaying(false)
  }
  const toggle = () => {
    if (revealed >= total) setRevealed(0)
    setPlaying((p) => !p)
  }

  const progress = total === 0 ? 0 : (revealed / total) * 100

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_minmax(0,360px)]">
      <Card className="p-4 sm:p-6 gap-4">
        <header>
          <h2 className="text-lg font-semibold">Learning mode</h2>
          <p className="text-sm text-muted-foreground">
            Watch the English text dissolve into Al Bhed, one letter at a time. The cipher card highlights the active letter.
          </p>
        </header>

        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            English text
          </label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a phrase to learn…"
            className="mt-1 min-h-20 resize-none"
            aria-label="English text to learn"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={toggle} disabled={total === 0} variant="default" size="sm">
            {playing ? (
              <>
                <Pause className="h-4 w-4 mr-1.5" /> Pause
              </>
            ) : revealed >= total && total > 0 ? (
              <>
                <Play className="h-4 w-4 mr-1.5" /> Replay
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1.5" /> Play
              </>
            )}
          </Button>
          <Button onClick={reset} variant="outline" size="sm" disabled={revealed === 0}>
            <RotateCcw className="h-4 w-4 mr-1.5" />
            Reset
          </Button>
          <div className="flex items-center gap-3 ml-auto w-full sm:w-auto">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Speed</span>
            <Slider
              min={60}
              max={500}
              step={20}
              value={[520 - delayMs]}
              onValueChange={(v) => setDelayMs(520 - v[0])}
              className="w-40 sm:w-48"
              aria-label="Reveal speed"
            />
          </div>
        </div>

        <div className="h-1.5 rounded-full bg-muted overflow-hidden" aria-hidden="true">
          <div
            className="h-full bg-[var(--color-gold)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="space-y-2">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">English</div>
          <p className="font-mono text-lg sm:text-xl leading-relaxed break-words">
            {text.split("").map((ch, i) => (
              <span
                key={`en-${i}`}
                className={i < revealed ? "text-muted-foreground/50" : ""}
              >
                {ch}
              </span>
            ))}
          </p>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Al Bhed</div>
          <p className="font-mono text-lg sm:text-xl leading-relaxed break-words text-[var(--color-cipher)]">
            {translated.split("").map((ch, i) => (
              <span
                key={`ab-${i}`}
                className={
                  i < revealed
                    ? "opacity-100"
                    : "opacity-20"
                }
              >
                {ch}
              </span>
            ))}
          </p>
        </div>
      </Card>

      <CipherReference highlightEnglish={lastLetter} />
    </div>
  )
}
