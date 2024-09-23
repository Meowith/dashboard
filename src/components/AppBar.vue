<script setup lang="ts">
import Popover from 'primevue/popover';
import {useTranslation} from "i18next-vue";
import type {MenuItem} from "primevue/menuitem";
import {computed, onMounted, ref, watch} from "vue";
import {GlobalRole, useStateStore} from "@/stores/state";
import {useRoute, useRouter} from "vue-router";
import {logout} from "@/service/api-access";
import {createApp, deleteApp} from "@/service/app-management";
import {storeToRefs} from "pinia";
import type {App} from "@/models/entity";
import {useConfirm} from "primevue/useconfirm";
import ConfirmDialog from 'primevue/confirmdialog';
import {useToast} from "primevue/usetoast";
import {isAxiosError} from "axios";

const {t} = useTranslation()
const {globalUser} = useStateStore();
const op = ref()
const menuOptions = ref<MenuItem[]>([])
onMounted(() => {
  menuOptions.value = []

  menuOptions.value.push({
    label: t('home.nav.home'),
    icon: 'pi pi-home',
    route: '/'
  });

  if (globalUser!.globalRole == GlobalRole.Admin) {
    menuOptions.value.push({
      label: t('home.nav.admin'),
      icon: 'pi pi-shield',
      route: '/admin'
    });
  }
})

function popover(event: any) {
  op.value.toggle(event)
}

const appCreationVisible = ref(false)
const appLoading = ref(false)
const appName = ref('')
const userMenuItems = ref<MenuItem[]>([])
const router = useRouter()
const route = useRoute()
const emit = defineEmits(['refresh'])
onMounted(() => {
  userMenuItems.value.push({
    label: t('home.menu.logout'),
    icon: "pi pi-sign-out",
    command() {
      logout()
      router.push({path: '/login'})
    }
  })
})

async function doCreateApp() {
  appLoading.value = true
  await createApp({
    name: appName.value
  })
  appLoading.value = false
  appName.value = ''
  appCreationVisible.value = false
  emit('refresh')
}

const {ownApps} = storeToRefs(useStateStore())
const appMenuItems = ref<MenuItem[]>([])
const currentApp = computed(() => {
  if (route.name == 'appMgmt') {
    let id = route.params['id']
    let app: App | undefined = ownApps.value?.apps.find(x => x.id == id)
    return app
  }
  return undefined
})

const confirm = useConfirm()
const toast = useToast()

watch(currentApp, (v) => {
  if (!v) return
  appMenuItems.value = [];
  if (globalUser?.id == v.owner_id) {
    appMenuItems.value.push({
      label: t('app.menu.delete'),
      icon: "pi pi-trash",
      severity: 'error',
      command() {
        confirm.require({
          message: t('app.menu.delete-sure'),
          header: t('app.menu.delete'),
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
              await deleteApp({id: currentApp.value!.id})
              toast.add({
                severity: 'info',
                summary: t('app.menu.delete-toast.success-title'),
                detail: t('app.menu.delete-toast.success-desc'),
              })
              await router.push({path: '/'})
            } catch (e) {
              if (isAxiosError(e) && e.response) {
                toast.add({
                  severity: 'info',
                  summary: t('app.menu.delete-toast.error-title'),
                  detail: t('app.menu.delete-toast.error1-desc'),
                })
              } else {
                toast.add({
                  severity: 'info',
                  summary: t('app.menu.delete-toast.error-title'),
                  detail: t('app.menu.delete-toast.error2-desc'),
                })
              }
            }
          },
          reject: () => {
          }
        });
      },
    });
  }
}, {immediate: true})

const appOver = ref()

function appOptionsToggle(event: any) {
  appOver.value.toggle(event);
}

</script>

<template>
  <Menubar :model="menuOptions">
    <template #start>
      <Button icon="pi pi-plus" aria-label="Add" @click="appCreationVisible = true"/>
      <Dialog v-model:visible="appCreationVisible" modal :header="t('home.app.create.header')"
              :style="{ width: '27.5rem' }">
        <InputGroup>
          <InputText :placeholder="t('home.app.create.name')" v-model="appName"></InputText>
          <Button icon="pi pi-plus" @click="doCreateApp" :disabled="!appName || appName.length > 100"
                  :loading="appLoading"></Button>
        </InputGroup>
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
    <template #end>
      <div class="gap-2 flex flex-row items-center">
        <div v-if="route.name == 'appMgmt' && currentApp" class="flex items-center gap-1">
          <i class="pi pi-server"></i>
          <span class="font-thin">{{ currentApp.name }}</span>
          <Button icon="pi pi-ellipsis-v" text rounded aria-label="Filter" severity="secondary"
                  @click="appOptionsToggle" v-if="appMenuItems.length > 0"/>
          <ConfirmDialog></ConfirmDialog>
          <Menu :model="appMenuItems" ref="appOver" :popup="true">
            <template #item="{ item, props }">
              <a v-ripple class="flex items-center" v-bind="props.action">
                <span :class="item.icon + (item.severity=='error' ? ' text-red-500' : '')"/>
                <span :class="item.severity=='error' ? 'text-red-500' : ''">{{ item.label }}</span>
              </a>
            </template>
          </Menu>
        </div>
        <Avatar icon="pi pi-user" class="mr-2" @click="popover"/>
        <Menu :model="userMenuItems" ref="op" :popup="true"></Menu>
      </div>
    </template>
  </Menubar>
</template>

<style scoped>
</style>
