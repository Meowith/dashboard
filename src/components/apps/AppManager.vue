<script lang="ts" setup>

import {storeToRefs} from "pinia";
import {useStateStore} from "@/stores/state";
import {onMounted, onUnmounted, ref, watch} from "vue";
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

const props = defineProps<{
  refresh: boolean
}>()
const {ownApps} = storeToRefs(useStateStore())
const currentApp = ref<App>()
const {t} = useTranslation()
const buckets = ref<Bucket[]>([])
const {setBuckets} = useStateStore()
const loading = ref(false)

async function fetchBuckets() {
  try {
    loading.value = true;
    let new_buckets = await listBuckets(currentApp.value!.id)
    buckets.value = []
    new_buckets.buckets.forEach(bucket => {
      buckets.value.push(bucketFrom(bucket))
    })
    setBuckets(buckets.value)
    loading.value = false;
  } catch (e) {
  }
}

watch(() => props.refresh, () => {
  fetchBuckets()
})

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

onUnmounted(() => {
  setBuckets([])
})

</script>

<template>
  <div v-if="!currentApp" class="flex-grow flex justify-center items-center flex-col gap-4">
    <Message severity="error">{{ t('app.404') }}</Message>
    <Button icon="pi pi-home" @click="router.push({path:'/'})"></Button>
  </div>
  <div v-else-if="!loading" class="flex flex-wrap gap-4">
    <BucketTile v-for="bucket in buckets" :key="bucket.id" :bucket="bucket" class="flex-grow"
                @refresh="fetchBuckets()"/>
    <div style="align-items: center" class="flex w-full flex-col" v-if="buckets.length == 0">
      <span class="pi pi-warehouse text-gray-400" style="font-size: 5rem"></span>
      <span class="text-thin text-gray-400 m-3">{{t('app.bucket.empty')}}</span>
    </div>
  </div>
</template>

<style scoped>

</style>