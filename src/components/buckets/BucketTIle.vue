<script lang="ts" setup>
import type {Bucket} from "@/models/entity";
import {useTranslation} from "i18next-vue";
import {filesize} from "filesize";
import {computed, onMounted, ref} from "vue";
import type {MenuItem} from "primevue/menuitem";
import {useConfirm} from "primevue/useconfirm";
import {useToast} from "primevue/usetoast";
import {deleteBucket} from "@/service/bucket-management";
import {errorToast} from "@/service/error";

const props = defineProps<{
  bucket: Bucket
}>()
const {t} = useTranslation()

const percent = computed(() => {
  return props.bucket.space_taken / props.bucket.quota * 100
})

const bucketMenuItems = ref<MenuItem[]>()
const bucketMenu = ref()
const confirm = useConfirm()
const toast = useToast()
const emit = defineEmits(['refresh'])

onMounted(() => {
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
    }
  ]
})

function bucketMenuToggle(e: any) {
  bucketMenu.value.toggle(e)
}

</script>

<template>
  <Panel>
    <template #header>
      <div class="flex flex-col w-full">
        <div class="flex flex-row items-center w-full">
          <span class="flex-grow">{{ bucket.name }}</span>
        </div>
        <span class="font-thin text-xs text-surface-500 dark:text-surface-400">{{ bucket.id }}</span>
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
      </div>
    </div>

    <template #footer>
      <span class="font-thin text-xs text-surface-500 dark:text-surface-400">
        {{ t('app.bucket.tile.created') }} {{ bucket.created.toLocaleString() }}
      </span>
    </template>
  </Panel>
</template>

<style scoped>

</style>