import type { Localized } from './types'

export type Element = 'fire' | 'earth' | 'air' | 'water'

export interface ZodiacSign {
  slug: string
  name: Localized
  /** [month (1-12), day] inclusive start and end */
  start: [number, number]
  end: [number, number]
  element: Element
  ruler: Localized
  stones: string[]
  trait: Localized
  /** stroke path in a 24×24 box, used for both SVG and canvas (Path2D) */
  glyph: string
}

export const zodiacSigns: ZodiacSign[] = [
  {
    slug: 'aries',
    name: { en: 'Aries', ar: 'الحمل' },
    start: [3, 21], end: [4, 19], element: 'fire',
    ruler: { en: 'Mars', ar: 'المريخ' },
    stones: ['carnelian', 'garnet', 'citrine', 'aquamarine'],
    trait: { en: 'Bold, pioneering and full of fire.', ar: 'جريء ومبادر ومليء بالحماس.' },
    glyph: 'M12 21V9 M12 9C12 5 10 3 7.5 3S3 5 3 7.5 4.5 11 6 11 M12 9c0-4 2-6 4.5-6S21 5 21 7.5 19.5 11 18 11',
  },
  {
    slug: 'taurus',
    name: { en: 'Taurus', ar: 'الثور' },
    start: [4, 20], end: [5, 20], element: 'earth',
    ruler: { en: 'Venus', ar: 'الزهرة' },
    stones: ['rose-quartz', 'emerald', 'lapis-lazuli', 'malachite'],
    trait: { en: 'Grounded, loyal and devoted to beauty.', ar: 'ثابت ووفي ومحبّ للجمال.' },
    glyph: 'M17 15.5a5 5 0 1 1-10 0a5 5 0 1 1 10 0z M4 3.5c1 4 4 7 8 7s7-3 8-7',
  },
  {
    slug: 'gemini',
    name: { en: 'Gemini', ar: 'الجوزاء' },
    start: [5, 21], end: [6, 20], element: 'air',
    ruler: { en: 'Mercury', ar: 'عطارد' },
    stones: ['citrine', 'tigers-eye', 'aquamarine', 'moonstone'],
    trait: { en: 'Curious, witty and endlessly expressive.', ar: 'فضولي وذكي وكثير التعبير.' },
    glyph: 'M5 4c4 1.5 10 1.5 14 0 M5 20c4-1.5 10-1.5 14 0 M9 5v14 M15 5v14',
  },
  {
    slug: 'cancer',
    name: { en: 'Cancer', ar: 'السرطان' },
    start: [6, 21], end: [7, 22], element: 'water',
    ruler: { en: 'Moon', ar: 'القمر' },
    stones: ['moonstone', 'ruby', 'emerald', 'rose-quartz'],
    trait: { en: 'Intuitive, nurturing and deeply caring.', ar: 'حدسي وحنون وعميق المشاعر.' },
    glyph: 'M20 9.5c-1.8-3-5-4.5-9-4.5-3 0-5.5 1-7 2.5 M4 14.5c1.8 3 5 4.5 9 4.5 3 0 5.5-1 7-2.5 M9.5 9.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 1 1 5 0 M19.5 14.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 1 1 5 0',
  },
  {
    slug: 'leo',
    name: { en: 'Leo', ar: 'الأسد' },
    start: [7, 23], end: [8, 22], element: 'fire',
    ruler: { en: 'Sun', ar: 'الشمس' },
    stones: ['citrine', 'tigers-eye', 'carnelian', 'ruby'],
    trait: { en: 'Radiant, generous and born to shine.', ar: 'مشرق وكريم وُلد ليتألق.' },
    glyph: 'M8.5 16.5a3 3 0 1 1-6 0a3 3 0 1 1 6 0z M8.5 16.5C8.5 13 7 11 7 8a5 5 0 0 1 10 0c0 4-3.5 6.5-3.5 10a2.5 2.5 0 0 0 5 0',
  },
  {
    slug: 'virgo',
    name: { en: 'Virgo', ar: 'العذراء' },
    start: [8, 23], end: [9, 22], element: 'earth',
    ruler: { en: 'Mercury', ar: 'عطارد' },
    stones: ['amethyst', 'carnelian', 'tigers-eye', 'lapis-lazuli'],
    trait: { en: 'Thoughtful, precise and quietly kind.', ar: 'متأنٍّ ودقيق ولطيف بهدوء.' },
    glyph: 'M3 5.5c1.2 0 2 1 2 2.2V19 M5 8c0-2.6 4-2.6 4 0v11 M9 8c0-2.6 4-2.6 4 0v8.5c0 2 1 3.5 3 3.5 M13 12.5c2-2.8 7-2.5 7 1s-3.5 5.5-7.5 6.5',
  },
  {
    slug: 'libra',
    name: { en: 'Libra', ar: 'الميزان' },
    start: [9, 23], end: [10, 22], element: 'air',
    ruler: { en: 'Venus', ar: 'الزهرة' },
    stones: ['lapis-lazuli', 'opal', 'rose-quartz', 'citrine'],
    trait: { en: 'Graceful, fair and in love with harmony.', ar: 'أنيق وعادل وعاشق للتناغم.' },
    glyph: 'M3 20h18 M3 16h5.5a4.5 4.5 0 1 1 7 0H21',
  },
  {
    slug: 'scorpio',
    name: { en: 'Scorpio', ar: 'العقرب' },
    start: [10, 23], end: [11, 21], element: 'water',
    ruler: { en: 'Pluto', ar: 'بلوتو' },
    stones: ['garnet', 'malachite', 'onyx', 'turquoise'],
    trait: { en: 'Magnetic, intense and fiercely loyal.', ar: 'جذاب وعميق ووفيّ بشدة.' },
    glyph: 'M3 5.5c1.2 0 2 1 2 2.2V19 M5 8c0-2.6 4-2.6 4 0v11 M9 8c0-2.6 4-2.6 4 0v9.5c0 1.5 1 2.5 2.5 2.5H20 M17.5 17.5L20 20l-2.5 2.5',
  },
  {
    slug: 'sagittarius',
    name: { en: 'Sagittarius', ar: 'القوس' },
    start: [11, 22], end: [12, 21], element: 'fire',
    ruler: { en: 'Jupiter', ar: 'المشتري' },
    stones: ['turquoise', 'lapis-lazuli', 'amethyst', 'blue-topaz'],
    trait: { en: 'Adventurous, optimistic and free-spirited.', ar: 'مغامر ومتفائل وحرّ الروح.' },
    glyph: 'M4 20L20 4 M12 4h8v8 M7 11l6 6',
  },
  {
    slug: 'capricorn',
    name: { en: 'Capricorn', ar: 'الجدي' },
    start: [12, 22], end: [1, 19], element: 'earth',
    ruler: { en: 'Saturn', ar: 'زحل' },
    stones: ['garnet', 'onyx', 'tigers-eye', 'malachite'],
    trait: { en: 'Ambitious, patient and quietly strong.', ar: 'طموح وصبور وقوي بهدوء.' },
    glyph: 'M3 5c1.5 0 2.5 2 2.5 4v8 M5.5 9c0-3.5 5-4.5 5 0.5V17c0 2 1.2 3.5 3.2 3.5 M20.5 16.5a3.4 3.4 0 1 1-6.8 0a3.4 3.4 0 1 1 6.8 0z',
  },
  {
    slug: 'aquarius',
    name: { en: 'Aquarius', ar: 'الدلو' },
    start: [1, 20], end: [2, 18], element: 'air',
    ruler: { en: 'Uranus', ar: 'أورانوس' },
    stones: ['amethyst', 'garnet', 'aquamarine', 'lapis-lazuli'],
    trait: { en: 'Visionary, original and humanitarian.', ar: 'صاحب رؤية ومبتكر وإنساني.' },
    glyph: 'M3 10l3-3 3 3 3-3 3 3 3-3 3 3 M3 17l3-3 3 3 3-3 3 3 3-3 3 3',
  },
  {
    slug: 'pisces',
    name: { en: 'Pisces', ar: 'الحوت' },
    start: [2, 19], end: [3, 20], element: 'water',
    ruler: { en: 'Neptune', ar: 'نبتون' },
    stones: ['amethyst', 'aquamarine', 'moonstone', 'turquoise'],
    trait: { en: 'Dreamy, compassionate and artistic.', ar: 'حالم ورحيم وفنان بطبعه.' },
    glyph: 'M5 3c4 4 4 14 0 18 M19 3c-4 4-4 14 0 18 M4 12h16',
  },
]

export const getSign = (slug?: string | null) => zodiacSigns.find(s => s.slug === slug)

/** Returns the zodiac sign for a given month (1-12) and day. */
export function signForDate(month: number, day: number): ZodiacSign {
  const v = month * 100 + day
  for (const s of zodiacSigns) {
    const a = s.start[0] * 100 + s.start[1]
    const b = s.end[0] * 100 + s.end[1]
    if (a <= b ? v >= a && v <= b : v >= a || v <= b) return s
  }
  return zodiacSigns[0]!
}

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_EN_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
// Levantine month names, as used in Lebanon
const MONTHS_AR = ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول']

export const monthNames = (locale: string, long = false) =>
  locale === 'ar' ? MONTHS_AR : long ? MONTHS_EN_LONG : MONTHS_EN

export function signDates(s: ZodiacSign, locale: string, long = false) {
  const m = monthNames(locale, long)
  return `${m[s.start[0] - 1]} ${s.start[1]} – ${m[s.end[0] - 1]} ${s.end[1]}`
}
