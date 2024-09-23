<script setup lang="ts">
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
  <div class="p-4 flex flex-col gap-4" v-if="!loading && !cantAccess">
    <Toast/>
    <AdminBar @new-code="newCode = !newCode"/>
    <router-view :newCode="newCode"/>
  </div>
  <div class="flex justify-center items-center w-full h-full" v-else-if="!cantAccess">
    <ProgressSpinner/>
  </div>
  <div class="flex justify-center items-center w-full h-full" v-else-if="cantAccess">
    <Message>{{ t('admin.403') }}</Message>
  </div>
</template>

<style scoped>

</style>