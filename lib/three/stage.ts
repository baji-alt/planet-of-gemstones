import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

export interface StageOptions {
  container: HTMLElement
  /** transparent canvas (page background shows through) */
  alpha?: boolean
  bloom?: false | { strength?: number, radius?: number, threshold?: number }
  fov?: number
  cameraZ?: number
  /** optional .hdr url; procedural studio light otherwise */
  hdri?: string
  /** warm tint for the procedural environment */
  envIntensity?: number
  maxDpr?: number
  /** render only when something changed (reduced-motion / static viewers) */
  onDemand?: boolean
}

export interface Stage {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  /** called every frame with (elapsed seconds, delta seconds) */
  onFrame: (cb: (t: number, dt: number) => void) => void
  /** request one frame when in on-demand mode */
  invalidate: () => void
  dispose: () => void
  canvas: HTMLCanvasElement
}

/**
 * Creates a renderer + scene + camera wired to a container with:
 * resize handling, off-screen / hidden-tab pausing, HDR or procedural PBR
 * environment, optional bloom and adaptive pixel ratio aiming for 60fps.
 */
export function createStage(opts: StageOptions): Stage {
  const { container } = opts
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: opts.alpha ?? true,
    powerPreference: 'high-performance',
    stencil: false,
  })
  const maxDpr = opts.maxDpr ?? 1.75
  let dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
  renderer.setPixelRatio(dpr)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.setClearColor(0x000000, 0)
  const canvas = renderer.domElement
  canvas.style.display = 'block'
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.style.touchAction = 'pan-y'
  container.appendChild(canvas)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(opts.fov ?? 35, 1, 0.1, 100)
  camera.position.set(0, 0, opts.cameraZ ?? 6)

  // --- Environment (image based lighting) ---------------------------------
  const pmrem = new THREE.PMREMGenerator(renderer)
  const studio = studioScene()
  const envRT = pmrem.fromScene(studio, 0.02)
  scene.environment = envRT.texture
  scene.environmentIntensity = opts.envIntensity ?? 1
  studio.traverse(o => (o as THREE.Mesh).geometry?.dispose?.())
  let hdrRT: THREE.WebGLRenderTarget | null = null
  if (opts.hdri) {
    import('three/examples/jsm/loaders/HDRLoader.js').then(({ HDRLoader }) => {
      new HDRLoader().load(opts.hdri!, (tex) => {
        if (disposed) return tex.dispose()
        tex.mapping = THREE.EquirectangularReflectionMapping
        hdrRT = pmrem.fromEquirectangular(tex)
        scene.environment = hdrRT.texture
        tex.dispose()
        invalidate()
      })
    }).catch(() => { /* keep procedural env */ })
  }

  // --- Post-processing -----------------------------------------------------
  let composer: EffectComposer | null = null
  let bloomPass: UnrealBloomPass | null = null
  if (opts.bloom) {
    composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    bloomPass = new UnrealBloomPass(
      new THREE.Vector2(256, 256),
      opts.bloom.strength ?? 0.55,
      opts.bloom.radius ?? 0.35,
      opts.bloom.threshold ?? 0.82,
    )
    composer.addPass(bloomPass)
    composer.addPass(new OutputPass())
  }

  // --- Size ---------------------------------------------------------------
  const resize = () => {
    const w = Math.max(1, container.clientWidth)
    const h = Math.max(1, container.clientHeight)
    renderer.setSize(w, h, false)
    composer?.setSize(w, h)
    composer?.setPixelRatio(dpr)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    invalidate()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(container)

  // --- Loop ---------------------------------------------------------------
  const callbacks: ((t: number, dt: number) => void)[] = []
  const timer = new THREE.Timer()
  let visible = true
  let pageVisible = !document.hidden
  let raf = 0
  let needsRender = true
  let disposed = false

  // adaptive quality: sample frame times, drop DPR / bloom when slow
  let frames = 0
  let acc = 0
  const adapt = (dt: number) => {
    frames++
    acc += dt
    if (acc < 1.5) return
    const fps = frames / acc
    frames = 0
    acc = 0
    if (fps < 45 && dpr > 1) {
      dpr = Math.max(1, dpr - 0.25)
      renderer.setPixelRatio(dpr)
      resize()
    }
    else if (fps < 40 && bloomPass && bloomPass.enabled) {
      bloomPass.enabled = false
    }
  }

  const render = () => {
    if (composer && bloomPass?.enabled) composer.render()
    else renderer.render(scene, camera)
  }

  const tick = () => {
    raf = 0
    if (disposed || !visible || !pageVisible) return
    timer.update()
    const dt = Math.min(timer.getDelta(), 0.1)
    const t = timer.getElapsed()
    if (!opts.onDemand || needsRender) {
      needsRender = false // callbacks may invalidate() again to keep animating
      for (const cb of callbacks) cb(t, dt)
      render()
      if (!opts.onDemand) adapt(dt)
    }
    if (!opts.onDemand) raf = requestAnimationFrame(tick)
  }

  const start = () => {
    if (!raf && !disposed) {
      timer.update() // swallow the time spent paused
      raf = requestAnimationFrame(tick)
    }
  }

  function invalidate() {
    needsRender = true
    if (opts.onDemand) start()
  }

  const io = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting
    if (visible) start()
  }, { rootMargin: '100px' })
  io.observe(container)

  const onVis = () => {
    pageVisible = !document.hidden
    if (pageVisible) start()
  }
  document.addEventListener('visibilitychange', onVis)

  resize()
  start()

  return {
    renderer,
    scene,
    camera,
    canvas,
    onFrame: cb => callbacks.push(cb),
    invalidate,
    dispose() {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      scene.traverse((o) => {
        const m = o as THREE.Mesh
        m.geometry?.dispose?.()
        const mat = m.material as THREE.Material | THREE.Material[] | undefined
        if (Array.isArray(mat)) mat.forEach(x => x.dispose())
        else mat?.dispose?.()
      })
      envRT.dispose()
      hdrRT?.dispose()
      pmrem.dispose()
      composer?.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      canvas.remove()
    },
  }
}

