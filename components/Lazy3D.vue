<script setup lang="ts">
/**
 * Mounts heavy WebGL content only when: the device can handle it, the
 * element is near the viewport and the browser is idle. Until then (and
 * forever on low-end devices) the #fallback slot is shown. The fallback
 * stays underneath and fades out once the 3D slot calls `ready()`.
 */
const props = withDefaults(defineProps<{ eager?: boolean, idleTimeout?: number }>(), { idleTimeout: 2500 })
const { can3D } = use3D()
const root = ref<HTMLElement>()
const near = ref(false)
const idle = ref(false)
const isReady = ref(false)
const failed = ref(false)

onMounted(() => {
  const io = new IntersectionObserver(([e]) => {
    if (e?.isIntersecting) {
      near.value = true
      io.disconnect()
    }
  }, { rootMargin: '300px' })
  if (root.value) io.observe(root.value)
  const go = () => (idle.value = true)
  const whenIdle = () => ('requestIdleCallback' in window
    ? (window as any).requestIdleCallback(go, { timeout: props.idleTimeout })
    : setTimeout(go, 300))
  if (props.eager) go()
  else if (document.readyState === 'complete') whenIdle()
  else window.addEventListener('load', whenIdle, { once: true })
})

const show3D = computed(() => can3D.value === true && near.value && idle.value && !failed.value)
const ready = () => (isReady.value = true)
onErrorCaptured((err) => {
  console.warn('[Lazy3D] falling back to static art:', err)
  failed.value = true
  return false
})
</script>

<template>
  <div ref="root" class="relative h-full w-full">
    <div class="absolute inset-0 transition-opacity duration-700" :class="isReady ? 'pointer-events-none opacity-0' : 'opacity-100'">
      <slot name="fallback" />
    </div>
    <div v-if="show3D" class="absolute inset-0 transition-opacity duration-700" :class="isReady ? 'opacity-100' : 'opacity-0'">
      <slot :ready="ready" />
    </div>
  </div>
</template>
