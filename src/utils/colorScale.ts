export function grayscaleToRgb(value: number): [number, number, number] {
  const clamped = Math.min(1, Math.max(0, value))
  const channel = Math.round(clamped * 255)
  return [channel, channel, channel]
}

export function grayscaleToHex(value: number): string {
  const [r, g, b] = grayscaleToRgb(value)
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`
}

export function contrastTextColor(value: number): string {
  return value > 0.55 ? '#111111' : '#f5f5f5'
}

export interface MatrixRange {
  min: number
  max: number
}

export function findMatrixRange(matrix: number[][]): MatrixRange {
  let min = Infinity
  let max = -Infinity
  for (const row of matrix) {
    for (const value of row) {
      if (value < min) min = value
      if (value > max) max = value
    }
  }
  if (min === Infinity) return { min: 0, max: 1 }
  return { min, max }
}

export function findLayerRange(matrices: number[][][]): MatrixRange {
  let min = Infinity
  let max = -Infinity
  for (const matrix of matrices) {
    const range = findMatrixRange(matrix)
    if (range.min < min) min = range.min
    if (range.max > max) max = range.max
  }
  if (min === Infinity) return { min: 0, max: 1 }
  return { min, max }
}

export function normalizeMatrix(matrix: number[][], range?: MatrixRange): number[][] {
  const { min, max } = range ?? findMatrixRange(matrix)
  const span = max - min || 1
  return matrix.map((row) => row.map((value) => (value - min) / span))
}

export function normalizeLayer(matrices: number[][][]): number[][][] {
  const range = findLayerRange(matrices)
  return matrices.map((matrix) => normalizeMatrix(matrix, range))
}
