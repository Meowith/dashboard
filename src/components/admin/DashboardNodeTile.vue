<script setup lang="ts">
import type {DashboardNode} from "@/dto/admin";
import NodeTile from "@/components/admin/NodeTile.vue";

const props = defineProps<{
  node: DashboardNode
}>()
</script>

<template>
  <NodeTile :node="node">
  </NodeTile>
</template>

<style scoped>

</style>