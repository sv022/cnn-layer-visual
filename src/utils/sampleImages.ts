import type { Matrix2D } from '@/types/tensor'

export interface SampleImage {
  id: string
  label: string
  data: Matrix2D
}

function generateBlob(size: number, cx: number, cy: number, radius: number): Matrix2D {
  const matrix: Matrix2D = []
  for (let i = 0; i < size; i++) {
    const row: number[] = []
    for (let j = 0; j < size; j++) {
      const distance = Math.sqrt((i - cy) ** 2 + (j - cx) ** 2)
      row.push(Math.max(0, 1 - distance / radius))
    }
    matrix.push(row)
  }
  return matrix
}

export const mnistDigitsSamples: SampleImage[] = [
  { id: 'digit-sample-1', label: '3', data: generateBlob(28, 14, 12, 9) },
  { id: 'digit-sample-2', label: '6', data: generateBlob(28, 12, 16, 8) },
  { id: 'digit-sample-3', label: '0', data: generateBlob(28, 14, 14, 10) },
  { id: 'digit-sample-4', label: '1', data: generateBlob(28, 16, 10, 6) },
]

export const fashionMnistSamples: SampleImage[] = [
  { id: 'fashion-sample-1', label: 'Ботинок', data: generateBlob(28, 14, 18, 11) },
  { id: 'fashion-sample-2', label: 'Футболка', data: generateBlob(28, 14, 12, 12) },
  { id: 'fashion-sample-3', label: 'Сумка', data: generateBlob(28, 14, 14, 9) },
  { id: 'fashion-sample-4', label: 'Брюки', data: generateBlob(28, 14, 16, 7) },
]

export const samplesByDataset: Record<'mnist-digits' | 'fashion-mnist', SampleImage[]> = {
  'mnist-digits': mnistDigitsSamples,
  'fashion-mnist': fashionMnistSamples,
}
