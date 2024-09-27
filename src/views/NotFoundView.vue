<script setup lang="ts">
import {useRouter} from "vue-router";
import {useTranslation} from "i18next-vue";
const {t} = useTranslation();
const router = useRouter()
</script>

<template>
  <div class="flex-grow flex justify-center items-center flex-col gap-4">
    <Message severity="error">{{ t('app.404') }}</Message>
    <Button icon="pi pi-home" @click="router.push({path:'/'})"></Button>
  </div>
</template>

<style scoped>

</style>