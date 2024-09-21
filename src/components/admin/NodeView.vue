<script setup lang="ts">

import {type DashboardNode, MicroserviceType, type StorageNode} from "@/dto/admin";
import {onMounted, onUnmounted, ref} from "vue";
import StorageNodeTile from "@/components/admin/StorageNodeTile.vue";
import DashboardNodeTile from "@/components/admin/DashboardNodeTile.vue";
import {useTranslation} from "i18next-vue";
import {fetchNodeStatus} from "@/service/node-management";

const dashboards = ref<DashboardNode[]>([]);
const nodes = ref<StorageNode[]>([]);

const {t} = useTranslation();
let timer: ReturnType<typeof setInterval>;

async function fetchNodes() {
  try {
      let status = await fetchNodeStatus();
      let new_dashboards: DashboardNode[] = [];
      let new_nodes: StorageNode[] = [];
      status.nodes.forEach(node => {
        if (node.microservice_type == MicroserviceType.StorageNode) {
          new_nodes.push({
            access_token_issued_at: new Date(node.access_token_issued_at),
            addr: node.address,
            created: new Date(node.created),
            id: node.id,
            max_space: node.max_space || -1,
            used_space: node.used_space || -1,
            last_beat: new Date(node.last_beat)
          });
        } else {
          new_dashboards.push({
            access_token_issued_at: new Date(node.access_token_issued_at),
            addr: node.address,
            created: new Date(node.created),
            id: node.id,
            last_beat: new Date(node.last_beat)
          })
        }
      })
    nodes.value = new_nodes
    dashboards.value = new_dashboards
    } catch (ignored) {
    }
}

fetchNodes()

onMounted(() => {
  timer = setInterval(async () => {
    await fetchNodes()
  }, 60000)
})

onUnmounted(() => {
  clearInterval(timer);
})

</script>

<template>
  <Panel :header="t('admin.nodes.storage')">
    <div class="flex flex-row flex-wrap gap-2">
      <StorageNodeTile v-for="node in nodes" :key="node.id" :node="node"/>
    </div>
  </Panel>
  <Panel :header="t('admin.nodes.dashboard')">
    <div class="flex flex-row flex-wrap gap-2">
      <DashboardNodeTile v-for="node in dashboards" :key="node.id" :node="node"/>
    </div>
  </Panel>
</template>

<style scoped>

</style>