import type { Matrix2D, FeatureMaps } from '@/types/tensor'

export function relu(matrix: Matrix2D): Matrix2D {
  return matrix.map((row) => row.map((value) => Math.max(0, value)))
}

export function applyReluLayer(featureMaps: FeatureMaps): FeatureMaps {
  return featureMaps.map(relu)
}
