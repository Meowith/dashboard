<script lang="ts" setup>

import {ref} from "vue";
import {useTranslation} from "i18next-vue";
import type {App} from "@/models/entity";
import {errorToast} from "@/service/error";
import {useToast} from "primevue/usetoast";
import {addAppMember} from "@/service/user-management";
import {fetchUserByName} from "@/service/user";

const memberCreationVisible = ref(false)
const memberLoading = ref(false)
const memberName = ref('')
const emit = defineEmits(['refresh'])

const props = defineProps<{
  currentApp: App | undefined
}>()

const {t} = useTranslation()
const toast = useToast()

async function doCreateMember() {
  if (!props.currentApp?.name) return
  memberLoading.value = true

  try {
    let user = await fetchUserByName(memberName.value)
    if (!user) {
      toast.add({
        summary: t('error.generic-title'),
        detail: t(`error.server-code.NotFound`),
        severity: 'error',
        life: 3000
      })
      return;
    }
    await addAppMember(props.currentApp!.id, user.id)
  } catch (e) {
    errorToast(toast, e)
  }
  memberLoading.value = false
  memberName.value = ''
  memberCreationVisible.value = false
  emit('refresh')
}
</script>

<template>
  <Button aria-label="Add" icon="pi pi-plus" @click="memberCreationVisible = true"/>
  <Dialog v-model:visible="memberCreationVisible" :header="t('app.members.create.header')" :style="{ width: '27.5rem' }"
          modal>
    <InputGroup>
      <InputText v-model="memberName" :placeholder="t('app.members.create.name')"></InputText>
      <Button :disabled="!memberName || memberName.length > 100" :loading="memberLoading" icon="pi pi-plus"
              @click="doCreateMember"></Button>
    </InputGroup>
  </Dialog>
</template>

<style scoped>

</style>