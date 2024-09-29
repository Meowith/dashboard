<script lang="ts" setup>

import {createApp} from "@/service/app-management";
import {computed, ref} from "vue";
import {useTranslation} from "i18next-vue";
import {useToast} from "primevue/usetoast";
import {errorToast} from "@/service/error";
import {useStateStore} from "@/stores/state";
import {storeToRefs} from "pinia";

const appCreationVisible = ref(false)
const appLoading = ref(false)
const appName = ref('')
const appQuota = ref(512)
const emit = defineEmits(['refresh'])
const {globalUser} = useStateStore()
const {ownApps} = storeToRefs(useStateStore())
const quotaUnit = 1024 * 1024;
const {t} = useTranslation()
const toast = useToast()

const quotaLeft = computed(() => {
  if (!ownApps.value || !globalUser) return 0;
  let used = ownApps.value!.apps.filter(x => x.owner_id == globalUser.id).map(x => x.quota).reduce((x, y) => x + y, 0)
  return globalUser.quota - used;
})

async function doCreateApp() {
  appLoading.value = true
  try {
    await createApp({
      name: appName.value,
      quota: appQuota.value * quotaUnit
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
    <div class="flex flex-col gap-2">
      <InputText class="w-full" v-model="appName" :placeholder="t('home.app.create.name')"></InputText>

      <InputNumber class="w-full" v-model="appQuota" :placeholder="t('home.app.create.quota')" :min="1" :max="Math.floor(quotaLeft / quotaUnit)"
                   fluid
                   suffix="MB"></InputNumber>
    </div>
    <InputGroup class="flex justify-center">
      <Button :disabled="!appName || appName.length > 100 || appQuota <= 0" :loading="appLoading" icon="pi pi-plus"
              @click="doCreateApp"></Button>
    </InputGroup>
  </Dialog>
</template>

<style scoped>

</style>