<script setup lang="ts">
withDefaults(defineProps<{ eyebrow?: string, title: string, subtitle?: string, align?: 'center' | 'start', as?: string }>(), { align: 'center', as: 'h2' })
</script>

<template>
  <header v-reveal :class="['max-w-2xl', align === 'center' ? 'mx-auto text-center' : 'text-start']">
    <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
    <component :is="as" class="h-display mt-4 text-4xl sm:text-5xl">{{ title }}</component>
    <GoldDivider v-if="align === 'center'" />
    <p v-if="subtitle" class="text-base leading-relaxed text-ink-soft sm:text-lg" :class="align === 'center' ? '' : 'mt-4'">{{ subtitle }}</p>
  </header>
</template>
