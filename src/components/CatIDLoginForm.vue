<script lang="ts" setup>
import image from '@/assets/catid.svg';
import {useTranslation} from "i18next-vue";

const {t} = useTranslation();

</script>

<template>
  <div class="flex flex-col gap-6 w-full">
    <div class="flex items-center justify-center w-full gap-3">
      <Image :src="image" alt="CatID logo" width="50"/>
      <span>{{ t('login.catid.prompt') }}</span>
    </div>
    <Button :label="t('login.button')" class="self-end" icon="pi pi-arrow-right"></Button>
  </div>
</template>

<style scoped>

</style>