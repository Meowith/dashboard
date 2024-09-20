<script setup lang="ts">
import AdminBar from "@/components/admin/AdminBar.vue";
</script>

<template>
  <div class="m-2 flex flex-col gap-2">
    <AdminBar/>
    <router-view/>
  </div>
</template>

<style scoped>

</style>