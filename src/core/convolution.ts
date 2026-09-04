import type { Matrix2D, FeatureMaps } from '@/types/tensor'
import type { Kernel, ConvConfig } from '@/types/layer'
import { padMatrix } from './padding'

export function outputSize(
  inputSize: number,
  kernelSize: number,
  stride: number,
  padding: number,
): number {
  return Math.floor((inputSize + padding * 2 - kernelSize) / stride) + 1
}

export function convolve2d(
  input: Matrix2D,
  kernel: Kernel,
  stride: number,
  padding: number,
): Matrix2D {
  const padded = padMatrix(input, padding)
  const inRows = padded.length
  const inCols = padded[0]?.length ?? 0
  const kh = kernel.weights.length
  const kw = kernel.weights[0]?.length ?? 0

  const outRows = Math.floor((inRows - kh) / stride) + 1
  const outCols = Math.floor((inCols - kw) / stride) + 1

  if (outRows <= 0 || outCols <= 0) {
    throw new Error(
      `Некорректные размеры свёртки: вход ${inRows}x${inCols}, ядро ${kh}x${kw}, stride ${stride}`,
    )
  }

  const output: Matrix2D = Array.from({ length: outRows }, () => new Array(outCols).fill(0))

  for (let i = 0; i < outRows; i++) {
    for (let j = 0; j < outCols; j++) {
      let acc = 0
      const baseRow = i * stride
      const baseCol = j * stride
      for (let ki = 0; ki < kh; ki++) {
        for (let kj = 0; kj < kw; kj++) {
          acc += padded[baseRow + ki]![baseCol + kj]! * kernel.weights[ki]![kj]!
        }
      }
      output[i]![j] = acc + kernel.bias
    }
  }

  return output
}

export function applyConvLayer(input: Matrix2D, config: ConvConfig): FeatureMaps {
  return config.kernels.map((kernel) => convolve2d(input, kernel, config.stride, config.padding))
}
