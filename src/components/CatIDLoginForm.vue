<script lang="ts" setup>
import image from '@/assets/catid.svg';
import {useTranslation} from "i18next-vue";
import {LOGIN_METHODS} from "@/env";

const {t} = useTranslation();
function redirect() {
  location.href = LOGIN_METHODS.CATID.uri;
}
</script>

<template>
  <div class="flex flex-col gap-6 w-full">
    <div class="flex items-center justify-center w-full gap-3">
      <Image :src="image" alt="CatID logo" width="50"/>
      <span>{{ t('login.catid.prompt') }}</span>
    </div>
    <Button @click="redirect" :label="t('login.button')" class="self-end" icon="pi pi-arrow-right"></Button>
  </div>
</template>

<style scoped>

</style>
