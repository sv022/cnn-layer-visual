<script setup lang="ts">
import { computed } from 'vue'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const props = defineProps<{
  row: number
  col: number
  value: number
}>()

const emit = defineEmits<{
  (e: 'update', value: number): void
}>()

const STEP = 0.01
const STEP_FAST = 0.1

const sliderValue = computed({
  get: () => [props.value],
  set: (v) => emit('update', clamp(v[0]!)),
})

function clamp(value: number): number {
  return Math.min(1, Math.max(0, Math.round(value * 100) / 100))
}

function nudge(delta: number) {
  emit('update', clamp(props.value + delta))
}
</script>

<template>
  <div class="w-56 rounded-md border border-border bg-card p-3 shadow-md">
    <Label class="mb-2 block text-center text-lg font-semibold">
      {{ value.toFixed(2) }}
    </Label>

    <div class="flex items-center gap-2">
      <Button variant="ghost" size="icon" @click="nudge(-STEP)" @click.shift="nudge(-STEP_FAST)">
        −
      </Button>
      <Slider v-model="sliderValue" :min="0" :max="1" :step="0.01" class="flex-1" />
      <Button variant="ghost" size="icon" @click="nudge(STEP)" @click.shift="nudge(STEP_FAST)">
        +
      </Button>
    </div>

    <p class="mt-2 text-center text-xs text-muted-foreground">({{ row }}, {{ col }})</p>
  </div>
</template>
