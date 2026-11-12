<script setup lang="ts">
import { getStone } from '~/data/stones'

const props = defineProps<{ options: string[], label: string }>()
const model = defineModel<string>({ required: true })
const { l } = useL()
const items = computed(() => props.options.map(s => getStone(s)!).filter(Boolean))
</script>

<template>
  <fieldset>
    <legend class="text-sm font-medium text-ink">{{ label }}: <span class="font-normal text-ink-soft">{{ l(getStone(model)?.name) }}</span></legend>
    <div class="mt-3 flex flex-wrap gap-2.5">
      <label v-for="s in items" :key="s.slug" class="relative cursor-pointer" :title="l(s.name)">
        <input v-model="model" type="radio" :value="s.slug" class="peer sr-only" :name="`stone-${label}`">
        <span class="sr-only">{{ l(s.name) }}</span>
        <span
          class="block h-10 w-10 rounded-full ring-2 ring-transparent ring-offset-2 ring-offset-cream transition peer-checked:ring-burgundy peer-focus-visible:ring-burgundy/60"
          :style="{ background: `radial-gradient(circle at 35% 30%, ${s.highlight}, ${s.hex} 55%, #00000055)` }"
        />
      </label>
    </div>
  </fieldset>
</template>
