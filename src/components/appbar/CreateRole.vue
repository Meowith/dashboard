<script lang="ts" setup>

import {ref} from "vue";
import {useTranslation} from "i18next-vue";
import {createRole} from "@/service/role-management";
import type {App} from "@/models/entity";
import {errorToast} from "@/service/error";
import {useToast} from "primevue/usetoast";

const roleCreationVisible = ref(false)
const roleLoading = ref(false)
const roleName = ref('')
const emit = defineEmits(['refresh'])

const props = defineProps<{
  currentApp: App | undefined
}>()

const {t} = useTranslation()
const toast = useToast()

async function doCreateRole() {
  if (!props.currentApp?.name) return
  roleLoading.value = true
  try {
    await createRole(props.currentApp!.id, roleName.value)
  } catch (e) {
    errorToast(toast, e)
  }
  roleLoading.value = false
  roleName.value = ''
  roleCreationVisible.value = false
  emit('refresh')
}
</script>

<template>
  <Button aria-label="Add" icon="pi pi-plus" @click="roleCreationVisible = true"/>
  <Dialog v-model:visible="roleCreationVisible" :header="t('app.roles.create.header')" :style="{ width: '27.5rem' }"
          modal>
    <InputGroup>
      <InputText v-model="roleName" :placeholder="t('app.roles.create.name')"></InputText>
      <Button :disabled="!roleName || roleName.length > 100" :loading="roleLoading" icon="pi pi-plus"
              @click="doCreateRole"></Button>
    </InputGroup>
  </Dialog>
</template>

<style scoped>

</style>