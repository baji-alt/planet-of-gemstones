<script setup lang="ts">
import type { Metal } from '~/data/types'

defineProps<{ options: Metal[], label: string }>()
const model = defineModel<Metal>({ required: true })
const { t } = useI18n()
</script>

<template>
  <fieldset>
    <legend class="text-sm font-medium text-ink">{{ label }}</legend>
    <div class="mt-3 flex gap-2">
      <label v-for="m in options" :key="m" class="cursor-pointer">
        <input v-model="model" type="radio" :value="m" class="peer sr-only" :name="`metal-${label}`">
        <span class="chip peer-checked:border-burgundy peer-checked:bg-burgundy peer-checked:text-cream peer-focus-visible:ring-2 peer-focus-visible:ring-burgundy/40">
          <span class="h-4 w-4 rounded-full ring-1 ring-black/10" :style="{ background: m === 'gold' ? 'linear-gradient(135deg,#F1E2B8,#C9A24B,#8C6B22)' : 'linear-gradient(135deg,#F4F5F7,#B9BEC6,#7D828B)' }" />
          {{ t(`shop.metals.${m}`) }}
        </span>
      </label>
    </div>
  </fieldset>
</template>
