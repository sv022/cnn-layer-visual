import { computed, type Ref } from 'vue'
import type { HighlightWindow } from './useKernelHighlight'


export function useConvOutputCell(inputWindow: Ref<HighlightWindow | null>, stride: Ref<number>) {
  return computed<{ row: number; col: number } | null>(() => {
    const window = inputWindow.value
    if (!window) return null
    return {
      row: Math.floor(window.row / stride.value),
      col: Math.floor(window.col / stride.value),
    }
  })
}

export function usePoolProjection(
  sourceCell: Ref<{ row: number; col: number } | null>,
  poolWindowSize: Ref<number>,
  poolStride: Ref<number>,
) {
  const poolCell = computed<{ row: number; col: number } | null>(() => {
    const cell = sourceCell.value
    if (!cell) return null
    return {
      row: Math.floor(cell.row / poolStride.value),
      col: Math.floor(cell.col / poolStride.value),
    }
  })

  const poolInputWindow = computed<HighlightWindow | null>(() => {
    const cell = poolCell.value
    if (!cell) return null
    return {
      row: cell.row * poolStride.value,
      col: cell.col * poolStride.value,
      size: poolWindowSize.value,
    }
  })

  return { poolCell, poolInputWindow }
}

export function cellToPointWindow(
  cell: Ref<{ row: number; col: number } | null>,
): Ref<HighlightWindow | null> {
  return computed(() => (cell.value ? { row: cell.value.row, col: cell.value.col, size: 1 } : null))
}
