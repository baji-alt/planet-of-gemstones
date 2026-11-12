<script setup lang="ts">
import { site } from '~/data/site'

usePageSeo('contact')
const { t } = useI18n()
const { link } = useWhatsApp()
</script>

<template>
  <div>
    <PageHero :eyebrow="t('contact.eyebrow')" :title="t('contact.title')" :subtitle="t('contact.subtitle')" />
    <section class="section bg-fabric">
      <div class="container-lux space-y-10">
        <div class="grid gap-6 sm:grid-cols-2">
          <a v-sparkle :href="link(t('wa.general'))" target="_blank" rel="noopener" class="card-lux group flex items-center gap-5 p-7 transition hover:-translate-y-1">
            <span class="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[#1F7A4A] text-white"><WhatsAppIcon /></span>
            <span>
              <span class="block font-display text-3xl text-burgundy-900">{{ t('contact.whatsapp') }}</span>
              <span class="mt-1 block text-sm text-ink-soft">{{ t('contact.whatsappText') }}</span>
            </span>
          </a>
          <a v-sparkle :href="site.instagram" target="_blank" rel="noopener" class="card-lux group flex items-center gap-5 p-7 transition hover:-translate-y-1">
            <span class="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-burgundy to-gold text-white"><AppIcon name="instagram" :size="26" /></span>
            <span>
              <span class="block font-display text-3xl text-burgundy-900">{{ t('contact.instagram') }}</span>
              <span class="mt-1 block text-sm text-ink-soft" dir="ltr">@{{ site.instagramHandle }} · {{ site.followers }}</span>
              <span class="mt-1 block text-sm text-ink-soft">{{ t('contact.instagramText') }}</span>
            </span>
          </a>
        </div>
        <StoreMap heading />
      </div>
    </section>
    <HomeShippingInfo />
  </div>
</template>
