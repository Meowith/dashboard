<script lang="ts" setup>

import {onMounted, ref, watch} from "vue";
import {type App, type Bucket, bucketFrom, fromOwnedApps, type UserRole, userRoleFrom} from "@/models/entity";
import {useRoute} from "vue-router";
import {storeToRefs} from "pinia";
import {useStateStore} from "@/stores/state";
import {useTranslation} from "i18next-vue";
import {listBuckets, listOwnedApps} from "@/service/app-management";
import {deleteRole, getRoles} from "@/service/role-management";
import {useToast} from "primevue/usetoast";
import {errorToast} from "@/service/error";

const {t} = useTranslation()

const {ownApps} = storeToRefs(useStateStore())
const currentApp = ref<App>()
const route = useRoute()
const {setApps} = useStateStore()
const permEditOpen = ref(false)
const permEdit = ref('')
const props = defineProps<{
  refresh: boolean
}>()
const toast = useToast()

async function fetchApps() {
  setApps(fromOwnedApps(await listOwnedApps()))
}

watch(() => props.refresh, () => {
  fetchRoles()
})

onMounted(async () => {
  let id = route.params['id']
  let app: App | undefined = ownApps.value?.apps.find(x => x.id == id)
  if (!app) {
    await fetchApps()
    app = ownApps.value?.apps.find(x => x.id == id)
  }
  currentApp.value = app
  await fetchRoles()
})

const roles = ref<UserRole[]>([])

async function fetchRoles() {
  roles.value = (await getRoles(currentApp.value!.id)).roles.map(userRoleFrom)
}

const buckets = ref<Bucket[]>([])
const {setBuckets, currentBuckets} = useStateStore()

async function fetchBuckets() {
  if (currentBuckets) {
    return
  }
  try {
    let new_buckets = await listBuckets(currentApp.value!.id)
    buckets.value = []
    new_buckets.buckets.forEach(bucket => {
      buckets.value.push(bucketFrom(bucket))
    })
    setBuckets(buckets.value)
  } catch (e) {
  }
}

async function doDeleteRole(name: string) {
  try {
    await deleteRole(currentApp.value!.id, name)
    await fetchRoles()
  } catch (e) {
    errorToast(toast, e)
  }
}

</script>

<template>
  <div class="flex flex-wrap gap-4">
    <Panel :header="t('app.roles.title')" class="w-full">
      <Dialog v-model:visible="permEditOpen" :header="permEdit" modal>

      </Dialog>
      <DataTable :value="roles">
        <Column :header="t('app.roles.table-cols.name')" field="name"/>
        <Column :header="t('app.roles.table-cols.created')" field="created">
          <template #body="slotProps">
            {{ slotProps.data.created.toLocaleString() }}
          </template>
        </Column>
        <Column :header="t('app.roles.table-cols.last-modified')" field="last_modified">
          <template #body="slotProps">
            {{ slotProps.data.last_modified.toLocaleString() }}
          </template>
        </Column>
        <Column :header="t('app.roles.table-cols.scopes')" field="scopes">
          <template #body="slotProps">
            {{ slotProps.data.scopes }}
          </template>
        </Column>
        <Column :header="t('app.roles.table-cols.action')" field="actions">
          <template #body="slotProps">
            <Button class="mr-2" icon="pi pi-pencil" severity="info"
                    @click="permEdit = slotProps.data.name; permEditOpen = true"></Button>
            <Button icon="pi pi-trash" outlined severity="danger" @click="doDeleteRole(slotProps.data.name)"></Button>
          </template>
        </Column>
      </DataTable>
    </Panel>
  </div>
</template>

<style scoped>

</style>