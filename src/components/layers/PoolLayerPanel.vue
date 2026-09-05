<script setup lang="ts">
import { computed } from 'vue'
import { useNetworkStore } from '@/stores/network'
import { useVisualsStore } from '@/stores/visuals'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import type { PoolMode } from '@/types/layer'
import LayerGrid from './conv/LayerGrid.vue'
import LabeledStepper from './conv/LabeledStepper.vue'
import { useConvOutputCell, usePoolProjection, cellToPointWindow } from '@/composables/usePixelProjection'
import type { HighlightWindow } from '@/composables/useKernelHighlight'

const networkStore = useNetworkStore()
const visualsStore = useVisualsStore()

const featureMaps = computed(() => networkStore.poolOutput)

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
const convStrideRef = computed(() => networkStore.convConfig.stride)
const sourceCell = useConvOutputCell(inputWindow, convStrideRef)

const poolWindowSizeRef = computed(() => networkStore.poolConfig.windowSize)
const poolStrideRef = computed(() => networkStore.poolConfig.stride)
const { poolCell } = usePoolProjection(sourceCell, poolWindowSizeRef, poolStrideRef)
const projectionWindow = cellToPointWindow(poolCell)

const poolModes: { value: PoolMode; label: string }[] = [
  { value: 'max', label: 'Max' },
  { value: 'average', label: 'Average' },
]

function selectMode(mode: PoolMode) {
  networkStore.updatePoolConfig({ mode })
}

function updateWindowSize(value: number) {
  networkStore.updatePoolConfig({ windowSize: Math.max(2, value) })
}

function updateStride(value: number) {
  networkStore.updatePoolConfig({ stride: Math.max(1, value) })
}
</script>

<template>
  <Card class="w-75 border-l-[3px]" :style="{ borderLeftColor: 'var(--color-pooling)' }">
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle class="flex items-center gap-1.5 text-[13px] font-semibold">
        <span class="h-2 w-2 rounded-full" style="background: var(--color-pooling)" />
        Pooling
      </CardTitle>
      <span class="text-[11px] text-muted-foreground">{{ outputShapeLabel }}</span>
    </CardHeader>

    <CardContent class="flex flex-col gap-3">
      <div>
        <p class="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Feature maps
        </p>
        <LayerGrid
          :maps="featureMaps"
          normalize-as-layer
          accent-color-var="var(--color-pooling)"
          :projection-window="projectionWindow"
        />
      </div>

      <Separator />

      <div class="flex flex-col gap-1.5">
        <Label class="text-[11px] text-muted-foreground">Pooling mode</Label>
        <div class="flex overflow-hidden rounded-md border border-border text-[12px]">
          <button
            v-for="modeOption in poolModes"
            :key="modeOption.value"
            class="flex-1 py-1.5"
            :class="
              networkStore.poolConfig.mode === modeOption.value
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground'
            "
            @click="selectMode(modeOption.value)"
          >
            {{ modeOption.label }}
          </button>
        </div>
      </div>

      <div class="flex gap-2.5">
        <LabeledStepper
          :model-value="networkStore.poolConfig.windowSize"
          label="Window size"
          :min="2"
          :max="4"
          @update:model-value="updateWindowSize"
        />
        <LabeledStepper
          :model-value="networkStore.poolConfig.stride"
          label="Stride"
          :min="1"
          :max="4"
          @update:model-value="updateStride"
        />
      </div>
    </CardContent>
  </Card>
</template>
