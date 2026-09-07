<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxTrigger,
  ComboboxViewport,
} from '@/components/ui/combobox'
import { Loader2, LucideCheck, LucideChevronDown } from '@lucide/vue'
import { kernelPresetCatalog } from '@/utils/kernelPresetCatalog'

const props = defineProps<{
  modelValue: string
  isLoading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const selectedLabel = computed(
  () => kernelPresetCatalog.find((p) => p.id === props.modelValue)?.label,
)

function handleSelect(value: unknown) {
  if (typeof value === 'string' && value.length > 0) {
    emit('update:modelValue', value)
  }
}

function displayValue() {
  return ''
}
</script>

<template>
  <Combobox :model-value="modelValue" @update:model-value="handleSelect">
    <ComboboxAnchor as-child>
      <ComboboxTrigger as-child>
        <Button variant="outline" size="sm" class="h-7 w-45 justify-between px-2 text-[11px]">
          <span class="flex items-center gap-1.5 truncate">
            <Loader2 v-if="isLoading" class="size-3 animate-spin" />
            {{ selectedLabel ?? 'Select preset' }}
          </span>
          <LucideChevronDown class="size-3.5 shrink-0 text-muted-foreground" />
        </Button>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxList class="w-80" align="end">
      <ComboboxInput :display-value="displayValue" placeholder="Search for presets" />
      <ComboboxViewport class="max-h-75">
        <ComboboxEmpty>No results found.</ComboboxEmpty>
        <ComboboxItem v-for="preset in kernelPresetCatalog" :key="preset.id" :value="preset.id">
          <div class="flex flex-col gap-0.5">
            <span>{{ preset.label }}</span>
            <span class="text-[11px] text-muted-foreground">{{ preset.description }}</span>
          </div>
          <ComboboxItemIndicator>
            <LucideCheck class="size-4" />
          </ComboboxItemIndicator>
        </ComboboxItem>
      </ComboboxViewport>
    </ComboboxList>
  </Combobox>
</template>
