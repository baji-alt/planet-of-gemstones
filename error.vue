<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()
const { t } = useI18n()
const localePath = useLocalePath()
const back = () => clearError({ redirect: localePath('/') })
</script>

<template>
  <div class="on-dark bg-night grid min-h-screen place-items-center px-6 text-center text-cream">
    <div>
      <BrandLogo :size="140" class="mx-auto" />
      <p class="mt-8 font-display text-7xl text-gold-light">{{ error.statusCode }}</p>
      <h1 class="h-display mt-2 text-4xl">{{ t('error.title') }}</h1>
      <p class="mt-3 text-cream/80">{{ t('error.text') }}</p>
      <button type="button" class="btn-gold mt-8" @click="back">{{ t('error.home') }}</button>
    </div>
  </div>
</template>
