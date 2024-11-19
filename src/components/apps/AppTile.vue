<script lang="ts" setup>
import type {App} from "@/models/entity";
import {useTranslation} from "i18next-vue";
import {filesize} from "filesize";
import {ref} from "vue";
import copy from "copy-to-clipboard";

const props = defineProps<{
  app: App & { is_member: boolean }
}>()
const {t} = useTranslation()

const copySuccess = ref(false)

function copyId() {
  if (copy(props.app.id)) {
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 1000)
  }
}

</script>

<template>
  <panel>
    <template #header>
      <div class="flex flex-row gap-2 items-center">
        <Avatar :icon="'pi ' + (app.is_member ? 'pi-share-alt' : 'pi-shield')"></Avatar>
        <div class="flex flex-col w-full">
          <span class="flex-grow">{{ app.name }}</span>
          <span class="font-thin text-xs text-surface-500 dark:text-surface-400" style="margin-top: -0.5em">{{ app.id }} <Button
              :icon="`pi ${copySuccess ? 'pi-check' : 'pi-clipboard'}`" text size="small"
              style="width: 2em; height: 2em;" @click="copyId"></Button></span>
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