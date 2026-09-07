import { ref } from 'vue'
import { parseExampleImages, type SampleImage } from '@/utils/exampleImageParser'
import { exampleImageCatalog } from '@/utils/exampleImageCatalog'
import type { Matrix2D } from '@/types/tensor'

export function useExampleImages() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const cache = new Map<string, SampleImage[]>()

  async function loadExamples(datasetId: string): Promise<SampleImage[]> {
    const cached = cache.get(datasetId)
    if (cached) return cached

    const meta = exampleImageCatalog.find((set) => set.id === datasetId)
    if (!meta) {
      error.value = `Unknown dataset: ${datasetId}`
      return []
    }

    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(meta.url)
      if (!response.ok) {
        throw new Error(`Failed to load weights: HTTP ${response.status}`)
      }
      const exportData: Matrix2D[] = await response.json()
      const samples = parseExampleImages(exportData)
      cache.set(datasetId, samples)
      return samples
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      console.error('useExampleImages:', e)
      return []
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, error, loadExamples }
}
