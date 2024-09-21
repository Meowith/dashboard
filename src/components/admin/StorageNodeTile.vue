<script setup lang="ts">
import type {StorageNode} from "@/dto/admin";
import {computed} from "vue";
import {filesize} from "filesize";
import NodeTile from "@/components/admin/NodeTile.vue";
import {useTranslation} from "i18next-vue";

const props = defineProps<{
  node: StorageNode
}>()

const percent = computed(() => {
  if (props.node.used_space == -1) {
    return 0;
  }
  return props.node.used_space / props.node.max_space * 100
})

const {t} = useTranslation()

</script>

<template>
  <NodeTile :node="node">
    <template #content>
      <div class="flex flex-row gap-2 items-center">
        <knob :model-value="percent" :valueTemplate="(n) => n.toFixed(0)+'%'" readonly></knob>
        <div class="grid grid-cols-2 h-18">
          <div class="col-span-2 text-sm text-surface-500 dark:text-surface-400 items-center gap-2 flex">
            <i class="pi pi-database"></i>
            <span>{{ t('admin.tiles.storage.storage') }}</span>
          </div>
          <span>{{ t('admin.tiles.storage.max') }}</span>
          <span v-tooltip="node.max_space + 'B'">{{ filesize(node.max_space, {standard: "jedec"}) }}</span>
          <span>{{ t('admin.tiles.storage.used') }}</span>
          <span v-tooltip="node.used_space + 'B'">{{ filesize(node.used_space, {standard: "jedec"}) }}</span>
        </div>
      </div>
    </template>
  </NodeTile>
</template>

<style scoped>

</style>