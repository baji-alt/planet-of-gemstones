<script setup lang="ts">
import { products } from '~/data/products'

const { t } = useI18n()
const localePath = useLocalePath()
const best = products.filter(p => p.bestseller).slice(0, 8)
</script>

<template>
  <section class="section bg-fabric">
    <div class="container-lux">
      <SectionHeading :eyebrow="t('best.eyebrow')" :title="t('best.title')" :subtitle="t('best.subtitle')" />
      <ul v-reveal="{ stagger: true }" class="no-scrollbar -mx-4 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 lg:grid-cols-4">
        <li v-for="p in best" :key="p.slug" class="w-[68%] shrink-0 snap-start sm:w-[42%] md:w-auto">
          <ProductCard :product="p" />
        </li>
      </ul>
      <div class="mt-10 text-center">
        <NuxtLink :to="localePath('/shop')" class="btn-ghost">{{ t('best.viewAll') }}</NuxtLink>
      </div>
    </div>
  </section>
</template>
