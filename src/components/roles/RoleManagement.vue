<script lang="ts" setup>
import Select from 'primevue/select';
import {computed, onMounted, ref, watch} from "vue";
import {type App, type Bucket, bucketFrom, fromOwnedApps, type UserRole, userRoleFrom} from "@/models/entity";
import {useRoute} from "vue-router";
import {storeToRefs} from "pinia";
import {useStateStore} from "@/stores/state";
import {useTranslation} from "i18next-vue";
import {listBuckets, listOwnedApps} from "@/service/app-management";
import {decodePermSet, deleteRole, encodePermSet, getRoles, modifyRole} from "@/service/role-management";
import {useToast} from "primevue/usetoast";
import {errorToast} from "@/service/error";
import {APP_ID, AppPermission, type ScopedPermission, UserPermission} from "@/dto/role";
import {enumValues} from "@/enumIter";

const {t} = useTranslation()

const {ownApps} = storeToRefs(useStateStore())
const currentApp = ref<App>()
const route = useRoute()
const {setApps} = useStateStore()
const permEditOpen = ref(false)
const permEdit = ref<UserRole | undefined>()
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
const modified = ref(false)
const newScope = ref<{
  value: {
    app: boolean,
    id: string
  }
}>()
const scopeEnum = computed(() => {
  return newScope.value?.value.app ? AppPermission : UserPermission
})
const scopeKey = computed(() => {
  return newScope.value?.value.app ? 'app.roles.permissions.app' : 'app.roles.permissions.user'
})
const scopeOptions = ref()
type EitherPerm = { id: UserPermission }[] | { id: AppPermission }[];
const currentPermissions = ref<[EitherPerm, EitherPerm]>([[], []])

async function fetchBuckets() {
  if (!currentBuckets || currentBuckets.length == 0) {
    try {
      let new_buckets = await listBuckets(currentApp.value!.id)
      buckets.value = []
      new_buckets.buckets.forEach(bucket => {
        buckets.value.push(bucketFrom(bucket))
      })
      setBuckets(buckets.value)
    } catch (e) {
      errorToast(toast, e)
    }
  } else {
    buckets.value = currentBuckets
  }
  scopeOptions.value = [
    {
      label: 'App',
      items: [
        {label: 'App', value: {app: true, id: APP_ID}},
      ]
    },
    {
      label: 'Bucket',
      items: buckets.value.map(x => {
        return {
          label: x.name,
          value: {app: false, id: x.id}
        }
      })
    },
  ]
}

async function doDeleteRole(name: string) {
  try {
    await deleteRole(currentApp.value!.id, name)
    await fetchRoles()
  } catch (e) {
    errorToast(toast, e)
  }
}

function editRole(name: string) {
  resetCurrent()
  permEdit.value = roles.value.find(x => x.name == name)
  if (!permEdit.value) return
  permEditOpen.value = true
  fetchBuckets()
}

function resetCurrent() {
  newScope.value = undefined
  modified.value = false
}

watch(newScope, (v) => {
  currentPermissions.value = [
    (v?.value?.app ? enumValues(AppPermission) : enumValues(UserPermission)).map(x => {
      return {
        id: x,
      }
    }) as unknown as EitherPerm,
    []
  ]
}, {immediate: true})

async function addScope() {
  if (!permEdit.value || !newScope.value) return
  let newScoped: ScopedPermission = {
    allowance: encodePermSet(currentPermissions.value[1].map(x => x.id)), bucket_id: newScope.value.value.id
  }
  permEdit.value.scopes.push(newScoped)
  resetCurrent()
  modified.value = true
}

async function deleteScope(idx: number) {
  if (!permEdit.value) return
  permEdit.value.scopes.splice(idx, 1)
  console.log(permEdit.value.scopes)
  modified.value = true
}

const saveLoading = ref(false)

async function save() {
  if (!permEdit.value) return
  saveLoading.value = true
  try {
    await modifyRole(
        currentApp.value!.id,
        permEdit.value!.name,
        {
          perms: permEdit.value.scopes
        }
    )
    toast.add({
      summary: t('app.roles.toast.save-success-title'),
      detail: t('app.roles.toast.save-success-desc'),
      life: 3000
    })
  } catch (e) {
    errorToast(toast, e)
  }
  saveLoading.value = false
  modified.value = false
}

const loading = ref(false)

</script>

<template>
  <div class="flex flex-wrap gap-4">
    <Panel :header="t('app.roles.title')" class="w-full">
      <Dialog v-model:visible="permEditOpen" :header="permEdit?.name" modal class="w-1/2 min-w-96">
        <div class="flex flex-col gap-4">
          <div v-for="(scope, index) in permEdit!.scopes" class="flex flex-col gap-2 font-thin text-xs">
            <div class="flex gap-1 items-center flex-wrap" v-if="scope.bucket_id != APP_ID">
              <Chip icon="pi pi-warehouse" :label="buckets.find(x => x.id == scope.bucket_id)?.name"></Chip>
              <Chip v-for="i in decodePermSet(UserPermission, scope.allowance)" label="">
                {{ t('app.roles.permissions.user.' + UserPermission[i] as any) }}
              </Chip>
              <Button severity="danger" outlined icon="pi pi-trash" @click="deleteScope(index)"></Button>
            </div>
            <div class="flex gap-1 items-center flex-wrap" v-else>
              <Chip icon="pi pi-address-book"></Chip>
              <Chip v-for="i in decodePermSet(AppPermission, scope.allowance)" label="">
                {{ t('app.roles.permissions.app.' + AppPermission[i] as any) }}
              </Chip>
              <Button severity="danger" outlined icon="pi pi-trash" @click="deleteScope(index)"></Button>
            </div>
          </div>
        </div>
        <Divider/>
        <div class="flex flex-col gap-4">
          <label for="scope-sel">{{ t('app.roles.role-create.label-scope') }}</label>
          <Select id="scope-sel" v-model="newScope" :options="scopeOptions" optionLabel="label"
                  optionGroupLabel="label" optionGroupChildren="items"
                  :placeholder="t('app.roles.role-create.placeholder-scope')"
                  class="w-full md:w-56">
            <template #optiongroup="slotProps">
              <div class="flex items-center">
                <div>{{ slotProps.option.label }}</div>
              </div>
            </template>
          </Select>
          <label for="allowances">{{ t('app.roles.role-create.label-allowances') }}</label>
          <PickList v-model="currentPermissions" data-key="id" id="allowances" :disabled="!newScope"
                    :show-source-controls="false"
                    :show-target-controls="false">
            <template #option="{ option  }">
              {{ t(scopeKey + '.' + scopeEnum[option.id] as any) }}
            </template>
          </PickList>
          <div class="flex">
            <Button icon="pi pi-plus" @click="addScope()" :disabled="!newScope"></Button>
            <div class="flex-grow"></div>
            <Button icon="pi pi-save" @click="save()" :loading="saveLoading" :disabled="!modified"></Button>
          </div>
        </div>
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
        <Column :header="t('app.roles.table-cols.action')" field="actions">
          <template #body="slotProps">
            <Button class="mr-2" icon="pi pi-pencil" severity="info"
                    @click="editRole(slotProps.data.name)"></Button>
            <Button icon="pi pi-trash" outlined severity="danger" @click="doDeleteRole(slotProps.data.name)"></Button>
          </template>
        </Column>
      </DataTable>
    </Panel>
  </div>
</template>

<style scoped>

</style>