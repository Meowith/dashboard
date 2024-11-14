<script lang="ts" setup>

import {ref, watch} from "vue";
import {useTranslation} from "i18next-vue";
import type {App} from "@/models/entity";
import {errorToast} from "@/service/error";
import {useToast} from "primevue/usetoast";
import {createToken} from "@/service/token-management";
import type {ScopedPermission} from "@/dto/role";
import ScopeEditor from "@/components/ScopeEditor.vue";
import copy from "copy-to-clipboard";

const tokenCreationVisible = ref(false)
const tokenLoading = ref(false)
const tokenName = ref('')
const readyToken = ref('')
const emit = defineEmits(['refresh'])

const props = defineProps<{
  currentApp: App | undefined
}>()

const {t} = useTranslation()
const toast = useToast()
const perms = ref<ScopedPermission[]>([]);

async function doCreateToken() {
  if (!props.currentApp?.name) return
  tokenLoading.value = true
  try {
    let resp = await createToken({
      app_id: props.currentApp.id, name: tokenName.value, perms: perms.value
    })
    readyToken.value = resp.token
  } catch (e) {
    errorToast(toast, e)
  }
  tokenLoading.value = false
  tokenName.value = ''
  emit('refresh')
}

function doCopy() {
  if (copy(readyToken.value)) {
    toast.add({
      severity: 'info',
      summary: t('copy.title'),
      detail: t('copy.desc'),
      life: 3000
    })
  }
}

watch(tokenCreationVisible, () => {
  tokenLoading.value = false
  tokenName.value = ''
  perms.value = []
  readyToken.value = ''
})

</script>

<template>
  <Button aria-label="Add" icon="pi pi-plus" @click="tokenCreationVisible = true"/>
  <Dialog v-model:visible="tokenCreationVisible" :header="t('app.tokens.create.header')" class="w-1/2 min-w-96"
          modal>
    <div v-if="!readyToken">
      <InputGroup class="mb-4">
        <InputText v-model="tokenName" :placeholder="t('app.tokens.create.name')"></InputText>
        <Button :disabled="!tokenName || tokenName.length > 100" :loading="tokenLoading" icon="pi pi-plus"
                @click="doCreateToken"></Button>
      </InputGroup>
      <ScopeEditor v-if="currentApp" :app="currentApp" :save-loading="tokenLoading" v-model:scopes="perms"
                   :save-disable="tokenName.length == 0" @save="doCreateToken"/>
    </div>
    <div v-else class="flex flex-col justify-center items-center">
      <span class="text-xl">{{ t('app.tokens.create.ready-message') }}</span>
      <span class="text-surface-400 dark:text-surface-500">{{ t('app.tokens.create.ready-tip') }}</span>
      <InputGroup class="mt-6">
        <InputText :model-value="readyToken" :readonly="true"></InputText>
        <Button icon="pi pi-copy" @click="doCopy"></Button>
      </InputGroup>
    </div>
  </Dialog>
</template>

<style scoped>

</style>
