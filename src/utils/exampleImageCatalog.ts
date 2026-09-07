export interface ExampleSetMeta {
  id: string
  label: string
  url: string
}

export const exampleImageCatalog: ExampleSetMeta[] = [
  {
    id: 'mnist-digits',
    label: 'MNIST Digits',
    url: '/images/digits.json',
  },
  {
    id: 'fashion-mnist',
    label: 'Fashion-MNIST',
    url: '/images/fashion.json',
  },
]
