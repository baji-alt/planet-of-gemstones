<script setup lang="ts">
import { categories, products } from '~/data/products'

const { t } = useI18n()
const localePath = useLocalePath()
const cover = (slug: string) => {
  const pick: Record<string, string> = {
    'zodiac': 'gemini-zodiac-bracelet',
    'stones': 'amethyst-natural-stone',
    'mens-rings': 'royal-lapis-signet-ring',
    'silver': 'moonstone-oval-pendant',
    'prayer-beads': 'tigers-eye-misbaha',
  }
  return products.find(p => p.slug === pick[slug])!
}
</script>

<template>
  <section id="collections" class="section bg-fabric">
    <div class="container-lux">
      <SectionHeading :eyebrow="t('categories.eyebrow')" :title="t('categories.title')" :subtitle="t('categories.subtitle')" />
      <ul v-reveal="{ stagger: true }" class="no-scrollbar -mx-4 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-5">
        <li v-for="c in categories" :key="c.slug" class="w-[72%] shrink-0 snap-start sm:w-auto">
          <NuxtLink v-sparkle :to="localePath(`/shop?category=${c.slug}`)" class="group block overflow-hidden rounded-[1.75rem] bg-cream-50 ring-1 ring-gold/30 transition duration-500 hover:-translate-y-1 hover:shadow-gold">
            <div class="aspect-[4/5] overflow-hidden">
              <div class="h-full w-full transition duration-700 group-hover:scale-105">
                <ProductArt :product="cover(c.slug)" :show-text="false" />
              </div>
            </div>
            <div class="p-5">
              <h3 class="font-display text-2xl text-burgundy-900">{{ t(`categories.${c.slug}.title`) }}</h3>
              <p class="mt-1 text-sm leading-relaxed text-ink-soft">{{ t(`categories.${c.slug}.desc`) }}</p>
              <span class="mt-4 inline-flex items-center gap-2 text-sm font-medium text-burgundy">
                {{ t('categories.explore') }} <AppIcon name="arrow" :size="16" class="transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </span>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>
