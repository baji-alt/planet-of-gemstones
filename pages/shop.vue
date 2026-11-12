<script setup lang="ts">
import { categories, priceRange, products } from '~/data/products'
import { stones } from '~/data/stones'
import { zodiacSigns } from '~/data/zodiac'
import type { Metal } from '~/data/types'

usePageSeo('shop')
const { t } = useI18n()
const { l, price } = useL()
const route = useRoute()
const router = useRouter()

type Sort = 'featured' | 'priceAsc' | 'priceDesc' | 'newest'
// Pages are prerendered without query strings, so URL filters are applied right
// after hydration (keeps server and client markup identical).
const hydrated = ref(false)
onMounted(() => (hydrated.value = true))
const q = (k: string) => (hydrated.value && typeof route.query[k] === 'string' ? (route.query[k] as string) : '')
const setQ = (k: string, v: string | number | '') => {
  const query = { ...route.query, [k]: v === '' ? undefined : String(v) }
  router.replace({ query })
}
const filter = (k: string) => computed({ get: () => q(k), set: v => setQ(k, v) })
const category = filter('category')
const stone = filter('stone')
const zodiac = filter('zodiac')
const metal = filter('metal')
const sort = computed<Sort>({ get: () => (q('sort') as Sort) || 'featured', set: v => setQ('sort', v === 'featured' ? '' : v) })
const maxPrice = computed({ get: () => Number(q('max')) || priceRange.max, set: v => setQ('max', v >= priceRange.max ? '' : v) })

const results = computed(() => {
  let list = products.filter(p =>
    (!category.value || p.category === category.value)
    && (!stone.value || p.stones.includes(stone.value))
    && (!zodiac.value || p.zodiac === zodiac.value || (p.zodiac == null && zodiacSigns.find(z => z.slug === zodiac.value)?.stones.includes(p.stones[0]!)))
    && (!metal.value || p.metals.includes(metal.value as Metal))
    && p.price <= maxPrice.value,
  )
  if (sort.value === 'priceAsc') list = [...list].sort((a, b) => a.price - b.price)
  if (sort.value === 'priceDesc') list = [...list].sort((a, b) => b.price - a.price)
  if (sort.value === 'newest') list = [...list].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew))
  if (sort.value === 'featured') list = [...list].sort((a, b) => Number(!!b.bestseller) - Number(!!a.bestseller))
  return list
})
const activeCount = computed(() => [category, stone, zodiac, metal].filter(f => f.value).length + (maxPrice.value < priceRange.max ? 1 : 0))
const clearAll = () => router.replace({ query: {} })
const sheet = ref(false)
watch(sheet, v => import.meta.client && document.documentElement.classList.toggle('overflow-hidden', v))
</script>

