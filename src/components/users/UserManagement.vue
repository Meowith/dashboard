<script lang="ts" setup>
import {storeToRefs} from "pinia";
import {useStateStore} from "@/stores/state";
import {onMounted, ref, watch} from "vue";
import {type App, fromOwnedApps, type UserRole, userRoleFrom} from "@/models/entity";
import {useRoute} from "vue-router";
import {listAppMembers, listOwnedApps} from "@/service/app-management";
import type {MemberDto} from "@/dto/app";
import {useTranslation} from "i18next-vue";
import {getRoles} from "@/service/role-management";

const {t} = useTranslation()
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
  await fetchRoles()
  await fetchMembers()

  watch(pickListRoles, () => {
    modified.value = true
  })
})

const members = ref<MemberDto[]>([])
async function fetchMembers() {
  members.value = (await listAppMembers(currentApp.value!.id)).members
}
const userEditOpen = ref(false)
const userEdit = ref<MemberDto | undefined>(undefined)
const pickListRoles = ref<[string[], string[]]>([[], []])
const roles = ref<UserRole[]>([])
const modified = ref(false)

async function fetchRoles() {
  roles.value = (await getRoles(currentApp.value!.id)).roles.map(userRoleFrom)
}

function editUser(member: MemberDto) {
  pickListRoles.value = [roles.value
      .map((role) => role.name)
      .filter(role => !member.member_roles.includes(role)), member.member_roles]
  modified.value = false
  userEditOpen.value = true
  userEdit.value = member
}
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <Panel :header="t('')" class="w-full">
      <Dialog v-model:visible="userEditOpen" :header="userEdit?.name" modal class="w-1/2 min-w-96">
        <div class="flex flex-col gap-4">
          <label for="roles">{{ t('') }}</label>
          <PickList v-model="pickListRoles" data-key="id" id="roles"
                    :show-source-controls="false"
                    :show-target-controls="false">
            <template #option="{ option  }">
              {{ option }}
            </template>
          </PickList>
          <div class="flex">
            <Button icon="pi pi-save" @click="save()" :loading="saveLoading" :disabled="!modified"></Button>
          </div>
        </div>
      </Dialog>
      <DataTable :value="members" tableStyle="min-width: 50rem">
        <Column field="member_id" header="ID"></Column>
        <Column field="member_roles" header="Roles"></Column>
        <Column field="actions" header="Actions">
          <template #body="slotProps">
            <Button class="mr-2" icon="pi pi-user-edit" severity="info"
                    @click="editUser(slotProps.data)"></Button>
            <Button icon="pi pi-trash" outlined severity="danger" @click="doDeleteRole(slotProps.data.name)"></Button>
          </template>
        </Column>
      </DataTable>
    </Panel>
  </div>
</template>

<style scoped>

</style>
