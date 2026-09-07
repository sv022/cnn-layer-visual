import type { Kernel } from '@/types/layer'

export interface KernelExport {
  layer_config: {
    type: string
    input_width: number
    input_height: number
    channels: number
    kernel_size: number
    num_kernels: number
    stride: number
    padding: number
  }
  weights: {
    kernels: number[][][][]
    biases: number[]
  }
}

export function parseKernelExport(exportData: KernelExport, idPrefix: string): Kernel[] {
  const { channels, num_kernels: numKernels, kernel_size: kernelSize } = exportData.layer_config
  const { kernels, biases } = exportData.weights

  if (channels !== 1) {
    throw new Error(`parseKernelExport: only support channels=1, received channels=${channels}`)
  }
  if (kernels.length !== numKernels) {
    throw new Error(
      `parseKernelExport: layer_config.num_kernels=${numKernels}, but weights.kernels.length=${kernels.length}`,
    )
  }

  return kernels.map((filterChannels, index) => {
    const weights = filterChannels[0]
    if (weights!.length !== kernelSize || weights![0]?.length !== kernelSize) {
      throw new Error(
        `parseKernelExport: filter #${index} shape ${weights!.length}x${weights![0]?.length}, expected ${kernelSize}x${kernelSize}`,
      )
    }
    return {
      id: `${idPrefix}-${index}`,
      weights,
      bias: biases[index] ?? 0,
    } as Kernel
  })
}
