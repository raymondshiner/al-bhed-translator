# Al Bhed Translator

A modern, mobile-friendly translator for the Al Bhed cipher language from Final Fantasy X.

- **Translate** — bidirectional English ↔ Al Bhed, instant as you type, with a swap button and copy-to-clipboard.
- **Learn** — progressive-reveal animation that turns English text into Al Bhed one letter at a time, with the cipher card highlighting the active letter.
- **Cipher** — full 26-letter reference card.
- **Dictionary** — searchable list of common Al Bhed words, tap to load into the translator.
- **Share links** — encode the current text + direction into the URL hash.

## Stack

Vite 8, React 19, TypeScript, Tailwind CSS v4, shadcn/ui (Radix Nova preset), lucide-react.

## Development

```bash
npm install
npm run dev      # start dev server
npm run build    # type-check + production build to dist/
npm run preview  # serve dist/ locally
```

## Deploy

`vercel.json` is included for one-step Vercel deploys.

```bash
vercel        # preview deploy
vercel --prod # production deploy
```

The build output is a static SPA, so any static host works (Cloudflare Pages, Netlify, GitHub Pages with SPA rewrites).

## Credits

Al Bhed and Final Fantasy X are © Square Enix. This is a fan-made cipher tool.
