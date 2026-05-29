export type Direction = "en-to-ab" | "ab-to-en"

const EN_TO_AB = "ypltavkrezgmshubxncdijfqow"

const AB_TO_EN: string = (() => {
  const out = new Array<string>(26)
  for (let i = 0; i < 26; i++) {
    const target = EN_TO_AB.charCodeAt(i) - 97
    out[target] = String.fromCharCode(97 + i)
  }
  return out.join("")
})()

function translate(text: string, map: string): string {
  let result = ""
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i)
    if (code >= 97 && code <= 122) {
      result += map[code - 97]
    } else if (code >= 65 && code <= 90) {
      result += map[code - 65].toUpperCase()
    } else {
      result += text[i]
    }
  }
  return result
}

export function toAlBhed(text: string): string {
  return translate(text, EN_TO_AB)
}

export function toEnglish(text: string): string {
  return translate(text, AB_TO_EN)
}

export function translateText(text: string, direction: Direction): string {
  return direction === "en-to-ab" ? toAlBhed(text) : toEnglish(text)
}

export function cipherTable(): Array<{ english: string; alBhed: string }> {
  const rows: Array<{ english: string; alBhed: string }> = []
  for (let i = 0; i < 26; i++) {
    rows.push({
      english: String.fromCharCode(65 + i),
      alBhed: EN_TO_AB[i].toUpperCase(),
    })
  }
  return rows
}

export const CANON_PHRASES: Array<{ en: string; label: string }> = [
  { en: "Hello", label: "Hello" },
  { en: "Yes", label: "Yes" },
  { en: "No", label: "No" },
  { en: "Thank you", label: "Thank you" },
  { en: "I am Al Bhed!", label: "I am Al Bhed!" },
  { en: "Where is the airship?", label: "Where is the airship?" },
  { en: "What is this?", label: "What is this?" },
  { en: "Sorry!", label: "Sorry!" },
  { en: "Help!", label: "Help!" },
  { en: "Welcome to Home.", label: "Welcome to Home" },
]

type DictEntry = { en: string; note?: string }

const DICT_SEED: DictEntry[] = [
  { en: "yes" },
  { en: "no" },
  { en: "hello" },
  { en: "goodbye" },
  { en: "thank you" },
  { en: "welcome" },
  { en: "please" },
  { en: "sorry" },
  { en: "friend" },
  { en: "family" },
  { en: "father" },
  { en: "mother" },
  { en: "brother" },
  { en: "sister" },
  { en: "help" },
  { en: "stop" },
  { en: "go" },
  { en: "come" },
  { en: "water" },
  { en: "fire" },
  { en: "sand", note: "Bikanel desert" },
  { en: "sea" },
  { en: "sky" },
  { en: "ship" },
  { en: "airship", note: "Cid's Fahrenheit" },
  { en: "machina", note: "FFX term for machine" },
  { en: "sin", note: "The great calamity" },
  { en: "yevon", note: "The religion of Spira" },
  { en: "spira", note: "The world of FFX" },
  { en: "home", note: "Al Bhed sanctuary on Bikanel" },
  { en: "heart" },
  { en: "love" },
  { en: "i" },
  { en: "you" },
  { en: "what" },
  { en: "this" },
  { en: "that" },
  { en: "now" },
  { en: "here" },
  { en: "there" },
]

export const DICTIONARY: Array<{ en: string; ab: string; note?: string }> =
  DICT_SEED.map((d) => ({ ...d, ab: toAlBhed(d.en) }))
