<script setup lang="ts">
import type { Product } from '~/data/products'
import type { Metal, Version } from '~/data/types'

/** Real photo (AVIF/WebP via Nuxt Image) when available, otherwise illustrated art. */
const props = withDefaults(defineProps<{ product: Product, index?: number, metal?: Metal, version?: Version, sizes?: string, eager?: boolean }>(), { index: 0, sizes: '(max-width: 640px) 50vw, 25vw' })
const { l } = useL()
const src = computed(() => props.product.images[props.index])
</script>

<template>
  <NuxtPicture
    v-if="src"
    :src="src"
    :alt="l(product.name)"
    :sizes="sizes"
    format="avif,webp"
    :loading="eager ? 'eager' : 'lazy'"
    :img-attrs="{ class: 'h-full w-full object-cover' }"
    class="block h-full w-full"
  />
  <ProductArt v-else :product="product" :variant="index" :metal="metal" :version="version" />
</template>
