<script lang="ts" setup>
import type {DashboardNode, StorageNode} from "@/dto/admin";
import {useTranslation} from "i18next-vue";
import {computed, ref} from "vue";
import type {MenuItem} from "primevue/menuitem";
import {errorToast} from "@/service/error";
import {useConfirm} from "primevue/useconfirm";
import {useToast} from "primevue/usetoast";
import {deleteNode} from "@/service/node-management";

const props = defineProps<{
  node: StorageNode | DashboardNode
}>()
const {t} = useTranslation()
const badgeSeverity = computed(() => {
  let now = new Date();
  const duration = now.valueOf() - props.node.last_beat.valueOf();
  if (duration < 2 * 60000) {
    return 'success'
  } else if (duration < 5 * 60000) {
    return 'warn'
  }
  return 'danger'
})


const nodeMenu = ref(null)
const confirm = useConfirm()
const toast = useToast()

function nodeMenuToggle(e: any) {
  (nodeMenu.value!! as any).toggle(e)
}

const nodeMenuItems: MenuItem[] = [
  {
    label: t('confirm.delete'),
    icon: 'pi pi-trash',
    severity: 'error',
    command() {
      confirm.require({
        message: t('admin.nodes.node-delete-sure'),
        header: t('admin.nodes.node-delete-header'),
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
            await deleteNode(props.node.type, props.node.id)
            toast.add({
              severity: 'info',
              summary: t('admin.nodes.node-deleted-title'),
              detail: t('admin.nodes.node-deleted-desc'),
              life: 3000
            })
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


</script>

<template>
  <Panel>
    <template #header>
      <div class="flex flex-col w-full">
        <div class="flex flex-row items-center w-full">
          <span class="flex-grow">{{ node.addr }}</span>
          <Badge v-tooltip="t('admin.tiles.last-seen')" :severity="badgeSeverity"
                 :value="node.last_beat.toLocaleString()" class="justify-self-end" size="small"></Badge>
        </div>
        <span class="font-thin text-xs text-surface-500 dark:text-surface-400">{{ node.id }}</span>
      </div>
    </template>

    <slot name="content">

    </slot>

    <template #footer>
      <div class="flex justify-between items-end">
        <span class="font-thin text-xs text-surface-500 dark:text-surface-400">
             {{ t('admin.tiles.registered') }} {{ node.created.toLocaleString() }}
           </span>

        <Button aria-label="Filter" icon="pi pi-ellipsis-v" rounded severity="secondary" text
                @click="nodeMenuToggle"/>
        <Menu ref="nodeMenu" :model="nodeMenuItems" :popup="true">
          <template #item="{ item, props }">
            <a v-ripple class="flex items-center" v-bind="props.action">
              <span :class="item.icon + (item.severity=='error' ? ' text-red-500' : '')"/>
              <span :class="item.severity=='error' ? 'text-red-500' : ''">{{ item.label }}</span>
            </a>
          </template>
        </Menu>
      </div>
    </template>
  </Panel>
</template>

<style scoped>

</style>