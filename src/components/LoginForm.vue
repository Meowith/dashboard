<script setup lang="ts">
import LoginComponent from "@/components/LoginComponent.vue";
</script>

<template>
  <Card class="w-2/3 max-w-md border-neutral-800 border">
    <template #content>
      <LoginComponent :setup="false"/>
    </template>
  </Card>
</template>

<style scoped>

</style>
