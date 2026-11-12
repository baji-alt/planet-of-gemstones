<script setup lang="ts">
/**
 * Interactive 3D jewel viewer. Builds the piece procedurally from product
 * data (or loads a Draco GLB when `model` is set). Drag to rotate,
 * scroll/pinch to zoom; metal and stone can be swapped live.
 */
import * as THREE from 'three'
import type { OrbitControls as OC } from 'three/examples/jsm/controls/OrbitControls.js'
import { createStage, gradientBackground, type Stage } from '~/lib/three/stage'
import { buildJewel, loadDracoGLB, type Jewel, type JewelSpec } from '~/lib/three/jewelry'
import type { Metal, ProductType, Version } from '~/data/types'

const props = withDefaults(defineProps<{
  type: ProductType
  stones: string[]
  metal: Metal
  ringStyle?: 'solitaire' | 'signet'
  version?: Version
  model?: string
  interactive?: boolean
  autoRotate?: boolean
  bloom?: boolean
  reducedMotion?: boolean
  background?: [string, string]
}>(), { interactive: true, autoRotate: true, bloom: true, background: () => ['#F8F1EC', '#E4D0C6'] })

const emit = defineEmits<{ ready: [] }>()
const el = ref<HTMLDivElement>()
let stage: Stage | null = null
let controls: OC | null = null
let jewel: Jewel | null = null
let holder: THREE.Group | null = null
let disposed = false

const spec = (): JewelSpec => ({
  type: props.type,
  metal: props.metal,
  stones: props.stones.map(stoneLook),
  ringStyle: props.ringStyle,
  version: props.version,
  seed: 7,
})

const framing: Record<string, { z: number, rx: number, y: number }> = {
  ring: { z: 8.2, rx: 0.42, y: -0.4 },
  bracelet: { z: 7.4, rx: -1.05, y: 0.15 }, // lies flat, spins like on a turntable
  pendant: { z: 5.8, rx: 0.1, y: 0 },
  necklace: { z: 5.8, rx: 0.1, y: 0 },
  beads: { z: 7.2, rx: -1.05, y: 0.15 },
  stone: { z: 5.6, rx: 0.4, y: 0 },
}

function build() {
  if (!stage || !holder) return
  if (jewel) {
    holder.remove(jewel.group)
    jewel.group.traverse((o) => {
      const m = o as THREE.Mesh
      m.geometry?.dispose()
      ;(m.material as THREE.Material | undefined)?.dispose?.()
    })
  }
  jewel = buildJewel(spec())
  const f = framing[props.type] ?? framing.ring!
  jewel.group.rotation.x = f.rx
  jewel.group.position.y = f.y
  holder.add(jewel.group)
  // portrait containers (mobile) need the camera further back to fit the piece
  const aspect = el.value ? el.value.clientWidth / Math.max(1, el.value.clientHeight) : 1
  stage.camera.position.set(0, 0.4, f.z * (aspect < 0.95 ? 1.22 : 1))
  stage.camera.lookAt(0, 0, 0)
  controls?.update()
  stage.invalidate()
}

onMounted(async () => {
  if (!el.value) return
  const reduced = !!props.reducedMotion
  stage = createStage({
    container: el.value,
    alpha: false,
    bloom: props.bloom ? { strength: 0.35, radius: 0.3, threshold: 0.9 } : false,
    cameraZ: 6,
    fov: 30,
    onDemand: reduced || !props.autoRotate,
    maxDpr: props.interactive ? 2 : 1.5,
  })
  stage.scene.background = gradientBackground(props.background[0], props.background[1])
  // warm key light for metal highlights
  const key = new THREE.DirectionalLight('#FFF1DC', 1.4)
  key.position.set(3, 5, 4)
  stage.scene.add(key, new THREE.AmbientLight('#ffffff', 0.25))

  holder = new THREE.Group()
  stage.scene.add(holder)

  if (props.interactive) {
    const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js')
    if (disposed || !stage) return
    controls = new OrbitControls(stage.camera, stage.canvas)
    controls.enablePan = false
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.minDistance = 3.2
    controls.maxDistance = 10
    controls.autoRotate = props.autoRotate && !reduced
    controls.autoRotateSpeed = 1.6
    stage.canvas.style.touchAction = 'none'
    stage.canvas.style.cursor = 'grab'
    controls.addEventListener('change', () => stage?.invalidate())
    controls.addEventListener('start', () => {
      if (controls) controls.autoRotate = false
      stage!.canvas.style.cursor = 'grabbing'
    })
    controls.addEventListener('end', () => (stage!.canvas.style.cursor = 'grab'))
  }

  if (props.model) {
    try {
      const scene = await loadDracoGLB(props.model)
      if (disposed) return
      holder.add(scene)
      stage.invalidate()
    }
    catch { build() }
  }
  else {
    build()
  }

  let first = true
  stage.onFrame((_t, dt) => {
    if (controls) controls.update()
    else if (props.autoRotate && !reduced && holder) holder.rotation.y += dt * 0.6
    if (first) {
      first = false
      requestAnimationFrame(() => emit('ready'))
    }
  })
  stage.invalidate()
})

watch(() => props.metal, m => (jewel?.setMetal(m), stage?.invalidate()))
watch(() => props.stones.join(), () => {
  if (!jewel) return
  if (props.type === 'bracelet') build() // multi-stone: rebuild colours per charm
  else jewel.setStone(stoneLook(props.stones[0]!))
  stage?.invalidate()
})
watch(() => [props.type, props.version, props.ringStyle], () => build())

onBeforeUnmount(() => {
  disposed = true
  controls?.dispose()
  stage?.dispose()
  stage = null
})
</script>

<template>
  <div ref="el" class="h-full w-full" />
</template>
