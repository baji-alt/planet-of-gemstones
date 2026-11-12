<script setup lang="ts">
import { testimonials } from '~/data/testimonials'
import { getProduct } from '~/data/products'

const { t } = useI18n()
const { l } = useL()
const { reducedMotion } = use3D()
const track = ref<HTMLElement>()
const index = ref(0)
const playing = ref(true)
let timer: ReturnType<typeof setInterval> | undefined

const go = (i: number) => {
  const n = testimonials.length
  index.value = (i + n) % n
  const el = track.value?.children[index.value] as HTMLElement | undefined
  if (el && track.value) {
    track.value.scrollTo({ left: el.offsetLeft - track.value.offsetLeft, behavior: reducedMotion.value ? 'auto' : 'smooth' })
  }
}
const onScroll = () => {
  if (!track.value) return
  const kids = Array.from(track.value.children) as HTMLElement[]
  const x = Math.abs(track.value.scrollLeft)
  let best = 0
  kids.forEach((k, i) => {
    if (Math.abs(Math.abs(k.offsetLeft - track.value!.offsetLeft) - x) < Math.abs(Math.abs(kids[best]!.offsetLeft - track.value!.offsetLeft) - x)) best = i
  })
  index.value = best
}
const start = () => {
  stop()
  if (reducedMotion.value || !playing.value) return
  timer = setInterval(() => go(index.value + 1), 6000)
}
const stop = () => timer && clearInterval(timer)
const toggle = () => {
  playing.value = !playing.value
  start()
}
onMounted(start)
onBeforeUnmount(stop)
watch(reducedMotion, start)
</script>

<template>
  <section class="section overflow-hidden bg-cream" aria-roledescription="carousel" :aria-label="t('testimonials.title')" @pointerenter="stop" @pointerleave="start" @focusin="stop" @focusout="start">
    <div class="container-lux">
      <SectionHeading :eyebrow="t('testimonials.eyebrow')" :title="t('testimonials.title')" />
      <ul ref="track" class="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4" @scroll.passive="onScroll">
        <li
          v-for="(r, i) in testimonials"
          :key="r.name"
          class="card-lux w-[86%] shrink-0 snap-center p-7 sm:w-[46%] lg:w-[31.5%]"
          role="group"
          aria-roledescription="slide"
          :aria-label="`${i + 1} / ${testimonials.length}`"
        >
          <p class="flex gap-0.5 text-gold" :aria-label="t('testimonials.ofStars', { n: r.rating })">
            <svg v-for="s in r.rating" :key="s" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C12.6 7.2 16.8 11.4 24 12C16.8 12.6 12.6 16.8 12 24C11.4 16.8 7.2 12.6 0 12C7.2 11.4 11.4 7.2 12 0Z" fill="currentColor" /></svg>
          </p>
          <blockquote class="mt-5 font-display text-xl leading-snug text-burgundy-900">“{{ l(r.quote) }}”</blockquote>
          <footer class="mt-6 flex items-center justify-between gap-3 border-t border-gold/25 pt-4 text-sm">
            <span><strong class="font-medium text-ink">{{ r.name }}</strong> · <span class="text-ink-soft">{{ l(r.city) }}</span></span>
            <span class="text-end text-xs text-ink-soft">{{ l(getProduct(r.product)?.name) }}</span>
          </footer>
        </li>
      </ul>
      <div class="mt-6 flex items-center justify-center gap-3">
        <button type="button" class="grid h-11 w-11 place-items-center rounded-full border border-gold/50 text-burgundy hover:bg-burgundy hover:text-cream" :aria-label="t('testimonials.prev')" @click="go(index - 1)">
          <AppIcon name="chevron" :size="18" class="rotate-180 rtl:rotate-0" />
        </button>
        <div class="flex gap-1.5" aria-hidden="true">
          <span v-for="(_, i) in testimonials" :key="i" class="h-1.5 rounded-full transition-all" :class="i === index ? 'w-6 bg-burgundy' : 'w-1.5 bg-gold/50'" />
        </div>
        <button type="button" class="grid h-11 w-11 place-items-center rounded-full border border-gold/50 text-burgundy hover:bg-burgundy hover:text-cream" :aria-label="t('testimonials.next')" @click="go(index + 1)">
          <AppIcon name="chevron" :size="18" class="rtl:rotate-180" />
        </button>
        <button v-if="!reducedMotion" type="button" class="grid h-11 w-11 place-items-center rounded-full text-ink-soft hover:text-burgundy" :aria-label="playing ? t('testimonials.pause') : t('testimonials.play')" @click="toggle">
          <AppIcon :name="playing ? 'pause' : 'play'" :size="16" />
        </button>
      </div>
    </div>
  </section>
</template>
