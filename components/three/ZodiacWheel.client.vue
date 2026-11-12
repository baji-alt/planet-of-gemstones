<script setup lang="ts">
/**
 * Interactive 3D zodiac wheel. Clicking a sign rotates the wheel so the sign
 * lands at the top; the parent reveals that sign's bracelet. Keyboard users
 * use the accessible sign list rendered by the parent.
 */
import * as THREE from 'three'
import { createStage, gradientBackground, type Stage } from '~/lib/three/stage'
import { brilliantGeometry, buildStarfield, DIAMOND, gemMaterial, metalMaterial } from '~/lib/three/jewelry'
import { zodiacSigns } from '~/data/zodiac'

const props = defineProps<{ selected: number, reducedMotion?: boolean }>()
const emit = defineEmits<{ select: [index: number], ready: [] }>()
const el = ref<HTMLDivElement>()
let stage: Stage | null = null
let wheel: THREE.Group | null = null
let targetRot = 0
const segMats: THREE.MeshBasicMaterial[] = []
const glyphMats: THREE.MeshBasicMaterial[] = []
let hovered = -1
const cleanups: (() => void)[] = []

const STEP = Math.PI / 6
const angleOf = (i: number) => Math.PI / 2 - i * STEP

function glyphTexture(d: string, label: string) {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 256
  const g = c.getContext('2d')!
  g.save()
  g.translate(78, 36)
  g.scale(4.2, 4.2)
  g.strokeStyle = '#F1E2B8'
  g.lineWidth = 1.5
  g.lineCap = 'round'
  g.lineJoin = 'round'
  g.stroke(new Path2D(d))
  g.restore()
  g.fillStyle = '#E6CB86'
  g.font = '500 30px "Cormorant Garamond", Georgia, serif'
  g.textAlign = 'center'
  g.fillText(label.toUpperCase(), 128, 200)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

function setTarget(i: number, snap = false) {
  // shortest path to bring sign i to the top
  const desired = i * STEP
  const cur = targetRot
  let delta = (desired - cur) % (Math.PI * 2)
  if (delta > Math.PI) delta -= Math.PI * 2
  if (delta < -Math.PI) delta += Math.PI * 2
  targetRot = cur + delta
  if (snap && wheel) wheel.rotation.z = targetRot
  paint()
  stage?.invalidate()
}

function paint() {
  segMats.forEach((m, i) => {
    m.opacity = i === props.selected ? 0.32 : i === hovered ? 0.14 : 0.0
  })
  glyphMats.forEach((m, i) => {
    m.opacity = i === props.selected ? 1 : 0.62
  })
}

onMounted(() => {
  if (!el.value) return
  const reduced = !!props.reducedMotion
  stage = createStage({ container: el.value, alpha: false, bloom: { strength: 0.3, radius: 0.35, threshold: 0.92 }, cameraZ: 10.6, envIntensity: 0.6, fov: 34, onDemand: true })
  const { scene, camera } = stage
  scene.background = gradientBackground('#3A1022', '#0E0E12', '#1C0D15')
  scene.add(buildStarfield(500, 16, 5))

  const tilt = new THREE.Group()
  tilt.rotation.x = -0.32
  scene.add(tilt)
  wheel = new THREE.Group()
  tilt.add(wheel)

  const R0 = 1.75
  const R1 = 3.05
  const gold = metalMaterial('gold')
  const disc = new THREE.Mesh(
    new THREE.RingGeometry(R0, R1, 128, 1),
    new THREE.MeshPhysicalMaterial({ color: '#6A1934', roughness: 0.55, metalness: 0, clearcoat: 0.3, clearcoatRoughness: 0.4, side: THREE.DoubleSide }),
  )
  wheel.add(disc)
  for (const r of [R0, R1, R1 + 0.14]) {
    const rim = new THREE.Mesh(new THREE.TorusGeometry(r, r === R1 + 0.14 ? 0.012 : 0.03, 10, 200), gold)
    wheel.add(rim)
  }
  // tick marks on the outer ring
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2
    const tick = new THREE.Mesh(new THREE.BoxGeometry(0.012, i % 6 === 0 ? 0.14 : 0.07, 0.01), gold)
    const rr = R1 + 0.07
    tick.position.set(Math.cos(a) * rr, Math.sin(a) * rr, 0.01)
    tick.rotation.z = a - Math.PI / 2
    wheel.add(tick)
  }

  zodiacSigns.forEach((s, i) => {
    const a = angleOf(i)
    // divider
    const div = new THREE.Mesh(new THREE.BoxGeometry(R1 - R0, 0.012, 0.012), gold)
    const da = a + STEP / 2
    div.position.set(Math.cos(da) * (R0 + R1) / 2, Math.sin(da) * (R0 + R1) / 2, 0.01)
    div.rotation.z = da
    wheel!.add(div)
    // clickable / highlight segment
    const segMat = new THREE.MeshBasicMaterial({ color: '#E6CB86', transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide })
    const seg = new THREE.Mesh(new THREE.RingGeometry(R0, R1, 12, 1, a - STEP / 2, STEP), segMat)
    seg.position.z = 0.005
    seg.userData.index = i
    wheel!.add(seg)
    segMats.push(segMat)
    // glyph + name, upright when the sign is at the top
    const gm = new THREE.MeshBasicMaterial({ map: glyphTexture(s.glyph, s.name.en), transparent: true, depthWrite: false, toneMapped: false })
    const glyph = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.95), gm)
    const gr = (R0 + R1) / 2
    glyph.position.set(Math.cos(a) * gr, Math.sin(a) * gr, 0.02)
    glyph.rotation.z = a - Math.PI / 2
    glyph.raycast = () => {}
    wheel!.add(glyph)
    glyphMats.push(gm)
  })

  // centre: inner dark disc + gem
  const inner = new THREE.Mesh(new THREE.CircleGeometry(R0 - 0.02, 96), new THREE.MeshStandardMaterial({ color: '#121016', roughness: 0.8 }))
  inner.position.z = -0.01
  wheel.add(inner)
  const gem = new THREE.Mesh(brilliantGeometry(), gemMaterial(DIAMOND))
  gem.scale.setScalar(0.8)
  gem.rotation.x = 0.9
  gem.position.z = 0.6
  tilt.add(gem)
  const gemLight = new THREE.PointLight('#FFF1DA', 30, 12)
  gemLight.position.set(1.5, 2, 3.5)
  const gemFill = new THREE.PointLight('#FFFFFF', 18, 12)
  gemFill.position.set(-2, -0.5, 3)
  tilt.add(gemLight, gemFill)
  // pointer marker at the top
  const marker = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.24, 4), gold)
  marker.position.set(0, R1 + 0.42, 0.05)
  marker.rotation.z = Math.PI
  tilt.add(marker)

  setTarget(props.selected, true)

  // picking
  const ray = new THREE.Raycaster()
  const ndc = new THREE.Vector2()
  const pick = (e: PointerEvent) => {
    const r = stage!.canvas.getBoundingClientRect()
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    ray.setFromCamera(ndc, camera)
    const hit = ray.intersectObjects(wheel!.children, false).find(h => h.object.userData.index !== undefined)
    return hit ? (hit.object.userData.index as number) : -1
  }
  let downAt = 0
  const onDown = () => (downAt = performance.now())
  const onUp = (e: PointerEvent) => {
    if (performance.now() - downAt > 400) return
    const i = pick(e)
    if (i >= 0) emit('select', i)
  }
  const onMove = (e: PointerEvent) => {
    const i = pick(e)
    if (i !== hovered) {
      hovered = i
      stage!.canvas.style.cursor = i >= 0 ? 'pointer' : 'default'
      paint()
      stage!.invalidate()
    }
  }
  stage.canvas.addEventListener('pointerdown', onDown)
  stage.canvas.addEventListener('pointerup', onUp)
  stage.canvas.addEventListener('pointermove', onMove)
  cleanups.push(() => {
    stage?.canvas.removeEventListener('pointerdown', onDown)
    stage?.canvas.removeEventListener('pointerup', onUp)
    stage?.canvas.removeEventListener('pointermove', onMove)
  })

  let first = true
  let idleSpin = 0
  stage.onFrame((t, dt) => {
    if (!wheel) return
    const diff = targetRot - wheel.rotation.z
    if (reduced) wheel.rotation.z = targetRot
    else wheel.rotation.z += diff * Math.min(1, dt * 4.5)
    if (!reduced) {
      idleSpin += dt
      gem.rotation.y = idleSpin * 0.5
      tilt.rotation.y = Math.sin(t * 0.4) * 0.05
    }
    // keep animating while settling or for the idle gem spin
    if (!reduced) stage!.invalidate()
    if (first) {
      first = false
      requestAnimationFrame(() => emit('ready'))
    }
  })
  stage.invalidate()
})

watch(() => props.selected, i => setTarget(i))

onBeforeUnmount(() => {
  cleanups.forEach(f => f())
  stage?.dispose()
  stage = null
})
</script>

<template>
  <div ref="el" class="h-full w-full" aria-hidden="true" />
</template>
