<script lang="ts" setup>

import {storeToRefs} from "pinia";
import {useStateStore} from "@/stores/state";
import {onMounted, ref} from "vue";
import {type App, fromOwnedApps} from "@/models/entity";
import {useRoute} from "vue-router";
import {listOwnedApps} from "@/service/app-management";

const {ownApps} = storeToRefs(useStateStore())
const currentApp = ref<App>()
const route = useRoute()
const {setApps} = useStateStore()

async function fetchApps() {
  setApps(fromOwnedApps(await listOwnedApps()))
}

onMounted(async () => {
  let id = route.params['id']
  let app: App | undefined = ownApps.value?.apps.find(x => x.id == id)
  if (!app) {
    await fetchApps()
    app = ownApps.value?.apps.find(x => x.id == id)
  }
  currentApp.value = app
})
</script>

<template>

</template>

<style scoped>

</style>