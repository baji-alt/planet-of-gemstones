<script setup lang="ts">
/**
 * On-brand illustrated placeholder that mirrors the Instagram photography:
 * product on soft cream draped fabric, a blurred pale-green leaf in a top
 * corner, the Arabic title in burgundy at the top and a thin grey English
 * caption at the bottom. Replaced automatically once real photos exist.
 */
import type { Product } from '~/data/products'
import { getStone } from '~/data/stones'
import { getSign } from '~/data/zodiac'
import type { Metal, Version } from '~/data/types'
import { blobPath, hashString, mix, r2, rng } from '~/lib/art'

const props = withDefaults(defineProps<{
  product: Product
  variant?: number
  metal?: Metal
  version?: Version
  stoneOverride?: string
  showText?: boolean
}>(), { variant: 0, showText: true })

const uid = useId()
const W = 400
const H = 500

const metalHex = computed(() => (props.metal ?? props.product.metals[0] ?? 'gold') === 'gold'
  ? { base: '#C9A24B', light: '#F1E2B8', dark: '#8C6B22' }
  : { base: '#B9BEC6', light: '#F4F5F7', dark: '#7D828B' })

const stoneList = computed(() => {
  const slugs = props.stoneOverride ? [props.stoneOverride] : props.product.stones
  return slugs.map(s => getStone(s)).filter(Boolean).map(s => ({
    slug: s!.slug,
    light: s!.highlight,
    base: s!.hex,
    dark: mix(s!.hex, '#000000', 0.45),
    clear: s!.clarity === 'clear',
  }))
})

const sign = computed(() => getSign(props.product.zodiac))
const titleAr = computed(() => sign.value ? `برج ${sign.value.name.ar}` : props.product.name.ar)
const caption = computed(() => {
  if (sign.value) {
    const m = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const s = sign.value
    return `${s.name.en} : ${m[s.start[0] - 1]} ${s.start[1]} – ${m[s.end[0] - 1]} ${s.end[1]}`
  }
  return props.product.name.en
})

const seed = computed(() => hashString(props.product.slug + props.variant))
const leafRight = computed(() => (seed.value % 2 === 0) !== (props.variant % 2 === 1))
const zoom = computed(() => [1, 1.35, 0.92][props.variant % 3]!)
const cy = computed(() => (props.showText ? 270 : 250))

/* ---------- item geometry ---------- */
const charms = computed(() => {
  const r = rng(seed.value)
  const n = 22
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + (r() - 0.5) * 0.1
    const rx = 108
    const ry = 96
    const ax = r2(Math.cos(a) * rx)
    const ay = r2(Math.sin(a) * ry)
    const len = 16 + r() * 6
    const size = r2(11 + r() * 5)
    const sx = r2(Math.cos(a) * (rx + len))
    const sy = r2(Math.sin(a) * (ry + len) + 4)
    const stone = stoneList.value[i % stoneList.value.length]!
    return { ax, ay, sx, sy, size, stone, path: blobPath(sx, sy, size, size * (1.1 + r() * 0.25), Math.floor(r() * 1e6), 7, 0.18) }
  })
})

const beads = computed(() => {
  const n = 18
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2
    return { x: r2(Math.cos(a) * 100), y: r2(Math.sin(a) * 92), stone: stoneList.value[i % stoneList.value.length]!, spacer: i === 4 }
  })
})

const misbaha = computed(() => {
  const n = 33
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1)
    const a = -Math.PI / 2 + 0.32 + t * (Math.PI * 2 - 0.64)
    return { x: r2(Math.cos(a) * 92), y: r2(Math.sin(a) * 110 - 30) }
  })
})

const looseBlob = computed(() => blobPath(0, 0, 92, 74, seed.value, 8, 0.12))
const fabric = computed(() => {
  const r = rng(seed.value + 99)
  return Array.from({ length: 4 }, (_, i) => {
    const y = 120 + i * 95 + r() * 30
    const c = 40 + r() * 80
    return `M-20 ${y} C ${100 + r() * 60} ${y - c}, ${260 + r() * 60} ${y + c}, 420 ${y - 20 + r() * 40} L420 ${y + 60} C 300 ${y + 60 + c * 0.5}, 120 ${y + 40 - c * 0.5}, -20 ${y + 70} Z`
  })
})

const alt = computed(() => `${props.product.name.en} — ${props.product.name.ar}`)
</script>

