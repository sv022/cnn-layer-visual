import { ref } from 'vue'
import { useNetworkStore } from '@/stores/network'
import { parseKernelExport, type KernelExport } from '@/utils/kernelExportParser'
import { kernelPresetCatalog } from '@/utils/kernelPresetCatalog'

export function useKernelPreset() {
  const networkStore = useNetworkStore()
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const activePresetId = ref<string>(kernelPresetCatalog[0]!.id)

  async function selectPreset(presetId: string) {
    const preset = kernelPresetCatalog.find((p) => p.id === presetId)
    if (!preset) {
      error.value = `Unknown preset: ${presetId}`
      return
    }

    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(preset.url)
      if (!response.ok) {
        throw new Error(`Failed to load weights: HTTP ${response.status}`)
      }
      const exportData: KernelExport = await response.json()
      const kernels = parseKernelExport(exportData, preset.id)
      networkStore.updateConvConfig({ kernels })
      activePresetId.value = preset.id
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      console.error('useKernelPreset:', e)
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, error, activePresetId, selectPreset }
}
