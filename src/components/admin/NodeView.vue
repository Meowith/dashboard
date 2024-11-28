<script lang="ts" setup>

import {type DashboardNode, MicroserviceType, type ServiceRegisterCodeDto, type StorageNode} from "@/dto/admin";
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import StorageNodeTile from "@/components/admin/StorageNodeTile.vue";
import DashboardNodeTile from "@/components/admin/DashboardNodeTile.vue";
import {useTranslation} from "i18next-vue";
import {deleteNodeRegisterCode, fetchNodeStatus, listNodeRegisterCodes} from "@/service/node-management";
import {filesize} from "filesize";
import ConfirmDialog from "primevue/confirmdialog";

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
          type: node.microservice_type,
          access_token_issued_at: new Date(node.access_token_issued_at),
          addr: node.address,
          created: new Date(node.created),
          id: node.id,
          info: node.info || {
            max_space: 0,
            used_space: 0,
            commited: 0,
            reserved: 0,
            uncommitted: 0,
          },
          last_beat: new Date(node.last_beat)
        });
      } else if (node.microservice_type == MicroserviceType.Dashboard) {
        new_dashboards.push({
          type: node.microservice_type,
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
  }, 10000)
})

onUnmounted(() => {
  clearInterval(timer);
})

const maxSpace = computed(() => {
  let sum = 0;
  for (let node of nodes.value) {
    sum += node.info.max_space
  }
  return sum
})

const usedSpace = computed(() => {
  let sum = 0;
  for (let node of nodes.value) {
    sum += node.info.used_space
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
    <Panel class="flex-grow full-height-panel-content">
      <template #header>
        <div class="col-span-2 items-center gap-2 flex">
          <i class="pi pi-database"></i>
          <span class="p-panel-title text-base">{{ t('admin.tiles.storage.storage') }}</span>
        </div>
      </template>
      <div class="flex flex-row gap-2 items-center justify-center h-full" style="padding: 18px">
        <knob :model-value="percent" :valueTemplate="(n) => n.toFixed(0) + '%'" readonly></knob>
        <div class="grid grid-cols-2 h-18">
          <span>{{ t('admin.tiles.storage.max') }}</span>
          <span v-tooltip="maxSpace + 'B'">{{ filesize(maxSpace, {standard: "jedec"}) }}</span>
          <span>{{ t('admin.tiles.storage.used') }}</span>
          <span v-tooltip="usedSpace + 'B'">{{ filesize(usedSpace, {standard: "jedec"}) }}</span>
        </div>
      </div>
    </Panel>
    <Panel class="flex-grow full-height-panel-content min-h-48 min-w-72">
      <template #header>
        <div class="col-span-2 items-center gap-2 flex">
          <i class="pi pi-barcode"></i>
          <span class="p-panel-title text-base">{{ t('admin.codes.title') }}</span>
        </div>
      </template>
      <VirtualScroller :itemSize="50" :items="codes" v-if="codes.length > 0">
                       class="sm:w-96 rounded fill-panel">
        <template v-slot:item="{ item, options }">
          <div :class="['flex items-center p-2 gap-2', { 'bg-surface-100 dark:bg-surface-800': options.odd }]"
               style="height: 50px">
            <i v-if="item.valid" class="pi pi-check text-green-400 mx-2"></i>
            <i v-tooltip="t('admin.codes.invalid')" v-else class="pi pi-times text-red-400 mx-2"></i>
            <div class="flex flex-col gap-1">
              <span :class="'font-mono text-xs ' + (item.valid ? 'text-green-400' : 'text-red-400')">{{
                  item.code
                }}</span>
              <span class="font-thin text-xs">{{ new Date(item.created).toLocaleString() }}</span>
            </div>
            <div class="flex-grow flex justify-end">
              <Button class="justify-self-end" icon="pi pi-trash" outlined severity="danger"
                      @click="deleteCode(item.code)"></Button>
            </div>
          </div>
        </template>
      </VirtualScroller>
      <div class="flex flex-col text-sm justify-center items-center h-full text-gray-500" style="padding: 0 18px 18px;">
        <i class="pi pi-warehouse"></i>
        <span>{{t('admin.codes.none')}}</span>
      </div>
    </Panel>
    <Panel class="flex-grow">
      <template #header>
        <div class="col-span-2 items-center flex">
          <i class="pi pi-desktop"></i>
          <span class="ml-2 p-panel-title text-base">{{ t('admin.nodes.dashboard') }}</span>
          <divider layout="vertical"/>
          <ProgressBar class="w-24" :value="dashboardsAlive / dashboards.length * 100">
            {{ dashboardsAlive }} / {{ dashboards.length }}
          </ProgressBar>
        </div>
      </template>
      <div class="flex flex-row flex-wrap" style="gap: 18px">
        <DashboardNodeTile v-for="node in dashboards" :key="node.id" :node="node" class="flex-grow"/>
      </div>
    </Panel>
    <Panel class="flex-grow">
      <template #header>
        <div class="col-span-2 items-center flex">
          <i class="pi pi-cloud-download"></i>
          <span class="ml-2 p-panel-title text-base">{{ t('admin.nodes.storage') }}</span>
          <divider layout="vertical"></divider>
          <ProgressBar class="w-24" :value="nodesAlive / nodes.length * 100">
            {{ nodesAlive }} / {{ nodes.length }}
          </ProgressBar>
        </div>
      </template>
      <div class="flex flex-row flex-wrap" style="gap: 18px">
        <StorageNodeTile v-for="node in nodes" :key="node.id" :node="node" class="flex-grow"/>
      </div>
    </Panel>
  </div>
  <ConfirmDialog></ConfirmDialog>
</template>

<style lang="scss">
.fill-panel {
  min-width: max(100%, 16rem);
  min-height: max(100%, 5rem);
}

.full-height-panel-content {
  display: flex;
  flex-direction: column;

  & .p-panel-content {
    height: 100%;
    padding: 0 !important;
  }

  & .p-panel-content-container {
    flex-grow: 1;
  }
}
</style>