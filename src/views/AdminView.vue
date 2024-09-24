<script lang="ts" setup>
import AdminBar from "@/components/admin/AdminBar.vue";
import {fetchCurrentUserController} from "@/service/user";
import {GlobalRole, useStateStore} from "@/stores/state";
import {ref} from "vue";
import {useTranslation} from "i18next-vue";
import {useRouter} from "vue-router";
import Toast from "primevue/toast";

const {t} = useTranslation()

const loading = ref(true);
const newCode = ref(true);
const cantAccess = ref(false)

try {
  await fetchCurrentUserController(useRouter())
  const {globalUser} = useStateStore()
  if (globalUser!.globalRole != GlobalRole.Admin) {
    cantAccess.value = true
  }
  loading.value = false;
} catch (e) {
  cantAccess.value = true
  loading.value = false
}

</script>

<template>
  <div v-if="!loading && !cantAccess" class="p-4 flex flex-col gap-4">
    <Toast/>
    <AdminBar @new-code="newCode = !newCode"/>
    <router-view :newCode="newCode"/>
  </div>
  <div v-else-if="!cantAccess" class="flex justify-center items-center w-full h-full">
    <ProgressSpinner/>
  </div>
  <div v-else-if="cantAccess" class="flex justify-center items-center w-full h-full">
    <Message>{{ t('admin.403') }}</Message>
  </div>
</template>

<style scoped>

</style>