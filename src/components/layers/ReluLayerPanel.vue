<script setup lang="ts">
import { computed } from 'vue'
import { useNetworkStore } from '@/stores/network'
import { useVisualsStore } from '@/stores/visuals'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import LayerGrid from './conv/LayerGrid.vue'
import { useConvOutputCell, cellToPointWindow } from '@/composables/usePixelProjection'
import type { HighlightWindow } from '@/composables/useKernelHighlight'

const networkStore = useNetworkStore()
const visualsStore = useVisualsStore()

const featureMaps = computed(() => networkStore.reluOutput)

const outputShapeLabel = computed(() => {
  const first = featureMaps.value[0]
  const rows = first?.length ?? 0
  const cols = first?.[0]?.length ?? 0
  return `${rows}×${cols}×${featureMaps.value.length}`
})

const inputWindow = computed<HighlightWindow | null>(() => {
  const cell = visualsStore.selectedInputCell
  if (!cell) return null
  return { row: cell.row, col: cell.col, size: networkStore.convConfig.kernelSize }
})
const strideRef = computed(() => networkStore.convConfig.stride)
const reluCell = useConvOutputCell(inputWindow, strideRef)
const projectionWindow = cellToPointWindow(reluCell)
</script>

<template>
  <Card class="w-75 border-l-[3px]" :style="{ borderLeftColor: 'var(--color-dense)' }">
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle class="flex items-center gap-1.5 text-[13px] font-semibold">
        <span class="h-2 w-2 rounded-full" style="background: var(--color-dense)" />
        ReLU
      </CardTitle>
      <span class="text-[11px] text-muted-foreground">{{ outputShapeLabel }}</span>
    </CardHeader>

    <CardContent class="flex flex-col gap-3">
      <div>
        <p class="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Activation maps
        </p>
        <LayerGrid :maps="featureMaps" normalize-as-layer accent-color-var="var(--color-dense)" :projection-window="visualsStore.showInputWindow ? projectionWindow : null" />
      </div>
    </CardContent>
  </Card>
</template>
