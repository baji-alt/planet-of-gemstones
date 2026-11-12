import type { CategorySlug, Localized, Metal, ProductType, Version } from './types'
import { zodiacSigns } from './zodiac'

export interface Product {
  slug: string
  category: CategorySlug
  type: ProductType
  name: Localized
  description: Localized
  /** USD */
  price: number
  compareAt?: number
  /** stone slugs, first one is the hero stone */
  stones: string[]
  zodiac?: string
  metals: Metal[]
  /** ring head style used by the 3D viewer */
  ringStyle?: 'solitaire' | 'signet'
  /** offered versions (zodiac bracelets: women's charm chain / men's bead bracelet) */
  versions?: Version[]
  bestseller?: boolean
  isNew?: boolean
  /**
   * Real photography. Drop files into /public/img/products/ and list them here,
   * e.g. ['/img/products/gemini-1.jpg']. Nuxt Image serves them as AVIF/WebP.
   * While empty, an on-brand illustrated placeholder is rendered instead.
   */
  images: string[]
  /** Optional Draco-compressed GLB in /public/models. Procedural model is used when absent. */
  model?: string
}

const zodiacPrices: Record<string, number> = {
  aries: 38, taurus: 42, gemini: 38, cancer: 45, leo: 42, virgo: 38,
  libra: 40, scorpio: 42, sagittarius: 40, capricorn: 42, aquarius: 40, pisces: 40,
}

const zodiacBracelets: Product[] = zodiacSigns.map(sign => ({
  slug: `${sign.slug}-zodiac-bracelet`,
  category: 'zodiac',
  type: 'bracelet',
  name: { en: `${sign.name.en} Zodiac Bracelet`, ar: `سوار برج ${sign.name.ar}` },
  description: {
    en: `A fine gold link chain with hand-picked tumbled natural stones dangling as charms, chosen for ${sign.name.en}. ${sign.trait.en} Also available as a men’s version on natural stone beads.`,
    ar: `سلسلة ذهبية ناعمة تتدلّى منها أحجار طبيعية مصقولة مختارة بعناية لبرج ${sign.name.ar}. ${sign.trait.ar} متوفر أيضاً بنسخة رجالية من خرز الأحجار الطبيعية.`,
  },
  price: zodiacPrices[sign.slug] ?? 40,
  stones: sign.stones,
  zodiac: sign.slug,
  metals: ['gold', 'silver'],
  versions: ['women', 'men'],
  bestseller: ['gemini', 'scorpio', 'sagittarius', 'leo'].includes(sign.slug),
  isNew: sign.slug === 'scorpio' || sign.slug === 'sagittarius',
  images: [],
}))

