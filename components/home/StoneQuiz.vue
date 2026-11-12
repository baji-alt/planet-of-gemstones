<script setup lang="ts">
import { monthNames, signDates, signForDate } from '~/data/zodiac'
import { getStone } from '~/data/stones'
import { products } from '~/data/products'

type Intention = 'love' | 'protection' | 'abundance' | 'calm'
const affinity: Record<Intention, string[]> = {
  love: ['rose-quartz', 'ruby', 'emerald', 'garnet', 'moonstone', 'opal'],
  protection: ['tigers-eye', 'onyx', 'turquoise', 'malachite', 'garnet', 'lapis-lazuli'],
  abundance: ['citrine', 'tigers-eye', 'emerald', 'carnelian', 'malachite'],
  calm: ['amethyst', 'moonstone', 'aquamarine', 'lapis-lazuli', 'blue-topaz', 'rose-quartz'],
}

const { t, locale } = useI18n()
const { l, price } = useL()
const localePath = useLocalePath()
const step = ref<1 | 2 | 3>(1)
const day = ref<number | ''>('')
const month = ref<number | ''>('')
const intention = ref<Intention | ''>('')
const heading = ref<HTMLElement>()

const daysIn = computed(() => (month.value ? new Date(2024, Number(month.value), 0).getDate() : 31))
watch(daysIn, (n) => {
  if (day.value && day.value > n) day.value = n
})

const sign = computed(() => (day.value && month.value ? signForDate(Number(month.value), Number(day.value)) : null))
const stone = computed(() => {
  if (!sign.value) return null
  const pref = intention.value ? affinity[intention.value] : []
  const slug = sign.value.stones.find(s => pref.includes(s)) ?? sign.value.stones[0]!
  return getStone(slug)!
})
const bracelet = computed(() => products.find(p => p.zodiac === sign.value?.slug))

const go = async (s: 1 | 2 | 3) => {
  step.value = s
  await nextTick()
  heading.value?.focus()
}
const reset = () => {
  day.value = ''
  month.value = ''
  intention.value = ''
  go(1)
}
</script>

