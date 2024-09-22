<script setup lang="ts">
import {i18nextPromise} from "@/i18n";
import {initApiAccess} from "@/service/api-access";

initApiAccess()
await i18nextPromise;
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
