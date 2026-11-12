<script setup lang="ts">
defineProps<{ eyebrow: string, title: string, subtitle?: string }>()
</script>

<template>
  <section class="on-dark relative overflow-hidden bg-night pb-14 pt-32 text-center text-cream sm:pb-20 sm:pt-40">
    <span v-for="i in 18" :key="i" class="absolute h-[2px] w-[2px] animate-twinkle rounded-full bg-gold-pale" :style="{ left: `${(i * 41) % 100}%`, top: `${(i * 29) % 100}%`, animationDelay: `${(i % 6) * 0.5}s` }" aria-hidden="true" />
    <div class="container-lux relative">
      <p class="eyebrow">{{ eyebrow }}</p>
      <h1 class="h-display mt-4 text-5xl sm:text-6xl">{{ title }}</h1>
      <GoldDivider />
      <p v-if="subtitle" class="mx-auto max-w-xl text-cream/80">{{ subtitle }}</p>
      <slot />
    </div>
  </section>
</template>
