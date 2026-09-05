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
import {
  kernelPresetCatalog,
  type DatasetId,
  type KernelPresetMeta,
} from '@/utils/kernelPresetCatalog'
import { LucideCheck, LucideChevronDown } from '@lucide/vue'

const props = defineProps<{
  modelValue: DatasetId
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: DatasetId): void
}>()

const selectedPreset = computed<KernelPresetMeta | undefined>({
  get: () => kernelPresetCatalog.find((p) => p.value === props.modelValue),
  set: (preset) => {
    if (preset) emit('update:modelValue', preset.value)
  },
})
</script>

<template>
  <Combobox v-model="selectedPreset" by="value">
    <ComboboxAnchor as-child>
      <ComboboxTrigger as-child>
        <Button variant="outline" size="sm" class="h-7 w-37.5 justify-between px-2 text-[11px]">
          <span class="truncate">{{ selectedPreset?.label ?? 'Выбрать фильтры' }}</span>
          <LucideChevronDown class="size-3.5 shrink-0 text-muted-foreground" />
        </Button>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxList class="w-72" align="start">
      <ComboboxInput placeholder="Поиск набора фильтров..." />
      <ComboboxViewport class="max-h-65">
        <ComboboxEmpty>Ничего не найдено.</ComboboxEmpty>
        <ComboboxItem v-for="preset in kernelPresetCatalog" :key="preset.value" :value="preset">
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