export { rng, hashString } from '../random'

/**
 * Procedural jewellery studio used for image based lighting: a near-black
 * room with bright softbox strips (white, warm gold, a hint of blush). The
 * contrast is what makes cut stones flash and metal read as polished.
 */
function studioScene() {
  const scene = new THREE.Scene()
  const room = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshBasicMaterial({ color: '#0b0a0d', side: THREE.BackSide }))
  scene.add(room)
  const box = (w: number, h: number, color: string, intensity: number, pos: [number, number, number]) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide }))
    m.position.set(...pos)
    m.lookAt(0, 0, 0)
    scene.add(m)
  }
  box(8, 1.2, '#ffffff', 9, [0, 9, 2]) // overhead strip
  box(1.2, 7, '#fff3df', 6, [-9, 1, 3]) // warm key
  box(1.2, 7, '#ffffff', 5, [9, 0, -2]) // rim
  box(5, 1, '#f1c27a', 3.5, [3, -6, 7]) // gold bounce
  box(3, 3, '#f3c9d6', 2.2, [-5, -3, -8]) // blush fill
  box(2, 2, '#ffffff', 12, [4, 5, 8]) // small hot spot for sparkle
  return scene
}

/**
 * Radial gradient used as scene.background. Transmission (glass/gem) samples
 * the rendered background, so an opaque gradient gives the refraction real
 * colour instead of black.
 */
export function gradientBackground(inner: string, outer: string, mid?: string, cx = 0.5, cy = 0.45, radius = 0.75) {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(cx * 256, cy * 256, 4, cx * 256, cy * 256, radius * 256)
  grad.addColorStop(0, inner)
  if (mid) grad.addColorStop(0.45, mid)
  grad.addColorStop(1, outer)
  g.fillStyle = grad
  g.fillRect(0, 0, 256, 256)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}
