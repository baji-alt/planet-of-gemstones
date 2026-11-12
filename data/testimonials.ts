import type { Localized } from './types'

/**
 * PLACEHOLDER testimonials — replace with real customer feedback
 * (e.g. screenshots/quotes from the Instagram "Feedbacks" highlight, with permission).
 */
export interface Testimonial {
  name: string
  city: Localized
  rating: number
  quote: Localized
  product: string
}

export const testimonials: Testimonial[] = [
  {
    name: 'Maya K.', city: { en: 'Beirut', ar: 'بيروت' }, rating: 5, product: 'gemini-zodiac-bracelet',
    quote: { en: 'My Gemini bracelet is even prettier in person. The stones are so vivid and the packaging felt like a gift to myself.', ar: 'سوار برج الجوزاء أجمل بكثير على الطبيعة. الأحجار ألوانها حيّة والتغليف كأنه هدية لنفسي.' },
  },
  {
    name: 'Rami H.', city: { en: 'Jounieh', ar: 'جونيه' }, rating: 5, product: 'yemeni-agate-ring',
    quote: { en: 'Bought the Yemeni agate ring for my father. Solid silver, beautiful stone, and delivered the next day.', ar: 'اشتريت خاتم العقيق اليمني لوالدي. فضة متينة وحجر جميل ووصل باليوم التالي.' },
  },
  {
    name: 'Nour S.', city: { en: 'Tripoli', ar: 'طرابلس' }, rating: 5, product: 'moonstone-oval-pendant',
    quote: { en: 'The moonstone pendant has the softest blue glow. They explained the meaning of the stone with so much love.', ar: 'قلادة حجر القمر فيها وهج أزرق ناعم جداً. وشرحوا لي معنى الحجر بكل حب.' },
  },
  {
    name: 'Lea M.', city: { en: 'Byblos', ar: 'جبيل' }, rating: 5, product: 'scorpio-zodiac-bracelet',
    quote: { en: 'I ordered three zodiac bracelets for my sisters. Everyone found their sign — we wear them every day.', ar: 'طلبت ثلاث أساور أبراج لأخواتي. كل وحدة لقت برجها ومنلبسهم كل يوم.' },
  },
  {
    name: 'Karim A.', city: { en: 'Saida', ar: 'صيدا' }, rating: 5, product: 'royal-lapis-signet-ring',
    quote: { en: 'The lapis signet is heavy, elegant and exactly like the photos. Excellent service on WhatsApp.', ar: 'خاتم اللازورد ثقيل وأنيق ومتل الصور تماماً. خدمة ممتازة على الواتساب.' },
  },
  {
    name: 'Yasmine T.', city: { en: 'Zahle', ar: 'زحلة' }, rating: 5, product: 'aquamarine-solitaire-ring',
    quote: { en: 'Delicate, sparkly and perfectly sized. My aquamarine ring is my new favourite piece.', ar: 'ناعم ولامع وقياسه مظبوط. خاتم الأكوامارين صار قطعتي المفضلة.' },
  },
]
