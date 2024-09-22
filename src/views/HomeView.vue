<script setup lang="ts">
import AppBar from "@/components/AppBar.vue";
import {ref} from "vue";
import {fetchCurrentUser} from "@/service/user";

const loading = ref(true)
await fetchCurrentUser()
loading.value = false
</script>

<template>
  <div class="p-4 flex flex-col gap-4" v-if="!loading">
    <AppBar/>
    <router-view/>
  </div>
  <div class="flex justify-center items-center w-full h-full" v-else>
    <ProgressSpinner/>
  </div>
</template>
