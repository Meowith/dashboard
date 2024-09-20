<script setup lang="ts">
import type {DashboardNode} from "@/dto/admin";

const props = defineProps<{
  node: DashboardNode
}>()
</script>

<template>
{{ node}}
</template>

<style scoped>

</style>