<template>
  <section id="quiz" class="section bg-blush/60">
    <div class="container-lux">
      <div class="card-lux relative mx-auto max-w-4xl overflow-hidden p-6 sm:p-12">
        <svg class="pointer-events-none absolute -end-10 -top-10 h-48 w-48 text-gold/20" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C12.6 7.2 16.8 11.4 24 12C16.8 12.6 12.6 16.8 12 24C11.4 16.8 7.2 12.6 0 12C7.2 11.4 11.4 7.2 12 0Z" fill="currentColor" /></svg>
        <SectionHeading :eyebrow="t('quiz.eyebrow')" :title="t('quiz.title')" :subtitle="step < 3 ? t('quiz.subtitle') : undefined" />

        <ol class="mx-auto mt-8 flex max-w-xs items-center justify-center gap-3" aria-hidden="true">
          <li v-for="n in 3" :key="n" class="h-1 flex-1 rounded-full transition" :class="n <= step ? 'bg-burgundy' : 'bg-gold/30'" />
        </ol>

        <div class="mt-8" aria-live="polite">
          <!-- step 1: birthday -->
          <form v-if="step === 1" class="mx-auto max-w-md" @submit.prevent="sign && go(2)">
            <h3 ref="heading" tabindex="-1" class="text-center font-display text-2xl text-burgundy-900">{{ t('quiz.step1') }}</h3>
            <div class="mt-6 grid grid-cols-[1fr_1.6fr] gap-3">
              <label class="block text-sm">
                <span class="mb-1.5 block text-ink-soft">{{ t('quiz.day') }}</span>
                <select v-model.number="day" class="field" required>
                  <option value="" disabled>—</option>
                  <option v-for="d in daysIn" :key="d" :value="d">{{ d }}</option>
                </select>
              </label>
              <label class="block text-sm">
                <span class="mb-1.5 block text-ink-soft">{{ t('quiz.month') }}</span>
                <select v-model.number="month" class="field" required>
                  <option value="" disabled>—</option>
                  <option v-for="(m, i) in monthNames(locale, true)" :key="m" :value="i + 1">{{ m }}</option>
                </select>
              </label>
            </div>
            <p v-if="sign" class="mt-4 text-center text-sm text-burgundy">✦ {{ l(sign.name) }} · {{ signDates(sign, locale) }}</p>
            <button type="submit" class="btn-primary mt-6 w-full" :disabled="!sign">{{ t('quiz.next') }}</button>
          </form>

          <!-- step 2: intention -->
          <form v-else-if="step === 2" class="mx-auto max-w-lg" @submit.prevent="go(3)">
            <h3 ref="heading" tabindex="-1" class="text-center font-display text-2xl text-burgundy-900">{{ t('quiz.step2') }}</h3>
            <div class="mt-6 grid grid-cols-2 gap-3" role="radiogroup" :aria-label="t('quiz.step2')">
              <label v-for="k in (['love', 'protection', 'abundance', 'calm'] as const)" :key="k" class="cursor-pointer">
                <input v-model="intention" type="radio" :value="k" class="peer sr-only" name="intention">
                <span class="flex min-h-[64px] items-center justify-center gap-2 rounded-2xl border border-gold/40 bg-cream-50 px-4 text-center transition peer-checked:border-burgundy peer-checked:bg-burgundy peer-checked:text-cream peer-focus-visible:ring-2 peer-focus-visible:ring-burgundy/40">
                  <AppIcon :name="{ love: 'heart', protection: 'gem', abundance: 'star', calm: 'globe' }[k]" :size="18" />
                  {{ t(`quiz.intentions.${k}`) }}
                </span>
              </label>
            </div>
            <div class="mt-6 flex gap-3">
              <button type="button" class="btn-ghost flex-1" @click="go(1)">{{ t('quiz.back') }}</button>
              <button v-sparkle type="submit" class="btn-primary flex-[2]" :disabled="!intention">{{ t('quiz.reveal') }}</button>
            </div>
          </form>

          <!-- step 3: result -->
          <div v-else-if="sign && stone" class="grid items-center gap-8 sm:grid-cols-[0.9fr_1.1fr]">
            <div class="overflow-hidden rounded-[1.5rem] ring-1 ring-gold/30">
              <div class="aspect-[4/5]"><ProductArt v-if="bracelet" :product="bracelet" /></div>
            </div>
            <div>
              <p class="eyebrow">{{ t('quiz.resultEyebrow') }}</p>
              <h3 ref="heading" tabindex="-1" class="h-display mt-3 flex items-center gap-4 text-5xl">
                <span class="h-12 w-12 shrink-0 rounded-full shadow-soft" :style="{ background: `radial-gradient(circle at 35% 30%, ${stone.highlight}, ${stone.hex} 60%, #00000066)` }" aria-hidden="true" />
                {{ l(stone.name) }}
              </h3>
              <p class="mt-4 text-ink-soft"><span class="font-medium text-burgundy">{{ t('quiz.yourSign') }}:</span> {{ l(sign.name) }} · {{ signDates(sign, locale) }}</p>
              <p class="mt-4 leading-relaxed">{{ l(stone.meaning) }}</p>
              <p class="mt-2 text-sm text-ink-soft">{{ l(stone.properties) }}</p>
              <div class="mt-7 flex flex-wrap gap-3">
                <NuxtLink v-if="bracelet" v-sparkle :to="localePath(`/product/${bracelet.slug}`)" class="btn-primary">{{ t('quiz.shopBracelet') }} · {{ price(bracelet.price) }}</NuxtLink>
                <NuxtLink :to="localePath(`/stones#${stone.slug}`)" class="btn-ghost">{{ t('quiz.readMore') }}</NuxtLink>
              </div>
              <button type="button" class="mt-5 text-sm text-ink-soft underline underline-offset-4" @click="reset">{{ t('quiz.again') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
