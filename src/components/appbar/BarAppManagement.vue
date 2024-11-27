<script lang="ts" setup>
import ConfirmDialog from "primevue/confirmdialog";
import type {App} from "@/models/entity";
import {computed, ref, watch} from "vue";
import {deleteApp, modifyAppQuota} from "@/service/app-management";
import {isAxiosError} from "axios";
import {errorToast} from "@/service/error";
import {useConfirm} from "primevue/useconfirm";
import {useToast} from "primevue/usetoast";
import type {MenuItem} from "primevue/menuitem";
import {useRouter} from "vue-router";
import {useStateStore} from "@/stores/state";
import {useTranslation} from "i18next-vue";
import {storeToRefs} from "pinia";

const props = defineProps<{
  currentApp: App
}>()

const confirm = useConfirm()
const toast = useToast()
const appOver = ref()
const appMenuItems = ref<MenuItem[]>([])
const router = useRouter()
const {t} = useTranslation()
const {globalUser} = useStateStore()
const {ownApps} = storeToRefs(useStateStore())
const appQuotaModify = ref(false)
const appLoading = ref(false)
const quotaUnit = 1024 * 1024;
const appQuota = ref(Math.floor(props.currentApp.quota / quotaUnit))
const quotaLeft = computed(() => {
  if (!ownApps.value || !globalUser) return 0;
  let used = ownApps.value!.apps.filter(x => x.owner_id == globalUser.id).map(x => x.quota).reduce((x, y) => x + y, 0) - props.currentApp.quota
  return globalUser.quota - used;
})

function appOptionsToggle(event: any) {
  appOver.value.toggle(event);
}

watch(() => props.currentApp, (v) => {
  appMenuItems.value = [];
  if (!v) return
  if (globalUser?.id == v.owner_id) {
    appMenuItems.value.push({
      label: t('app.menu.update-quota'),
      icon: "pi pi-pencil",
      severity: 'secondary',
      command() {
        appQuotaModify.value = true
      },
    });
    appMenuItems.value.push({
      label: t('app.menu.delete'),
      icon: "pi pi-trash",
      severity: 'error',
      command() {
        confirm.require({
          message: t('app.menu.delete-sure'),
          header: t('app.menu.delete'),
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
              await deleteApp({id: props.currentApp.id})
              toast.add({
                severity: 'info',
                summary: t('app.menu.delete-toast.success-title'),
                detail: t('app.menu.delete-toast.success-desc'),
                life: 3000
              })
              await router.push({path: '/'})
            } catch (e) {
              if (isAxiosError(e) && e.response) {
                toast.add({
                  severity: 'info',
                  summary: t('app.menu.delete-toast.error-title'),
                  detail: t('app.menu.delete-toast.error1-desc'),
                  life: 3000
                })
              } else {
                errorToast(toast, e, t('app.menu.delete-toast.error-title'))
              }
            }
          },
          reject: () => {
          }
        });
      },
    });
  }
}, {immediate: true})

async function doModifyQuota() {
  try {
    await modifyAppQuota(props.currentApp.id, {quota: appQuota.value * quotaUnit})
    appQuotaModify.value = false
    toast.add({
      life: 3000,
      summary: t('app.menu.updated-toast.success-title'),
      detail: t('app.menu.updated-toast.success-desc', {size: appQuota.value})
    })
  } catch (e) {
    errorToast(toast, e)
  }
}

</script>

<template>
  <div class="flex items-center gap-1">
    <i class="pi pi-server"></i>
    <span class="font-thin">{{ currentApp.name }}</span>
    <Button v-if="appMenuItems.length > 0" aria-label="Filter" icon="pi pi-ellipsis-v" rounded severity="secondary"
            text @click="appOptionsToggle"/>
    <ConfirmDialog></ConfirmDialog>
    <Menu ref="appOver" :model="appMenuItems" :popup="true">
      <template #item="{ item, props }">
        <a v-ripple class="flex items-center" v-bind="props.action">
          <span :class="item.icon + (item.severity=='error' ? ' text-red-500' : '')"/>
          <span :class="item.severity=='error' ? 'text-red-500' : ''">{{ item.label }}</span>
        </a>
      </template>
    </Menu>
    <Dialog v-model:visible="appQuotaModify" :header="t('home.app.update-quota.header')" :style="{ width: '27.5rem' }"
            modal>
      <InputGroup class="flex justify-center">
        <InputNumber class="w-full" v-model="appQuota" :placeholder="t('home.app.create.quota')" :min="1"
                     :max="Math.floor(quotaLeft / quotaUnit)"
                     fluid
                     suffix="MB"></InputNumber>
        <Button :disabled="appQuota <= 0" :loading="appLoading" icon="pi pi-plus"
                @click="doModifyQuota"></Button>
      </InputGroup>
    </Dialog>
  </div>
</template>

<style scoped>

</style>
