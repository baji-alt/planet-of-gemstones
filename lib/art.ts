import { hashString, rng } from './random'

export { hashString, rng }

/** Round SVG coordinates so server (Node) and browser trig results serialize identically. */
export const r2 = (n: number) => Math.round(n * 100) / 100

/** Mix a hex colour toward another (t = 0..1). */
export function mix(a: string, b: string, t: number) {
  const pa = parseInt(a.slice(1), 16)
  const pb = parseInt(b.slice(1), 16)
  const ch = (p: number, s: number) => (p >> s) & 255
  const c = (s: number) => Math.round(ch(pa, s) + (ch(pb, s) - ch(pa, s)) * t)
  return `#${((1 << 24) | (c(16) << 16) | (c(8) << 8) | c(0)).toString(16).slice(1)}`
}

/** Smooth irregular closed blob (tumbled stone silhouette) as an SVG path. */
export function blobPath(cx: number, cy: number, rx: number, ry: number, seed: number, points = 7, jitter = 0.16) {
  const r = rng(seed)
  const pts: [number, number][] = []
  const rot = r() * Math.PI * 2
  for (let i = 0; i < points; i++) {
    const a = rot + (i / points) * Math.PI * 2
    const k = 1 - jitter + r() * jitter * 2
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k])
  }
  // Catmull-Rom → cubic Bézier
  const n = pts.length
  let d = `M${pts[0]![0].toFixed(1)} ${pts[0]![1].toFixed(1)}`
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]!
    const p1 = pts[i]!
    const p2 = pts[(i + 1) % n]!
    const p3 = pts[(i + 2) % n]!
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += `C${c1[0]!.toFixed(1)} ${c1[1]!.toFixed(1)} ${c2[0]!.toFixed(1)} ${c2[1]!.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return `${d}Z`
}
