export interface Localized {
  en: string
  ar: string
}

export type Locale = keyof Localized

export type Metal = 'gold' | 'silver'
export type CategorySlug = 'zodiac' | 'stones' | 'mens-rings' | 'silver' | 'prayer-beads'
export type ProductType = 'bracelet' | 'ring' | 'pendant' | 'necklace' | 'stone' | 'beads'
/** zodiac bracelets come in a women's charm version and a men's bead version */
export type Version = 'women' | 'men'
