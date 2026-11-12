<script setup lang="ts">
usePageSeo('home')
const { t } = useI18n()
</script>

<template>
  <div>
    <HomeHero />
    <HomeCategoryCards />
    <HomeZodiacSection />
    <HomeAtelierSection />
    <HomeBestSellers />
    <HomeStoneQuiz />
    <HomeShippingInfo />
    <HomeTestimonials />
    <HomeInstagramStrip />
    <section class="section bg-cream" :aria-label="t('store.title')">
      <div class="container-lux"><StoreMap heading /></div>
    </section>
  </div>
</template>
