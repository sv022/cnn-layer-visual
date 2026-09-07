<script setup lang="ts">
import { Badge } from '@/components/ui/badge'

interface LayerTypeTag {
  label: string
  colorVar: string
}

const layerTypes: LayerTypeTag[] = [
  { label: 'Input', colorVar: 'var(--color-input)' },
  { label: 'Convolution', colorVar: 'var(--color-convolution)' },
  { label: 'Activation', colorVar: 'var(--color-activation)' },
  { label: 'Pooling', colorVar: 'var(--color-pooling)' },
]
</script>

<template>
  <header class="flex items-center gap-2.5 border-b border-border px-7 py-3.5">
    <h1 class="mr-auto text-[15px] font-semibold">CNN Layer Visualizer</h1>

    <Badge
      v-for="layer in layerTypes"
      :key="layer.label"
      variant="outline"
      class="gap-1.5 rounded-full text-[11px] font-medium text-muted-foreground"
    >
      <span class="h-1.5 w-1.5 rounded-full" :style="{ backgroundColor: layer.colorVar }" />
      {{ layer.label }}
    </Badge>
  </header>
</template>
