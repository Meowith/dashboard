<script lang="ts" setup>

import {storeToRefs} from "pinia";
import {useStateStore} from "@/stores/state";
import {computed, onMounted, ref, watch} from "vue";
import {type AppToken, appTokenFrom} from "@/models/entity";
import {useRoute} from "vue-router";
import {deleteToken, listTokens} from "@/service/token-management";
import {errorToast} from "@/service/error";
import {useToast} from "primevue/usetoast";
import {useTranslation} from "i18next-vue";
import {useConfirm} from "primevue/useconfirm";
import ConfirmDialog from "primevue/confirmdialog";
import {hasPermission} from "@/service/api-access";
import {AppPermission} from "@/dto/role";
import {fetchUserById} from "@/service/user";

const {currentApp} = storeToRefs(useStateStore())
useRoute();
const {globalUser} = useStateStore()
const {t} = useTranslation();

const props = defineProps<{
  refresh: boolean
}>()

const tokens = ref<AppToken[]>([])
const loading = ref(false)
const toast = useToast()
const confirm = useConfirm()
const canSeeAll = computed(() => {
  return globalUser?.id == currentApp.value?.owner_id || hasPermission([AppPermission.ListAllTokens])
})

async function fetchTokens() {
  if (!currentApp.value || !globalUser) return

  loading.value = true
  try {
    if (canSeeAll) {
      tokens.value = (await listTokens(currentApp.value!.id, '')).tokens.map(appTokenFrom)
    } else {
      tokens.value = (await listTokens(currentApp.value!.id, globalUser!.id)).tokens.map(appTokenFrom)
    }
    for (let i = 0; i < tokens.value.length; i++) {
      tokens.value[i].user_name = (await fetchUserById(tokens.value[i].issuer_id))?.name
    }
  } catch (e) {
    errorToast(toast, e)
  }
  loading.value = false
}

onMounted(async () => {
  await fetchTokens()
})

watch(() => props.refresh, () => {
  fetchTokens()
})

function promptDelete(token: AppToken) {
  confirm.require({
    message: t('app.tokens.prompt.delete-sure'),
    header: t('app.tokens.prompt.delete'),
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: t('confirm.cancel'),
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: t('confirm.delete'),
      severity: 'danger'
    },
    accept: async () => {
      try {
        await deleteToken(currentApp.value!.id, token.issuer_id, token.name)
        await fetchTokens()
      } catch (e) {
        errorToast(toast, e)
      }
    },
    reject: () => {
    }
  })
}

</script>

<template>
  <div class="flex w-full" v-if="loading">
    <ProgressSpinner/>
  </div>
  <div v-if="!loading">
    <Panel :header="t(`app.tokens.table.${canSeeAll ? 'title-all' : 'title-your'}`)">
      <ConfirmDialog></ConfirmDialog>
      <DataTable :value="tokens" v-if="tokens.length">
        <Column :header="t('app.tokens.table-cols.name')" field="name"/>
        <Column :header="t('app.tokens.table-cols.created')" field="created">
          <template #body="slotProps">
            {{ slotProps.data.created.toLocaleString() }}
          </template>
        </Column>
        <Column :header="t('app.tokens.table-cols.last_modified')" field="last_modified">
          <template #body="slotProps">
            {{ slotProps.data.created.toLocaleString() }}
          </template>
        </Column>
        <Column :header="t('app.tokens.table-cols.issuer')" field="issuer_id" v-if="canSeeAll">
          <template #body="slotProps">
            {{ slotProps.data.user_name || slotProps.data.issuer_id }}
          </template>
        </Column>
        <Column :header="t('app.tokens.table-cols.action')" field="actions">
          <template #body="slotProps">
            <Button outlined icon="pi pi-trash" severity="danger" @click="promptDelete(slotProps.data)"></Button>
          </template>
        </Column>
      </DataTable>
      <div style="align-items: center" class="flex w-full flex-col" v-else>
        <span class="pi pi-list text-gray-400" style="font-size: 5rem"></span>
        <span class="text-thin text-gray-400 m-3">{{ t('app.tokens.empty') }}</span>
      </div>
    </Panel>
  </div>
</template>

<style scoped>

</style>