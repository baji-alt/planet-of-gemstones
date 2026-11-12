<script setup lang="ts">
import { getProduct } from '~/data/products'

usePageSeo('about')
const { t } = useI18n()
const localePath = useLocalePath()
const values = [
  { k: 'natural', icon: 'gem' },
  { k: 'meaning', icon: 'star' },
  { k: 'care', icon: 'gift' },
]
const art = getProduct('sagittarius-zodiac-bracelet')!
</script>

<template>
  <div>
    <PageHero :eyebrow="t('about.eyebrow')" :title="t('about.title')" />
    <section class="section bg-fabric">
      <div class="container-lux grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div v-reveal class="relative mx-auto w-full max-w-md">
          <div class="aspect-[4/5] overflow-hidden rounded-[2rem] shadow-soft ring-1 ring-gold/30"><ProductArt :product="art" /></div>
          <div class="absolute -bottom-8 -end-6 hidden rounded-full bg-cream p-2 shadow-soft sm:block"><BrandLogo :size="120" /></div>
        </div>
        <div class="space-y-6 text-lg leading-relaxed text-ink-soft">
          <p v-reveal class="font-display text-3xl leading-snug text-burgundy-900">{{ t('about.lead') }}</p>
          <p v-reveal>{{ t('about.p1') }}</p>
          <p v-reveal>{{ t('about.p2') }}</p>
          <p v-reveal>{{ t('about.p3') }}</p>
        </div>
      </div>
    </section>
    <section class="section bg-cream">
      <ul v-reveal="{ stagger: true }" class="container-lux grid gap-6 sm:grid-cols-3">
        <li v-for="v in values" :key="v.k" class="card-lux p-8 text-center">
          <span class="mx-auto grid h-14 w-14 place-items-center rounded-full bg-burgundy text-gold-light"><AppIcon :name="v.icon" /></span>
          <h2 class="mt-5 font-display text-2xl text-burgundy-900">{{ t(`about.values.${v.k}.title`) }}</h2>
          <p class="mt-2 text-sm text-ink-soft">{{ t(`about.values.${v.k}.text`) }}</p>
        </li>
      </ul>
      <div class="mt-12 text-center"><NuxtLink :to="localePath('/contact')" class="btn-primary">{{ t('about.cta') }}</NuxtLink></div>
    </section>
  </div>
</template>
