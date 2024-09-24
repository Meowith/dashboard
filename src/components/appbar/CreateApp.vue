<script lang="ts" setup>

import {createApp} from "@/service/app-management";
import {ref} from "vue";
import {useTranslation} from "i18next-vue";
import {useToast} from "primevue/usetoast";
import {errorToast} from "@/service/error";

const appCreationVisible = ref(false)
const appLoading = ref(false)
const appName = ref('')
const emit = defineEmits(['refresh'])

const {t} = useTranslation()
const toast = useToast()

async function doCreateApp() {
  appLoading.value = true
  try {
    await createApp({
      name: appName.value
    })
  } catch (e) {
    errorToast(toast, e)
  }
  appLoading.value = false
  appName.value = ''
  appCreationVisible.value = false
  emit('refresh')
}
</script>

<template>
  <Button aria-label="Add" icon="pi pi-plus" @click="appCreationVisible = true"/>
  <Dialog v-model:visible="appCreationVisible" :header="t('home.app.create.header')" :style="{ width: '27.5rem' }"
          modal>
    <InputGroup>
      <InputText v-model="appName" :placeholder="t('home.app.create.name')"></InputText>
      <Button :disabled="!appName || appName.length > 100" :loading="appLoading" icon="pi pi-plus"
              @click="doCreateApp"></Button>
    </InputGroup>
  </Dialog>
</template>

<style scoped>

</style>