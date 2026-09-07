<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useNetworkStore } from '@/stores/network'
import { useVisualsStore } from '@/stores/visuals'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import LayerGrid from './conv/LayerGrid.vue'
import LabeledStepper from './conv/LabeledStepper.vue'
import type { HighlightWindow } from '@/composables/useKernelHighlight.ts'
import { cellToPointWindow, useConvOutputCell } from '@/composables/usePixelProjection.ts'
import Checkbox from '../ui/checkbox/Checkbox.vue'
import KernelPresetPicker from './conv/KernelPresetPicker.vue'
import Label from '../ui/label/Label.vue'
import { useKernelPreset } from '@/composables/useKernelPreset.ts'
import ColorTooltip from './conv/ColorTooltip.vue'

const networkStore = useNetworkStore()
const visualsStore = useVisualsStore()
const kernelPreset = useKernelPreset()

const kernelMatrices = computed(() => networkStore.convConfig.kernels.map((k) => k.weights))
const featureMaps = computed(() => networkStore.convOutput)

const outputShapeLabel = computed(() => {
  const first = featureMaps.value[0]
  const rows = first?.length ?? 0
  const cols = first?.[0]?.length ?? 0
  return `${rows}×${cols}×${featureMaps.value.length}`
})

const inputWindow = computed<HighlightWindow | null>(() => {
  if (!visualsStore.showInputWindow) return null
  const cell = visualsStore.selectedInputCell
  if (!cell) return null
  return { row: cell.row, col: cell.col, size: networkStore.convConfig.kernelSize }
})

const strideRef = computed(() => networkStore.convConfig.stride)
const convCell = useConvOutputCell(inputWindow, strideRef)
const outputProjectionWindow = cellToPointWindow(convCell)

function updateStride(value: number) {
  networkStore.updateConvConfig({ stride: Math.max(1, value) })
}

function updatePadding(value: number) {
  networkStore.updateConvConfig({ padding: Math.max(0, value) })
}

onMounted(() => {
  kernelPreset.selectPreset(kernelPreset.activePresetId.value)
})
</script>

<template>
  <Card class="w-115 border-l-[3px]" :style="{ borderLeftColor: 'var(--color-convolution)' }">
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle class="flex items-center gap-1.5 text-[13px] font-semibold">
        <span class="h-2 w-2 rounded-full" style="background: var(--color-convolution)" />
        Convolution
      </CardTitle>
      <span class="text-[11px] text-muted-foreground">{{ outputShapeLabel }}</span>
    </CardHeader>

    <CardContent class="flex flex-col gap-3">
      <div class="flex gap-3.5">
        <div class="flex-1">
          <p class="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Filters
          </p>
          <LayerGrid
            :maps="kernelMatrices"
            :normalize-as-layer="false"
            :show-values="visualsStore.showPixelValues"
            accent-color-var="var(--color-convolution)"
          />
        </div>

        <div class="flex-1">
          <p
            class="flex mb-2 text-[10px] items-center font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Feature maps
            <ColorTooltip :maps="featureMaps" />
          </p>
          <LayerGrid
            :maps="featureMaps"
            normalize-as-layer
            accent-color-var="var(--color-convolution)"
            :projection-window="outputProjectionWindow"
          />
        </div>
      </div>

      <Separator />

      <div class="flex gap-2.5">
        <LabeledStepper
          :model-value="networkStore.convConfig.stride"
          label="Stride"
          :min="1"
          :max="4"
          @update:model-value="updateStride"
        />
        <LabeledStepper
          :model-value="networkStore.convConfig.padding"
          label="Padding"
          :min="0"
          :max="4"
          @update:model-value="updatePadding"
        />
      </div>
      <div class="flex items-center gap-2">
        <Checkbox
          id="show-values"
          :model-value="visualsStore.showPixelValues"
          @update:model-value="(v) => (visualsStore.showPixelValues = !!v)"
        />
        <Label for="show-values" class="text-[13px]">Show kernel values</Label>
      </div>
      <div>
        <p class="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Feature maps
        </p>
        <KernelPresetPicker
          :model-value="kernelPreset.activePresetId.value"
          :is-loading="kernelPreset.isLoading.value"
          @update:model-value="kernelPreset.selectPreset"
        />
      </div>
    </CardContent>
  </Card>
</template>
