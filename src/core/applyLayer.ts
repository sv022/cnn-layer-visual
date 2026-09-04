import type { FeatureMaps, Matrix2D } from '@/types/tensor'
import type { LayerConfig } from '@/types/layer'
import { applyConvLayer } from './convolution'
import { applyReluLayer } from './activation'
import { applyPoolLayer } from './pooling'

export function applyLayer(layer: LayerConfig, input: FeatureMaps): FeatureMaps {
  switch (layer.type) {
    case 'conv':
      return applyConvLayer(input[0]!, layer.config)
    case 'relu':
      return applyReluLayer(input)
    case 'pool':
      return applyPoolLayer(input, layer.config)
    default: {
      const exhaustiveCheck: never = layer
      throw new Error(`Неизвестный тип слоя: ${JSON.stringify(exhaustiveCheck)}`)
    }
  }
}

export function applyPipeline(inputImage: Matrix2D, layers: LayerConfig[]): FeatureMaps[] {
  const stages: FeatureMaps[] = [[inputImage]]
  let current: FeatureMaps = [inputImage]

  for (const layer of layers) {
    current = applyLayer(layer, current)
    stages.push(current)
  }

  return stages
}
