<script setup lang="ts">
import Popover from 'primevue/popover';
import {useTranslation} from "i18next-vue";
import type {MenuItem} from "primevue/menuitem";
import {onMounted, ref} from "vue";
import {GlobalRole, useStateStore} from "@/stores/state";
import {useRouter} from "vue-router";
import {logout} from "@/service/api-access";

const {t} = useTranslation()
const {globalUser} = useStateStore();
const op = ref()
const menuOptions = ref<MenuItem[]>([])
onMounted(() => {
  menuOptions.value = []

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
const menuItems = ref<MenuItem[]>([])
const router = useRouter()
onMounted(() => {
  menuItems.value.push({
    label: t('home.menu.logout'),
    icon: "pi pi-sign-out",
    command() {
      logout()
      router.push({path: '/login'})
    }
  })
})

</script>

<template>
  <Menubar :model="menuOptions">
    <template #start>
      <Button icon="pi pi-plus" aria-label="Add" @click="appCreationVisible = true"/>
      <Dialog v-model:visible="appCreationVisible" modal :header="t('home.app.create.header')" :style="{ width: '27.5rem' }">
        <InputGroup>
          <InputText :placeholder="t('home.app.create.name')"></InputText>
          <Button icon="pi pi-plus"></Button>
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
        <Avatar icon="pi pi-user" class="mr-2" @click="popover"/>
        <Popover ref="op">
          <Menu :model="menuItems"></Menu>
        </Popover>
      </div>
    </template>
  </Menubar>
</template>

<style scoped>
</style>
