<script setup lang="ts">
const { t } = useI18n()
const { l, price } = useL()
const localePath = useLocalePath()
const { lines, subtotal, open, setQty } = useCart()
const { link } = useWhatsApp()
const panel = ref<HTMLElement>()

const describe = (i: { metal?: string, size?: string, version?: string }) =>
  [i.version && t(`shop.versions.${i.version}`), i.metal && t(`shop.metals.${i.metal}`), i.size].filter(Boolean).join(' · ')

const message = computed(() => {
  const rows = lines.value.map((i) => {
    const opts = describe(i)
    return `• ${i.qty} × ${l(i.product.name)}${opts ? ` (${opts})` : ''} — ${price(i.product.price * i.qty)}`
  })
  return [t('wa.greeting'), t('wa.order'), ...rows, `${t('wa.total')}: ${price(subtotal.value)}`].join('\n')
})

watch(open, async (v) => {
  if (!import.meta.client) return
  document.documentElement.classList.toggle('overflow-hidden', v)
  if (v) {
    await nextTick()
    panel.value?.focus()
  }
})
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') open.value = false
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="open" class="fixed inset-0 z-[60]">
        <div class="absolute inset-0 bg-ink/50 backdrop-blur-sm" @click="open = false" />
        <aside
          ref="panel"
          tabindex="-1"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-title"
          class="drawer-panel absolute inset-y-0 end-0 flex w-full max-w-md flex-col bg-cream shadow-2xl outline-none"
        >
          <div class="flex items-center justify-between border-b border-gold/30 px-6 py-5">
            <h2 id="cart-title" class="font-display text-3xl text-burgundy-900">{{ t('cart.title') }}</h2>
            <button type="button" class="grid h-11 w-11 place-items-center rounded-full hover:bg-burgundy/5" :aria-label="t('nav.close')" @click="open = false">
              <AppIcon name="close" />
            </button>
          </div>

          <div v-if="!lines.length" class="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
            <BrandLogo :size="96" />
            <p class="text-ink-soft">{{ t('cart.empty') }}</p>
            <NuxtLink :to="localePath('/shop')" class="btn-primary" @click="open = false">{{ t('common.shopNow') }}</NuxtLink>
          </div>

          <ul v-else class="flex-1 divide-y divide-gold/20 overflow-y-auto px-6">
            <li v-for="i in lines" :key="i.key" class="flex gap-4 py-5">
              <div class="h-24 w-20 shrink-0 overflow-hidden rounded-xl ring-1 ring-gold/30">
                <ProductMedia :product="i.product" :metal="i.metal" :version="i.version" sizes="80px" />
              </div>
              <div class="flex flex-1 flex-col">
                <NuxtLink :to="localePath(`/product/${i.slug}`)" class="font-display text-lg leading-tight text-burgundy-900" @click="open = false">{{ l(i.product.name) }}</NuxtLink>
                <p class="mt-1 text-xs text-ink-soft">{{ describe(i) }}</p>
                <div class="mt-auto flex items-center justify-between pt-2">
                  <div class="flex items-center rounded-full border border-gold/40">
                    <button type="button" class="grid h-9 w-9 place-items-center" :aria-label="t('cart.decrease')" @click="setQty(i.key, i.qty - 1)"><AppIcon name="minus" :size="16" /></button>
                    <span class="w-6 text-center text-sm" aria-live="polite">{{ i.qty }}</span>
                    <button type="button" class="grid h-9 w-9 place-items-center" :aria-label="t('cart.increase')" @click="setQty(i.key, i.qty + 1)"><AppIcon name="plus" :size="16" /></button>
                  </div>
                  <span class="font-medium text-burgundy-900">{{ price(i.product.price * i.qty) }}</span>
                </div>
                <button type="button" class="mt-2 self-start text-xs text-ink-soft underline underline-offset-2" :aria-label="t('cart.remove', { name: l(i.product.name) })" @click="setQty(i.key, 0)">✕</button>
              </div>
            </li>
          </ul>

          <div v-if="lines.length" class="border-t border-gold/30 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5">
            <div class="flex items-center justify-between text-lg">
              <span>{{ t('cart.subtotal') }}</span>
              <span class="font-display text-2xl text-burgundy-900">{{ price(subtotal) }}</span>
            </div>
            <p class="mt-2 text-xs text-ink-soft">{{ t('cart.note') }}</p>
            <a v-sparkle :href="link(message)" target="_blank" rel="noopener" class="btn-wa mt-4 w-full">
              <WhatsAppIcon /> {{ t('cart.checkout') }}
            </a>
          </div>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>
