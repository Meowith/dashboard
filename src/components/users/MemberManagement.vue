<script lang="ts" setup>
import {storeToRefs} from "pinia";
import {useStateStore} from "@/stores/state";
import {computed, onMounted, ref, watch} from "vue";
import {listAppMembers} from "@/service/app-management";
import type {MemberDto} from "@/dto/app";
import {useTranslation} from "i18next-vue";
import {modifyUserRoles} from "@/service/role-management";
import {useConfirm} from "primevue/useconfirm";
import ConfirmDialog from "primevue/confirmdialog";
import {deleteAppMember} from "@/service/user-management";
import {errorToast} from "@/service/error";
import {useToast} from "primevue/usetoast";
import {fetchUserById} from "@/service/user";

const {t} = useTranslation()
const {currentApp} = storeToRefs(useStateStore())
const confirm = useConfirm()
const toast = useToast()

const props = defineProps<{
  refresh: boolean
}>()

watch(() => props.refresh, () => {
  fetchMembers()
})

onMounted(async () => {
  await fetchMembers()
})

const members = ref<MemberDto[]>([])

async function fetchMembers() {
  let new_members = (await listAppMembers(currentApp.value!.id)).members
  members.value = []
  for (let member of new_members) {
    member.name = (await fetchUserById(member.member_id))?.name
    members.value.push(member)
  }
}

const userEditOpen = ref(false)
const userEdit = ref<MemberDto | undefined>(undefined)
const pickListRoles = ref<[string[], string[]]>([[], []])
const {currentRoles} = storeToRefs(useStateStore())
const modified = computed(() => {
  if (!userEdit.value) return false
  return !(userEdit.value.member_roles.length == pickListRoles.value[1].length &&
      userEdit.value.member_roles.every(x => pickListRoles.value[1].includes(x)))
})
const saveLoading = ref(false)

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
  pickListRoles.value = [currentRoles.value
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
      <DataTable :value="members" tableStyle="min-width: 50rem" v-if="members.length">
        <Column field="member_id" :header="t('app.members.columns.name')">
          <template #body="slotProps">
            {{slotProps.data.name || slotProps.data.member_id}}
          </template>
        </Column>
        <Column field="member_roles" :header="t('app.members.columns.roles')">
          <template #body="slotProps">
            <div class="flex gap-2 flex-wrap">
              <Chip v-for="role in slotProps.data.member_roles" :key="role" :label="role"/>
            </div>
          </template>
        </Column>
        <Column field="actions" :header="t('app.members.columns.actions')">
          <template #body="slotProps">
            <Button class="mr-2" icon="pi pi-user-edit" severity="info"
                    @click="editUser(slotProps.data)"></Button>
            <Button icon="pi pi-trash" outlined severity="danger" @click="doDeleteMember(slotProps.data)"></Button>
          </template>
        </Column>
      </DataTable>
      <div style="align-items: center" class="flex w-full flex-col" v-else>
        <span class="pi pi-users text-gray-400" style="font-size: 5rem"></span>
        <span class="text-thin text-gray-400 m-3">{{ t('app.members.edit.empty') }}</span>
      </div>
    </Panel>
  </div>
</template>

<style scoped>

</style>
