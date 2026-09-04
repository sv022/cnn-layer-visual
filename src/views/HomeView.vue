<script setup lang="ts">
import TopBar from '@/components/layout/TopBar.vue'
import PipelineLayout from '@/components/layout/PipelineLayout.vue'
import InputImage from '@/components/layers/InputImage.vue'
import ConvLayerPanel from '@/components/layers/ConvLayerPanel.vue'
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <TopBar />

    <PipelineLayout>
      <InputImage />
      <ConvLayerPanel />
    </PipelineLayout>
  </div>
</template>
