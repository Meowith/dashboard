<script lang="ts" setup>
import ConfirmDialog from "primevue/confirmdialog";
import type {App} from "@/models/entity";
import {ref, watch} from "vue";
import {deleteApp} from "@/service/app-management";
import {isAxiosError} from "axios";
import {errorToast} from "@/service/error";
import {useConfirm} from "primevue/useconfirm";
import {useToast} from "primevue/usetoast";
import type {MenuItem} from "primevue/menuitem";
import {useRouter} from "vue-router";
import {useStateStore} from "@/stores/state";
import {useTranslation} from "i18next-vue";

const props = defineProps<{
  currentApp: App
}>()

const confirm = useConfirm()
const toast = useToast()
const appOver = ref()
const appMenuItems = ref<MenuItem[]>([])
const router = useRouter()
const {globalUser} = useStateStore();
const {t} = useTranslation()

function appOptionsToggle(event: any) {
  appOver.value.toggle(event);
}

watch(() => props.currentApp, (v) => {
  appMenuItems.value = [];
  if (!v) return
  if (globalUser?.id == v.owner_id) {
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
              })
              await router.push({path: '/'})
            } catch (e) {
              if (isAxiosError(e) && e.response) {
                toast.add({
                  severity: 'info',
                  summary: t('app.menu.delete-toast.error-title'),
                  detail: t('app.menu.delete-toast.error1-desc'),
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
  </div>
</template>

<style scoped>

</style>