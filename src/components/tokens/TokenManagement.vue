<script lang="ts" setup>

import {storeToRefs} from "pinia";
import {useStateStore} from "@/stores/state";
import {computed, onMounted, ref, watch} from "vue";
import {type App, type AppToken, appTokenFrom, fromOwnedApps} from "@/models/entity";
import {useRoute} from "vue-router";
import {listOwnedApps} from "@/service/app-management";
import {deleteToken, listTokens} from "@/service/token-management";
import {errorToast} from "@/service/error";
import {useToast} from "primevue/usetoast";
import {useTranslation} from "i18next-vue";
import {useConfirm} from "primevue/useconfirm";
import ConfirmDialog from "primevue/confirmdialog";

const {ownApps} = storeToRefs(useStateStore())
const currentApp = ref<App>()
const route = useRoute()
const {setApps, globalUser} = useStateStore()
const {t} = useTranslation();

const props = defineProps<{
  refresh: boolean
}>()
const emit = defineEmits(['refresh'])
const tokens = ref<AppToken[]>([])
const toast = useToast()
const confirm = useConfirm()

async function fetchApps() {
  setApps(fromOwnedApps(await listOwnedApps()))
}

const canSeeAll = computed(() => {
  // TODO proper perm check
  return globalUser?.id == currentApp.value?.owner_id
})

async function fetchTokens() {
  if (!currentApp.value || !globalUser) return

  try {
    if (canSeeAll) {
      tokens.value = (await listTokens(currentApp.value!.id, '')).tokens.map(appTokenFrom)
    } else {
      tokens.value = (await listTokens(currentApp.value!.id, globalUser!.id)).tokens.map(appTokenFrom)
    }
  } catch (e) {
    errorToast(toast, e)
  }
}

onMounted(async () => {
  let id = route.params['id']
  let app: App | undefined = ownApps.value?.apps.find(x => x.id == id)
  if (!app) {
    await fetchApps()
    app = ownApps.value?.apps.find(x => x.id == id)
  }
  currentApp.value = app
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
      } catch(e) {
        errorToast(toast, e)
      }
    },
    reject: () => {}
  })
}

</script>

<template>
  <Panel :header="t(`app.tokens.table.${canSeeAll ? 'title-all' : 'title-your'}`)">
    <ConfirmDialog></ConfirmDialog>
    <DataTable :value="tokens">
      <Column :header="t('app.roles.table-cols.name')" field="name"/>
      <Column :header="t('app.roles.table-cols.created')" field="created">
        <template #body="slotProps">
          {{ slotProps.data.created.toLocaleString() }}
        </template>
      </Column>
      <Column :header="t('app.roles.table-cols.last-modified')" field="last_modified">
        <template #body="slotProps">
          {{ slotProps.data.created.toLocaleString() }}
        </template>
      </Column>
      <Column :header="t('app.roles.table-cols.name')" field="issuer_id" v-if="canSeeAll"/>
      <Column :header="t('app.roles.table-cols.action')" field="actions">
        <template #body="slotProps">
          <Button outlined icon="pi pi-trash" severity="danger" @click="promptDelete(slotProps.data)"></Button>
        </template>
      </Column>
    </DataTable>
  </Panel>
</template>

<style scoped>

</style>