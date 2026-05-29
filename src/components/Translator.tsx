import { useEffect, useMemo } from "react"
import { ArrowLeftRight, Copy, Eraser, Info, Link as LinkIcon, Sparkles } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  CANON_PHRASES,
  translateText,
  type Direction,
} from "@/lib/al-bhed"

type Props = {
  direction: Direction
  source: string
  preserveProperNouns: boolean
  onDirectionChange: (d: Direction) => void
  onSourceChange: (s: string) => void
  onPreserveProperNounsChange: (v: boolean) => void
}

function labels(direction: Direction) {
  return direction === "en-to-ab"
    ? { from: "English", to: "Al Bhed", fromColor: "text-foreground", toColor: "text-[var(--color-cipher)]" }
    : { from: "Al Bhed", to: "English", fromColor: "text-[var(--color-cipher)]", toColor: "text-foreground" }
}

export function Translator({
  direction,
  source,
  preserveProperNouns,
  onDirectionChange,
  onSourceChange,
  onPreserveProperNounsChange,
}: Props) {
  const target = useMemo(
    () => translateText(source, direction, { preserveProperNouns }),
    [source, direction, preserveProperNouns],
  )
  const { from, to, fromColor, toColor } = labels(direction)

  const swap = () => {
    onDirectionChange(direction === "en-to-ab" ? "ab-to-en" : "en-to-ab")
    onSourceChange(target)
  }

  const copy = async (text: string, what: string) => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`Copied ${what}`)
    } catch {
      toast.error("Copy failed — your browser blocked it")
    }
  }

  const share = async () => {
    const url = new URL(window.location.href)
    url.hash = `${direction === "en-to-ab" ? "en" : "ab"}/${encodeURIComponent(source)}`
    try {
      await navigator.clipboard.writeText(url.toString())
      toast.success("Share link copied to clipboard")
    } catch {
      toast.error("Couldn't copy share link")
    }
  }

  const loadPhrase = (phraseEn: string) => {
    onDirectionChange("en-to-ab")
    onSourceChange(phraseEn)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-3 sm:gap-4 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
        {/* SOURCE */}
        <Card className="relative gap-3 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`font-mono ${fromColor}`}>
                {from}
              </Badge>
              <span className="text-xs text-muted-foreground tabular-nums">
                {source.length} {source.length === 1 ? "char" : "chars"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Clear source"
                    onClick={() => onSourceChange("")}
                    disabled={!source}
                  >
                    <Eraser className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Clear</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Copy source"
                    onClick={() => copy(source, from)}
                    disabled={!source}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy {from}</TooltipContent>
              </Tooltip>
            </div>
          </div>
          <Textarea
            value={source}
            onChange={(e) => onSourceChange(e.target.value)}
            placeholder={
              direction === "en-to-ab"
                ? "Type English here…"
                : "Type Al Bhed here…"
            }
            spellCheck={direction === "en-to-ab"}
            autoCapitalize="off"
            autoCorrect={direction === "en-to-ab" ? "on" : "off"}
            className={`min-h-40 sm:min-h-56 resize-none text-base sm:text-lg leading-relaxed ${
              direction === "ab-to-en" ? "font-mono" : ""
            }`}
            aria-label={`${from} input`}
          />
        </Card>

        {/* SWAP */}
        <div className="flex md:flex-col items-center justify-center gap-2 md:py-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                aria-label="Swap direction"
                onClick={swap}
                className="rounded-full h-11 w-11 shadow-sm"
              >
                <ArrowLeftRight className="h-4 w-4 md:rotate-90 transition-transform" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Swap direction</TooltipContent>
          </Tooltip>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground hidden md:block">
            swap
          </span>
        </div>

        {/* TARGET */}
        <Card className="relative gap-3 p-4 sm:p-5 glow-cipher">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`font-mono ${toColor}`}>
                {to}
              </Badge>
              <span className="text-xs text-muted-foreground tabular-nums">
                {target.length} {target.length === 1 ? "char" : "chars"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Copy result"
                    onClick={() => copy(target, to)}
                    disabled={!target}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy {to}</TooltipContent>
              </Tooltip>
            </div>
          </div>
          <Textarea
            value={target}
            readOnly
            placeholder={
              direction === "en-to-ab"
                ? "Al Bhed translation will appear here…"
                : "English translation will appear here…"
            }
            className={`min-h-40 sm:min-h-56 resize-none text-base sm:text-lg leading-relaxed ${
              direction === "en-to-ab" ? "font-mono" : ""
            }`}
            aria-label={`${to} output`}
          />
        </Card>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 rounded-lg border border-border bg-card/40 px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <Switch
            id="preserve-names"
            checked={preserveProperNouns}
            onCheckedChange={onPreserveProperNounsChange}
            aria-label="Preserve proper nouns"
          />
          <label htmlFor="preserve-names" className="text-sm font-medium cursor-pointer select-none">
            Preserve names
          </label>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="About name preservation"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Info className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs leading-relaxed">
              When on, capitalized words 2+ letters long are left untranslated
              (Tidus, Yuna, Spira). Wrap anything in [square brackets] to always
              preserve it — brackets are stripped from the output.
            </TooltipContent>
          </Tooltip>
        </div>
        <Button variant="outline" size="sm" onClick={share} disabled={!source}>
          <LinkIcon className="h-4 w-4 mr-1.5" />
          Share link
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5" /> Try:
        </span>
        {CANON_PHRASES.slice(0, 6).map((p) => (
          <button
            key={p.en}
            onClick={() => loadPhrase(p.en)}
            className="text-xs rounded-full border border-border bg-card/60 px-3 py-1 hover:bg-card hover:border-[var(--color-gold)]/40 transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function useShareHashOnMount(
  setSource: (s: string) => void,
  setDirection: (d: Direction) => void,
) {
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "")
    if (!hash) return
    const slash = hash.indexOf("/")
    if (slash === -1) return
    const dirCode = hash.slice(0, slash)
    const text = decodeURIComponent(hash.slice(slash + 1))
    if (dirCode === "en") {
      setDirection("en-to-ab")
      setSource(text)
    } else if (dirCode === "ab") {
      setDirection("ab-to-en")
      setSource(text)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
