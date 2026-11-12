# Planet of Gemstones · ديوان الأحجار الكريمة

A premium, bilingual (English / Arabic, full RTL) storefront for **Planet of Gemstones**, a verified Instagram jewelry brand ([@planet_of_gemstones](https://www.instagram.com/planet_of_gemstones/), 108K followers) with a store near Riad El Solh, Beirut.

The site is built around real-time 3D: a refracting brilliant-cut gem in the hero, an interactive ring/jewel viewer with live stone and metal swaps, and a 3D zodiac wheel that reveals each sign's bracelet.

## Features

- **3D hero**: a procedurally cut round-brilliant gem (`MeshPhysicalMaterial` with transmission, IOR 2.4, dispersion and iridescence) in a starfield, with a gold orbit and comet that echo the logo swoosh. Reacts to the pointer and to device tilt. Bloom post-processing.
- **3D jewel viewer** (product pages and the home "atelier"): drag to rotate, scroll or pinch to zoom. Swap the stone and the metal (gold/silver) live. Renders rings (solitaire/signet), charm bracelets, men's bead bracelets, pendants, drop necklaces, misbaha prayer beads and loose tumbled stones, all procedurally.
- **3D zodiac wheel**: click a sign (or use the arrow keys on the accessible sign list) and the wheel turns to it, revealing the sign's bracelet, stones, dates, element and ruling planet. Opens on today's sign.
- **Shop**: filter by category, stone, zodiac sign, metal and price (state lives in the URL), plus sorting. On desktop, hovering a card swaps the image for a live 3D turntable.
- **Product page**: 3D view plus a gallery, women's ♀ and men's ♂ versions for zodiac bracelets, stone meaning (chakra, hardness, zodiac), a size guide, **Add to cart** and **Order on WhatsApp** (pre-filled message).
- **Cart**: saved in localStorage. Checkout sends the whole order as one WhatsApp message.
- **Find your stone quiz**: birth date + intention → zodiac sign → recommended stone and bracelet.
- **Stones encyclopedia** with search and chakra filter, deep-linkable (`/stones#amethyst`).
- Testimonials carousel, Instagram strip, shipping & payment block, click-to-load store map, About and Contact pages.
- **Mobile first**: sticky bottom CTA bar on mobile (most traffic comes from Instagram), floating WhatsApp button on desktop.
- GSAP/ScrollTrigger reveals, gold sparkle micro-interactions and page transitions, all disabled under `prefers-reduced-motion`.

## Performance and accessibility

- All Three.js code is code-split and **lazy-loaded**. It mounts only when the canvas is near the viewport *and* the browser is idle (`components/Lazy3D.vue`).
- **Low-end fallback**: devices without WebGL2, with little memory or few cores, with Data Saver on, or with a software renderer get static on-brand art instead. Test with `?no3d` or `?force3d`.
- Adaptive quality: the pixel ratio and then bloom are reduced if the frame rate drops below about 45 fps. Rendering pauses when off-screen or when the tab is hidden.
- `prefers-reduced-motion`: no auto-rotation, parallax or twinkle, and scenes render on demand.
- **Draco GLB** support: drop compressed models in `public/models/` and set `model` on a product. The decoder is copied to `public/draco/` on install.
- Optional **HDRI**: set `NUXT_PUBLIC_HDRI_URL`. By default a procedural jewellery-studio environment is generated, with no download.
- Real photos go through `@nuxt/image` as **AVIF/WebP**.
- Keyboard navigable (skip link, focus rings, radio groups, Escape closes the cart). WCAG AA colour pairs: gold is used on dark backgrounds or as decoration, and text on cream is burgundy or ink.
- Bilingual SEO: `hreflang`, canonical, Open Graph, `JewelryStore` and `Product` JSON-LD. All 166 routes are prerendered.

## Stack

| | |
|---|---|
| Framework | [Nuxt 3](https://nuxt.com) (Vue 3, TypeScript) |
| Styling | Tailwind CSS (`@nuxtjs/tailwindcss`), logical properties for RTL |
| i18n | `@nuxtjs/i18n` (`/` English, `/ar` Arabic with RTL) |
| 3D | Three.js (WebGLRenderer, `MeshPhysicalMaterial`, PMREM environment, UnrealBloom, OrbitControls, GLTF + Draco) |
| Motion | GSAP + ScrollTrigger |
| Images | `@nuxt/image` (AVIF/WebP) |
| Fonts | Cormorant Garamond, Inter, Amiri, Noto Kufi Arabic |

## Getting started

Requires Node 20+.

```bash
git clone https://github.com/baji-alt/planet-of-gemstones.git
cd planet-of-gemstones
cp .env.example .env    # set the WhatsApp number etc.
npm install
npm run dev             # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build (server + prerendered pages) in `.output/` |
| `npm run generate` | Fully static site in `.output/public` (deploy to Netlify, Vercel, Cloudflare Pages or GitHub Pages) |
| `npm run preview` | Preview the production build |
| `npm run typecheck` | Strict TypeScript check with vue-tsc |
| `npm run og-image` | Regenerate `public/og.png` and the touch icon from the logo |

### Environment variables

| Variable | Purpose |
|---|---|
| `NUXT_PUBLIC_SITE_URL` | Public URL, used for canonical, hreflang and Open Graph links |
| `NUXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number in international format, digits only (e.g. `961XXXXXXXX`) |
| `NUXT_PUBLIC_HDRI_URL` | Optional `.hdr` file in `/public` for image-based lighting |

## Project structure

```
app.vue, layouts/, error.vue   shell, header/footer/cart, store JSON-LD
pages/                         index, shop, product/[slug], stones, about, contact
components/
  home/                        hero, categories, zodiac section, atelier, quiz, testimonials…
  three/                       HeroGem, JewelViewer, ZodiacWheel (client-only, lazy)
  ProductArt.vue               on-brand illustrated placeholder (cream fabric, leaf, AR title, EN caption)
  Lazy3D.vue                   visibility + idle + capability gate with static fallback
lib/three/                     stage (renderer, env, bloom, adaptive loop) and jewelry builders
data/                          products, stones, zodiac, testimonials, site facts
i18n/locales/                  en.json, ar.json
plugins/directives.ts          v-reveal (GSAP) and v-sparkle
```

## Swapping in real content

- **Store facts** (address pin, hours, links): `data/site.ts`. Opening hours and the WhatsApp number are **placeholders** until confirmed.
- **Photos**: put files in `public/img/products/` and list them in the product's `images` array in `data/products.ts`. The illustrated placeholder disappears automatically.
- **3D models**: add a Draco GLB to `public/models/` and set `model: '/models/your-piece.glb'`. See `public/models/README.md`.
- **Products and prices** (USD): `data/products.ts`. All 12 zodiac bracelets plus sample men's rings, silver jewelry, natural stones and prayer beads are included as placeholder data.
- **Testimonials**: `data/testimonials.ts` holds **sample** quotes. Replace them with real customer feedback.
- **Copy**: `i18n/locales/en.json` and `ar.json`.

## Notes

- `scripts/fix-vue-types.mjs` works around a Windows-only issue in Nuxt 3.21's generated auto-import types (Vue imports resolving to `any`). It runs automatically on `postinstall` and `typecheck`.
- Prerendering skips URLs with query strings: shop filters are client-side state.
