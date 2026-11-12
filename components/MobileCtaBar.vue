<script setup lang="ts">
/** Sticky bottom CTA for mobile visitors (most traffic comes from Instagram). Product pages render their own. */
const { t } = useI18n()
const localePath = useLocalePath()
const { link } = useWhatsApp()
const route = useRoute()
const onProduct = computed(() => route.path.includes('/product/'))
</script>

<template>
  <div v-if="!onProduct" class="fixed inset-x-0 bottom-0 z-40 border-t border-gold/40 bg-cream/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md lg:hidden">
    <div class="flex gap-3">
      <NuxtLink :to="localePath('/shop')" class="btn-primary flex-1">{{ t('common.shopNow') }}</NuxtLink>
      <a :href="link(t('wa.general'))" target="_blank" rel="noopener" class="btn-wa flex-1">
        <WhatsAppIcon /> WhatsApp
      </a>
    </div>
  </div>
</template>
