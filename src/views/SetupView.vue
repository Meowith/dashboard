<script lang="ts" setup>
import {useTranslation} from "i18next-vue";
import LoginComponent from "@/components/LoginComponent.vue";

const {t} = useTranslation()
</script>

<template>
  <div class="w-full h-full flex justify-center items-center">
    <Card class="w-2/5 max-w-6xl border-neutral-800 border">
      <template #content>
        <h1 class="text-2xl text-center">{{ t('setup.title') }}</h1>
        <LoginComponent :setup="true"/>
      </template>
    </Card>
  </div>
</template>

<style scoped>

</style>
