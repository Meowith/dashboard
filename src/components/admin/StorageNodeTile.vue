<script setup lang="ts">
import type {StorageNode} from "@/dto/admin";

const props = defineProps<{
  node: StorageNode
}>()

</script>

<template>
  {{ node }}
</template>

<style scoped>

</style>