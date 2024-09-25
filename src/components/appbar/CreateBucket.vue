<script lang="ts" setup>

import ToggleSwitch from "primevue/toggleswitch";
import {storeToRefs} from "pinia";
import {useStateStore} from "@/stores/state";
import {computed, ref} from "vue";
import {createBucket} from "@/service/bucket-management";
import {errorToast} from "@/service/error";
import {useToast} from "primevue/usetoast";
import type {App} from "@/models/entity";
import {useTranslation} from "i18next-vue";

const {currentBuckets} = storeToRefs(useStateStore())
const bucketLoading = ref(false)
const bucketName = ref('')
const bucketQuota = ref(1)
const bucketAtomicUpload = ref(false)
const quotaUnit = 1024 * 1024;

const toast = useToast()
const {t} = useTranslation()
const bucketCreationVisible = ref(false)
const props = defineProps<{
  currentApp: App | undefined
}>()
const emit = defineEmits(['refresh'])

const quotaLeft = computed(() => {
  if (props.currentApp) {
    let used = currentBuckets.value.map(x => x.quota).reduce((l, r) => l + r, 0);
    return props.currentApp.quota - used;
  }
  return 0;
})

async function doCreateBucket() {
  bucketLoading.value = true
  try {
    await createBucket({
      app_id: props.currentApp!.id,
      atomic_upload: bucketAtomicUpload.value,
      name: bucketName.value,
      quota: bucketQuota.value * quotaUnit
    })
    toast.add({
      severity: 'info',
      summary: t('app.bucket.toast.success-title'),
      detail: t('app.bucket.toast.success-desc'),
      life: 3000
    })
    bucketName.value = ''
    bucketAtomicUpload.value = false
    bucketQuota.value = 1
    bucketCreationVisible.value = false
    emit('refresh')
  } catch (e) {
    errorToast(toast, e, t('app.bucket.toast.error-title'))
  }
  bucketLoading.value = false
}
</script>

<template>
  <Button aria-label="Add" icon="pi pi-plus" @click="bucketCreationVisible = true"/>
  <Dialog v-model:visible="bucketCreationVisible" :header="t('app.bucket.create')" :style="{ width: '27.5rem' }"
          modal>
    <div class="flex flex-col gap-2">
      <InputText v-model="bucketName" :placeholder="t('app.bucket.create-name')" fluid></InputText>
      <label class="font-bold" for="num-in"> {{ t('app.bucket.quota') }} </label>
      <InputNumber id="num-in" v-model="bucketQuota" :max="Math.floor(quotaLeft / quotaUnit)" :min="1" fluid
                   suffix="MB"></InputNumber>
      <label class="font-bold" for="atomonoff"> {{ t('app.bucket.atomic-upload') }} </label>
      <div>
        <ToggleSwitch id="atomonoff" v-model="bucketAtomicUpload"/>
        <span class="text-sm ml-2 h-6 align-top" style="line-height: 24px">{{ t('app.bucket.atomic-desc') }}</span>
      </div>

      <Button :disabled="!bucketName || bucketName.length > 100" :loading="bucketLoading" class="self-end"
              icon="pi pi-plus"
              @click="doCreateBucket"></Button>
    </div>
  </Dialog>
</template>

<style scoped>

</style>