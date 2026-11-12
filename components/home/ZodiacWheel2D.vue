<script setup lang="ts">
/** SVG zodiac wheel: the fallback for devices without WebGL (also clickable). */
import { zodiacSigns } from '~/data/zodiac'

const props = defineProps<{ selected: number }>()
const emit = defineEmits<{ select: [i: number] }>()
const { l } = useL()

// accumulate rotation so the wheel always takes the shortest path
const rot = ref(-props.selected * 30)
watch(() => props.selected, (i) => {
  const desired = -i * 30
  let d = (desired - rot.value) % 360
  if (d > 180) d -= 360
  if (d < -180) d += 360
  rot.value += d
})

const seg = (i: number) => {
  const a0 = ((-90 + i * 30 - 15) * Math.PI) / 180
  const a1 = ((-90 + i * 30 + 15) * Math.PI) / 180
  const R = 96
  const r = 58
  const p = (rad: number, a: number) => `${(100 + Math.cos(a) * rad).toFixed(2)} ${(100 + Math.sin(a) * rad).toFixed(2)}`
  return `M${p(r, a0)} L${p(R, a0)} A${R} ${R} 0 0 1 ${p(R, a1)} L${p(r, a1)} A${r} ${r} 0 0 0 ${p(r, a0)} Z`
}
const pos = (i: number) => {
  const a = ((-90 + i * 30) * Math.PI) / 180
  return { x: Math.round((100 + Math.cos(a) * 77) * 100) / 100, y: Math.round((100 + Math.sin(a) * 77) * 100) / 100, deg: i * 30 }
}
</script>

<template>
  <div class="relative h-full w-full">
    <svg viewBox="0 0 200 200" class="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="zw-bg"><stop offset="0" stop-color="#3A1022" /><stop offset="1" stop-color="#0E0E12" /></radialGradient>
      </defs>
      <rect width="200" height="200" fill="url(#zw-bg)" />
      <path d="M100 0 l3 6 h-6z" fill="#C9A24B" transform="translate(0 -1)" />
      <g :style="{ transform: `rotate(${rot}deg)`, transformOrigin: '100px 100px', transition: 'transform 0.9s cubic-bezier(0.22,1,0.36,1)' }">
        <circle cx="100" cy="100" r="96" fill="#5E1730" stroke="#C9A24B" stroke-width="1" />
        <path
          v-for="(s, i) in zodiacSigns"
          :key="s.slug"
          :d="seg(i)"
          :fill="i === selected ? 'rgba(230,203,134,0.28)' : 'transparent'"
          stroke="#C9A24B"
          stroke-width="0.5"
          class="cursor-pointer transition-[fill] hover:fill-[rgba(230,203,134,0.14)]"
          @click="emit('select', i)"
        />
        <circle cx="100" cy="100" r="58" fill="#141219" stroke="#C9A24B" stroke-width="1" />
        <g v-for="(s, i) in zodiacSigns" :key="`g-${s.slug}`" :transform="`translate(${pos(i).x - 8} ${pos(i).y - 8}) rotate(${pos(i).deg} 8 8)`" class="pointer-events-none">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F1E2B8" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" :opacity="i === selected ? 1 : 0.65"><path :d="s.glyph" /></svg>
        </g>
      </g>
      <g fill="none" stroke="#C9A24B" stroke-width="0.9" stroke-linejoin="round" transform="translate(100 100) scale(0.42) translate(-100 -76)">
        <path d="M74 48H126L140 63L100 104L60 63Z M60 63H140 M74 48L82 63L100 48L118 63L126 48 M82 63L100 104L118 63" />
      </g>
    </svg>
    <span class="sr-only">{{ l(zodiacSigns[selected]!.name) }}</span>
  </div>
</template>
