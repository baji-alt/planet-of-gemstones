// Captured when the app boots: the router briefly rewrites the URL during
// hydration, so reading location.search later can miss ?no3d / ?force3d.
const bootSearch = import.meta.client ? window.location.search : ''

/**
 * Decides whether this device should get real-time 3D, and whether the
 * user prefers reduced motion. Both are false during SSR and resolve on mount.
 */
export function use3D() {
  const can3D = useState<boolean | null>('can-3d', () => null)
  const reducedMotion = useState('reduced-motion', () => false)

  onMounted(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotion.value = mq.matches
    mq.addEventListener?.('change', e => (reducedMotion.value = e.matches))
    if (can3D.value !== null) return
    can3D.value = detect()
  })

  return { can3D, reducedMotion }
}

function detect(): boolean {
  try {
    const params = new URLSearchParams(bootSearch)
    if (params.has('no3d')) return false
    if (params.has('force3d')) return true
    const nav = navigator as Navigator & { deviceMemory?: number, connection?: { saveData?: boolean } }
    if (nav.connection?.saveData) return false
    if ((nav.deviceMemory ?? 8) < 3) return false
    if ((nav.hardwareConcurrency ?? 8) < 4) return false
    const c = document.createElement('canvas')
    const gl = c.getContext('webgl2')
    if (!gl) return false
    const dbg = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : ''
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    // software rasterisers can't hold 60fps with transmission + bloom
    if (/swiftshader|llvmpipe|software|basic render/i.test(renderer)) return false
    return true
  }
  catch {
    return false
  }
}
