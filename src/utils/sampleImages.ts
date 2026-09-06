import type { Matrix2D } from '@/types/tensor'
import { examplesDigits, examplesFashion } from './exampleImages'

export interface SampleImage {
  id: string
  label: string
  data: Matrix2D
}

export const mnistDigitsSamples: SampleImage[] = [
  { id: 'digit-sample-1', label: '3', data: examplesDigits[0]! },
  { id: 'digit-sample-2', label: '6', data: examplesDigits[1]! },
  { id: 'digit-sample-3', label: '0', data: examplesDigits[2]! },
  { id: 'digit-sample-4', label: '1', data: examplesDigits[3]! },
]

export const fashionMnistSamples: SampleImage[] = [
  { id: 'fashion-sample-1', label: 'Ботинок', data: examplesFashion[0]! },
  { id: 'fashion-sample-2', label: 'Футболка', data: examplesFashion[1]! },
  { id: 'fashion-sample-3', label: 'Сумка', data: examplesFashion[2]! },
  { id: 'fashion-sample-4', label: 'Брюки', data: examplesFashion[3]! },
]

export const samplesByDataset: Record<'mnist-digits' | 'fashion-mnist', SampleImage[]> = {
  'mnist-digits': mnistDigitsSamples,
  'fashion-mnist': fashionMnistSamples,
}