const mensRings: Product[] = [
  {
    slug: 'royal-lapis-signet-ring', category: 'mens-rings', type: 'ring', ringStyle: 'signet',
    name: { en: 'Royal Lapis Signet Ring', ar: 'خاتم اللازورد الملكي' },
    description: { en: 'A bold sterling silver signet crowned with a deep-blue lapis lazuli cabochon flecked with gold pyrite.', ar: 'خاتم فضة عيار ٩٢٥ جريء يتوّجه حجر لازورد أزرق عميق بنقاط ذهبية.' },
    price: 120, stones: ['lapis-lazuli'], metals: ['silver', 'gold'], bestseller: true, images: [],
  },
  {
    slug: 'yemeni-agate-ring', category: 'mens-rings', type: 'ring', ringStyle: 'signet',
    name: { en: 'Yemeni Agate Ring', ar: 'خاتم العقيق اليمني' },
    description: { en: 'A classic men’s ring with a warm carnelian (Yemeni agate) stone set in hand-engraved silver.', ar: 'خاتم رجالي كلاسيكي بحجر عقيق يمني دافئ مركّب على فضة محفورة يدوياً.' },
    price: 95, stones: ['carnelian'], metals: ['silver', 'gold'], bestseller: true, images: [],
  },
  {
    slug: 'tigers-eye-sultan-ring', category: 'mens-rings', type: 'ring', ringStyle: 'signet',
    name: { en: 'Tiger’s Eye Sultan Ring', ar: 'خاتم السلطان بعين النمر' },
    description: { en: 'Gold-plated silver with a large chatoyant tiger’s eye that catches the light as you move.', ar: 'فضة مطلية بالذهب مع حجر عين النمر الكبير الذي يلمع مع كل حركة.' },
    price: 110, stones: ['tigers-eye'], metals: ['gold', 'silver'], images: [],
  },
  {
    slug: 'black-onyx-ring', category: 'mens-rings', type: 'ring', ringStyle: 'signet',
    name: { en: 'Black Onyx Ring', ar: 'خاتم الأونيكس الأسود' },
    description: { en: 'Minimal and powerful: polished black onyx framed in brushed sterling silver.', ar: 'بسيط وقوي: أونيكس أسود لامع بإطار من الفضة المصقولة.' },
    price: 90, stones: ['onyx'], metals: ['silver', 'gold'], images: [],
  },
  {
    slug: 'turquoise-heritage-ring', category: 'mens-rings', type: 'ring', ringStyle: 'signet',
    name: { en: 'Turquoise Heritage Ring', ar: 'خاتم الفيروز التراثي' },
    description: { en: 'A heritage-style silver ring with a natural turquoise, the traveller’s talisman.', ar: 'خاتم فضة بطابع تراثي مع فيروز طبيعي، تعويذة المسافرين.' },
    price: 105, stones: ['turquoise'], metals: ['silver', 'gold'], isNew: true, images: [],
  },
  {
    slug: 'ruby-crown-ring', category: 'mens-rings', type: 'ring', ringStyle: 'solitaire',
    name: { en: 'Ruby Crown Ring', ar: 'خاتم التاج بالياقوت' },
    description: { en: 'A faceted ruby held high in a crown setting on a heavy gold-plated band.', ar: 'ياقوت أحمر مقطّع مرفوع في ترصيعة على شكل تاج فوق حلقة ثقيلة مطلية بالذهب.' },
    price: 160, stones: ['ruby'], metals: ['gold', 'silver'], images: [],
  },
]

const silverJewelry: Product[] = [
  {
    slug: 'aquamarine-solitaire-ring', category: 'silver', type: 'ring', ringStyle: 'solitaire',
    name: { en: 'Aquamarine Solitaire Ring', ar: 'خاتم سوليتير أكوامارين' },
    description: { en: 'A delicate sterling silver solitaire with a sea-blue faceted aquamarine.', ar: 'خاتم سوليتير رقيق من الفضة مع حجر أكوامارين مقطّع بلون البحر.' },
    price: 85, stones: ['aquamarine'], metals: ['silver', 'gold'], bestseller: true, images: [],
  },
  {
    slug: 'blue-topaz-solitaire-ring', category: 'silver', type: 'ring', ringStyle: 'solitaire',
    name: { en: 'Blue Topaz Solitaire Ring', ar: 'خاتم سوليتير توباز أزرق' },
    description: { en: 'Swiss-blue topaz in a six-prong sterling silver setting. Bright, clear and timeless.', ar: 'توباز أزرق سويسري في ترصيعة فضية بستة مخالب. مشرق وواضح وخالد.' },
    price: 80, stones: ['blue-topaz'], metals: ['silver', 'gold'], images: [],
  },
  {
    slug: 'moonstone-oval-pendant', category: 'silver', type: 'pendant',
    name: { en: 'Moonstone Oval Pendant', ar: 'قلادة حجر القمر البيضاوية' },
    description: { en: 'An oval rainbow moonstone with a soft blue glow, bezel-set in sterling silver on a fine chain.', ar: 'حجر قمر بيضاوي بوهج أزرق ناعم، مركّب بإطار فضي على سلسلة رفيعة.' },
    price: 70, stones: ['moonstone'], metals: ['silver', 'gold'], bestseller: true, images: [],
  },
  {
    slug: 'opal-oval-pendant', category: 'silver', type: 'pendant',
    name: { en: 'Opal Oval Pendant', ar: 'قلادة الأوبال البيضاوية' },
    description: { en: 'A milky opal with flashes of rainbow fire, framed in polished silver.', ar: 'أوبال حليبي بومضات من ألوان قوس قزح، بإطار فضي لامع.' },
    price: 90, stones: ['opal'], metals: ['silver', 'gold'], isNew: true, images: [],
  },
  {
    slug: 'amethyst-drop-necklace', category: 'silver', type: 'necklace',
    name: { en: 'Amethyst Drop Necklace', ar: 'عقد الجمشت المتدلّي' },
    description: { en: 'A faceted amethyst drop on a dainty sterling silver chain, made for everyday calm.', ar: 'قطرة جمشت مقطّعة على سلسلة فضية ناعمة، للهدوء كل يوم.' },
    price: 75, stones: ['amethyst'], metals: ['silver', 'gold'], images: [],
  },
  {
    slug: 'rose-quartz-necklace', category: 'silver', type: 'necklace',
    name: { en: 'Rose Quartz Love Necklace', ar: 'عقد الكوارتز الوردي للحب' },
    description: { en: 'A soft-pink rose quartz drop, the stone of love, on a fine silver chain.', ar: 'قطرة كوارتز وردي ناعمة، حجر الحب، على سلسلة فضية رفيعة.' },
    price: 65, stones: ['rose-quartz'], metals: ['silver', 'gold'], images: [],
  },
]

