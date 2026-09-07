export interface KernelPresetMeta {
  id: string
  label: string
  description: string
  url: string
}

export const kernelPresetCatalog: KernelPresetMeta[] = [
  {
    id: 'common-kernels',
    label: 'Common Kernels',
    description: 'Classic blur/edge kernels 3×3',
    url: '/weights/common-kernels.json',
  },
  {
    id: 'mnist-digits-trained',
    label: 'MNIST Digits',
    description: 'Kernels for first convolution layer trained on MNIST digits',
    url: '/weights/digits-1l-kernels.json',
  },
  {
    id: 'mnist-fashion-trained',
    label: 'MNIST Fashion',
    description: 'Kernels for first convolution layer trained on MNIST fashion',
    url: '/weights/fashion-1l-kernels.json',
  },
]

export const defaultKernelPresetId = kernelPresetCatalog[0]!.id
