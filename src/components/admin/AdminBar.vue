<script lang="ts" setup>
import {ref} from "vue";
import {useTranslation} from "i18next-vue";
import {useToast} from "primevue/usetoast";
import {createNodeRegisterCode} from "@/service/node-management";
import copy from "copy-to-clipboard";
import type {MenuItem} from "primevue/menuitem";
import UserProfile from "@/components/UserProfile.vue";

const addNodeDialog = ref(false)
const {t} = useTranslation();
const registerCode = ref('')
const codeLoading = ref(false)

const toast = useToast();

const emit = defineEmits(['new-code'])

async function createCode() {
  codeLoading.value = true
  try {
    registerCode.value = (await createNodeRegisterCode()).code
    emit('new-code')
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
      summary: t('copy.title'),
      detail: t('copy.desc'),
      life: 3000
    })
  }
}

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
    <template #start>
      <Button aria-label="Add" icon="pi pi-plus" @click="addNodeDialog = true; registerCode = ''"/>
      <Dialog v-model:visible="addNodeDialog" :header="t('admin.nodes.add')" :style="{ width: '27.5rem' }" modal>
        <span class="text-surface-500 dark:text-surface-400 block mb-4">{{
            registerCode ? t('admin.nodes.add-tip') : t('admin.nodes.add-generate')
          }}</span>
        <div class="flex justify-center items-center">
          <Button v-if="!registerCode" :loading="codeLoading" icon="pi pi-plus" @click="createCode"></Button>
          <InputGroup v-else>
            <InputText :model-value="registerCode" :readonly="true"></InputText>
            <Button icon="pi pi-copy" severity="secondary" @click="doCopy"></Button>
          </InputGroup>
        </div>
      </Dialog>
    </template>
    <template #end>
      <UserProfile/>
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
