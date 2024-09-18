<script setup lang="ts">
import {i18nextPromise} from "@/i18n";
import {init_api_access} from "@/service/api-access";
init_api_access()
await i18nextPromise;
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
