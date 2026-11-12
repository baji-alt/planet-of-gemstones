<script setup lang="ts">
import { getProduct, products } from '~/data/products'
import { chakraNames, getStone, stones as allStones } from '~/data/stones'
import { getSign, signDates } from '~/data/zodiac'
import type { Metal, Version } from '~/data/types'

const route = useRoute()
const product = getProduct(String(route.params.slug))
if (!product) throw createError({ statusCode: 404, statusMessage: 'Product not found', fatal: true })
const p = product!

const { t, locale } = useI18n()
const { l, price } = useL()
const localePath = useLocalePath()
const { link } = useWhatsApp()
const { can3D, reducedMotion } = use3D()
const { add, open: cartOpen } = useCart()
const config = useRuntimeConfig()

// ---- options ----
const metal = ref<Metal>(p.metals[0] ?? 'gold')
const version = ref<Version | undefined>(p.versions?.[0])
onMounted(() => {
  // query params are applied after hydration (pages are prerendered without them)
  const v = route.query.version as Version
  if (p.versions?.includes(v)) version.value = v
})
const heroStone = getStone(p.stones[0])!
const swapStones = computed(() => {
  if (p.type === 'bracelet' || p.type === 'stone' || p.type === 'beads') return []
  const same = allStones.filter(s => s.slug !== heroStone.slug && (s.clarity === 'clear') === (heroStone.clarity === 'clear'))
  return [heroStone.slug, ...same.slice(0, 6).map(s => s.slug)]
})
const stone = ref(heroStone.slug)
const viewerStones = computed(() => (swapStones.value.length ? [stone.value] : p.stones))

const sizes = computed(() => {
  if (p.type === 'ring') return ['6', '7', '8', '9', '10', '11', '12'].map(s => `US ${s}`)
  if (p.type === 'bracelet') return ['15 cm', '16 cm', '17 cm', '18 cm', '19 cm']
  return []
})
const size = ref('')
watch(sizes, s => (size.value = s[2] ?? ''), { immediate: true })

// ---- media ----
const views = computed(() => {
  const photos = p.images.length ? p.images.map((_, i) => i) : [0, 1, 2]
  return ['3d', ...photos] as ('3d' | number)[]
})
const view = ref<'3d' | number>(0)
onMounted(() => {
  if (can3D.value) view.value = '3d'
})
watch(can3D, v => v && (view.value = '3d'))

// ---- actions ----
const added = ref(false)
const addToCart = () => {
  add({ slug: p.slug, metal: p.metals.length ? metal.value : undefined, size: size.value || undefined, version: version.value })
  added.value = true
  setTimeout(() => (added.value = false), 2200)
  cartOpen.value = true
}
const waText = computed(() => {
  const opts = [version.value && t(`shop.versions.${version.value}`), p.metals.length && t(`shop.metals.${metal.value}`), stone.value !== heroStone.slug && l(getStone(stone.value)?.name), size.value].filter(Boolean).join(', ')
  return `${t('wa.greeting')}\n${t('wa.order')}\n• ${l(p.name)}${opts ? ` (${opts})` : ''} — ${price(p.price)}\n${config.public.siteUrl}${localePath(`/product/${p.slug}`)}`
})

const sign = getSign(p.zodiac)
const productStones = p.stones.map(s => getStone(s)!).filter(Boolean)
const related = products.filter(x => x.slug !== p.slug && (x.category === p.category || x.stones.some(s => p.stones.includes(s)))).slice(0, 4)
const ringTable = [
  ['6', '51.9', '16.5'], ['7', '54.4', '17.3'], ['8', '57.0', '18.1'], ['9', '59.5', '19.0'], ['10', '62.1', '19.8'], ['11', '64.6', '20.6'], ['12', '67.2', '21.4'],
]
const sizingKey = p.type === 'necklace' || p.type === 'beads' ? 'pendant' : p.type

// ---- SEO ----
usePageSeo('product', () => ({ title: l(p.name), description: l(p.description) }))
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': p.name.en,
      'alternateName': p.name.ar,
      'description': p.description.en,
      'sku': p.slug,
      'brand': { '@type': 'Brand', 'name': 'Planet of Gemstones' },
      'image': p.images.length ? p.images.map(i => `${config.public.siteUrl}${i}`) : [`${config.public.siteUrl}/og.png`],
      'offers': { '@type': 'Offer', 'priceCurrency': 'USD', 'price': p.price, 'availability': 'https://schema.org/InStock', 'url': `${config.public.siteUrl}/product/${p.slug}` },
    }),
  }],
})
</script>