const naturalStones: Product[] = [
  ['amethyst', 'Amethyst Tumbled Stone', 'حجر الجمشت المصقول', 12],
  ['citrine', 'Citrine Tumbled Stone', 'حجر السترين المصقول', 12],
  ['lapis-lazuli', 'Lapis Lazuli Palm Stone', 'حجر اللازورد للكف', 18],
  ['moonstone', 'Moonstone Tumbled Stone', 'حجر القمر المصقول', 15],
  ['turquoise', 'Turquoise Nugget', 'قطعة فيروز طبيعية', 16],
  ['tigers-eye', 'Tiger’s Eye Tumbled Stone', 'حجر عين النمر المصقول', 10],
].map(([stone, en, ar, price]) => ({
  slug: `${stone}-natural-stone`,
  category: 'stones' as const,
  type: 'stone' as const,
  name: { en: en as string, ar: ar as string },
  description: {
    en: 'A hand-selected natural stone, tumbled smooth. Every piece is unique in shape, tone and inclusions — keep it close, in your pocket or on your desk.',
    ar: 'حجر طبيعي مختار يدوياً ومصقول بنعومة. كل قطعة فريدة في شكلها ولونها وتفاصيلها، احتفظ بها قريبة منك في جيبك أو على مكتبك.',
  },
  price: price as number,
  stones: [stone as string],
  metals: [],
  bestseller: stone === 'amethyst',
  images: [],
}))

const prayerBeads: Product[] = [
  ['amethyst', 'Amethyst Misbaha', 'سبحة جمشت', 55, true],
  ['lapis-lazuli', 'Lapis Lazuli Misbaha', 'سبحة لازورد', 65, false],
  ['tigers-eye', 'Tiger’s Eye Misbaha', 'سبحة عين النمر', 45, true],
  ['onyx', 'Black Onyx Misbaha', 'سبحة أونيكس أسود', 45, false],
  ['turquoise', 'Turquoise Misbaha', 'سبحة فيروز', 70, false],
  ['carnelian', 'Yemeni Agate Misbaha', 'سبحة عقيق يمني', 60, false],
].map(([stone, en, ar, price, best]) => ({
  slug: `${stone}-misbaha`,
  category: 'prayer-beads' as const,
  type: 'beads' as const,
  name: { en: en as string, ar: ar as string },
  description: {
    en: '33 polished natural stone beads with a metal separator and a silk tassel. Calm in the hand, beautiful as a gift.',
    ar: 'سبحة من ٣٣ حبة من الأحجار الطبيعية المصقولة مع فواصل معدنية وشرابة حرير. هادئة في اليد وجميلة كهدية.',
  },
  price: price as number,
  stones: [stone as string],
  metals: ['silver', 'gold'] as Metal[],
  bestseller: best as boolean,
  images: [],
}))

export const products: Product[] = [...zodiacBracelets, ...mensRings, ...silverJewelry, ...naturalStones, ...prayerBeads]

export const getProduct = (slug: string) => products.find(p => p.slug === slug)

export const categories: { slug: CategorySlug, icon: ProductType }[] = [
  { slug: 'zodiac', icon: 'bracelet' },
  { slug: 'stones', icon: 'stone' },
  { slug: 'mens-rings', icon: 'ring' },
  { slug: 'silver', icon: 'pendant' },
  { slug: 'prayer-beads', icon: 'beads' },
]

export const priceRange = {
  min: Math.min(...products.map(p => p.price)),
  max: Math.max(...products.map(p => p.price)),
}
