<script lang="ts" setup>

import {type DashboardNode, MicroserviceType, type ServiceRegisterCodeDto, type StorageNode} from "@/dto/admin";
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import StorageNodeTile from "@/components/admin/StorageNodeTile.vue";
import DashboardNodeTile from "@/components/admin/DashboardNodeTile.vue";
import {useTranslation} from "i18next-vue";
import {deleteNodeRegisterCode, fetchNodeStatus, listNodeRegisterCodes} from "@/service/node-management";
import {filesize} from "filesize";

const dashboards = ref<DashboardNode[]>([]);
const nodes = ref<StorageNode[]>([]);

const props = defineProps<{
  newCode: boolean
}>()

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

const codes = ref<ServiceRegisterCodeDto[]>([]);

async function fetchCodes() {
  try {
    codes.value = await listNodeRegisterCodes()
  } catch (e) {
  }
}

async function deleteCode(code: string) {
  try {
    await deleteNodeRegisterCode(code)
    await fetchCodes()
  } catch (e) {
  }
}

watch(() => props.newCode, async () => {
  await fetchCodes()
})

fetchNodes()
fetchCodes()
onMounted(() => {
  timer = setInterval(async () => {
    await fetchNodes()
    await fetchCodes()
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
    <Panel class="flex-grow">
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
    <Panel :header="t('admin.nodes.nodes')" class="flex-grow">
      <div class="flex flex-row gap-2 items-center w-full">
        <div class="grid grid-cols-2 h-18 items-center w-full">
          <span>{{ t('admin.nodes.storages') }}</span>
          <Badge :severity="nodesAlive == nodes.length ? 'success' : 'error'" class="ml-2" size="small">
            {{ nodesAlive }} / {{ nodes.length }}
          </Badge>
          <span>{{ t('admin.nodes.dashboards') }}</span>
          <Badge :severity="dashboardsAlive == dashboards.length ? 'success' : 'error'" class="ml-2" size="small">
            {{ dashboardsAlive }} / {{ dashboards.length }}
          </Badge>
        </div>
      </div>
    </Panel>
    <Panel :header="t('admin.codes.title')" class="flex-grow">
      <div class="flex w-full justify-center h-full">
        <VirtualScroller :itemSize="50" :items="codes"
                         class="border border-surface-200 dark:border-surface-700 rounded min-h-40 w-72 sm:w-96 h-full">
          <template v-slot:item="{ item, options }">
            <div :class="['flex items-center p-2 gap-2', { 'bg-surface-100 dark:bg-surface-800': options.odd }]"
                 style="height: 50px">
              <div class="flex flex-col gap-1">
                <span :class="'font-mono text-xs ' + (item.valid ? 'text-green-400' : 'text-red-400')">{{ item.code }}</span>
                <span class="font-thin text-xs">{{ new Date(item.created).toLocaleString() }}</span>
              </div>
              <i v-if="item.valid" class="pi pi-check text-green-400"></i>
              <i v-tooltip="t('admin.codes.invalid')" v-else class="pi pi-times text-red-400"></i>
              <div class="flex-grow flex justify-end">
                <Button class="justify-self-end" icon="pi pi-trash" outlined severity="danger"
                        @click="deleteCode(item.code)"></Button>
              </div>
            </div>
          </template>
        </VirtualScroller>
      </div>
    </Panel>
    <Panel :header="t('admin.nodes.dashboard')" class="flex-grow">
      <div class="flex flex-row flex-wrap gap-2">
        <DashboardNodeTile v-for="node in dashboards" :key="node.id" :node="node" class="flex-grow"/>
      </div>
    </Panel>
    <Panel :header="t('admin.nodes.storage')" class="flex-grow">
      <div class="flex flex-row flex-wrap gap-2">
        <StorageNodeTile v-for="node in nodes" :key="node.id" :node="node" class="flex-grow"/>
      </div>
    </Panel>
  </div>
</template>

<style scoped>
</style>