<script setup lang="ts">
import { computed } from 'vue'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { FeatureMaps } from '@/types/tensor'
import { findLayerRange, grayscaleToHex } from '@/utils/colorScale'
import { LucideCircleQuestionMark, LucideMinus } from '@lucide/vue'

const props = defineProps<{
  maps: FeatureMaps
}>()

function formatValue(value: number): string {
  const rounded = value.toFixed(2)
  return rounded === '-0.00' ? '0.00' : rounded
}

const range = computed(() => findLayerRange(props.maps))

const minSwatchColor = grayscaleToHex(0)
const maxSwatchColor = grayscaleToHex(1)
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <Button type="button" class="inline-flex items-center" aria-label="Color scale">
          <LucideCircleQuestionMark class="ml-1.5 h-3 w-3 stroke-muted-foreground/50" />
        </button>
      </TooltipTrigger>
      <TooltipContent class="max-w-60 text-[11px] text-muted-foreground">
        <div class="flex gap-1 items-center">
          <div class="flex items-center gap-1.5">
            <span
              class="h-3 w-3 shrink-0 rounded-sm border border-border/40"
              :style="{ backgroundColor: minSwatchColor }"
            />
            <span>{{ formatValue(range.min) }}</span>
          </div>
          <LucideMinus class="h-3 w-3 shrink-0 text-muted-foreground" />
          <div class="flex items-center gap-1.5">
            <span
              class="h-3 w-3 shrink-0 rounded-sm border border-border"
              :style="{ backgroundColor: maxSwatchColor }"
            />
            <span>{{ formatValue(range.max) }}</span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
