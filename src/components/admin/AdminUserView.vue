<script setup lang="ts">
import {FilterMatchMode} from '@primevue/core/api';
import {onMounted, ref} from "vue";
import {alterUserRole, fetchAllUsers} from "@/service/admin-management";
import {useTranslation} from "i18next-vue";
import {GlobalRole, type GlobalUserInfo, useStateStore} from "@/stores/state";
import {fromUserDto} from "@/models/entity";
import Select from "primevue/select";

const {t} = useTranslation();
const users = ref<GlobalUserInfo[]>([]);
const filters = ref();
clearFilter();
const {globalUser} = useStateStore()

async function fetchUsers() {
  users.value = (await fetchAllUsers()).users.map(fromUserDto)
}

function clearFilter() {
  filters.value = {
    name: {value: null, matchMode: FilterMatchMode.CONTAINS},
  }
}

onMounted(() => {
  fetchUsers()
})

const roles = ref([
  {name: t('admin.users.role-1')},
  {name: t('admin.users.role-2')}
]);
const loading = ref(false);

async function changeRole(user: GlobalUserInfo, role: any) {
  loading.value = true;
  let changeTo = role.name == t('admin.users.role-1') ? GlobalRole.User : GlobalRole.Admin;

  await alterUserRole(user.id, {
    role: changeTo == GlobalRole.Admin ? "Admin" : "User"
  });
  user.globalRole = changeTo;
  users.value[users.value.findIndex((v) => v.id == user.id)] = user
  loading.value = false;
}
</script>

<template>
  <Panel>
    <DataTable v-model:filters="filters" :value="users" paginator :rows="10" :rowsPerPageOptions="[10, 20, 30]"
               filter-display="row">
      <template #header>
        <div class="flex justify-between">
          <Button type="button" icon="pi pi-filter-slash" outlined @click="clearFilter()"/>
          <IconField>
            <InputIcon>
              <i class="pi pi-search"/>
            </InputIcon>
            <InputText v-model="filters['name'].value" :placeholder="t('admin.users.search')"/>
          </IconField>
        </div>
      </template>
      <Column field="name" :header="t('admin.users.columns.name')" sortable>
        <template #body="slotProps">
          <div class="flex flex-col">
            <span>{{ slotProps.data.name }}</span>
            <span class="text-xs text-surface-400 black:text-surface-500">{{ slotProps.data.id }}</span>
          </div>
        </template>
      </Column>
      <Column field="globalRole" :header="t('admin.users.columns.global-role')" sortable>
        <template #body="slotProps">
          <Select :disabled="loading || slotProps.data.id == globalUser!.id"
                  :model-value="{name: slotProps.data.globalRole == GlobalRole.Admin ? t('admin.users.role-2') : t('admin.users.role-1')}"
                  @update:model-value="(v) => changeRole(slotProps.data, v)"
                  :options="roles" optionLabel="name" class="w-full"/>
        </template>
      </Column>
      <Column field="created" :header="t('admin.users.columns.created')" sortable>
        <template #body="slotProps">
          {{ slotProps.data.created.toLocaleString() }}
        </template>
      </Column>
      <Column field="lastModified" :header="t('admin.users.columns.last-modified')" sortable>
        <template #body="slotProps">
          {{ slotProps.data.lastModified.toLocaleString() }}
        </template>
      </Column>
    </DataTable>
  </Panel>
</template>

<style scoped>

</style>