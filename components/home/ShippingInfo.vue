<script setup lang="ts">
const { t } = useI18n()
const items = [
  { icon: 'truck', k: 'lebanon' },
  { icon: 'globe', k: 'world' },
  { icon: 'card', k: 'payment' },
  { icon: 'gift', k: 'gift' },
]
</script>

<template>
  <section class="border-y border-gold/30 bg-cream py-14" :aria-label="t('shipping.eyebrow')">
    <div class="container-lux">
      <div class="text-center">
        <p class="eyebrow">{{ t('shipping.eyebrow') }}</p>
        <h2 class="h-display mt-3 text-3xl sm:text-4xl">{{ t('shipping.title') }}</h2>
      </div>
      <ul v-reveal="{ stagger: true }" class="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
        <li v-for="i in items" :key="i.k" class="text-center">
          <span class="mx-auto grid h-14 w-14 place-items-center rounded-full bg-cream-50 text-burgundy ring-1 ring-gold/50"><AppIcon :name="i.icon" :size="24" /></span>
          <h3 class="mt-4 font-display text-xl text-burgundy-900">{{ t(`shipping.${i.k}`) }}</h3>
          <p class="mt-1 text-sm text-ink-soft">{{ t(`shipping.${i.k}Text`) }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>
