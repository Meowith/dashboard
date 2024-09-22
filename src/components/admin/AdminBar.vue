<script setup lang="ts">
import {ref} from "vue";
import {useTranslation} from "i18next-vue";
import {useToast} from "primevue/usetoast";
import Toast from "primevue/toast";
import {fetchNodeRegisterCode} from "@/service/node-management";
import copy from "copy-to-clipboard";
import type {MenuItem} from "primevue/menuitem";
import {useRouter} from "vue-router";

const addNodeDialog = ref(false)
const {t} = useTranslation();
const registerCode = ref('')
const codeLoading = ref(false)

const toast = useToast();

async function createCode() {
  codeLoading.value = true
  try {
    registerCode.value = (await fetchNodeRegisterCode()).code
  } catch (_) {
    toast.add({
      severity: "error",
      summary: t('admin.nodes.code-gen-fail'),
      detail: t('admin.nodes.code-gen-fail-desc'),
      life: 3000
    })
  }
  codeLoading.value = false
}

function doCopy() {
  if (copy(registerCode.value)) {
    toast.add({
      severity: 'info',
      summary: t('admin.nodes.code-copied'),
      life: 3000
    })
  }
}

const router = useRouter()
const menuItems: MenuItem[] = [
  {
    label: t('admin.nav.home'),
    icon: "pi pi-home",
    route: '/'
  }
]

</script>

<template>
  <Menubar :model="menuItems">
    <template #end>
      <Button icon="pi pi-plus" aria-label="Add" @click="addNodeDialog = true; registerCode = ''"/>
      <Toast/>
      <Dialog v-model:visible="addNodeDialog" modal :header="t('admin.nodes.add')" :style="{ width: '27.5rem' }">
        <span class="text-surface-500 dark:text-surface-400 block mb-4">{{
            registerCode ? t('admin.nodes.add-tip') : t('admin.nodes.add-generate')
          }}</span>
        <div class="flex justify-center items-center">
          <Button icon="pi pi-plus" :loading="codeLoading" @click="createCode" v-if="!registerCode"></Button>
          <InputGroup v-else>
            <InputText :model-value="registerCode" :readonly="true"></InputText>
            <Button icon="pi pi-copy" severity="secondary" @click="doCopy"></Button>
          </InputGroup>
        </div>
      </Dialog>
    </template>
    <template #item="{ item, props, }">
      <router-link v-slot="{ href, navigate }" :to="item.route" custom>
        <a v-ripple :href="href" v-bind="props.action" @click="navigate">
          <span :class="item.icon"/>
          <span class="ml-2">{{ item.label }}</span>
        </a>
      </router-link>
    </template>
  </Menubar>
</template>

<style scoped>

</style>
