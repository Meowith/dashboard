<script lang="ts" setup>

import {onMounted, ref} from "vue";
import type {MenuItem} from "primevue/menuitem";
import {logout} from "@/service/api-access";
import {useTranslation} from "i18next-vue";
import {useRouter} from "vue-router";
import {useStateStore} from "@/stores/state";

const op = ref()
const {t} = useTranslation()
const router = useRouter()
const {globalUser} = useStateStore()

function popover(event: any) {
  op.value.toggle(event)
}

const userMenuItems = ref<MenuItem[]>([])
onMounted(() => {
  userMenuItems.value.push({
    label: globalUser?.name,
    items: [{
      label: t('home.menu.logout'),
      icon: "pi pi-sign-out",
      command() {
        logout()
        router.push({path: '/login'})
      }
    }]
  })
})

</script>

<template>
  <Avatar class="mr-2" icon="pi pi-user" @click="popover"/>
  <Menu ref="op" :model="userMenuItems" :popup="true"></Menu>
</template>

<style scoped>

</style>