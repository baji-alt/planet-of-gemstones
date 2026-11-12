<script setup lang="ts">
const { t } = useI18n()
const { link } = useWhatsApp()
</script>

<template>
  <a
    v-sparkle
    :href="link(t('wa.general'))"
    target="_blank"
    rel="noopener"
    :aria-label="t('common.whatsapp')"
    class="fixed bottom-8 end-8 z-40 hidden h-14 w-14 place-items-center rounded-full bg-[#1F7A4A] text-white shadow-lg ring-4 ring-white/60 transition hover:scale-105 lg:grid"
  >
    <WhatsAppIcon />
  </a>
</template>
