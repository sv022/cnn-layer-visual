import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useVisualsStore = defineStore('visuals', () => {
  const showPixelValues = ref(true)
  const showPixelBorders = ref(false)
  const hoveredChannelIndex = ref<number | null>(null)

  function setHoveredChannel(index: number | null) {
    hoveredChannelIndex.value = index
  }

  return {
    showPixelValues,
    showPixelBorders,
    hoveredChannelIndex,
    setHoveredChannel,
  }
})
