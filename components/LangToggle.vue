<script setup lang="ts">
const { t, locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const other = computed(() => (locale.value === 'ar' ? 'en' : 'ar'))
// Prerendered HTML has no query string; keep the query (e.g. shop filters) only after hydration.
const hydrated = ref(false)
onMounted(() => (hydrated.value = true))
const href = computed(() => {
  const path = switchLocalePath(other.value)
  return hydrated.value ? path : path.split('?')[0]!
})
</script>

<template>
  <NuxtLink
    :to="href"
    :lang="other"
    :hreflang="other"
    :aria-label="t('nav.languageLabel')"
    class="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-current/30 px-3 text-sm transition hover:border-gold"
    :class="other === 'ar' ? 'font-arabic text-base' : 'font-sans'"
  >
    {{ t('nav.language') }}
  </NuxtLink>
</template>
