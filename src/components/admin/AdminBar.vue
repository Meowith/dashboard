<script setup lang="ts">
import {ref} from "vue";
import {useTranslation} from "i18next-vue";
import {useToast} from "primevue/usetoast";
import Toast from "primevue/toast";
import {fetchNodeRegisterCode} from "@/service/node-management";
import copy from "copy-to-clipboard";

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

</script>

<template>
  <Toolbar>
    <template #start>
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
  </Toolbar>
</template>

<style scoped>

</style>
