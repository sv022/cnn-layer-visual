import { computed, type Ref } from 'vue'
import type { HighlightWindow } from './useKernelHighlight'

/**
 * Проецирует окно свёртки на входе в ОДНУ конкретную ячейку выхода
 * Conv/ReLU (форма не меняется между ними). Окно, выбранное на входном
 * изображении, всегда выровнено по stride (см. useKernelHighlight),
 * поэтому деление нацело даёт точный индекс выходной ячейки.
 */
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

/**
 * Проецирует ячейку карты (выход Conv/ReLU) в окно на выходе Pooling —
 * то есть какое окно текущей карты будет агрегировано в одно значение
 * при пулинге, и в какую именно выходную ячейку.
 */
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

/** Утилита для превращения ячейки в HighlightWindow размера 1x1 (точечная подсветка). */
export function cellToPointWindow(
  cell: Ref<{ row: number; col: number } | null>,
): Ref<HighlightWindow | null> {
  return computed(() => (cell.value ? { row: cell.value.row, col: cell.value.col, size: 1 } : null))
}
