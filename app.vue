<script setup lang="ts">
import { site } from '~/data/site'

const head = useLocaleHead({ seo: true })
const config = useRuntimeConfig()

useHead(() => ({
  htmlAttrs: { lang: head.value.htmlAttrs?.lang, dir: head.value.htmlAttrs?.dir },
  link: head.value.link,
  meta: head.value.meta,
}))

useSeoMeta({
  ogSiteName: 'Planet of Gemstones · ديوان الأحجار الكريمة',
  ogType: 'website',
  ogImage: `${config.public.siteUrl}/og.png`,
  twitterCard: 'summary_large_image',
})

// Structured data for local SEO
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'JewelryStore',
      'name': 'Planet of Gemstones',
      'alternateName': 'ديوان الأحجار الكريمة',
      'url': config.public.siteUrl,
      'logo': `${config.public.siteUrl}/logo.svg`,
      'image': `${config.public.siteUrl}/og.png`,
      'priceRange': '$$',
      'currenciesAccepted': 'USD',
      'address': { '@type': 'PostalAddress', 'streetAddress': 'Near Riad El Solh', 'addressLocality': 'Beirut', 'addressCountry': 'LB' },
      'geo': { '@type': 'GeoCoordinates', 'latitude': site.geo.lat, 'longitude': site.geo.lng },
      'openingHours': site.openingHours,
      'sameAs': [site.instagram, site.threads, site.linktree],
    }),
  }],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
