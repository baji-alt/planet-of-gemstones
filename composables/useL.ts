import type { Localized } from '~/data/types'

// Unicode "left-to-right isolate" / "pop directional isolate", written as escapes on purpose
const LRI = String.fromCharCode(0x2066)
const PDI = String.fromCharCode(0x2069)

/** Pick the active-locale string from a { en, ar } object, and format USD prices. */
export function useL() {
  const { locale } = useI18n()
  const l = (v?: Localized | null) => (v ? v[locale.value as 'en' | 'ar'] ?? v.en : '')
  const isAr = computed(() => locale.value === 'ar')
  const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
  // USD prices read "$42" in both languages; isolate them so RTL text doesn't reorder the symbol
  const price = (usd: number) => (locale.value === 'ar' ? `${LRI}${fmt.format(usd)}${PDI}` : fmt.format(usd))
  return { l, isAr, price, locale }
}
