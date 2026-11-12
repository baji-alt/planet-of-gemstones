<script setup lang="ts">
import { signDates, signForDate, zodiacSigns } from '~/data/zodiac'
import { getStone } from '~/data/stones'
import { products } from '~/data/products'
import type { Version } from '~/data/types'

const { t, locale } = useI18n()
const { l, price } = useL()
const localePath = useLocalePath()
const { reducedMotion } = use3D()

const selected = ref(2) // Gemini on the server; today's sign once mounted
const version = ref<Version>('women')
onMounted(() => {
  const now = new Date()
  selected.value = zodiacSigns.indexOf(signForDate(now.getMonth() + 1, now.getDate()))
})
const sign = computed(() => zodiacSigns[selected.value]!)
const bracelet = computed(() => products.find(p => p.zodiac === sign.value.slug)!)
const stones = computed(() => sign.value.stones.map(s => getStone(s)!).filter(Boolean))

const listEl = ref<HTMLElement>()
const choose = (i: number) => {
  selected.value = i
  nextTick(() => listEl.value?.querySelector<HTMLElement>(`[data-i="${i}"]`)?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reducedMotion.value ? 'auto' : 'smooth' }))
}
const onKey = (e: KeyboardEvent) => {
  const dir = (e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0) * (locale.value === 'ar' ? -1 : 1)
  if (!dir) return
  e.preventDefault()
  const i = (selected.value + dir + 12) % 12
  choose(i)
  listEl.value?.querySelector<HTMLElement>(`[data-i="${i}"]`)?.focus()
}
</script>

<template>
  <section id="zodiac" class="on-dark section bg-night text-cream" :aria-label="t('zodiac.wheelLabel')">
    <div class="container-lux">
      <SectionHeading :eyebrow="t('zodiac.eyebrow')" :title="t('zodiac.title')" :subtitle="t('zodiac.subtitle')" />

      <div class="mt-12 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div class="min-w-0">
          <div class="relative mx-auto aspect-square w-full max-w-[560px] overflow-hidden rounded-full ring-1 ring-gold/30">
            <Lazy3D>
              <template #fallback>
                <HomeZodiacWheel2D :selected="selected" @select="choose" />
              </template>
              <template #default="{ ready }">
                <LazyThreeZodiacWheel :selected="selected" :reduced-motion="reducedMotion" @select="choose" @ready="ready" />
              </template>
            </Lazy3D>
          </div>

          <div ref="listEl" role="radiogroup" :aria-label="t('zodiac.chooseSign')" class="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-6 lg:overflow-visible lg:px-0" @keydown="onKey">
            <button
              v-for="(s, i) in zodiacSigns"
              :key="s.slug"
              type="button"
              role="radio"
              :data-i="i"
              :aria-checked="i === selected"
              :tabindex="i === selected ? 0 : -1"
              class="flex shrink-0 flex-col items-center gap-1 rounded-2xl border px-3 py-2.5 text-xs transition lg:px-1"
              :class="i === selected ? 'border-gold bg-gold/15 text-cream' : 'border-cream/15 text-cream/75 hover:border-gold/60'"
              @click="choose(i)"
            >
              <ZodiacGlyph :d="s.glyph" :size="22" class="text-gold-light" />
              {{ l(s.name) }}
            </button>
          </div>
        </div>

        <Transition mode="out-in" enter-active-class="transition duration-500 ease-out" enter-from-class="opacity-0 translate-y-4" leave-active-class="transition duration-200" leave-to-class="opacity-0">
          <article :key="sign.slug" class="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:items-center" aria-live="polite">
            <div class="relative overflow-hidden rounded-[1.75rem] ring-1 ring-gold/40">
              <div class="aspect-[4/5]"><ProductArt :product="bracelet" :version="version" /></div>
            </div>
            <div>
              <p class="flex items-center gap-3 text-gold-light">
                <ZodiacGlyph :d="sign.glyph" :size="34" />
                <span class="text-sm uppercase tracking-luxe rtl:tracking-normal">{{ t(`zodiac.elements.${sign.element}`) }}</span>
              </p>
              <h3 class="h-display mt-3 text-5xl">{{ l(sign.name) }}</h3>
              <p class="mt-1 font-arabic text-2xl text-gold-light" lang="ar" v-if="locale !== 'ar'">برج {{ sign.name.ar }}</p>
              <p class="mt-4 text-cream/80">{{ l(sign.trait) }}</p>
              <dl class="mt-6 grid grid-cols-2 gap-4 border-y border-gold/25 py-5 text-sm">
                <div><dt class="text-cream/70">{{ t('zodiac.dates') }}</dt><dd class="mt-1 text-cream">{{ signDates(sign, locale) }}</dd></div>
                <div><dt class="text-cream/70">{{ t('zodiac.ruler') }}</dt><dd class="mt-1 text-cream">{{ l(sign.ruler) }}</dd></div>
              </dl>
              <p class="mt-5 text-sm text-cream/70">{{ t('zodiac.stones') }}</p>
              <ul class="mt-2 flex flex-wrap gap-2">
                <li v-for="s in stones" :key="s.slug">
                  <NuxtLink :to="localePath(`/stones#${s.slug}`)" class="inline-flex items-center gap-2 rounded-full border border-cream/20 px-3 py-1.5 text-sm text-cream/90 hover:border-gold">
                    <span class="h-3 w-3 rounded-full ring-1 ring-white/30" :style="{ background: `radial-gradient(circle at 35% 30%, ${s.highlight}, ${s.hex})` }" />
                    {{ l(s.name) }}
                  </NuxtLink>
                </li>
              </ul>
              <div class="mt-6 inline-flex rounded-full border border-cream/20 p-1 text-xs" role="group" :aria-label="t('product.version')">
                <button v-for="v in (['women', 'men'] as const)" :key="v" type="button" class="min-h-[36px] rounded-full px-4 transition" :class="version === v ? 'bg-gold text-ink' : 'text-cream/80'" :aria-pressed="version === v" @click="version = v">
                  {{ t(`shop.versions.${v}`) }} {{ v === 'women' ? '♀' : '♂' }}
                </button>
              </div>
              <div class="mt-6 flex flex-wrap items-center gap-4">
                <NuxtLink v-sparkle :to="localePath(`/product/${bracelet.slug}?version=${version}`)" class="btn-gold">{{ t('zodiac.shopBracelet') }} · {{ price(bracelet.price) }}</NuxtLink>
              </div>
            </div>
          </article>
        </Transition>
      </div>
    </div>
  </section>
</template>
