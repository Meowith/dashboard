<script setup lang="ts">
import {fromOwnedApps} from "@/models/entity";
import AppTile from "@/components/apps/AppTile.vue";
import {onMounted, watch} from "vue";
import {listOwnedApps} from "@/service/app-management";
import {useStateStore} from "@/stores/state";
import {storeToRefs} from "pinia";

const props = defineProps<{
  refresh: boolean
}>()
const {setApps} = useStateStore()
const {ownApps} = storeToRefs(useStateStore())

watch(() => props.refresh, () => {
  fetchApps()
})

async function fetchApps() {
  setApps(fromOwnedApps(await listOwnedApps()))
}

onMounted(fetchApps)

</script>

<template>
  <div class="flex flex-wrap flex-row gap-4" v-if="ownApps">
    <AppTile v-for="app in ownApps!.apps" :key="app.id" :app="app"/>
  </div>
</template>

<style scoped>

</style>
