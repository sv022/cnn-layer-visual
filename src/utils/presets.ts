import type { Kernel } from '@/types/layer'

function kernel(id: string, weights: number[][], bias = 0): Kernel {
  return { id, weights, bias }
}

const sobelX = kernel('sobel-x', [
  [-1, 0, 1],
  [-2, 0, 2],
  [-1, 0, 1],
])

const sobelY = kernel('sobel-y', [
  [-1, -2, -1],
  [0, 0, 0],
  [1, 2, 1],
])

const laplacian = kernel('laplacian', [
  [0, 1, 0],
  [1, -4, 1],
  [0, 1, 0],
])

const sharpen = kernel('sharpen', [
  [0, -1, 0],
  [-1, 5, -1],
  [0, -1, 0],
])

const boxBlur = kernel('box-blur', [
  [1 / 9, 1 / 9, 1 / 9],
  [1 / 9, 1 / 9, 1 / 9],
  [1 / 9, 1 / 9, 1 / 9],
])

const emboss = kernel('emboss', [
  [-2, -1, 0],
  [-1, 1, 1],
  [0, 1, 2],
])

const ridgeHorizontal = kernel('ridge-h', [
  [-1, -1, -1],
  [2, 2, 2],
  [-1, -1, -1],
])

const ridgeVertical = kernel('ridge-v', [
  [-1, 2, -1],
  [-1, 2, -1],
  [-1, 2, -1],
])

const mnistDigitsKernels: Kernel[] = [
  sobelX,
  sobelY,
  laplacian,
  sharpen,
  boxBlur,
  emboss,
  ridgeHorizontal,
  ridgeVertical,
]

const fashionMnistKernels: Kernel[] = mnistDigitsKernels.map((k) => ({
  ...k,
  id: `fashion-${k.id}`,
}))

const presetsByDataset: Record<'mnist-digits' | 'fashion-mnist', Kernel[]> = {
  'mnist-digits': mnistDigitsKernels,
  'fashion-mnist': fashionMnistKernels,
}

export function createDefaultKernels(datasetId: 'mnist-digits' | 'fashion-mnist'): Kernel[] {
  return presetsByDataset[datasetId]
}
