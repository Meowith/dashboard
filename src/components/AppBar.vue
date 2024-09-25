<script lang="ts" setup>
import {useTranslation} from "i18next-vue";
import type {MenuItem} from "primevue/menuitem";
import {computed, onMounted, ref, watch} from "vue";
import {GlobalRole, useStateStore} from "@/stores/state";
import {useRoute} from "vue-router";
import {storeToRefs} from "pinia";
import type {App} from "@/models/entity";
import UserProfile from "@/components/UserProfile.vue";
import BarAppManagement from "@/components/appbar/BarAppManagement.vue";
import CreateBucket from "@/components/appbar/CreateBucket.vue";
import CreateRole from "@/components/appbar/CreateRole.vue";
import CreateMember from "@/components/appbar/CreateMember.vue";

const {t} = useTranslation()
const {globalUser} = useStateStore();
const menuOptions = ref<MenuItem[]>([])
onMounted(() => {
  calcNav()
})

function calcNav() {
  menuOptions.value = []

  menuOptions.value.push({
    label: t('home.nav.home'),
    icon: 'pi pi-home',
    route: '/'
  });

  if (currentApp.value) {
    menuOptions.value.push({
      label: t('home.nav.buckets'),
      icon: 'pi pi-warehouse',
      route: `/apps/${currentApp.value!.id}`
    });
    menuOptions.value.push({
      label: t('home.nav.roles'),
      icon: 'pi pi-user-edit',
      route: `/apps/${currentApp.value!.id}/roles`
    });
    menuOptions.value.push({
      label: t('home.nav.users'),
      icon: 'pi pi-users',
      route: `/apps/${currentApp.value!.id}/users`
    });
    menuOptions.value.push({
      label: t('home.nav.tokens'),
      icon: 'pi pi-list',
      route: `/apps/${currentApp.value!.id}/users`
    });
  }

  if (globalUser!.globalRole == GlobalRole.Admin) {
    menuOptions.value.push({
      label: t('home.nav.admin'),
      icon: 'pi pi-shield',
      route: '/admin'
    });
  }
}

const route = useRoute()
const emit = defineEmits(['refresh'])

const {ownApps} = storeToRefs(useStateStore())
const currentApp = computed(() => {
  if (['appMgmt', 'appUserMgmt', 'appTokenMgmt', 'appRoleMgmt'].includes(route.name as string)) {
    let id = route.params['id']
    let app: App | undefined = ownApps.value?.apps.find(x => x.id == id)
    return app
  }
  return undefined
})

watch(currentApp, () => {
  calcNav()
}, {immediate: true})

</script>

<template>
  <Menubar :model="menuOptions">
    <template #start>
      <CreateApp v-if="route.name == 'appList'" @refresh="emit('refresh')"/>
      <CreateBucket v-if="route.name == 'appMgmt'" :currentApp="currentApp" @refresh="emit('refresh')"/>
      <CreateRole v-if="route.name == 'appRoleMgmt'" :currentApp="currentApp" @refresh="emit('refresh')"/>
      <CreateMember v-if="route.name == 'appUserMgmt'" :currentApp="currentApp" @refresh="emit('refresh')"/>
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
        <BarAppManagement v-if="route.name == 'appMgmt' && currentApp" :current-app="currentApp!"/>
        <UserProfile/>
      </div>
    </template>
  </Menubar>
</template>

<style scoped>
</style>
