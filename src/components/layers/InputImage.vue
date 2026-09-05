<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useNetworkStore } from '@/stores/network'
import { useVisualsStore } from '@/stores/visuals'
import MatrixCanvas from '@/components/matrix/MatrixCanvas.vue'
import PixelInspector from '@/components/matrix/PixelInspector.vue'
import { useKernelHighlight } from '@/composables/useKernelHighlight'
import { samplesByDataset, type SampleImage } from '@/utils/sampleImages'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from '@/components/ui/context-menu'

const networkStore = useNetworkStore()
const visualsStore = useVisualsStore()

const activeDataset = ref<'mnist-digits' | 'fashion-mnist'>('mnist-digits')
const sampleThumbnails = computed<SampleImage[]>(() => samplesByDataset[activeDataset.value])

const sourceSize = computed(() => networkStore.inputImage.length)
const padding = computed(() => networkStore.convConfig.padding)
const paddedSize = computed(() => sourceSize.value + padding.value * 2)
const kernelSize = computed(() => networkStore.convConfig.kernelSize)
const stride = computed(() => networkStore.convConfig.stride)

const { highlightWindow, selectCell, selectedCell } = useKernelHighlight(paddedSize, kernelSize, stride)

watch(
  highlightWindow,
  (window) => {
    visualsStore.setSelectedInputCell(window ? { row: window.row, col: window.col } : null)
  },
  { immediate: true },
)

const visibleHighlightWindow = computed(() =>
  visualsStore.showInputWindow ? highlightWindow.value : null,
)

const selectedSourceCell = computed(() => {
  if (!selectedCell.value) return null
  const row = selectedCell.value.row - padding.value
  const col = selectedCell.value.col - padding.value
  if (row < 0 || row >= sourceSize.value || col < 0 || col >= sourceSize.value) return null
  return { row, col }
})

const selectedPixelValue = computed(() => {
  if (!selectedSourceCell.value) return 0
  return networkStore.inputImage[selectedSourceCell.value.row]![selectedSourceCell.value.col]
})

function handleCellClick(payload: { row: number; col: number; value: number }) {
  selectCell(payload.row, payload.col)
}

function handlePixelUpdate(value: number) {
  if (!selectedSourceCell.value) return
  networkStore.setInputPixel(selectedSourceCell.value.row, selectedSourceCell.value.col, value)
}

function selectDataset(dataset: 'mnist-digits' | 'fashion-mnist') {
  activeDataset.value = dataset
  networkStore.loadPretrainedKernels(dataset)
}

function selectSample(sample: SampleImage) {
  networkStore.setInputImage(sample.data.map((row) => [...row]))
}

function handleUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  loadImageFile(file)
}

async function loadImageFile(file: File) {
  const bitmap = await createImageBitmap(file)
  const size = 28
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.drawImage(bitmap, 0, 0, size, size)
  const { data } = ctx.getImageData(0, 0, size, size)

  const matrix = Array.from({ length: size }, (_, i) =>
    Array.from({ length: size }, (_, j) => {
      const idx = (i * size + j) * 4
      const gray = (data[idx]! + data[idx + 1]! + data[idx + 2]!) / 3 / 255
      return Math.round(gray * 100) / 100
    }),
  )

  networkStore.setInputImage(matrix)
}
</script>

<template>
  <Card class="w-85">
    <CardHeader class="flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle class="text-[13px] font-semibold">Input</CardTitle>
      <span class="text-[11px] text-muted-foreground">{{ paddedSize }}×{{ paddedSize }}×1</span>
    </CardHeader>

    <CardContent class="flex flex-col gap-3.5">
      <ContextMenu>
        <ContextMenuTrigger as-child>
          <div class="aspect-square w-full cursor-pointer overflow-hidden rounded-md">
            <MatrixCanvas
              :matrix="networkStore.paddedInputImage"
              is-pre-normalized
              :show-grid="visualsStore.showPixelBorders"
              :highlight-window="visibleHighlightWindow"
              @cell-click="handleCellClick"
            />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent
          v-if="selectedSourceCell"
          side="right"
          class="w-auto border-none bg-transparent p-0 shadow-none"
        >
          <PixelInspector
            :row="selectedSourceCell.row"
            :col="selectedSourceCell.col"
            :value="selectedPixelValue!"
            @update="handlePixelUpdate"
          />
        </ContextMenuContent>
      </ContextMenu>

      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <Checkbox
            id="show-values"
            :model-value="visualsStore.showInputWindow"
            @update:model-value="(v) => (visualsStore.showInputWindow = !!v)"
          />
          <Label for="show-values" class="text-[13px]">Show input window</Label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox
            id="show-borders"
            :model-value="visualsStore.showPixelBorders"
            @update:model-value="(v) => (visualsStore.showPixelBorders = !!v)"
          />
          <Label for="show-borders" class="text-[13px]">Show pixel borders</Label>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <Label class="text-[11px] text-muted-foreground">Pretrained datasets</Label>
        <div class="flex overflow-hidden rounded-md border border-border text-[11px]">
          <button
            class="flex-1 py-1.5"
            :class="
              activeDataset === 'mnist-digits'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground'
            "
            @click="selectDataset('mnist-digits')"
          >
            MNIST Digits
          </button>
          <button
            class="flex-1 py-1.5"
            :class="
              activeDataset === 'fashion-mnist'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground'
            "
            @click="selectDataset('fashion-mnist')"
          >
            Fashion-MNIST
          </button>
        </div>

        <div class="flex gap-1.5">
          <button
            v-for="sample in sampleThumbnails"
            :key="sample.id"
            class="aspect-square w-12 overflow-hidden rounded-md border border-border"
            :title="sample.label"
            @click="selectSample(sample)"
          >
            <MatrixCanvas :matrix="sample.data" is-pre-normalized />
          </button>
        </div>
      </div>

      <Button variant="secondary" as-child>
        <label class="cursor-pointer">
          Upload Image
          <input type="file" accept="image/*" class="hidden" @change="handleUpload" />
        </label>
      </Button>
    </CardContent>
  </Card>
</template>
