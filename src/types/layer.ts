import type { Matrix2D } from './tensor'

export interface Kernel {
  id: string
  weights: Matrix2D
  bias: number
}

export type PaddingMode = 'valid' | 'same'

export interface ConvConfig {
  kernelSize: number
  stride: number
  padding: number
  kernels: Kernel[]
}

export type PoolMode = 'max' | 'average'

export interface PoolConfig {
  windowSize: number
  stride: number
  mode: PoolMode
}

export type LayerConfig =
  { type: 'conv'; config: ConvConfig } | { type: 'relu' } | { type: 'pool'; config: PoolConfig }

export interface PretrainedKernelSet {
  id: string
  label: string
  datasetPreviewIds: string[]
  kernels: Kernel[]
}
