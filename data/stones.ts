import type { Localized } from './types'
import { zodiacSigns } from './zodiac'

export type Chakra = 'root' | 'sacral' | 'solar-plexus' | 'heart' | 'throat' | 'third-eye' | 'crown'

export interface Stone {
  slug: string
  name: Localized
  /** main body colour */
  hex: string
  /** lighter highlight colour used for the 3D/SVG rendering */
  highlight: string
  /** how light passes through: 'clear' (faceted, transparent) | 'milky' (translucent) | 'opaque' */
  clarity: 'clear' | 'milky' | 'opaque'
  colorName: Localized
  chakra: Chakra[]
  meaning: Localized
  properties: Localized
  hardness: string
}

export const stones: Stone[] = [
  {
    slug: 'amethyst', name: { en: 'Amethyst', ar: 'الجمشت (أمثيست)' },
    hex: '#8E5BB5', highlight: '#D7B8F0', clarity: 'clear',
    colorName: { en: 'Violet purple', ar: 'بنفسجي' }, chakra: ['crown', 'third-eye'],
    meaning: { en: 'The stone of calm and intuition. Soothes an anxious mind and protects your energy.', ar: 'حجر الهدوء والحدس. يهدّئ القلق ويحمي طاقتك.' },
    properties: { en: 'Peaceful sleep, spiritual clarity, emotional balance.', ar: 'نوم هادئ، صفاء روحي، توازن عاطفي.' },
    hardness: '7',
  },
  {
    slug: 'citrine', name: { en: 'Citrine', ar: 'السترين' },
    hex: '#E5A92E', highlight: '#FBE29A', clarity: 'clear',
    colorName: { en: 'Honey yellow', ar: 'أصفر عسلي' }, chakra: ['solar-plexus'],
    meaning: { en: 'The merchant’s stone of sunshine, joy and abundance.', ar: 'حجر الشمس والفرح والوفرة، يُعرف بحجر التجّار.' },
    properties: { en: 'Confidence, optimism, attracting prosperity.', ar: 'ثقة بالنفس، تفاؤل، جذب الرزق.' },
    hardness: '7',
  },
  {
    slug: 'turquoise', name: { en: 'Turquoise', ar: 'الفيروز' },
    hex: '#2FA9A4', highlight: '#9EE3DC', clarity: 'opaque',
    colorName: { en: 'Sky teal', ar: 'فيروزي' }, chakra: ['throat'],
    meaning: { en: 'An ancient talisman of protection and good fortune for travellers.', ar: 'تعويذة قديمة للحماية والحظ الحسن للمسافرين.' },
    properties: { en: 'Protection, honest communication, luck.', ar: 'حماية، تواصل صادق، حظ.' },
    hardness: '5–6',
  },
  {
    slug: 'carnelian', name: { en: 'Carnelian', ar: 'العقيق اليمني (كارنيليان)' },
    hex: '#C9481F', highlight: '#F7A57A', clarity: 'milky',
    colorName: { en: 'Sunset orange', ar: 'برتقالي الغروب' }, chakra: ['sacral'],
    meaning: { en: 'A warm stone of courage, vitality and creative fire.', ar: 'حجر دافئ للشجاعة والحيوية والإبداع.' },
    properties: { en: 'Motivation, courage, creativity.', ar: 'دافع، شجاعة، إبداع.' },
    hardness: '7',
  },
  {
    slug: 'lapis-lazuli', name: { en: 'Lapis Lazuli', ar: 'اللازورد' },
    hex: '#22409A', highlight: '#6E8FE0', clarity: 'opaque',
    colorName: { en: 'Royal blue with gold flecks', ar: 'أزرق ملكي بنقاط ذهبية' }, chakra: ['throat', 'third-eye'],
    meaning: { en: 'Worn by kings and sages, the stone of wisdom and truth.', ar: 'حجر الملوك والحكماء، حجر الحكمة والصدق.' },
    properties: { en: 'Wisdom, self-expression, inner truth.', ar: 'حكمة، تعبير عن الذات، صدق داخلي.' },
    hardness: '5–5.5',
  },
  {
    slug: 'garnet', name: { en: 'Garnet', ar: 'العقيق الرماني (غارنيت)' },
    hex: '#7E1426', highlight: '#E2546B', clarity: 'clear',
    colorName: { en: 'Pomegranate red', ar: 'أحمر رماني' }, chakra: ['root'],
    meaning: { en: 'The pomegranate stone of passion, devotion and energy.', ar: 'حجر الرمان للشغف والإخلاص والطاقة.' },
    properties: { en: 'Passion, commitment, grounding energy.', ar: 'شغف، التزام، طاقة ثابتة.' },
    hardness: '6.5–7.5',
  },
  {
    slug: 'tigers-eye', name: { en: 'Tiger’s Eye', ar: 'عين النمر' },
    hex: '#9A6416', highlight: '#E8B860', clarity: 'opaque',
    colorName: { en: 'Golden brown', ar: 'بني ذهبي' }, chakra: ['solar-plexus', 'root'],
    meaning: { en: 'A watchful stone of focus, strength and protection.', ar: 'حجر يقظ للتركيز والقوة والحماية.' },
    properties: { en: 'Focus, willpower, protection from envy.', ar: 'تركيز، قوة إرادة، حماية من الحسد.' },
    hardness: '7',
  },
  {
    slug: 'moonstone', name: { en: 'Moonstone', ar: 'حجر القمر' },
    hex: '#DCDDE8', highlight: '#BFD8FF', clarity: 'milky',
    colorName: { en: 'Milky white with blue glow', ar: 'أبيض حليبي بوهج أزرق' }, chakra: ['crown', 'sacral'],
    meaning: { en: 'The stone of new beginnings and feminine intuition.', ar: 'حجر البدايات الجديدة والحدس الأنثوي.' },
    properties: { en: 'Intuition, emotional balance, new beginnings.', ar: 'حدس، توازن عاطفي، بدايات جديدة.' },
    hardness: '6–6.5',
  },
  {
    slug: 'rose-quartz', name: { en: 'Rose Quartz', ar: 'الكوارتز الوردي' },
    hex: '#E7A6B4', highlight: '#FBDCE3', clarity: 'milky',
    colorName: { en: 'Soft pink', ar: 'وردي ناعم' }, chakra: ['heart'],
    meaning: { en: 'The stone of unconditional love and self-love.', ar: 'حجر الحب غير المشروط وحب الذات.' },
    properties: { en: 'Love, compassion, healing the heart.', ar: 'حب، رحمة، شفاء القلب.' },
    hardness: '7',
  },
  {
    slug: 'aquamarine', name: { en: 'Aquamarine', ar: 'الأكوامارين' },
    hex: '#7FC8D8', highlight: '#D2F1F7', clarity: 'clear',
    colorName: { en: 'Sea blue', ar: 'أزرق بحري' }, chakra: ['throat'],
    meaning: { en: 'Treasure of mermaids — calm, courage and clear speech.', ar: 'كنز حوريات البحر: هدوء وشجاعة وكلام واضح.' },
    properties: { en: 'Serenity, courage, clear communication.', ar: 'سكينة، شجاعة، تواصل واضح.' },
    hardness: '7.5–8',
  },
  {
    slug: 'blue-topaz', name: { en: 'Blue Topaz', ar: 'التوباز الأزرق' },
    hex: '#3E9CD6', highlight: '#BEE6FF', clarity: 'clear',
    colorName: { en: 'Swiss blue', ar: 'أزرق سويسري' }, chakra: ['throat'],
    meaning: { en: 'A bright stone of clarity, truth and calm focus.', ar: 'حجر مشرق للوضوح والصدق والتركيز الهادئ.' },
    properties: { en: 'Clarity, honesty, calm.', ar: 'وضوح، صدق، هدوء.' },
    hardness: '8',
  },
  {
    slug: 'opal', name: { en: 'Opal', ar: 'الأوبال' },
    hex: '#E3ECEC', highlight: '#FFD9F3', clarity: 'milky',
    colorName: { en: 'Iridescent white', ar: 'أبيض متلألئ بألوان قوس قزح' }, chakra: ['crown'],
    meaning: { en: 'A play of colour that awakens creativity and inspiration.', ar: 'لعبة ألوان توقظ الإبداع والإلهام.' },
    properties: { en: 'Creativity, inspiration, spontaneity.', ar: 'إبداع، إلهام، عفوية.' },
    hardness: '5.5–6.5',
  },
  {
    slug: 'onyx', name: { en: 'Black Onyx', ar: 'الأونيكس الأسود' },
    hex: '#1C1B21', highlight: '#5B5866', clarity: 'opaque',
    colorName: { en: 'Polished black', ar: 'أسود لامع' }, chakra: ['root'],
    meaning: { en: 'A grounding stone of strength, discipline and protection.', ar: 'حجر ثابت للقوة والانضباط والحماية.' },
    properties: { en: 'Strength, self-control, protection.', ar: 'قوة، ضبط النفس، حماية.' },
    hardness: '6.5–7',
  },
  {
    slug: 'malachite', name: { en: 'Malachite', ar: 'الملكيت' },
    hex: '#167A50', highlight: '#5FD39C', clarity: 'opaque',
    colorName: { en: 'Banded green', ar: 'أخضر مخطط' }, chakra: ['heart'],
    meaning: { en: 'The stone of transformation and emotional courage.', ar: 'حجر التحوّل والشجاعة العاطفية.' },
    properties: { en: 'Transformation, protection, growth.', ar: 'تحوّل، حماية، نمو.' },
    hardness: '3.5–4',
  },
  {
    slug: 'emerald', name: { en: 'Emerald', ar: 'الزمرد' },
    hex: '#138A5E', highlight: '#7EE6B8', clarity: 'clear',
    colorName: { en: 'Deep green', ar: 'أخضر عميق' }, chakra: ['heart'],
    meaning: { en: 'The jewel of loyalty, love and renewal.', ar: 'جوهرة الوفاء والحب والتجدد.' },
    properties: { en: 'Loyalty, growth, harmony in love.', ar: 'وفاء، نمو، انسجام في الحب.' },
    hardness: '7.5–8',
  },
  {
    slug: 'ruby', name: { en: 'Ruby', ar: 'الياقوت الأحمر' },
    hex: '#A3102F', highlight: '#FF6F8A', clarity: 'clear',
    colorName: { en: 'Pigeon-blood red', ar: 'أحمر دم الحمام' }, chakra: ['root', 'heart'],
    meaning: { en: 'The king of gems — vitality, passion and nobility.', ar: 'ملك الأحجار: حيوية وشغف ونُبل.' },
    properties: { en: 'Vitality, confidence, passion.', ar: 'حيوية، ثقة، شغف.' },
    hardness: '9',
  },
]

export const getStone = (slug?: string | null) => stones.find(s => s.slug === slug)

/** zodiac sign slugs linked to each stone (derived from the zodiac table) */
export const stoneZodiac = (slug: string) =>
  zodiacSigns.filter(z => z.stones.includes(slug)).map(z => z.slug)

export const chakraNames: Record<Chakra, { en: string, ar: string, hex: string }> = {
  'root': { en: 'Root', ar: 'الجذر', hex: '#B3263A' },
  'sacral': { en: 'Sacral', ar: 'العجز', hex: '#D9692B' },
  'solar-plexus': { en: 'Solar Plexus', ar: 'الضفيرة الشمسية', hex: '#D9A92B' },
  'heart': { en: 'Heart', ar: 'القلب', hex: '#3F9A5C' },
  'throat': { en: 'Throat', ar: 'الحلق', hex: '#3A8DC4' },
  'third-eye': { en: 'Third Eye', ar: 'العين الثالثة', hex: '#4B4FB0' },
  'crown': { en: 'Crown', ar: 'التاج', hex: '#8A55B8' },
}
