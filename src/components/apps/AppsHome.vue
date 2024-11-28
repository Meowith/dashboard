<script lang="ts" setup>
import {fromOwnedApps} from "@/models/entity";
import AppTile from "@/components/apps/AppTile.vue";
import {onMounted, watch} from "vue";
import {listOwnedApps} from "@/service/app-management";
import {useStateStore} from "@/stores/state";
import {storeToRefs} from "pinia";
import {useTranslation} from "i18next-vue";

const props = defineProps<{
  refresh: boolean
}>()
const {setApps} = useStateStore()
const {ownApps} = storeToRefs(useStateStore())
const {t} = useTranslation();

watch(() => props.refresh, () => {
  fetchApps()
})

async function fetchApps() {
  setApps(fromOwnedApps(await listOwnedApps()))
}

let interval: ReturnType<typeof setInterval>;
onMounted(() => {
  fetchApps()
  interval = setInterval(fetchApps, 30000)
})

onMounted(() => {
  clearInterval(interval)
})

</script>

<template>
  <div v-if="ownApps && ownApps.apps.length > 0" class="flex flex-wrap flex-row gap-4">
    <AppTile v-for="app in ownApps!.apps" :key="app.id" :app="app" class="flex-grow"/>
  </div>
  <div v-else-if="ownApps && ownApps.apps.length == 0" class="flex justify-center items-center flex-col gap-2 flex-grow">
    <span class="pi pi-home text-gray-400" style="font-size: 5rem"></span>
    <span class="text-thin text-gray-400 m-3">{{ t('home.empty') }}</span>
  </div>
</template>

<style scoped>

</style>
