<script setup lang="ts">
import { site } from '~/data/site'

const { t } = useI18n()
const localePath = useLocalePath()
const { link } = useWhatsApp()
const year = new Date().getFullYear()
const explore = computed(() => [
  { to: localePath('/shop?category=zodiac'), label: t('categories.zodiac.title') },
  { to: localePath('/shop?category=mens-rings'), label: t('categories.mens-rings.title') },
  { to: localePath('/shop?category=silver'), label: t('categories.silver.title') },
  { to: localePath('/shop?category=prayer-beads'), label: t('categories.prayer-beads.title') },
  { to: localePath('/stones'), label: t('nav.stones') },
  { to: localePath('/about'), label: t('nav.about') },
])
</script>

<template>
  <footer class="on-dark bg-night pb-28 pt-16 text-cream/80 lg:pb-12">
    <div class="container-lux grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
      <div>
        <div class="flex items-center gap-4">
          <BrandLogo :size="72" />
          <div>
            <p class="font-display text-2xl text-cream" lang="en">Planet of Gemstones</p>
            <p class="font-arabic text-lg text-gold-light" lang="ar">ديوان الأحجار الكريمة</p>
          </div>
        </div>
        <p class="mt-6 max-w-sm text-sm leading-relaxed">{{ t('footer.about') }}</p>
        <div class="mt-6 flex gap-3">
          <a :href="site.instagram" target="_blank" rel="noopener" class="btn-ghost !min-h-[44px] !px-4" :aria-label="t('common.instagram')"><AppIcon name="instagram" :size="18" /> {{ site.followers }}</a>
          <a :href="link(t('wa.general'))" target="_blank" rel="noopener" class="btn-ghost !min-h-[44px] !px-4"><WhatsAppIcon /> WhatsApp</a>
        </div>
      </div>
      <nav :aria-label="t('footer.explore')">
        <h2 class="eyebrow">{{ t('footer.explore') }}</h2>
        <ul class="mt-5 space-y-3 text-sm">
          <li v-for="l in explore" :key="l.to"><NuxtLink :to="l.to" class="link-underline hover:text-cream">{{ l.label }}</NuxtLink></li>
        </ul>
      </nav>
      <div>
        <h2 class="eyebrow">{{ t('footer.visit') }}</h2>
        <address class="mt-5 space-y-3 text-sm not-italic">
          <p class="flex gap-2"><AppIcon name="pin" :size="18" class="text-gold" /> {{ t('store.address') }}</p>
          <p class="flex gap-2"><AppIcon name="clock" :size="18" class="text-gold" /> <span>{{ t('store.hoursValue') }}<br>{{ t('store.hoursSunday') }}</span></p>
          <p><a :href="site.linktree" target="_blank" rel="noopener" class="link-underline">linktr.ee/planetofgemstones</a></p>
        </address>
      </div>
    </div>
    <div class="container-lux mt-14 flex flex-col items-center justify-between gap-3 border-t border-gold/20 pt-6 text-xs text-cream/70 sm:flex-row">
      <p>© {{ year }} Planet of Gemstones · ديوان الأحجار الكريمة. {{ t('footer.rights') }}</p>
      <p>{{ t('footer.madeIn') }} ✦</p>
    </div>
  </footer>
</template>
