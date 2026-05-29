// Headless UI verification — drives Playwright against the dev server.
// Usage: node tests/verify-ui.mjs   (dev server must be running on :5173)
import { chromium, devices } from 'playwright'

const BASE = process.env.BASE_URL ?? 'http://localhost:5173/'
const SHOTS = '/tmp/al-bhed-shots'

const results = []
const record = (name, ok, detail = '') => {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

async function verify(label, ctx, viewport) {
  const page = await ctx.newPage()
  page.on('pageerror', (err) => record(`${label}/no-console-errors`, false, err.message))
  await page.goto(BASE, { waitUntil: 'networkidle' })
  const step = async (name, fn) => {
    try {
      await fn()
    } catch (e) {
      record(`${label}/${name}`, false, String(e?.message ?? e).split('\n')[0])
    }
  }

  // 1) header
  const heading = await page.getByRole('heading', { level: 1 }).textContent()
  record(`${label}/header text`, /Al Bhed.*Translator/i.test(heading ?? ''), heading?.trim())

  // 2) all four tabs visible
  for (const t of ['Translate', 'Learn', 'Cipher', 'Dictionary']) {
    const visible = await page.getByRole('tab', { name: t }).isVisible()
    record(`${label}/tab ${t} visible`, visible)
  }

  // 3) full screenshot of Translate tab
  await page.screenshot({ path: `${SHOTS}/${label}-01-translate.png`, fullPage: true })

  // 4) type Hello in the English textarea, expect Rammu in Al Bhed
  const sourceArea = page.getByRole('textbox', { name: 'English input' })
  await sourceArea.fill('Hello world!')
  const targetArea = page.getByRole('textbox', { name: 'Al Bhed output' })
  const targetValue = await targetArea.inputValue()
  record(`${label}/translate Hello world!`, targetValue === 'Rammu funmt!', `got "${targetValue}"`)

  // 5) try the swap button
  await page.getByRole('button', { name: 'Swap direction' }).click()
  await page.waitForTimeout(150)
  const afterSwapSourceLabel = await page
    .getByRole('textbox', { name: /input$/ })
    .getAttribute('aria-label')
  record(`${label}/swap flips direction`, afterSwapSourceLabel === 'Al Bhed input', afterSwapSourceLabel ?? 'null')

  // Swap back
  await page.getByRole('button', { name: 'Swap direction' }).click()
  await page.waitForTimeout(100)

  // 6) try a canon-phrase chip
  await page.getByRole('button', { name: 'I am Al Bhed!' }).click()
  await page.waitForTimeout(150)
  const chipResult = await page.getByRole('textbox', { name: 'Al Bhed output' }).inputValue()
  record(`${label}/phrase chip I am Al Bhed!`, chipResult === 'E ys Ym Prat!', `got "${chipResult}"`)

  // 6b) proper-noun: brackets always preserve, regardless of toggle
  await step('bracket preserves', async () => {
    await sourceArea.fill('[Tidus] is here.')
    await page.waitForTimeout(80)
    const v = await targetArea.inputValue()
    if (v !== 'Tidus ec rana.') throw new Error(`got "${v}"`)
    record(`${label}/bracket preserves Tidus`, true)
  })

  // 6c) toggle "Preserve names" on, then capitalized words are preserved
  await step('toggle preserves names', async () => {
    await page.getByLabel('Preserve proper nouns').click() // turn ON
    await page.waitForTimeout(80)
    await sourceArea.fill('hello Tidus, where is Yuna?')
    await page.waitForTimeout(80)
    const v = await targetArea.inputValue()
    if (v !== 'rammu Tidus, frana ec Yuna?') throw new Error(`got "${v}"`)
    record(`${label}/preserve-names ON skips Tidus/Yuna`, true)
  })

  // 6d) toggle off → normal full translation resumes
  await step('toggle off restores full translation', async () => {
    await page.getByLabel('Preserve proper nouns').click() // OFF
    await page.waitForTimeout(80)
    await sourceArea.fill('Hello Tidus')
    await page.waitForTimeout(80)
    const v = await targetArea.inputValue()
    if (v !== 'Rammu Detic') throw new Error(`got "${v}"`)
    record(`${label}/preserve-names OFF translates everything`, true)
  })

  // 7) Cipher tab — verify all 26 letters rendered
  await page.getByRole('tab', { name: 'Cipher' }).click()
  await page.waitForTimeout(150)
  const cipherCellsCount = await page
    .locator('text=Cipher reference')
    .locator('..')
    .locator('..')
    .locator('div.grid > div')
    .count()
  record(`${label}/cipher 26 letters`, cipherCellsCount === 26, `count=${cipherCellsCount}`)
  await page.screenshot({ path: `${SHOTS}/${label}-02-cipher.png`, fullPage: true })

  // 8) Dictionary tab — verify entries, then filter
  await page.getByRole('tab', { name: 'Dictionary' }).click()
  await page.waitForTimeout(150)
  const allEntriesText = await page.getByText(/\d+ entries/).textContent()
  const allCount = parseInt(allEntriesText?.match(/\d+/)?.[0] ?? '0', 10)
  record(`${label}/dictionary populated`, allCount === 40, `count=${allCount}`)
  await page.getByRole('searchbox', { name: 'Search dictionary' }).fill('water')
  await page.waitForTimeout(120)
  const filteredText = await page.getByText(/\d+ entr/).textContent()
  const filteredCount = parseInt(filteredText?.match(/\d+/)?.[0] ?? '0', 10)
  record(`${label}/dictionary search "water"`, filteredCount === 1, `count=${filteredCount}`)
  await page.screenshot({ path: `${SHOTS}/${label}-03-dictionary.png`, fullPage: true })

  // Dictionary item click loads into translator
  await page.getByRole('searchbox', { name: 'Search dictionary' }).fill('')
  await page.waitForTimeout(100)
  await page.getByRole('button', { name: /^hello/i }).first().click()
  await page.waitForTimeout(150)
  const loadedSource = await page.getByRole('textbox', { name: 'English input' }).inputValue()
  record(`${label}/dictionary load → translator`, loadedSource === 'hello', `got "${loadedSource}"`)

  // 9) Learn tab — type, press Play, verify reveal progresses
  await page.getByRole('tab', { name: 'Learn' }).click()
  await page.waitForTimeout(150)
  await page.getByRole('textbox', { name: 'English text to learn' }).fill('Hello')
  await page.getByRole('button', { name: /play/i }).click()
  await page.waitForTimeout(800) // let some reveals happen
  await page.screenshot({ path: `${SHOTS}/${label}-04-learn.png`, fullPage: true })

  void viewport
  await page.close()
}

const browser = await chromium.launch({ headless: true })
try {
  const desktopCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  await verify('desktop', desktopCtx, '1280x900')
  await desktopCtx.close()

  const mobileCtx = await browser.newContext({ ...devices['iPhone 13'] })
  await verify('mobile', mobileCtx, 'iPhone 13')
  await mobileCtx.close()
} finally {
  await browser.close()
}

const failed = results.filter((r) => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
if (failed.length > 0) {
  console.log('FAILURES:')
  failed.forEach((f) => console.log(`  - ${f.name}: ${f.detail}`))
}
process.exit(failed.length === 0 ? 0 : 1)
