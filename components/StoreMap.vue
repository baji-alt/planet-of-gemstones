<script setup lang="ts">
/** Store location with a click-to-load Google Map (keeps third-party JS off the critical path). */
import { mapsEmbed, mapsLink } from '~/data/site'

defineProps<{ heading?: boolean }>()
const { t } = useI18n()
const { link } = useWhatsApp()
const loaded = ref(false)
</script>

<template>
  <div class="grid overflow-hidden rounded-[2rem] bg-cream-50 shadow-soft ring-1 ring-gold/30 lg:grid-cols-[1fr_1.4fr]">
    <div class="p-8 sm:p-10">
      <template v-if="heading">
        <p class="eyebrow">{{ t('store.eyebrow') }}</p>
        <h2 class="h-display mt-3 text-4xl">{{ t('store.title') }}</h2>
        <p class="mt-3 text-ink-soft">{{ t('store.subtitle') }}</p>
      </template>
      <dl class="mt-8 space-y-5 text-sm">
        <div class="flex gap-3">
          <dt><AppIcon name="pin" class="text-burgundy" /><span class="sr-only">{{ t('contact.visit') }}</span></dt>
          <dd class="text-base">{{ t('store.address') }}</dd>
        </div>
        <div class="flex gap-3">
          <dt><AppIcon name="clock" class="text-burgundy" /><span class="sr-only">{{ t('store.hours') }}</span></dt>
          <dd>{{ t('store.hoursValue') }}<br>{{ t('store.hoursSunday') }}</dd>
        </div>
      </dl>
      <div class="mt-8 flex flex-wrap gap-3">
        <a :href="mapsLink" target="_blank" rel="noopener" class="btn-primary">{{ t('store.directions') }}</a>
        <a :href="link(t('wa.general'))" target="_blank" rel="noopener" class="btn-ghost"><WhatsAppIcon /> WhatsApp</a>
      </div>
    </div>
    <div class="relative min-h-[320px] bg-blush">
      <iframe
        v-if="loaded"
        :src="mapsEmbed"
        :title="t('store.mapTitle')"
        class="absolute inset-0 h-full w-full border-0"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allowfullscreen
      />
      <button v-else type="button" class="group absolute inset-0 grid place-items-center overflow-hidden" @click="loaded = true">
        <svg class="absolute inset-0 h-full w-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <rect width="400" height="300" fill="#EFE3D8" />
          <g stroke="#FBF7F3" stroke-width="10" fill="none">
            <path d="M-10 80 L410 140" /><path d="M120 -10 L180 310" /><path d="M-10 230 Q 200 180 410 250" /><path d="M300 -10 L260 310" />
          </g>
          <g stroke="#E2D2C5" stroke-width="3" fill="none"><path d="M-10 40 L410 60" /><path d="M60 -10 L40 310" /><path d="M-10 170 L410 200" /></g>
          <circle cx="215" cy="150" r="46" fill="#7A1F3D" opacity="0.08" />
        </svg>
        <span class="relative flex flex-col items-center gap-3">
          <span class="grid h-14 w-14 place-items-center rounded-full bg-burgundy text-cream shadow-soft transition group-hover:scale-110"><AppIcon name="pin" /></span>
          <span class="rounded-full bg-cream/90 px-4 py-2 text-sm font-medium text-burgundy-900 ring-1 ring-gold/40">{{ t('store.loadMap') }}</span>
        </span>
      </button>
    </div>
  </div>
</template>
