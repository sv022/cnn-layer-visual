<script setup lang="ts">
import TopBar from '@/components/layout/TopBar.vue'
import PipelineLayout from '@/components/layout/PipelineLayout.vue'
import InputImage from '@/components/layers/InputImage.vue'
import ConvLayerPanel from '@/components/layers/ConvLayerPanel.vue'
import ReluLayerPanel from '@/components/layers/ReluLayerPanel.vue';
import PoolLayerPanel from '@/components/layers/PoolLayerPanel.vue';
import StageConnector from '@/components/layout/StageConnector.vue';
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <TopBar />

    <PipelineLayout>
      <InputImage />
      <StageConnector />
      <ConvLayerPanel />
      <StageConnector />
      <ReluLayerPanel />
      <StageConnector />
      <PoolLayerPanel />
    </PipelineLayout>
  </div>
</template>
