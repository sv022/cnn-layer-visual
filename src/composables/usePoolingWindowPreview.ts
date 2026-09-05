import { ref, computed, type Ref } from 'vue'
import type { HighlightWindow } from './useKernelHighlight'

export function usePoolingWindowPreview(windowSize: Ref<number>, stride: Ref<number>) {
  const hoveredOutputCell = ref<{ row: number; col: number } | null>(null)

  const inputHighlightWindow = computed<HighlightWindow | null>(() => {
    if (!hoveredOutputCell.value) return null
    return {
      row: hoveredOutputCell.value.row * stride.value,
      col: hoveredOutputCell.value.col * stride.value,
      size: windowSize.value,
    }
  })

  function setHoveredOutputCell(row: number, col: number) {
    hoveredOutputCell.value = { row, col }
  }

  function clearHoveredOutputCell() {
    hoveredOutputCell.value = null
  }

  return { hoveredOutputCell, inputHighlightWindow, setHoveredOutputCell, clearHoveredOutputCell }
}
