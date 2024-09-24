<script lang="ts" setup>
import type {DashboardNode, StorageNode} from "@/dto/admin";
import {useTranslation} from "i18next-vue";
import {computed} from "vue";

const props = defineProps<{
  node: StorageNode | DashboardNode
}>()
const {t} = useTranslation()
const badgeSeverity = computed(() => {
  let now = new Date();
  var duration = now.valueOf() - props.node.last_beat.valueOf();
  if (duration < 2 * 60000) {
    return 'success'
  } else if (duration < 5 * 60000) {
    return 'warn'
  }
  return 'danger'
})

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
      <span class="font-thin text-xs text-surface-500 dark:text-surface-400">
        {{ t('admin.tiles.registered') }} {{ node.created.toLocaleString() }}
      </span>
    </template>
  </Panel>
</template>

<style scoped>

</style>