<template>
  <div>
    <PageHero :eyebrow="t('shop.eyebrow')" :title="t('shop.title')" :subtitle="t('shop.subtitle')" />

    <div class="bg-fabric">
      <div class="container-lux py-10 lg:grid lg:grid-cols-[260px_1fr] lg:gap-12 lg:py-16">
        <!-- filters (sidebar on desktop, bottom sheet on mobile) -->
        <Transition name="drawer">
          <div v-if="sheet" class="fixed inset-0 z-[55] bg-ink/40 lg:hidden" @click="sheet = false" />
        </Transition>
        <aside
          :class="[
            'lg:static lg:block lg:max-h-none lg:translate-y-0 lg:bg-transparent lg:p-0 lg:shadow-none',
            sheet ? 'fixed inset-x-0 bottom-0 z-[56] max-h-[85vh] overflow-y-auto rounded-t-[2rem] bg-cream p-6 pb-28 shadow-2xl' : 'hidden',
          ]"
          :aria-label="t('shop.filters')"
        >
          <div class="flex items-center justify-between">
            <h2 class="font-display text-2xl text-burgundy-900">{{ t('shop.filters') }}</h2>
            <button v-if="activeCount" type="button" class="text-sm text-burgundy underline underline-offset-4" @click="clearAll">{{ t('shop.clear') }}</button>
          </div>

          <fieldset class="mt-6 border-t border-gold/30 pt-5">
            <legend class="eyebrow">{{ t('shop.category') }}</legend>
            <div class="mt-4 flex flex-wrap gap-2">
              <button type="button" class="chip" :aria-pressed="!category" @click="category = ''">{{ t('shop.all') }}</button>
              <button v-for="c in categories" :key="c.slug" type="button" class="chip" :aria-pressed="category === c.slug" @click="category = category === c.slug ? '' : c.slug">{{ t(`categories.${c.slug}.title`) }}</button>
            </div>
          </fieldset>

          <fieldset class="mt-6 border-t border-gold/30 pt-5">
            <legend class="eyebrow">{{ t('shop.stone') }}</legend>
            <div class="mt-4 flex flex-wrap gap-2">
              <button v-for="s in stones" :key="s.slug" type="button" class="chip !min-h-[34px] !px-2.5 !text-xs" :aria-pressed="stone === s.slug" @click="stone = stone === s.slug ? '' : s.slug">
                <span class="h-3 w-3 rounded-full" :style="{ background: `radial-gradient(circle at 35% 30%, ${s.highlight}, ${s.hex})` }" />{{ l(s.name) }}
              </button>
            </div>
          </fieldset>

          <fieldset class="mt-6 border-t border-gold/30 pt-5">
            <legend class="eyebrow">{{ t('shop.zodiac') }}</legend>
            <div class="mt-4 grid grid-cols-4 gap-2">
              <button v-for="z in zodiacSigns" :key="z.slug" type="button" class="flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-xl border text-[0.65rem] transition" :class="zodiac === z.slug ? 'border-burgundy bg-burgundy text-cream' : 'border-gold/40 bg-cream-50 text-ink-soft hover:border-burgundy/50'" :aria-pressed="zodiac === z.slug" @click="zodiac = zodiac === z.slug ? '' : z.slug">
                <ZodiacGlyph :d="z.glyph" :size="18" />{{ l(z.name) }}
              </button>
            </div>
          </fieldset>

          <fieldset class="mt-6 border-t border-gold/30 pt-5">
            <legend class="eyebrow">{{ t('shop.metal') }}</legend>
            <div class="mt-4 flex gap-2">
              <button v-for="m in (['gold', 'silver'] as const)" :key="m" type="button" class="chip" :aria-pressed="metal === m" @click="metal = metal === m ? '' : m">
                <span class="h-3.5 w-3.5 rounded-full" :style="{ background: m === 'gold' ? 'linear-gradient(135deg,#F1E2B8,#C9A24B)' : 'linear-gradient(135deg,#F4F5F7,#9AA0A8)' }" />{{ t(`shop.metals.${m}`) }}
              </button>
            </div>
          </fieldset>

          <fieldset class="mt-6 border-t border-gold/30 pt-5">
            <legend class="eyebrow">{{ t('shop.price') }}</legend>
            <label class="mt-4 block text-sm">
              <span class="text-ink-soft">{{ t('shop.upTo', { price: price(maxPrice) }) }}</span>
              <input v-model.number="maxPrice" type="range" :min="priceRange.min" :max="priceRange.max" step="5" class="mt-3 w-full accent-burgundy">
            </label>
          </fieldset>

          <button type="button" class="btn-primary mt-8 w-full lg:hidden" @click="sheet = false">{{ t('shop.showResults') }} ({{ results.length }})</button>
        </aside>

        <!-- results -->
        <section>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <p class="text-sm text-ink-soft" aria-live="polite">{{ t('shop.results', results.length) }}</p>
            <div class="flex items-center gap-2">
              <button type="button" class="btn-ghost !min-h-[44px] !px-4 lg:hidden" @click="sheet = true">
                <AppIcon name="filter" :size="18" /> {{ t('shop.filters') }}<span v-if="activeCount"> ({{ activeCount }})</span>
              </button>
              <label class="flex items-center gap-2 text-sm">
                <span class="sr-only sm:not-sr-only text-ink-soft">{{ t('shop.sort') }}</span>
                <select v-model="sort" class="field !min-h-[44px] !w-auto !py-0 text-sm">
                  <option v-for="s in (['featured', 'priceAsc', 'priceDesc', 'newest'] as const)" :key="s" :value="s">{{ t(`shop.sortOptions.${s}`) }}</option>
                </select>
              </label>
            </div>
          </div>

          <ul v-if="results.length" class="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 xl:grid-cols-3">
            <li v-for="(p, i) in results" :key="p.slug"><ProductCard :product="p" :eager="i < 2" /></li>
          </ul>
          <div v-else class="mt-16 text-center">
            <BrandLogo :size="96" class="mx-auto" />
            <p class="mt-6 text-ink-soft">{{ t('shop.empty') }}</p>
            <button type="button" class="btn-ghost mt-6" @click="clearAll">{{ t('shop.clear') }}</button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
