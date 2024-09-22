<script setup lang="ts">
import type {App} from "@/models/entity";
import AppTile from "@/components/apps/AppTile.vue";

const testData: App[] = [
  {
    name: 'Netflix',
    id: '33606455-9890-4e33-a317-d7178967b1dc',
    quota: 2000000000,
    created: new Date('2024-09-19T15:26:33.363629Z'),
    last_modified: new Date('2025-02-19T15:26:33.363629Z')
  }
]
</script>

<template>
  <div class="flex flex-wrap flex-row gap-4">
    <AppTile v-for="app in testData" :key="app.id" :app="app"/>
  </div>
</template>

<style scoped>

</style>
