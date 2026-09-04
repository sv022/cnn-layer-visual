export type Matrix2D = number[][]

export type FeatureMaps = Matrix2D[]

export interface MatrixShape {
  rows: number
  cols: number
}

export function shapeOf(matrix: Matrix2D): MatrixShape {
  return {
    rows: matrix.length,
    cols: matrix[0]?.length ?? 0,
  }
}
