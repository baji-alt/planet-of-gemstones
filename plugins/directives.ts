import type { Directive } from 'vue'

/**
 * v-reveal   → fade/slide in on scroll (GSAP ScrollTrigger, client only)
 * v-sparkle  → tiny gold 4-point stars burst on hover / tap
 * Both are no-ops on the server and with prefers-reduced-motion.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const reduced = () => import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let gsapP: Promise<typeof import('gsap')> | null = null
  const loadGsap = () => {
    gsapP ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([g, st]) => {
      g.gsap.registerPlugin(st.ScrollTrigger)
      return g
    })
    return gsapP
  }

  const reveal: Directive<HTMLElement, { delay?: number, y?: number, stagger?: boolean } | undefined> = {
    getSSRProps: () => ({}),
    mounted(el, binding) {
      if (reduced()) return
      const opts = binding.value || {}
      const targets = opts.stagger ? Array.from(el.children) as HTMLElement[] : [el]
      targets.forEach(t => (t.style.opacity = '0'))
      loadGsap().then(({ gsap }) => {
        gsap.fromTo(targets, { opacity: 0, y: opts.y ?? 28 }, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          delay: opts.delay ?? 0,
          stagger: opts.stagger ? 0.08 : 0,
          clearProps: 'transform',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })
    },
  }

  const STAR = '<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><path d="M12 0C12.6 7.2 16.8 11.4 24 12C16.8 12.6 12.6 16.8 12 24C11.4 16.8 7.2 12.6 0 12C7.2 11.4 11.4 7.2 12 0Z" fill="currentColor"/></svg>'
  const burst = (el: HTMLElement, e?: PointerEvent) => {
    if (reduced()) return
    const rect = el.getBoundingClientRect()
    const n = 4
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span')
      s.className = 'sparkle-star'
      s.innerHTML = STAR
      const size = 7 + Math.random() * 8
      const x = e ? e.clientX - rect.left : rect.width * Math.random()
      const y = e ? e.clientY - rect.top : rect.height * Math.random()
      s.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;--dx:${(Math.random() - 0.5) * 60}px;--dy:${-20 - Math.random() * 30}px;animation-delay:${i * 40}ms`
      el.appendChild(s)
      setTimeout(() => s.remove(), 900)
    }
  }
  const sparkle: Directive<HTMLElement & { _sp?: () => void, _spc?: (e: PointerEvent) => void }> = {
    getSSRProps: () => ({}),
    mounted(el) {
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative'
      el._sp = () => burst(el)
      el._spc = (e: PointerEvent) => burst(el, e)
      el.addEventListener('pointerenter', el._sp)
      el.addEventListener('pointerdown', el._spc)
    },
    unmounted(el) {
      el._sp && el.removeEventListener('pointerenter', el._sp)
      el._spc && el.removeEventListener('pointerdown', el._spc)
    },
  }

  nuxtApp.vueApp.directive('reveal', reveal)
  nuxtApp.vueApp.directive('sparkle', sparkle)

  if (import.meta.client) {
    // keep ScrollTrigger positions right after page transitions
    nuxtApp.hook('page:transition:finish', () => {
      loadGsap().then(() => import('gsap/ScrollTrigger')).then(({ ScrollTrigger }) => ScrollTrigger.refresh())
    })
  }
})
