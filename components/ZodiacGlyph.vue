<script setup lang="ts">
defineProps<{ d: string, size?: number | string, strokeWidth?: number }>()
</script>

<template>
  <svg :width="size ?? 24" :height="size ?? 24" viewBox="0 0 24 24" fill="none" stroke="currentColor" :stroke-width="strokeWidth ?? 1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path :d="d" />
  </svg>
</template>
