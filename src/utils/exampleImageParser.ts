import type { Matrix2D } from '@/types/tensor'

export interface SampleImage {
  id: string
  label: string
  data: Matrix2D
}

export function parseExampleImages(exportData: Matrix2D[]): SampleImage[] {
  return exportData.map((example) => {
    const id = Math.random().toString(36).slice(2)
    return { id: id, label: 'example', data: example }
  })
}
