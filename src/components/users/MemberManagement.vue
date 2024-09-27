<script lang="ts" setup>
import {storeToRefs} from "pinia";
import {useStateStore} from "@/stores/state";
import {computed, onMounted, ref, watch} from "vue";
import {type App, fromOwnedApps, type UserRole, userRoleFrom} from "@/models/entity";
import {useRoute} from "vue-router";
import {listAppMembers, listOwnedApps} from "@/service/app-management";
import type {MemberDto} from "@/dto/app";
import {useTranslation} from "i18next-vue";
import {getRoles, modifyUserRoles} from "@/service/role-management";
import {useConfirm} from "primevue/useconfirm";
import ConfirmDialog from "primevue/confirmdialog";
import {deleteAppMember} from "@/service/user-management";
import {errorToast} from "@/service/error";
import {useToast} from "primevue/usetoast";

const {t} = useTranslation()
const {ownApps} = storeToRefs(useStateStore())
const currentApp = ref<App>()
const route = useRoute()
const confirm = useConfirm()
const toast = useToast()
const {setApps} = useStateStore()

async function fetchApps() {
  setApps(fromOwnedApps(await listOwnedApps()))
}

const props = defineProps<{
  refresh: boolean
}>()

watch(() => props.refresh, () => {
  fetchMembers()
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
  await fetchMembers()
})

const members = ref<MemberDto[]>([])

async function fetchMembers() {
  members.value = (await listAppMembers(currentApp.value!.id)).members
}

const userEditOpen = ref(false)
const userEdit = ref<MemberDto | undefined>(undefined)
const pickListRoles = ref<[string[], string[]]>([[], []])
const roles = ref<UserRole[]>([])
const modified = computed(() => {
  if (!userEdit.value) return false
  return !(userEdit.value.member_roles.length == pickListRoles.value[1].length &&
      userEdit.value.member_roles.every(x => pickListRoles.value[1].includes(x)))
})
const saveLoading = ref(false)

async function fetchRoles() {
  roles.value = (await getRoles(currentApp.value!.id)).roles.map(userRoleFrom)
}

async function doDeleteMember(member: MemberDto) {
  confirm.require({
    message: t('app.members.prompt.delete-sure'),
    header: t('app.members.prompt.delete'),
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: t('confirm.cancel'),
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: t('confirm.delete'),
      severity: 'danger'
    },
    accept: async () => {
      try {
        await deleteAppMember(currentApp.value!.id, member.member_id)
        await fetchMembers()
      } catch (e) {
        errorToast(toast, e)
      }
    },
    reject: () => {
    }
  })
}

async function save() {
  try {
    await modifyUserRoles(currentApp.value!.id, userEdit.value!.member_id, {
      roles: pickListRoles.value[1]
    })
    await fetchMembers()
    userEditOpen.value = false
  } catch (e) {
    errorToast(toast, e)
  }
}

function editUser(member: MemberDto) {
  pickListRoles.value = [roles.value
      .map((role) => role.name)
      .filter(role => !member.member_roles.includes(role)), member.member_roles]
  userEditOpen.value = true
  userEdit.value = member
}
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <Panel :header="t('app.members.edit.title')" class="w-full">
      <ConfirmDialog></ConfirmDialog>
      <Dialog v-model:visible="userEditOpen" :header="userEdit?.member_id" modal class="w-1/2 min-w-96">
        <div class="flex flex-col gap-4">
          <label for="roles">{{ t('app.members.edit.roles') }}</label>
          <PickList v-model="pickListRoles" id="roles"
                    :show-source-controls="false"
                    :show-target-controls="false">
            <template #option="{ option }">
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
            <Button icon="pi pi-trash" outlined severity="danger" @click="doDeleteMember(slotProps.data)"></Button>
          </template>
        </Column>
      </DataTable>
    </Panel>
  </div>
</template>

<style scoped>

</style>
