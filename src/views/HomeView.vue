<script lang="ts" setup>
import AppBar from "@/components/AppBar.vue";
import {ref} from "vue";
import {fetchCurrentUser} from "@/service/user";
import {useRouter} from "vue-router";
import Toast from "primevue/toast";

const loading = ref(true)
await fetchCurrentUser(useRouter())
loading.value = false
const refresh = ref(false);
</script>

<template>
  <div v-if="!loading" class="p-4 flex flex-col gap-4">
    <Toast/>
    <AppBar @refresh="refresh = !refresh"/>
    <router-view :refresh="refresh"/>
  </div>
  <div v-else class="flex justify-center items-center w-full h-full">
    <ProgressSpinner/>
  </div>
</template>
