<script lang="ts" setup>
import {ref, watch} from "vue";
import {type UserRole, userRoleFrom} from "@/models/entity";
import {storeToRefs} from "pinia";
import {useStateStore} from "@/stores/state";
import {useTranslation} from "i18next-vue";
import {deleteRole, getRoles, modifyRole} from "@/service/role-management";
import {useToast} from "primevue/usetoast";
import {errorToast} from "@/service/error";
import ScopeEditor from "@/components/ScopeEditor.vue";

const {t} = useTranslation()

const {currentApp} = storeToRefs(useStateStore())
const permEdit = ref<UserRole | undefined>()
const props = defineProps<{
  refresh: boolean
}>()
const toast = useToast()


watch(() => props.refresh, () => {
  fetchRoles()
})

const {currentRoles} = storeToRefs(useStateStore())

async function fetchRoles() {
  currentRoles.value = (await getRoles(currentApp.value!.id)).roles.map(userRoleFrom)
}

async function doDeleteRole(name: string) {
  try {
    await deleteRole(currentApp.value!.id, name)
    await fetchRoles()
  } catch (e) {
    errorToast(toast, e)
  }
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
}

const loading = ref(false)
const scopeEditor = ref(false)

function editRole(name: string) {
  permEdit.value = currentRoles.value.find(x => x.name == name)
  if (!permEdit.value) return
  scopeEditor.value = true
}

</script>

<template>
  <div class="flex w-full" v-if="loading">
    <ProgressSpinner/>
  </div>
  <div v-if="!loading" class="flex flex-wrap gap-4">
    <Panel :header="t('app.roles.title')" class="w-full">
      <Dialog v-if="currentApp && permEdit" v-model:visible="scopeEditor" :header="permEdit.name" modal class="w-1/2 min-w-96">
        <ScopeEditor  :app="currentApp" allow-app-scope
                     :save-loading="saveLoading" v-model:scopes="permEdit.scopes"
                     @save="save"/>
      </Dialog>
      <div style="align-items: center" class="flex w-full flex-col" v-if="currentRoles.length == 0 && !loading">
        <span class="pi pi-user-edit text-gray-400" style="font-size: 5rem"></span>
        <span class="text-thin text-gray-400 m-3">{{ t('app.roles.empty') }}</span>
      </div>
      <DataTable :value="currentRoles" v-else>
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