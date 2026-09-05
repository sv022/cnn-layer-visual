import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useVisualsStore = defineStore('visuals', () => {
  const showPixelValues = ref(true)
  const showInputWindow = ref(true)
  const showPixelBorders = ref(false)
  const hoveredChannelIndex = ref<number | null>(null)

  const selectedInputCell = ref<{ row: number; col: number } | null>(null)

  function setHoveredChannel(index: number | null) {
    hoveredChannelIndex.value = index
  }

  function setSelectedInputCell(cell: { row: number; col: number } | null) {
    selectedInputCell.value = cell
  }

  return {
    showPixelValues,
    showInputWindow,
    showPixelBorders,
    hoveredChannelIndex,
    selectedInputCell,
    setHoveredChannel,
    setSelectedInputCell,
  }
})
