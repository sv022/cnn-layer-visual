<script setup lang="ts">
import { computed } from 'vue'
import type { FeatureMaps } from '@/types/tensor'
import MatrixTile from './MatrixTile.vue'
import { useVisualsStore } from '@/stores/visuals'
import { normalizeLayer } from '@/utils/colorScale'

const props = withDefaults(
  defineProps<{
    maps: FeatureMaps
    normalizeAsLayer?: boolean
    accentColorVar?: string
    columns?: number
  }>(),
  {
    normalizeAsLayer: true,
    accentColorVar: 'var(--color-convolution)',
    columns: 2,
  },
)

const visualsStore = useVisualsStore()

const displayMaps = computed<FeatureMaps>(() =>
  props.normalizeAsLayer ? normalizeLayer(props.maps) : props.maps,
)

function handleHover(index: number, hovered: boolean) {
  visualsStore.setHoveredChannel(hovered ? index : null)
}
</script>

<template>
  <div class="grid gap-1.5" :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }">
    <MatrixTile
      v-for="(matrix, index) in displayMaps"
      :key="index"
      :matrix="matrix"
      is-pre-normalized
      :is-active="visualsStore.hoveredChannelIndex === index"
      :accent-color-var="accentColorVar"
      @select="visualsStore.setHoveredChannel(index)"
      @hover="(hovered: boolean) => handleHover(index, hovered)"
    />
  </div>
</template>
