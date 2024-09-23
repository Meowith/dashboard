<script setup lang="ts">

import {storeToRefs} from "pinia";
import {useStateStore} from "@/stores/state";
import {onMounted, ref} from "vue";
import {type App, type Bucket, bucketFrom, fromOwnedApps} from "@/models/entity";
import {listBuckets, listOwnedApps} from "@/service/app-management";
import {useRoute, useRouter} from "vue-router";
import {useTranslation} from "i18next-vue";
import BucketTile from "@/components/buckets/BucketTIle.vue";

const {setApps} = useStateStore()
const route = useRoute();
const router = useRouter()

async function fetchApps() {
  setApps(fromOwnedApps(await listOwnedApps()))
}

const {ownApps} = storeToRefs(useStateStore())
const currentApp = ref<App>()
const {t} = useTranslation()
const buckets = ref<Bucket[]>([])

async function fetchBuckets() {
  try {
    let new_buckets = await listBuckets(currentApp.value!.id)
    buckets.value = []
    new_buckets.buckets.forEach(bucket => {
      buckets.value.push(bucketFrom(bucket))
    })
  } catch (e) {
  }
}

onMounted(async () => {
  if (route.name == 'appMgmt') {
    let id = route.params['id']
    let app: App | undefined = ownApps.value?.apps.find(x => x.id == id)
    if (!app) {
      await fetchApps()
      app = ownApps.value?.apps.find(x => x.id == id)
    }
    currentApp.value = app
    await fetchBuckets()
  }
})

</script>

<template>
  <div v-if="!currentApp" class="flex-grow flex justify-center items-center flex-col gap-4">
    <Message severity="error">{{ t('app.404') }}</Message>
    <Button icon="pi pi-home" @click="router.push({path:'/'})"></Button>
  </div>
  <div v-else>
    <BucketTile :bucket="bucket" v-for="bucket in buckets" :key="bucket.id"/>
  </div>
</template>

<style scoped>

</style>