<template>
  <svg :viewBox="`0 0 ${W} ${H}`" role="img" :aria-label="alt" class="block h-full w-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient :id="`bg-${uid}`" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0" stop-color="#F7EFE9" />
        <stop offset="1" stop-color="#EAD9D0" />
      </linearGradient>
      <linearGradient :id="`fold-${uid}`" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.75" />
        <stop offset="1" stop-color="#D9C0B6" stop-opacity="0.35" />
      </linearGradient>
      <filter :id="`soft-${uid}`" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9" /></filter>
      <filter :id="`leafblur-${uid}`" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5" /></filter>
      <linearGradient :id="`metal-${uid}`" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" :stop-color="metalHex.light" />
        <stop offset="0.5" :stop-color="metalHex.base" />
        <stop offset="1" :stop-color="metalHex.dark" />
      </linearGradient>
      <radialGradient v-for="s in stoneList" :id="`st-${uid}-${s.slug}`" :key="s.slug" cx="0.36" cy="0.3" r="0.8">
        <stop offset="0" :stop-color="s.light" />
        <stop offset="0.45" :stop-color="s.base" />
        <stop offset="1" :stop-color="s.dark" />
      </radialGradient>
    </defs>

    <!-- cream draped fabric -->
    <rect :width="W" :height="H" :fill="`url(#bg-${uid})`" />
    <g :filter="`url(#soft-${uid})`">
      <path v-for="(d, i) in fabric" :key="i" :d="d" :fill="`url(#fold-${uid})`" />
    </g>

    <!-- pale green leaf peeking in -->
    <g :transform="leafRight ? `translate(${W + 10} -20) scale(-1 1)` : 'translate(-10 -20)'" :filter="`url(#leafblur-${uid})`" opacity="0.75">
      <path d="M0 40 C 60 10, 120 30, 150 90 C 100 110, 40 95, 0 40 Z" fill="#B7CBA2" />
      <path d="M0 40 C 50 60, 100 75, 150 90" stroke="#9FB88A" stroke-width="3" fill="none" />
      <path d="M-10 120 C 40 105, 80 120, 100 160 C 60 170, 20 160, -10 120 Z" fill="#C6D7B4" />
    </g>

    <text v-if="showText" x="200" y="74" text-anchor="middle" font-family="Amiri, 'Noto Kufi Arabic', serif" font-size="34" fill="#7A1F3D" direction="rtl">{{ titleAr }}</text>

    <!-- soft contact shadow -->
    <ellipse :cx="200" :cy="cy + 120 * zoom" :rx="120 * zoom" :ry="12 * zoom" fill="#7A4A3A" opacity="0.08" :filter="`url(#soft-${uid})`" />

    <g :transform="`translate(200 ${cy}) scale(${zoom})`">
      <!-- women's zodiac bracelet: gold chain with dangling tumbled charms -->
      <template v-if="product.type === 'bracelet' && version !== 'men'">
        <ellipse rx="108" ry="96" fill="none" :stroke="`url(#metal-${uid})`" stroke-width="3.2" stroke-dasharray="5 2.2" />
        <ellipse rx="108" ry="96" fill="none" :stroke="metalHex.light" stroke-width="0.8" stroke-dasharray="2 5.4" opacity="0.9" />
        <g v-for="(c, i) in charms" :key="i">
          <line :x1="c.ax" :y1="c.ay" :x2="c.sx" :y2="c.sy - c.size * 0.8" :stroke="metalHex.base" stroke-width="1.1" />
          <path :d="c.path" :fill="`url(#st-${uid}-${c.stone.slug})`" />
          <ellipse :cx="c.sx - c.size * 0.3" :cy="c.sy - c.size * 0.4" :rx="c.size * 0.28" :ry="c.size * 0.16" fill="#fff" opacity="0.55" />
        </g>
        <circle cx="0" cy="96" r="7" :fill="`url(#metal-${uid})`" />
      </template>

      <!-- men's version: natural stone beads -->
      <template v-else-if="product.type === 'bracelet'">
        <g v-for="(b, i) in beads" :key="i">
          <rect v-if="b.spacer" :x="b.x - 8" :y="b.y - 11" width="16" height="22" rx="4" :fill="`url(#metal-${uid})`" />
          <template v-else>
            <circle :cx="b.x" :cy="b.y" r="15" :fill="`url(#st-${uid}-${b.stone.slug})`" />
            <ellipse :cx="b.x - 5" :cy="b.y - 6" rx="4.5" ry="2.6" fill="#fff" opacity="0.55" />
          </template>
        </g>
      </template>

      <!-- ring -->
      <template v-else-if="product.type === 'ring'">
        <ellipse cy="40" rx="84" ry="64" fill="none" :stroke="`url(#metal-${uid})`" :stroke-width="product.ringStyle === 'signet' ? 16 : 10" />
        <ellipse cy="40" rx="84" ry="64" fill="none" :stroke="metalHex.light" stroke-width="1.5" opacity="0.7" transform="translate(-3 -3)" />
        <template v-if="product.ringStyle === 'signet'">
          <ellipse cy="-30" rx="58" ry="44" :fill="`url(#metal-${uid})`" />
          <ellipse cy="-32" rx="48" ry="36" :fill="`url(#st-${uid}-${stoneList[0]!.slug})`" />
          <ellipse cx="-16" cy="-46" rx="16" ry="8" fill="#fff" opacity="0.45" />
        </template>
        <template v-else>
          <path d="M-14 -16 L-22 -46 M14 -16 L22 -46 M0 -14 L0 -40" :stroke="metalHex.base" stroke-width="4" stroke-linecap="round" />
          <polygon points="-38,-58 -24,-82 24,-82 38,-58 0,-18" :fill="`url(#st-${uid}-${stoneList[0]!.slug})`" />
          <g stroke="#fff" stroke-opacity="0.55" stroke-width="1" fill="none">
            <path d="M-38 -58 H38 M-24 -82 L-12 -58 L0 -82 L12 -58 L24 -82 M-12 -58 L0 -18 L12 -58" />
          </g>
          <path d="M-12 -78 l4 -6 4 6 -4 6z" fill="#fff" opacity="0.8" />
        </template>
      </template>

      <!-- pendant / necklace -->
      <template v-else-if="product.type === 'pendant' || product.type === 'necklace'">
        <path d="M-150 -230 Q -60 -80 0 -62 Q 60 -80 150 -230" fill="none" :stroke="`url(#metal-${uid})`" stroke-width="2.2" stroke-dasharray="4 2" />
        <circle cy="-56" r="7" fill="none" :stroke="metalHex.base" stroke-width="3" />
        <template v-if="product.type === 'pendant'">
          <ellipse cy="10" rx="50" ry="66" :fill="`url(#metal-${uid})`" />
          <ellipse cy="10" rx="42" ry="58" :fill="`url(#st-${uid}-${stoneList[0]!.slug})`" />
          <ellipse cx="-14" cy="-14" rx="14" ry="22" fill="#fff" opacity="0.35" />
          <ellipse v-if="stoneList[0]?.slug === 'moonstone' || stoneList[0]?.slug === 'opal'" cx="8" cy="20" rx="26" ry="30" fill="#9FC4FF" opacity="0.25" />
        </template>
        <template v-else>
          <path d="M0 -48 L34 0 L0 64 L-34 0 Z" :fill="`url(#st-${uid}-${stoneList[0]!.slug})`" />
          <path d="M0 -48 L0 64 M-34 0 H34 M-17 -24 L17 24 M17 -24 L-17 24" stroke="#fff" stroke-opacity="0.4" stroke-width="1" />
          <rect x="-8" y="-56" width="16" height="10" rx="3" :fill="`url(#metal-${uid})`" />
        </template>
      </template>

      <!-- prayer beads (misbaha) -->
      <template v-else-if="product.type === 'beads'">
        <g v-for="(b, i) in misbaha" :key="i">
          <circle :cx="b.x" :cy="b.y" r="9" :fill="`url(#st-${uid}-${stoneList[0]!.slug})`" />
          <circle :cx="b.x - 3" :cy="b.y - 3" r="2.4" fill="#fff" opacity="0.5" />
        </g>
        <rect x="-8" y="72" width="16" height="34" rx="7" :fill="`url(#st-${uid}-${stoneList[0]!.slug})`" />
        <circle cx="0" cy="112" r="6" :fill="`url(#metal-${uid})`" />
        <path d="M-12 116 L12 116 L22 178 L-22 178 Z" fill="#7A1F3D" />
        <path d="M-8 120 L-14 176 M0 120 L0 178 M8 120 L14 176" stroke="#C9A24B" stroke-opacity="0.6" stroke-width="1" />
      </template>

      <!-- loose natural stone -->
      <template v-else>
        <path :d="looseBlob" :fill="`url(#st-${uid}-${stoneList[0]!.slug})`" />
        <ellipse cx="-28" cy="-30" rx="26" ry="12" fill="#fff" opacity="0.4" transform="rotate(-20 -28 -30)" />
      </template>
    </g>

    <text v-if="showText" x="200" y="474" text-anchor="middle" font-family="'Cormorant Garamond', Georgia, serif" font-size="15" letter-spacing="0.6" fill="#6F6862">{{ caption }}</text>
  </svg>
</template>
