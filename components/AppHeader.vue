<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { count, open: cartOpen } = useCart()
const menuOpen = ref(false)
const scrolled = ref(false)

const links = computed(() => [
  { to: localePath('/shop'), label: t('nav.shop') },
  { to: `${localePath('/')}#zodiac`, label: t('nav.zodiac') },
  { to: localePath('/stones'), label: t('nav.stones') },
  { to: localePath('/about'), label: t('nav.about') },
  { to: localePath('/contact'), label: t('nav.contact') },
])

const isHome = computed(() => route.path === localePath('/'))
const dark = computed(() => isHome.value && !scrolled.value && !menuOpen.value)

const onScroll = () => (scrolled.value = window.scrollY > 40)
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
watch(() => route.fullPath, () => (menuOpen.value = false))
watch(menuOpen, v => import.meta.client && document.documentElement.classList.toggle('overflow-hidden', v))
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-40 transition-colors duration-500"
    :class="dark ? 'on-dark bg-transparent text-cream' : 'bg-cream/90 text-burgundy-900 shadow-[0_1px_0_rgba(201,162,75,0.35)] backdrop-blur-md'"
  >
    <a href="#main" class="sr-only-focusable absolute start-4 top-2 z-50 rounded bg-burgundy px-4 py-2 text-cream">{{ t('nav.skip') }}</a>
    <div class="container-lux flex h-16 items-center justify-between gap-4">
      <NuxtLink :to="localePath('/')" class="flex items-center gap-3" :aria-label="t('brand.name')">
        <BrandLogo :size="44" />
        <span class="hidden leading-tight sm:block">
          <span class="block font-display text-lg font-semibold tracking-wide" lang="en">Planet of Gemstones</span>
          <span class="block font-arabic text-sm opacity-80" lang="ar">ديوان الأحجار الكريمة</span>
        </span>
      </NuxtLink>

      <nav class="hidden lg:block" :aria-label="t('nav.menu')">
        <ul class="flex items-center gap-8 text-sm tracking-wide">
          <li v-for="l in links" :key="l.to">
            <!-- hash links must not inherit the home page's aria-current -->
            <a v-if="l.to.includes('#')" :href="l.to" class="link-underline py-2">{{ l.label }}</a>
            <NuxtLink v-else :to="l.to" class="link-underline py-2">{{ l.label }}</NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="flex items-center gap-1 sm:gap-2">
        <LangToggle />
        <button
          type="button"
          class="relative inline-flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-current/10"
          :aria-label="t('cart.count', { n: count })"
          @click="cartOpen = true"
        >
          <AppIcon name="bag" />
          <span v-if="count" class="absolute -end-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[0.7rem] font-semibold text-ink">{{ count }}</span>
        </button>
        <button
          type="button"
          class="inline-flex h-11 w-11 items-center justify-center rounded-full lg:hidden"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          :aria-label="menuOpen ? t('nav.close') : t('nav.menu')"
          @click="menuOpen = !menuOpen"
        >
          <AppIcon :name="menuOpen ? 'close' : 'menu'" />
        </button>
      </div>
    </div>

    <Transition name="drawer">
      <div v-if="menuOpen" id="mobile-menu" class="fixed inset-x-0 bottom-0 top-16 z-30 bg-cream lg:hidden">
        <nav class="drawer-panel container-lux flex h-full flex-col justify-between bg-fabric pb-28 pt-8" :aria-label="t('nav.menu')">
          <ul class="space-y-2">
            <li v-for="l in links" :key="l.to">
              <NuxtLink :to="l.to" class="flex items-center justify-between border-b border-gold/30 py-4 font-display text-3xl text-burgundy-900">
                {{ l.label }}
                <AppIcon name="chevron" class="text-gold rtl:rotate-180" />
              </NuxtLink>
            </li>
          </ul>
          <div class="flex justify-center"><BrandLogo :size="96" /></div>
        </nav>
      </div>
    </Transition>
  </header>
</template>
