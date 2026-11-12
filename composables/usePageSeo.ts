/** Localized title/description + Open Graph for a page. */
export function usePageSeo(key: string, override?: () => { title?: string, description?: string }) {
  const { t } = useI18n()
  useSeoMeta({
    title: () => override?.().title ?? t(`seo.${key}.title`),
    description: () => override?.().description ?? t(`seo.${key}.description`),
    ogTitle: () => `${override?.().title ?? t(`seo.${key}.title`)} · Planet of Gemstones`,
    ogDescription: () => override?.().description ?? t(`seo.${key}.description`),
  })
}
