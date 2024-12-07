<script lang="ts" setup>
import type {Bucket} from "@/models/entity";
import {useTranslation} from "i18next-vue";
import {filesize} from "filesize";
import {computed, onMounted, onUnmounted, ref} from "vue";
import type {MenuItem} from "primevue/menuitem";
import {useConfirm} from "primevue/useconfirm";
import {useToast} from "primevue/usetoast";
import {deleteBucket, getBucketSessions, updateBucketQuota} from "@/service/bucket-management";
import {errorToast} from "@/service/error";
import copy from "copy-to-clipboard";
import {useStateStore} from "@/stores/state";
import {storeToRefs} from "pinia";
import type {UploadSession} from "@/dto/bucket";

const props = defineProps<{
  bucket: Bucket
}>()
const {t} = useTranslation()

const percent = computed(() => {
  return props.bucket.space_taken / props.bucket.quota * 100
})

const bucketMenuItems = ref<MenuItem[]>()
const bucketMenu = ref()
const bucketQuotaModify = ref(false)
const {ownApps, currentBuckets} = storeToRefs(useStateStore())
const confirm = useConfirm()
const toast = useToast()
const bucketLoading = ref(false)
const quotaUnit = 1024 * 1024;
const bucketQuota = ref(Math.floor(props.bucket.quota / quotaUnit))
const quotaLeft = computed(() => {
  if (!ownApps.value) return 0;
  let app = ownApps.value!.apps.find(x => x.id == props.bucket.app_id)
  if (!app) return 0;
  return app.quota - currentBuckets.value.reduce((a, b) => a + b.quota, 0)
})
const emit = defineEmits(['refresh'])

const sessions = ref<UploadSession[]>([])
let sessionInterval: ReturnType<typeof setInterval>
const sessionReserved = computed(() => {
  return sessions.value.reduce((a, b) => a + b.size, 0)
})

onMounted(async () => {

  sessionInterval = setInterval(async () => {
    try {
      sessions.value = await getBucketSessions(props.bucket.app_id, props.bucket.id)
    } catch (e) {}
  }, 5000)
  try {
    sessions.value = await getBucketSessions(props.bucket.app_id, props.bucket.id)
  } catch (e) {}

  bucketMenuItems.value = [
    {
      label: t('confirm.delete'),
      icon: 'pi pi-trash',
      severity: 'error',
      command() {
        confirm.require({
          message: t('app.bucket.menu.delete-sure'),
          header: t('app.bucket.menu.delete'),
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
              await deleteBucket(props.bucket.app_id, props.bucket.id)
              toast.add({
                severity: 'info',
                summary: t('app.bucket.toast.deleted-title'),
                detail: t('app.bucket.toast.deleted-desc'),
                life: 3000
              })
              emit('refresh')
            } catch (e) {
              errorToast(toast, e, t('app.bucket.toast.error-del-title'))
            }
          },
          reject: () => {
          }
        });
      },
    },
    {
      label: t('app.bucket.menu.edit-quota'),
      icon: 'pi pi-pencil',
      command() {
        bucketQuotaModify.value = true
      }
    }
  ]
})

onUnmounted(() => {
  clearInterval(sessionInterval)
})

function bucketMenuToggle(e: any) {
  bucketMenu.value.toggle(e)
}

const copySuccess = ref(false)

function copyId() {
  if (copy(props.bucket.id)) {
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 1000)
  }
}

async function doModifyQuota() {
  bucketLoading.value = true
  try {
    await updateBucketQuota(props.bucket.app_id, props.bucket.id, bucketQuota.value * quotaUnit)
    emit('refresh')
  } catch (e) {
    errorToast(toast, e)
  }
  bucketLoading.value = false
}

</script>

<template>
  <Panel>
    <template #header>
      <div class="flex flex-col w-full">
        <div class="flex flex-row items-center w-full">
          <span class="flex-grow">{{ bucket.name }}</span>
        </div>
        <span class="font-thin text-xs text-surface-500 dark:text-surface-400" style="margin-top: -0.5em">{{
            bucket.id
          }} <Button :icon="`pi ${copySuccess ? 'pi-check' : 'pi-clipboard'}`" text size="small"
                     style="width: 2em; height: 2em;" @click="copyId"></Button></span>
      </div>
      <Button aria-label="Filter" icon="pi pi-ellipsis-v" rounded severity="secondary" text
              @click="bucketMenuToggle"/>
      <Menu ref="bucketMenu" :model="bucketMenuItems" :popup="true">
        <template #item="{ item, props }">
          <a v-ripple class="flex items-center" v-bind="props.action">
            <span :class="item.icon + (item.severity=='error' ? ' text-red-500' : '')"/>
            <span :class="item.severity=='error' ? 'text-red-500' : ''">{{ item.label }}</span>
          </a>
        </template>
      </Menu>
    </template>

    <div>
      <div class="flex flex-row gap-2 items-center">
        <knob :model-value="percent" :valueTemplate="(n) => n.toFixed(0)+'%'" readonly></knob>
        <div class="grid grid-cols-2 h-18">
          <div class="col-span-2 text-sm text-surface-500 dark:text-surface-400 items-center gap-2 flex">
            <i class="pi pi-database"></i>
            <span>{{ t('admin.tiles.storage.storage') }}</span>
          </div>
          <span>{{ t('app.bucket.tile.storage-max') }}</span>
          <span v-tooltip="bucket.quota + 'B'">{{ filesize(bucket.quota, {standard: "jedec"}) }}</span>
          <span>{{ t('app.bucket.tile.storage-used') }}</span>
          <span v-tooltip="bucket.space_taken + 'B'">{{ filesize(bucket.space_taken, {standard: "jedec"}) }}</span>
          <span>{{ t('app.bucket.tile.files') }}</span>
          <span>{{ bucket.file_count }}</span>
        </div>
        <div class="grid grid-cols-2 h-18" style="gap: 0 0.5em;">
          <div class="col-span-2 text-sm text-surface-500 dark:text-surface-400 items-center gap-2 flex">
            <i class="pi pi-database"></i>
            <span>{{ t('app.bucket.tile.sessions') }}</span>
          </div>
          <span>{{ t('app.bucket.tile.count') }}</span>
          <span>{{ sessions.length }}</span>
          <span>{{ t('app.bucket.tile.reserved') }}</span>
          <span v-tooltip="sessionReserved + 'B'">{{ filesize(sessionReserved, {standard: "jedec"}) }}</span>
        </div>
      </div>

    </div>

    <template #footer>
      <span class="font-thin text-xs text-surface-500 dark:text-surface-400">
        {{ t('app.bucket.tile.created') }} {{ bucket.created.toLocaleString() }}
      </span>
    </template>
    <Dialog v-model:visible="bucketQuotaModify" :header="t('app.bucket.menu.edit-quota')" :style="{ width: '27.5rem' }"
            modal>
      <InputGroup class="flex justify-center">
        <InputNumber class="w-full" v-model="bucketQuota" :placeholder="t('home.app.create.quota')" :min="1"
                     :max="Math.floor(quotaLeft / quotaUnit)"
                     fluid
                     suffix="MB"></InputNumber>
        <Button :disabled="bucketQuota <= 0" :loading="bucketLoading" icon="pi pi-plus"
                @click="doModifyQuota"></Button>
      </InputGroup>
    </Dialog>
  </Panel>
</template>

<style scoped>

</style>