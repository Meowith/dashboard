<script lang="ts" setup>
import {storeToRefs} from "pinia";
import {useStateStore} from "@/stores/state";
import {onMounted, ref} from "vue";
import {type App, fromOwnedApps} from "@/models/entity";
import {useRoute} from "vue-router";
import {listAppMembers, listOwnedApps} from "@/service/app-management";
import type {MemberDto} from "@/dto/app";

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
  await fetchMembers()
})

const members = ref<MemberDto[]>([])
async function fetchMembers() {
  members.value = (await listAppMembers(currentApp.value!.id)).members
}

</script>

<template>
  <Panel header="todo">
    <DataTable :value="members" tableStyle="min-width: 50rem">
      <Column field="member_id" header="ID"></Column>
      <Column field="member_roles" header="Roles"></Column>
    </DataTable>
  </Panel>
</template>

<style scoped>

</style>