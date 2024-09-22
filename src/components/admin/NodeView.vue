<script setup lang="ts">

import {type DashboardNode, MicroserviceType, type StorageNode} from "@/dto/admin";
import {computed, onMounted, onUnmounted, ref} from "vue";
import StorageNodeTile from "@/components/admin/StorageNodeTile.vue";
import DashboardNodeTile from "@/components/admin/DashboardNodeTile.vue";
import {useTranslation} from "i18next-vue";
import {fetchNodeStatus} from "@/service/node-management";
import {filesize} from "filesize";

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
          max_space: node.max_space || 0,
          used_space: node.used_space || 0,
          last_beat: new Date(node.last_beat)
        });
      } else if (node.microservice_type == MicroserviceType.Dashboard) {
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

const maxSpace = computed(() => {
  let sum = 0;
  for (let node of nodes.value) {
    sum += node.max_space
  }
  return sum
})

const usedSpace = computed(() => {
  let sum = 0;
  for (let node of nodes.value) {
    sum += node.used_space
  }
  return sum
})

const percent = computed(() => {
  if (usedSpace.value < 0) {
    return 0;
  }
  return usedSpace.value / maxSpace.value * 100
})

const nodesAlive = computed(() => {
  let sum = 0;
  let now = new Date();
  nodes.value.forEach(node => {
    let duration = now.valueOf() - node.last_beat.valueOf();
    if (duration < 2 * 60000) {
      sum++
    }
  });
  return sum
})

const dashboardsAlive = computed(() => {
  let sum = 0;
  let now = new Date();
  dashboards.value.forEach(node => {
    let duration = now.valueOf() - node.last_beat.valueOf();
    if (duration < 2 * 60000) {
      sum++
    }
  });
  return sum
})


</script>

<template>
  <div class="flex flex-wrap gap-4">
    <Panel>
      <template #header>
        <div class="col-span-2 text-sm items-center gap-2 flex">
          <i class="pi pi-database"></i>
          <span>{{ t('admin.tiles.storage.storage') }}</span>
        </div>
      </template>
      <div class="flex flex-row gap-2 items-center">
        <knob :model-value="percent" :valueTemplate="(n) => n.toFixed(0)+'%'" readonly></knob>
        <div class="grid grid-cols-2 h-18">
          <span>{{ t('admin.tiles.storage.max') }}</span>
          <span v-tooltip="maxSpace + 'B'">{{ filesize(maxSpace, {standard: "jedec"}) }}</span>
          <span>{{ t('admin.tiles.storage.used') }}</span>
          <span v-tooltip="usedSpace + 'B'">{{ filesize(usedSpace, {standard: "jedec"}) }}</span>
        </div>
      </div>
    </Panel>
    <Panel :header="t('admin.nodes.nodes')">
      <div class="flex flex-row gap-2 items-center">
        <div class="grid grid-cols-2 h-18 items-center">
          <span>{{ t('admin.nodes.storages') }}</span>
          <Badge class="ml-2" size="small" :severity="nodesAlive == nodes.length ? 'success' : 'error'">
            {{ nodesAlive }} / {{ nodes.length }}
          </Badge>
          <span>{{ t('admin.nodes.dashboards') }}</span>
          <Badge class="ml-2" size="small" :severity="dashboardsAlive == dashboards.length ? 'success' : 'error'">
            {{ dashboardsAlive }} / {{ dashboards.length }}
          </Badge>
        </div>
      </div>
    </Panel>
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
  </div>
</template>

<style scoped>

</style>