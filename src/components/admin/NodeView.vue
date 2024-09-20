<script setup lang="ts">

import type {DashboardNode, StorageNode} from "@/dto/admin";
import {ref} from "vue";
import StorageNodeTile from "@/components/admin/StorageNodeTile.vue";
import DashboardNodeTile from "@/components/admin/DashboardNodeTile.vue";
import {useTranslation} from "i18next-vue";

const dashboards = ref<DashboardNode[]>([]);
const nodes = ref<StorageNode[]>([]);

const {t} = useTranslation();

</script>

<template>
  <Panel :header="t('admin.nodes.storage')">
    <div class="flex flex-row flex-wrap gap-2">
      <StorageNodeTile v-for="node in nodes" :key="node.id" :node="node" />
    </div>
  </Panel>
  <Panel :header="t('admin.nodes.dashboard')">
    <div class="flex flex-row flex-wrap gap-2">
      <DashboardNodeTile v-for="node in dashboards" :key="node.id" :node="node" />
    </div>
  </Panel>
</template>

<style scoped>

</style>