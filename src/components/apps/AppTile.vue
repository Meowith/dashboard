<script setup lang="ts">
import type {App} from "@/models/entity";
import {useTranslation} from "i18next-vue";
import {filesize} from "filesize";

defineProps<{
  app: App
}>()
const {t} = useTranslation()
</script>

<template>
  <panel>
    <template #header>
      <div class="flex flex-row gap-2 items-center" >
        <Avatar :label="app.name[0].toUpperCase()" size="large"></Avatar>
        <div class="flex flex-col w-full">
          <span class="flex-grow">{{ app.name }}</span>
          <span class="font-thin text-xs text-surface-500 dark:text-surface-400">{{ app.id }}</span>
        </div>
      </div>
    </template>
    <div class="grid grid-cols-2">
      <span>{{ t('home.app.tile.quota') }}</span>
      <span v-tooltip="app.quota + 'B'">{{
          filesize(app.quota, {standard: "jedec"})
        }}</span>
      <span>{{ t('home.app.tile.modified') }}</span>
      <span>{{ app.last_modified.toLocaleString() }}</span></div>
    <template #footer>
      <div class="flex flex-row items-center">
        <span class="font-thin text-xs text-surface-500 dark:text-surface-400 flex-grow">
              {{ t('home.app.tile.created') }} {{ app.created.toLocaleString() }}
            </span>
        <router-link :to="`/apps/${app.id}`">
          <Button :label="t('home.app.tile.manage')" icon="pi pi-arrow-right"/>
        </router-link>
      </div>
    </template>
  </panel>
</template>

<style scoped>

</style>