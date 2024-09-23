<script setup lang="ts">
import type {Bucket} from "@/models/entity";

const props = defineProps<{
  bucket: Bucket
}>()

</script>

<template>
<Panel :header="bucket.name">

</Panel>
</template>

<style scoped>

</style>