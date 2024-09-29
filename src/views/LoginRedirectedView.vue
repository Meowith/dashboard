<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {LOGIN_METHODS} from "@/env";
import {ref} from "vue";
import {usePreferenceStore} from "@/stores/preferences";
import image from "@/assets/catid.svg";
import {useTranslation} from "i18next-vue";
import {dashboardCatidLogin} from "@/service/api-access";

const route = useRoute();
const router = useRouter();
const store = usePreferenceStore()
const invalidMethod = !Object.keys(LOGIN_METHODS).some((v) => v == route.params.method)
if (invalidMethod) {
  router.push('/login')
}

let error = ref("");
let isError = ref(false)
const aboutToRoute = ref(false)
const {t} = useTranslation();

let code = get("code");

if (code != undefined && code.trim() !== '') {
  dashboardCatidLogin({code}).then(result => {
    store.preferences.token = result.token;
    router.push({path: '/'})
  }).catch(err => {
    error.value = err.response.data;
    isError.value = true;
  })
} else {
  aboutToRoute.value = true;
  router.push('/')
}

function get(name: string): string {
  const parts = window.location.href.split('?');
  if (parts.length > 1) {
    name = encodeURIComponent(name);
    const params = parts[1].split('&');
    const found = params.filter(el => (el.split('=')[0] === name) && el);
    if (found.length) return decodeURIComponent(found[0].split('=')[1]);
  }
  return '';
}

</script>

<template>
  <div class="w-full h-full flex items-center justify-center">
    <Panel class="flex flex-col gap-6">
      <template #header>
        <div class="flex items-center justify-center w-full gap-3">
          <Image :src="image" alt="CatID logo" width="50"/>
          <span>{{ t('login.catid.loading') }}</span>
        </div>
      </template>
      <div class="flex justify-center w-full">
        <ProgressSpinner strokeWidth="8" style="width: 50px; height: 50px"/>
      </div>
    </Panel>
  </div>
</template>

<style scoped>

</style>
