<script setup lang="ts">
import { chakraNames, stoneZodiac, stones, type Chakra } from '~/data/stones'
import { getSign } from '~/data/zodiac'
import { blobPath, hashString } from '~/lib/art'

usePageSeo('stones')
const { t } = useI18n()
const { l } = useL()
const localePath = useLocalePath()
const search = ref('')
const chakra = ref<Chakra | ''>('')
const list = computed(() => {
  const q = search.value.trim().toLowerCase()
  return stones.filter(s =>
    (!chakra.value || s.chakra.includes(chakra.value))
    && (!q || s.name.en.toLowerCase().includes(q) || s.name.ar.includes(q) || s.colorName.en.toLowerCase().includes(q) || s.colorName.ar.includes(q)),
  )
})
const chakras = Object.keys(chakraNames) as Chakra[]
</script>

<template>
  <div>
    <PageHero :eyebrow="t('stonesPage.eyebrow')" :title="t('stonesPage.title')" :subtitle="t('stonesPage.subtitle')" />
    <div class="bg-fabric py-12 sm:py-16">
      <div class="container-lux">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label class="relative block w-full max-w-sm">
            <span class="sr-only">{{ t('stonesPage.search') }}</span>
            <AppIcon name="search" :size="18" class="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input v-model="search" type="search" class="field ps-11" :placeholder="t('stonesPage.search')">
          </label>
          <div class="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4" role="group" :aria-label="t('stonesPage.chakra')">
            <button type="button" class="chip shrink-0" :aria-pressed="!chakra" @click="chakra = ''">{{ t('stonesPage.all') }}</button>
            <button v-for="c in chakras" :key="c" type="button" class="chip shrink-0" :aria-pressed="chakra === c" @click="chakra = chakra === c ? '' : c">
              <span class="h-2.5 w-2.5 rounded-full" :style="{ background: chakraNames[c].hex }" />{{ l(chakraNames[c]) }}
            </button>
          </div>
        </div>

        <ul v-if="list.length" class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <li v-for="s in list" :id="s.slug" :key="s.slug" v-reveal class="card-lux scroll-mt-24 overflow-hidden target:ring-2 target:ring-burgundy">
            <div class="flex items-center gap-5 border-b border-gold/25 bg-gradient-to-br from-cream to-blush/60 p-6">
              <svg viewBox="-60 -50 120 100" class="h-20 w-24 shrink-0 drop-shadow-md" aria-hidden="true">
                <defs>
                  <radialGradient :id="`sg-${s.slug}`" cx="0.35" cy="0.3" r="0.8">
                    <stop offset="0" :stop-color="s.highlight" /><stop offset="0.5" :stop-color="s.hex" /><stop offset="1" stop-color="#000" stop-opacity="0.55" />
                  </radialGradient>
                </defs>
                <path :d="blobPath(0, 0, 50, 40, hashString(s.slug), 8, 0.12)" :fill="`url(#sg-${s.slug})`" />
                <ellipse cx="-16" cy="-16" rx="14" ry="6" fill="#fff" opacity="0.4" transform="rotate(-20 -16 -16)" />
              </svg>
              <div>
                <h2 class="font-display text-3xl leading-tight text-burgundy-900">{{ l(s.name) }}</h2>
                <p class="mt-1 text-sm text-ink-soft">{{ l(s.colorName) }}</p>
              </div>
            </div>
            <div class="space-y-4 p-6 text-sm">
              <p class="leading-relaxed text-ink">{{ l(s.meaning) }}</p>
              <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
                <dt class="text-ink-soft">{{ t('stonesPage.properties') }}</dt><dd>{{ l(s.properties) }}</dd>
                <dt class="text-ink-soft">{{ t('stonesPage.chakra') }}</dt>
                <dd class="flex flex-wrap gap-2"><span v-for="c in s.chakra" :key="c" class="inline-flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full" :style="{ background: chakraNames[c].hex }" />{{ l(chakraNames[c]) }}</span></dd>
                <dt class="text-ink-soft">{{ t('stonesPage.hardness') }}</dt><dd>{{ s.hardness }} / 10</dd>
                <dt class="text-ink-soft">{{ t('stonesPage.zodiac') }}</dt>
                <dd class="flex flex-wrap gap-1.5">
                  <NuxtLink v-for="z in stoneZodiac(s.slug)" :key="z" :to="localePath(`/shop?zodiac=${z}`)" class="inline-flex items-center gap-1 rounded-full border border-gold/40 px-2 py-0.5 text-xs hover:border-burgundy">
                    <ZodiacGlyph :d="getSign(z)!.glyph" :size="13" class="text-burgundy" />{{ l(getSign(z)!.name) }}
                  </NuxtLink>
                </dd>
              </dl>
              <NuxtLink :to="localePath(`/shop?stone=${s.slug}`)" class="inline-flex items-center gap-2 pt-2 font-medium text-burgundy">
                {{ t('stonesPage.shop', { stone: l(s.name) }) }} <AppIcon name="arrow" :size="16" class="rtl:rotate-180" />
              </NuxtLink>
            </div>
          </li>
        </ul>
        <p v-else class="mt-16 text-center text-ink-soft">{{ t('stonesPage.none') }}</p>
      </div>
    </div>
  </div>
</template>
