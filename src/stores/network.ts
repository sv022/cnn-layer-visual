import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Matrix2D, FeatureMaps } from '@/types/tensor'
import type { LayerConfig, ConvConfig, PoolConfig } from '@/types/layer'
import { applyPipeline } from '@/core/applyLayer'
import { createDefaultKernels } from '@/utils/presets'
import { padMatrix } from '@/core/padding'

export const useNetworkStore = defineStore('network', () => {
  const inputImage = ref<Matrix2D>(createBlankImage(28))

  const convConfig = ref<ConvConfig>({
    kernelSize: 3,
    stride: 1,
    padding: 0,
    kernels: createDefaultKernels('mnist-digits'),
  })

  const poolConfig = ref<PoolConfig>({
    windowSize: 2,
    stride: 2,
    mode: 'max',
  })

  const layers = computed<LayerConfig[]>(() => [
    { type: 'conv', config: convConfig.value },
    { type: 'relu' },
    { type: 'pool', config: poolConfig.value },
  ])

  const paddedInputImage = computed<Matrix2D>(() =>
    padMatrix(inputImage.value, convConfig.value.padding),
  )

  const stageOutputs = computed<FeatureMaps[]>(() => {
    try {
      return applyPipeline(inputImage.value, layers.value)
    } catch (error) {
      console.error('Ошибка пересчёта конвейера:', error)
      return [[inputImage.value]]
    }
  })

  const convOutput = computed<FeatureMaps>(() => stageOutputs.value[1] ?? [])
  const reluOutput = computed<FeatureMaps>(() => stageOutputs.value[2] ?? [])
  const poolOutput = computed<FeatureMaps>(() => stageOutputs.value[3] ?? [])

  function setInputImage(matrix: Matrix2D) {
    inputImage.value = matrix
  }

  function setInputPixel(row: number, col: number, value: number) {
    const next = inputImage.value.map((r) => [...r])
    next[row]![col] = value
    inputImage.value = next
  }

  function updateConvConfig(patch: Partial<ConvConfig>) {
    convConfig.value = { ...convConfig.value, ...patch }
  }

  function updatePoolConfig(patch: Partial<PoolConfig>) {
    poolConfig.value = { ...poolConfig.value, ...patch }
  }

  function loadPretrainedKernels(datasetId: 'mnist-digits' | 'fashion-mnist') {
    convConfig.value = { ...convConfig.value, kernels: createDefaultKernels(datasetId) }
  }

  return {
    inputImage,
    paddedInputImage,
    convConfig,
    poolConfig,
    layers,
    stageOutputs,
    convOutput,
    reluOutput,
    poolOutput,
    setInputImage,
    setInputPixel,
    updateConvConfig,
    updatePoolConfig,
    loadPretrainedKernels,
  }
})

function createBlankImage(size: number): Matrix2D {
  // oxlint-disable-next-line unicorn/no-new-array
  return Array.from({ length: size }, () => new Array(size).fill(0))
}
