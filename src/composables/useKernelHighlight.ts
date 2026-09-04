import { ref, computed, type Ref } from 'vue'

export interface HighlightWindow {
  row: number
  col: number
  size: number
}

export function useKernelHighlight(
  matrixSize: Ref<number>,
  windowSize: Ref<number>,
  stride: Ref<number>,
) {
  const selectedCell = ref<{ row: number; col: number } | null>(null)

  const highlightWindow = computed<HighlightWindow | null>(() => {
    if (!selectedCell.value) return null

    const maxStart = matrixSize.value - windowSize.value
    if (maxStart < 0) return null

    const clampToStride = (position: number) => {
      const centered = position - Math.floor(windowSize.value / 2)
      const bounded = Math.min(Math.max(centered, 0), maxStart)
      const aligned = Math.round(bounded / stride.value) * stride.value
      return Math.min(aligned, maxStart)
    }

    return {
      row: clampToStride(selectedCell.value.row),
      col: clampToStride(selectedCell.value.col),
      size: windowSize.value,
    }
  })

  function selectCell(row: number, col: number) {
    selectedCell.value = { row, col }
  }

  function clearSelection() {
    selectedCell.value = null
  }

  return { selectedCell, highlightWindow, selectCell, clearSelection }
}
