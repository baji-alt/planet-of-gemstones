<script setup lang="ts">
import { getProduct } from '~/data/products'
import { getStone } from '~/data/stones'
import type { Metal } from '~/data/types'

const { t } = useI18n()
const { l } = useL()
const { link } = useWhatsApp()
const { reducedMotion } = use3D()
const stone = ref('aquamarine')
const metal = ref<Metal>('silver')
const options = ['aquamarine', 'blue-topaz', 'amethyst', 'citrine', 'emerald', 'ruby', 'garnet']
const fallbackProduct = getProduct('aquamarine-solitaire-ring')!
const waText = computed(() => t('wa.custom', { metal: t(`shop.metals.${metal.value}`), stone: l(getStone(stone.value)?.name) }))
</script>

<template>
  <section class="section bg-cream">
    <div class="container-lux grid items-center gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
      <div class="relative aspect-square overflow-hidden rounded-[2rem] ring-1 ring-gold/30 lg:order-last">
        <Lazy3D>
          <template #fallback>
            <ProductArt :product="fallbackProduct" :metal="metal" :stone-override="stone" :show-text="false" />
          </template>
          <template #default="{ ready }">
            <LazyThreeJewelViewer type="ring" ring-style="solitaire" :stones="[stone]" :metal="metal" :reduced-motion="reducedMotion" @ready="ready" />
          </template>
        </Lazy3D>
        <p class="pointer-events-none absolute inset-x-0 bottom-4 text-center text-xs text-ink-soft">{{ t('product.dragHint') }}</p>
      </div>
      <div>
        <SectionHeading :eyebrow="t('atelier.eyebrow')" :title="t('atelier.title')" :subtitle="t('atelier.subtitle')" align="start" />
        <div class="mt-8 space-y-7">
          <StoneSwatches v-model="stone" :options="options" :label="t('atelier.stone')" />
          <MetalToggle v-model="metal" :options="['silver', 'gold']" :label="t('atelier.metal')" />
          <a v-sparkle :href="link(waText)" target="_blank" rel="noopener" class="btn-primary"><WhatsAppIcon /> {{ t('atelier.cta') }}</a>
        </div>
      </div>
    </div>
  </section>
</template>
