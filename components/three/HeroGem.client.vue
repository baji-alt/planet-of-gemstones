<script setup lang="ts">
/**
 * Hero: slowly rotating brilliant-cut gem (transmission, IOR 2.4, dispersion,
 * iridescence) inside a starfield with a gold orbit + comet that echoes the
 * logo swoosh. Reacts to pointer and device tilt; bloom adds the sparkle.
 */
import * as THREE from 'three'
import { createStage, gradientBackground, type Stage } from '~/lib/three/stage'
import { brilliantGeometry, buildStarfield, DIAMOND, gemMaterial, starTexture } from '~/lib/three/jewelry'

const props = defineProps<{ reducedMotion?: boolean }>()
const emit = defineEmits<{ ready: [] }>()
const el = ref<HTMLDivElement>()
const config = useRuntimeConfig()
let stage: Stage | null = null
const cleanups: (() => void)[] = []

onMounted(() => {
  if (!el.value) return
  const reduced = !!props.reducedMotion
  stage = createStage({
    container: el.value,
    alpha: false,
    bloom: { strength: 0.5, radius: 0.45, threshold: 0.8 },
    cameraZ: 8,
    fov: 32,
    hdri: (config.public.hdriUrl as string) || undefined,
    envIntensity: 2.8,
    onDemand: reduced,
  })
  const { scene, camera } = stage
  const narrow = () => (el.value?.clientWidth ?? 800) < 640
  // glow sits right behind the gem so the transmission refracts warm colour
  const setBg = () => {
    const old = scene.background as THREE.Texture | null
    scene.background = narrow()
      ? gradientBackground('#9A3358', '#0E0E12', '#3A1226', 0.5, 0.24, 0.5)
      : gradientBackground('#9A3358', '#0E0E12', '#3A1226', 0.7, 0.5, 0.55)
    old?.dispose()
  }
  setBg()

  // key lights give the facets crisp specular flashes
  const warm = new THREE.PointLight('#FFE7C2', 60, 30)
  warm.position.set(3, 4, 5)
  const cool = new THREE.PointLight('#FFFFFF', 45, 30)
  cool.position.set(-4, 1.5, 4)
  const blush = new THREE.PointLight('#F3B6C8', 12, 30)
  blush.position.set(0, -4, 3)
  scene.add(warm, cool, blush)

  // --- the gem ---
  const gemGroup = new THREE.Group()
  scene.add(gemGroup)
  const gemMat = gemMaterial(DIAMOND)
  gemMat.metalness = 0.2 // a little extra mirror so facets flash against the night sky
  gemMat.transmission = 0.88
  const gem = new THREE.Mesh(brilliantGeometry(), gemMat)
  gem.scale.setScalar(0.95)
  gemGroup.add(gem)
  gemGroup.rotation.x = 0.42

  // sparkles riding on facet corners
  const starTex = starTexture()
  const sparkles: THREE.Sprite[] = []
  const corners = [[0.56, 0.36, 0], [-0.4, 0.36, 0.4], [1, 0.02, 0.1], [-0.9, 0.02, -0.4], [0.3, 0.36, -0.47], [0.1, -0.5, 0.45]]
  for (const [x, y, z] of corners) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: starTex, color: '#FFF4DC', blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }))
    s.position.set(x!, y!, z!)
    s.scale.setScalar(0.001)
    gem.add(s)
    sparkles.push(s)
  }

  // --- orbit + comet (logo swoosh) ---
  const orbitGroup = new THREE.Group()
  orbitGroup.rotation.set(1.22, 0.18, -0.32)
  scene.add(orbitGroup)
  const orbitR = 2.1
  const orbit = new THREE.Mesh(
    new THREE.TorusGeometry(orbitR, 0.007, 8, 256),
    new THREE.MeshBasicMaterial({ color: new THREE.Color('#C9A24B'), transparent: true, opacity: 0.55 }),
  )
  orbitGroup.add(orbit)
  const trailN = 60
  const trailPos = new Float32Array(trailN * 3)
  const trailCol = new Float32Array(trailN * 3)
  const trailGeo = new THREE.BufferGeometry()
  trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3))
  trailGeo.setAttribute('color', new THREE.BufferAttribute(trailCol, 3))
  const trail = new THREE.Points(trailGeo, new THREE.PointsMaterial({ size: 0.12, map: starTex, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
  orbitGroup.add(trail)
  const gold = new THREE.Color('#F1E2B8')
  const setComet = (phase: number) => {
    for (let i = 0; i < trailN; i++) {
      const a = phase - i * 0.012
      trailPos.set([Math.cos(a) * orbitR, Math.sin(a) * orbitR, 0], i * 3)
      const k = Math.pow(1 - i / trailN, 2.2)
      trailCol.set([gold.r * k * 1.6, gold.g * k * 1.6, gold.b * k * 1.6], i * 3)
    }
    trailGeo.attributes.position!.needsUpdate = true
    trailGeo.attributes.color!.needsUpdate = true
  }
  setComet(2.2)

  const stars = buildStarfield(narrow() ? 500 : 900, 14)
  scene.add(stars)

  // --- layout: gem sits right on desktop, centred higher on mobile ---
  const layout = () => {
    const n = narrow()
    const x = n ? 0 : 1.55
    const y = n ? 1.55 : 0.1
    gemGroup.position.set(x, y, 0)
    orbitGroup.position.set(x, y, 0)
    const s = n ? 0.62 : 1
    gemGroup.scale.setScalar(s)
    orbitGroup.scale.setScalar(s)
    setBg()
    stage?.invalidate()
  }
  layout()
  const ro = new ResizeObserver(layout)
  ro.observe(el.value)
  cleanups.push(() => ro.disconnect())

  // --- input: pointer + gyroscope parallax ---
  const target = new THREE.Vector2()
  const cur = new THREE.Vector2()
  if (!reduced) {
    const onMove = (e: PointerEvent) => {
      target.set((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1)
    }
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return
      target.set(THREE.MathUtils.clamp(e.gamma / 30, -1, 1), THREE.MathUtils.clamp((e.beta - 45) / 30, -1, 1))
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('deviceorientation', onTilt, { passive: true })
    cleanups.push(() => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('deviceorientation', onTilt)
    })
  }

  let first = true
  stage.onFrame((t, dt) => {
    if (!reduced) {
      cur.lerp(target, Math.min(1, dt * 2.5))
      gem.rotation.y += dt * 0.28
      gemGroup.rotation.x = 0.42 + cur.y * 0.22
      gemGroup.rotation.z = -cur.x * 0.12
      gemGroup.position.y += (Math.sin(t * 0.8) * 0.06 + (narrow() ? 1.55 : 0.1) - gemGroup.position.y) * 0.05
      camera.position.x = cur.x * 0.35
      camera.position.y = -cur.y * 0.25
      camera.lookAt(0, 0, 0)
      stars.rotation.y = t * 0.008
      setComet(2.2 + t * 0.35)
      sparkles.forEach((s, i) => {
        const k = Math.max(0, Math.sin(t * 1.6 + i * 1.9)) ** 8
        s.scale.setScalar(0.05 + k * 0.5)
        s.material.opacity = k
      })
    }
    else {
      gem.rotation.y = 0.35
      sparkles.forEach((s, i) => {
        s.scale.setScalar(i % 2 ? 0.35 : 0.2)
      })
    }
    if (first) {
      first = false
      requestAnimationFrame(() => emit('ready'))
    }
  })
  stage.invalidate()
})

onBeforeUnmount(() => {
  cleanups.forEach(f => f())
  stage?.dispose()
  stage = null
})
</script>

<template>
  <div ref="el" class="h-full w-full" aria-hidden="true" />
</template>
