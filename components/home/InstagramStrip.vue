<script setup lang="ts">
/** Instagram strip. Tiles use product art until real post images are added to /public/img/instagram. */
import { site } from '~/data/site'
import { products } from '~/data/products'

const { t } = useI18n()
const tiles = ['gemini-zodiac-bracelet', 'sagittarius-zodiac-bracelet', 'aquamarine-solitaire-ring', 'scorpio-zodiac-bracelet', 'moonstone-oval-pendant', 'amethyst-misbaha']
  .map(s => products.find(p => p.slug === s)!)
</script>

<template>
  <section class="section bg-fabric">
    <div class="container-lux">
      <div class="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-start">
        <div>
          <p class="eyebrow">{{ t('insta.eyebrow') }}</p>
          <h2 class="h-display mt-3 text-4xl">{{ t('insta.title') }}</h2>
          <p class="mt-2 text-ink-soft" dir="ltr">@{{ site.instagramHandle }} · {{ site.followers }} · {{ site.posts }} posts</p>
        </div>
        <a v-sparkle :href="site.instagram" target="_blank" rel="noopener" class="btn-primary"><AppIcon name="instagram" :size="18" /> {{ t('insta.follow') }}</a>
      </div>
      <ul v-reveal="{ stagger: true }" class="mt-10 grid grid-cols-3 gap-1.5 sm:gap-3 lg:grid-cols-6">
        <li v-for="p in tiles" :key="p.slug">
          <a :href="site.instagram" target="_blank" rel="noopener" class="group relative block aspect-square overflow-hidden rounded-lg sm:rounded-2xl" :aria-label="t('insta.post')">
            <div class="h-[125%] w-full -translate-y-[10%] transition duration-700 group-hover:scale-105"><ProductArt :product="p" /></div>
            <span class="absolute inset-0 grid place-items-center bg-burgundy/0 text-cream opacity-0 transition group-hover:bg-burgundy/40 group-hover:opacity-100"><AppIcon name="instagram" :size="28" /></span>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>
