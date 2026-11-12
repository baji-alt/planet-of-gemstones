import { getStone } from '~/data/stones'

/** Map a stone slug to the minimal look description used by the 3D builders. */
export function stoneLook(slug: string) {
  const s = getStone(slug)
  return s
    ? { hex: s.hex, highlight: s.highlight, clarity: s.clarity, slug: s.slug }
    : { hex: '#ffffff', highlight: '#ffffff', clarity: 'clear' as const, slug: 'diamond' }
}
