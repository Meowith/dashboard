<script setup lang="ts">
import type {App} from "@/models/entity";

const testData: App[] = [
  { name: 'Netflix', id: '33606455-9890-4e33-a317-d7178967b1dc', quota: 2000000000, created: '2024-09-19T15:26:33.363629Z', last_modified: '2025-02-19T15:26:33.363629Z' }
]
</script>

<template>
<div v-for="app in testData" :key="app.id">
  {{app}}
</div>
</template>

<style scoped>

</style>
