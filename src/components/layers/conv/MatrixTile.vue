<script setup lang="ts">
import { computed } from 'vue'
import type { Matrix2D } from '@/types/tensor'
import MatrixCanvas from '@/components/matrix/MatrixCanvas.vue'

const props = withDefaults(
  defineProps<{
    matrix: Matrix2D
    isActive?: boolean
    isPreNormalized?: boolean
    accentColorVar?: string
    projectionWindow?: { row: number; col: number; size: number } | null
  }>(),
  {
    isActive: false,
    isPreNormalized: false,
    accentColorVar: 'var(--color-convolution)',
    projectionWindow: null
  },
)

const emit = defineEmits<{
  (e: 'select'): void
  (e: 'hover', hovered: boolean): void
}>()

const borderStyle = computed(() =>
  props.isActive
    ? {
        borderColor: props.accentColorVar,
        boxShadow: `0 0 0 2px color-mix(in srgb, ${props.accentColorVar} 25%, transparent)`,
      }
    : {},
)
</script>

<template>
  <div
    class="aspect-square cursor-pointer overflow-hidden rounded-md border border-border transition-colors"
    :style="borderStyle"
    @click="emit('select')"
    @mouseenter="emit('hover', true)"
    @mouseleave="emit('hover', false)"
  >
    <MatrixCanvas
    :matrix="matrix"
    :is-pre-normalized="isPreNormalized"
    :highlight-window="projectionWindow"
    />
  </div>
</template>
