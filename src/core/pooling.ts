import type { Matrix2D, FeatureMaps } from '@/types/tensor'
import type { PoolConfig } from '@/types/layer'

function reduceWindow(values: number[], mode: PoolConfig['mode']): number {
  if (mode === 'max') return Math.max(...values)
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

export function pool2d(matrix: Matrix2D, config: PoolConfig): Matrix2D {
  const rows = matrix.length
  const cols = matrix[0]?.length ?? 0
  const { windowSize, stride, mode } = config

  const outRows = Math.floor((rows - windowSize) / stride) + 1
  const outCols = Math.floor((cols - windowSize) / stride) + 1

  if (outRows <= 0 || outCols <= 0) {
    throw new Error(
      `Invalid pool parameters: input: ${rows}x${cols}, window: ${windowSize}, stride: ${stride}`,
    )
  }

  const output: Matrix2D = Array.from({ length: outRows }, () => new Array(outCols).fill(0))

  for (let i = 0; i < outRows; i++) {
    for (let j = 0; j < outCols; j++) {
      const baseRow = i * stride
      const baseCol = j * stride
      const windowValues: number[] = []
      for (let wi = 0; wi < windowSize; wi++) {
        for (let wj = 0; wj < windowSize; wj++) {
          windowValues.push(matrix[baseRow + wi]![baseCol + wj]!)
        }
      }
      output[i]![j] = reduceWindow(windowValues, mode)
    }
  }

  return output
}

export function applyPoolLayer(featureMaps: FeatureMaps, config: PoolConfig): FeatureMaps {
  return featureMaps.map((matrix) => pool2d(matrix, config))
}
