/** Builds wa.me deep links with a pre-filled, localized message. */
export function useWhatsApp() {
  const config = useRuntimeConfig()
  const number = String(config.public.whatsappNumber || '').replace(/\D/g, '')
  const link = (text: string) => `https://wa.me/${number}?text=${encodeURIComponent(text)}`
  return { number, link }
}
