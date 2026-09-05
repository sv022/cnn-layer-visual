export type DatasetId = 'mnist-digits' | 'fashion-mnist'

export interface KernelPresetMeta {
  value: DatasetId
  label: string
  description: string
}

export const kernelPresetCatalog: KernelPresetMeta[] = [
  {
    value: 'mnist-digits',
    label: 'MNIST Digits',
    description: 'Pretrained kernels for MNIST digits: 3×3',
  },
  {
    value: 'fashion-mnist',
    label: 'Fashion-MNIST',
    description: 'Pretrained kernels for Fashion-MNIST: 3×3',
  },
]