<template>
  <div class="bg-fabric pb-28 pt-20 lg:pb-16 lg:pt-24">
    <div class="container-lux">
      <nav class="py-4 text-sm text-ink-soft" :aria-label="t('product.breadcrumbShop')">
        <ol class="flex flex-wrap items-center gap-2">
          <li><NuxtLink :to="localePath('/shop')" class="hover:text-burgundy">{{ t('product.breadcrumbShop') }}</NuxtLink></li>
          <li aria-hidden="true">/</li>
          <li><NuxtLink :to="localePath(`/shop?category=${p.category}`)" class="hover:text-burgundy">{{ t(`categories.${p.category}.title`) }}</NuxtLink></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" class="text-ink">{{ l(p.name) }}</li>
        </ol>
      </nav>

      <div class="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <!-- media -->
        <div class="lg:sticky lg:top-24 lg:self-start">
          <div class="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-cream-50 shadow-soft ring-1 ring-gold/30 sm:aspect-square">
            <template v-if="view === '3d'">
              <Lazy3D eager>
                <template #fallback><ProductMedia :product="p" :metal="metal" :version="version" eager /></template>
                <template #default="{ ready }">
                  <LazyThreeJewelViewer
                    :type="p.type"
                    :stones="viewerStones"
                    :metal="metal"
                    :ring-style="p.ringStyle"
                    :version="version"
                    :model="p.model"
                    :reduced-motion="reducedMotion"
                    @ready="ready"
                  />
                </template>
              </Lazy3D>
              <p class="pointer-events-none absolute inset-x-0 bottom-4 text-center text-xs text-ink-soft">{{ t('product.dragHint') }}</p>
            </template>
            <ProductMedia v-else :product="p" :index="view" :metal="metal" :version="version" sizes="(max-width: 1024px) 100vw, 55vw" eager />
          </div>
          <div class="mt-4 flex gap-3" role="tablist" :aria-label="t('product.gallery')">
            <template v-for="v in views" :key="v">
              <button
                v-if="v !== '3d' || can3D"
                type="button"
                role="tab"
                :aria-selected="view === v"
                :aria-label="v === '3d' ? t('product.view3d') : t('product.photo', { n: Number(v) + 1 })"
                class="relative h-20 w-16 overflow-hidden rounded-xl ring-2 transition sm:h-24 sm:w-20"
                :class="view === v ? 'ring-burgundy' : 'ring-gold/30 hover:ring-gold'"
                @click="view = v"
              >
                <span v-if="v === '3d'" class="grid h-full w-full place-items-center bg-night text-gold-light"><AppIcon name="cube" /><span class="absolute bottom-1 text-[0.6rem] font-semibold">3D</span></span>
                <ProductMedia v-else :product="p" :index="v" :metal="metal" :version="version" sizes="80px" />
              </button>
            </template>
          </div>
        </div>

        <!-- details -->
        <div>
          <p class="eyebrow">{{ t(`categories.${p.category}.title`) }}</p>
          <h1 class="h-display mt-3 text-4xl sm:text-5xl">{{ l(p.name) }}</h1>
          <p class="mt-1 text-xl text-gold-deep" :class="locale === 'ar' ? 'font-display italic' : 'font-arabic'" :lang="locale === 'ar' ? 'en' : 'ar'">{{ locale === 'ar' ? p.name.en : p.name.ar }}</p>
          <p class="mt-5 font-display text-3xl text-burgundy">{{ price(p.price) }}</p>
          <p v-if="sign" class="mt-3 inline-flex items-center gap-2 text-sm text-ink-soft"><ZodiacGlyph :d="sign.glyph" :size="18" class="text-burgundy" /> {{ l(sign.name) }} · {{ signDates(sign, locale) }}</p>
          <p class="mt-5 leading-relaxed text-ink-soft">{{ l(p.description) }}</p>

          <div class="mt-8 space-y-7 border-t border-gold/30 pt-7">
            <fieldset v-if="p.versions">
              <legend class="text-sm font-medium">{{ t('product.version') }}</legend>
              <div class="mt-3 flex flex-wrap gap-2">
                <button v-for="v in p.versions" :key="v" type="button" class="chip" :aria-pressed="version === v" @click="version = v">{{ t(`product.versions.${v}`) }}</button>
              </div>
            </fieldset>
            <StoneSwatches v-if="swapStones.length" v-model="stone" :options="swapStones" :label="t('atelier.stone')" />
            <MetalToggle v-if="p.metals.length" v-model="metal" :options="p.metals" :label="t('product.metal')" />
            <label v-if="sizes.length" class="block">
              <span class="text-sm font-medium">{{ t('product.size') }}</span>
              <select v-model="size" class="field mt-3 max-w-[220px]">
                <option v-for="s in sizes" :key="s" :value="s">{{ s }}</option>
              </select>
            </label>
          </div>

          <div class="mt-8 hidden gap-3 sm:flex">
            <button v-sparkle type="button" class="btn-primary flex-1" @click="addToCart">
              <AppIcon name="bag" :size="18" /> {{ added ? t('product.added') : t('product.addToCart') }}
            </button>
            <a :href="link(waText)" target="_blank" rel="noopener" class="btn-wa flex-1"><WhatsAppIcon /> {{ t('product.orderWhatsapp') }}</a>
          </div>
          <p class="mt-4 flex items-center gap-2 text-sm text-ink-soft"><AppIcon name="truck" :size="18" class="text-burgundy" /> {{ t('product.delivery') }}</p>

          <div class="mt-10 divide-y divide-gold/30 border-y border-gold/30">
            <details class="group py-5" open>
              <summary class="flex cursor-pointer list-none items-center justify-between font-display text-2xl text-burgundy-900">
                {{ t('product.stoneMeaning') }} <AppIcon name="plus" class="transition group-open:rotate-45" />
              </summary>
              <ul class="mt-4 space-y-5">
                <li v-for="s in productStones" :key="s.slug" class="flex gap-4">
                  <span class="mt-1 h-9 w-9 shrink-0 rounded-full shadow-soft" :style="{ background: `radial-gradient(circle at 35% 30%, ${s.highlight}, ${s.hex} 60%, #00000055)` }" aria-hidden="true" />
                  <div>
                    <NuxtLink :to="localePath(`/stones#${s.slug}`)" class="font-medium text-burgundy-900 underline-offset-4 hover:underline">{{ l(s.name) }}</NuxtLink>
                    <p class="mt-1 text-sm leading-relaxed text-ink-soft">{{ l(s.meaning) }}</p>
                    <p class="mt-1 text-xs text-ink-soft">{{ t('product.chakra') }}: {{ s.chakra.map(c => l(chakraNames[c])).join(' · ') }} — {{ t('product.hardness') }}: {{ s.hardness }}</p>
                  </div>
                </li>
              </ul>
              <p class="mt-4 text-xs italic text-ink-soft">{{ t('product.naturalNote') }}</p>
            </details>
            <details class="group py-5">
              <summary class="flex cursor-pointer list-none items-center justify-between font-display text-2xl text-burgundy-900">
                {{ t('product.sizeGuide') }} <AppIcon name="plus" class="transition group-open:rotate-45" />
              </summary>
              <p class="mt-4 text-sm leading-relaxed text-ink-soft">{{ t(`product.sizing.${sizingKey}`) }}</p>
              <table v-if="p.type === 'ring'" class="mt-4 w-full text-sm">
                <thead><tr class="text-start text-ink-soft"><th class="py-2 text-start font-medium">{{ t('product.ringTable.size') }}</th><th class="text-start font-medium">{{ t('product.ringTable.circ') }}</th><th class="text-start font-medium">{{ t('product.ringTable.diam') }}</th></tr></thead>
                <tbody>
                  <tr v-for="r in ringTable" :key="r[0]" class="border-t border-gold/20"><td class="py-2">US {{ r[0] }}</td><td>{{ r[1] }} mm</td><td>{{ r[2] }} mm</td></tr>
                </tbody>
              </table>
            </details>
          </div>
        </div>
      </div>

      <section class="mt-20">
        <h2 class="h-display text-center text-4xl">{{ t('product.related') }}</h2>
        <GoldDivider />
        <ul class="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          <li v-for="r in related" :key="r.slug"><ProductCard :product="r" /></li>
        </ul>
      </section>
    </div>

    <!-- sticky mobile CTA -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-gold/40 bg-cream/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md sm:hidden">
      <div class="flex items-center gap-2">
        <span class="me-1 font-display text-2xl text-burgundy">{{ price(p.price) }}</span>
        <button type="button" class="btn-primary flex-1 !px-3" @click="addToCart"><AppIcon name="bag" :size="18" /><span class="sr-only">{{ t('product.addToCart') }}</span></button>
        <a :href="link(waText)" target="_blank" rel="noopener" class="btn-wa flex-[2] !px-3"><WhatsAppIcon /> {{ t('product.orderWhatsapp') }}</a>
      </div>
    </div>
  </div>
</template>
