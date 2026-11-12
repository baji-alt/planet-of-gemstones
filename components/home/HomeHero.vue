<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { reducedMotion } = use3D()
const hero = ref<HTMLElement>()

onMounted(async () => {
  if (reducedMotion.value || !hero.value) return
  const { gsap } = await import('gsap')
  gsap.from(hero.value.querySelectorAll('[data-hero]'), { opacity: 0, y: 26, duration: 1.1, ease: 'power3.out', stagger: 0.12, delay: 0.1 })
})
</script>

<template>
  <section ref="hero" class="on-dark relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink pb-28 pt-24 text-cream lg:items-center lg:pb-16">
    <div class="absolute inset-0 -z-10">
      <Lazy3D :idle-timeout="2000">
        <template #fallback><HomeHeroFallback /></template>
        <template #default="{ ready }">
          <LazyThreeHeroGem :reduced-motion="reducedMotion" @ready="ready" />
        </template>
      </Lazy3D>
      <!-- legibility veil behind the copy -->
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent lg:bg-gradient-to-r lg:from-ink/85 lg:via-ink/30 lg:to-transparent rtl:lg:bg-gradient-to-l" />
    </div>

    <div class="container-lux">
      <div class="max-w-xl">
        <p data-hero class="eyebrow">{{ t('hero.eyebrow') }}</p>
        <h1 data-hero class="h-display mt-5 text-5xl sm:text-6xl lg:text-7xl">{{ t('hero.title') }}</h1>
        <p data-hero class="mt-3 text-xl text-gold-light sm:text-2xl" :class="$i18n.locale === 'ar' ? 'font-display italic' : 'font-arabic'" :lang="$i18n.locale === 'ar' ? 'en' : 'ar'">{{ t('hero.titleAr') }}</p>
        <p data-hero class="mt-6 max-w-lg text-base leading-relaxed text-cream/85 sm:text-lg">{{ t('hero.subtitle') }}</p>
        <div data-hero class="mt-8 flex flex-wrap gap-3">
          <NuxtLink v-sparkle :to="localePath('/shop')" class="btn-gold">{{ t('hero.ctaShop') }}</NuxtLink>
          <NuxtLink :to="`${localePath('/')}#quiz`" class="btn-ghost">{{ t('hero.ctaQuiz') }}</NuxtLink>
        </div>
      </div>
    </div>

    <a href="#collections" class="absolute bottom-24 start-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-luxe text-cream/70 lg:flex rtl:translate-x-1/2">
      {{ t('hero.scroll') }}
      <span class="h-10 w-px animate-floaty bg-gradient-to-b from-gold to-transparent" />
    </a>
  </section>
</template>
