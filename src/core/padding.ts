import type { Matrix2D } from '@/types/tensor'


export function padMatrix(matrix: Matrix2D, padding: number): Matrix2D {
  if (padding <= 0) return matrix

  const rows = matrix.length
  const cols = matrix[0]?.length ?? 0
  const paddedCols = cols + padding * 2
  const paddedRows = rows + padding * 2

  const result: Matrix2D = Array.from({ length: paddedRows }, () => new Array(paddedCols).fill(0))

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[i + padding]![j + padding] = matrix[i]![j]!
    }
  }

  return result
}
