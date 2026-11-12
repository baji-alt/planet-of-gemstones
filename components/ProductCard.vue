<script setup lang="ts">
/**
 * Product card. On desktop hover (after a short intent delay) the image is
 * replaced by a live 3D turntable of the piece. Only one WebGL context is
 * alive at a time because it unmounts on leave.
 */
import type { Product } from '~/data/products'

const props = defineProps<{ product: Product, eager?: boolean }>()
const { t } = useI18n()
const { l, price } = useL()
const localePath = useLocalePath()
const { can3D, reducedMotion } = use3D()
const { add, open } = useCart()

const hovering = ref(false)
const ready = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined
const finePointer = ref(false)
onMounted(() => (finePointer.value = window.matchMedia('(hover: hover) and (pointer: fine)').matches))

const enter = () => {
  if (!can3D.value || !finePointer.value) return
  timer = setTimeout(() => (hovering.value = true), 220)
}
const leave = () => {
  clearTimeout(timer)
  hovering.value = false
  ready.value = false
}

const quickAdd = () => {
  add({ slug: props.product.slug, metal: props.product.metals[0], version: props.product.versions?.[0] })
  open.value = true
}
</script>

<template>
  <article class="group relative flex flex-col" @pointerenter="enter" @pointerleave="leave">
    <NuxtLink :to="localePath(`/product/${product.slug}`)" class="relative block aspect-[4/5] overflow-hidden rounded-[1.5rem] ring-1 ring-gold/25 transition duration-500 group-hover:shadow-gold" :aria-label="t('common.viewProduct', { name: l(product.name) })">
      <div class="h-full w-full transition duration-700 group-hover:scale-[1.03]">
        <ProductMedia :product="product" :eager="eager" />
      </div>
      <div v-if="hovering" class="absolute inset-0 transition-opacity duration-500" :class="ready ? 'opacity-100' : 'opacity-0'">
        <LazyThreeJewelViewer
          :type="product.type"
          :stones="product.stones"
          :metal="product.metals[0] ?? 'gold'"
          :ring-style="product.ringStyle"
          :model="product.model"
          :interactive="false"
          :bloom="false"
          :reduced-motion="reducedMotion"
          @ready="ready = true"
        />
      </div>
      <div class="absolute start-3 top-3 flex flex-col gap-1.5">
        <span v-if="product.isNew" class="rounded-full bg-burgundy px-2.5 py-1 text-[0.7rem] font-medium text-cream">{{ t('common.new') }}</span>
        <span v-if="product.bestseller" class="rounded-full bg-cream/90 px-2.5 py-1 text-[0.7rem] font-medium text-burgundy-900 ring-1 ring-gold/40">{{ t('common.bestseller') }}</span>
      </div>
      <span v-if="can3D && finePointer" class="absolute bottom-3 end-3 grid h-9 w-9 place-items-center rounded-full bg-cream/85 text-burgundy opacity-0 ring-1 ring-gold/40 transition group-hover:opacity-100" aria-hidden="true"><AppIcon name="cube" :size="18" /></span>
    </NuxtLink>
    <div class="mt-4 flex items-start justify-between gap-3 px-1">
      <div>
        <h3 class="font-display text-xl leading-tight text-burgundy-900">
          <NuxtLink :to="localePath(`/product/${product.slug}`)">{{ l(product.name) }}</NuxtLink>
        </h3>
        <p class="mt-1 text-sm text-ink-soft">{{ price(product.price) }}</p>
      </div>
      <button v-sparkle type="button" class="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/50 text-burgundy transition hover:bg-burgundy hover:text-cream" :aria-label="`${t('product.addToCart')}: ${l(product.name)}`" @click="quickAdd">
        <AppIcon name="plus" :size="18" />
      </button>
    </div>
  </article>
</template>
