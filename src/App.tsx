import { useEffect, useState } from "react"
import { BookText, GraduationCap, Languages, ScrollText } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { AppHeader } from "@/components/AppHeader"
import { Translator, useShareHashOnMount } from "@/components/Translator"
import { CipherReference } from "@/components/CipherReference"
import { LearningMode } from "@/components/LearningMode"
import { Dictionary } from "@/components/Dictionary"
import type { Direction } from "@/lib/al-bhed"

type Tab = "translate" | "learn" | "cipher" | "dictionary"

const PRESERVE_KEY = "al-bhed:preserve-names"

function App() {
  const [direction, setDirection] = useState<Direction>("en-to-ab")
  const [source, setSource] = useState("")
  const [tab, setTab] = useState<Tab>("translate")
  const [preserveProperNouns, setPreserveProperNouns] = useState<boolean>(() => {
    try {
      return localStorage.getItem(PRESERVE_KEY) === "1"
    } catch {
      return false
    }
  })

  useShareHashOnMount(setSource, setDirection)

  useEffect(() => {
    try {
      localStorage.setItem(PRESERVE_KEY, preserveProperNouns ? "1" : "0")
    } catch {
      /* storage disabled (private mode, etc.) — fine to swallow */
    }
  }, [preserveProperNouns])

  const loadFromDictionary = (englishText: string) => {
    setDirection("en-to-ab")
    setSource(englishText)
    setTab("translate")
  }

  return (
    <TooltipProvider delayDuration={250}>
      <div className="mx-auto w-full max-w-5xl px-3 sm:px-6 py-5 sm:py-8 space-y-5 sm:space-y-7">
        <AppHeader />

        <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-14 sm:h-10 p-1">
            <TabsTrigger value="translate" className="h-full flex-col sm:flex-row gap-0.5 sm:gap-1.5 text-[11px] sm:text-sm">
              <Languages className="h-4 w-4" />
              <span>Translate</span>
            </TabsTrigger>
            <TabsTrigger value="learn" className="h-full flex-col sm:flex-row gap-0.5 sm:gap-1.5 text-[11px] sm:text-sm">
              <GraduationCap className="h-4 w-4" />
              <span>Learn</span>
            </TabsTrigger>
            <TabsTrigger value="cipher" className="h-full flex-col sm:flex-row gap-0.5 sm:gap-1.5 text-[11px] sm:text-sm">
              <ScrollText className="h-4 w-4" />
              <span>Cipher</span>
            </TabsTrigger>
            <TabsTrigger value="dictionary" className="h-full flex-col sm:flex-row gap-0.5 sm:gap-1.5 text-[11px] sm:text-sm">
              <BookText className="h-4 w-4" />
              <span>Dictionary</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="translate" className="focus-visible:outline-none">
            <Translator
              direction={direction}
              source={source}
              preserveProperNouns={preserveProperNouns}
              onDirectionChange={setDirection}
              onSourceChange={setSource}
              onPreserveProperNounsChange={setPreserveProperNouns}
            />
          </TabsContent>
          <TabsContent value="learn" className="focus-visible:outline-none">
            <LearningMode />
          </TabsContent>
          <TabsContent value="cipher" className="focus-visible:outline-none">
            <CipherReference />
          </TabsContent>
          <TabsContent value="dictionary" className="focus-visible:outline-none">
            <Dictionary onLoad={loadFromDictionary} />
          </TabsContent>
        </Tabs>

        <footer className="text-center text-xs text-muted-foreground pt-4 pb-2">
          Final Fantasy X and Al Bhed are © Square Enix. This is a fan-made cipher tool.
        </footer>
      </div>
      <Toaster position="bottom-center" />
    </TooltipProvider>
  )
}

export default App
