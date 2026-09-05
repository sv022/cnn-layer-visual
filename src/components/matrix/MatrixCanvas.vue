<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import type { Matrix2D } from '@/types/tensor'
import {
  grayscaleToRgb,
  contrastTextColor,
  normalizeMatrix,
  findMatrixRange,
} from '@/utils/colorScale'

const props = withDefaults(
  defineProps<{
    matrix: Matrix2D
    isPreNormalized?: boolean
    showValues?: boolean
    showGrid?: boolean
    highlightWindow?: { row: number; col: number; size: number } | null
  }>(),
  {
    isPreNormalized: false,
    showValues: false,
    showGrid: false,
    highlightWindow: null,
  },
)

const emit = defineEmits<{
  (e: 'cell-click', payload: { row: number; col: number; value: number }): void
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let resizeObserver: ResizeObserver | null = null

const displaySize = ref({ width: 0, height: 0 })

const rows = computed(() => props.matrix.length)
const cols = computed(() => props.matrix[0]?.length ?? 0)

const displayMatrix = computed<Matrix2D>(() => {
  if (props.isPreNormalized) return props.matrix
  return normalizeMatrix(props.matrix, findMatrixRange(props.matrix))
})

function computeCellBounds(count: number, totalPx: number): number[] {
  // oxlint-disable-next-line unicorn/no-new-array
  const bounds = new Array(count + 1)
  for (let i = 0; i <= count; i++) {
    bounds[i] = Math.round((i * totalPx) / count)
  }
  return bounds
}

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return
  const { width: displayWidth, height: displayHeight } = displaySize.value
  if (displayWidth === 0 || displayHeight === 0) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  const targetWidth = Math.round(displayWidth * dpr)
  const targetHeight = Math.round(displayHeight * dpr)

  if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
    canvas.width = targetWidth
    canvas.height = targetHeight
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const colBounds = computeCellBounds(cols.value, canvas.width)
  const rowBounds = computeCellBounds(rows.value, canvas.height)

  for (let i = 0; i < rows.value; i++) {
    const y0 = rowBounds[i]
    const y1 = rowBounds[i + 1]
    const cellHeight = y1! - y0!

    for (let j = 0; j < cols.value; j++) {
      const x0 = colBounds[j]
      const x1 = colBounds[j + 1]
      const cellWidth = x1! - x0!

      const normalizedValue = displayMatrix.value[i]![j]
      const [r, g, b] = grayscaleToRgb(normalizedValue!)
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
      ctx.fillRect(x0!, y0!, cellWidth, cellHeight)

      if (props.showGrid) {
        ctx.strokeStyle = 'rgba(255,255,255,0.08)'
        ctx.strokeRect(x0! + 0.5, y0! + 0.5, cellWidth - 1, cellHeight - 1)
      }

      if (props.showValues && cellWidth >= 18 * dpr) {
        ctx.fillStyle = contrastTextColor(normalizedValue!)
        ctx.font = `${Math.max(8, Math.floor(cellWidth * 0.32))}px monospace`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const rawValue = props.matrix[i]![j]
        ctx.fillText(rawValue!.toFixed(2), x0! + cellWidth / 2, y0! + cellHeight / 2)
      }
    }
  }

  if (props.highlightWindow) {
    const { row, col, size: windowSize } = props.highlightWindow
    const hx0 = colBounds[col]
    const hy0 = rowBounds[row]
    const hx1 = colBounds[Math.min(col + windowSize, cols.value)]
    const hy1 = rowBounds[Math.min(row + windowSize, rows.value)]
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 2 * dpr
    ctx.strokeRect(hx0!, hy0!, hx1! - hx0!, hy1! - hy0!)
  }
}

function handleClick(event: MouseEvent) {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const col = Math.floor(((event.clientX - rect.left) / rect.width) * cols.value)
  const row = Math.floor(((event.clientY - rect.top) / rect.height) * rows.value)
  if (row < 0 || row >= rows.value || col < 0 || col >= cols.value) return
  emit('cell-click', { row, col, value: props.matrix[row]![col]! })
}

watch(
  [
    () => props.matrix,
    () => props.highlightWindow,
    () => props.showValues,
    () => props.showGrid,
    displaySize,
  ],
  draw,
  { deep: true },
)

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  resizeObserver = new ResizeObserver((entries) => {
    const entry = entries[0]
    if (!entry) return
    const { width, height } = entry.contentRect
    displaySize.value = { width, height }
  })
  resizeObserver.observe(canvas)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="block h-full w-full cursor-pointer rounded-md"
    :style="{ imageRendering: 'pixelated' }"
    @click="handleClick"
  />
</template>
