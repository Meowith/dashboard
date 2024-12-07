<script lang="ts" setup>

import {storeToRefs} from "pinia";
import {useStateStore} from "@/stores/state";
import {onMounted, onUnmounted, ref, watch} from "vue";
import {type Bucket, bucketFrom} from "@/models/entity";
import {listBuckets} from "@/service/app-management";
import {useTranslation} from "i18next-vue";
import BucketTile from "@/components/buckets/BucketTIle.vue";
const props = defineProps<{
  refresh: boolean
}>()
const {currentApp} = storeToRefs(useStateStore())
const {t} = useTranslation()
const buckets = ref<Bucket[]>([])
const {setBuckets} = useStateStore()
const loading = ref(false)

async function fetchBuckets(bck: boolean) {
  try {
    if (bck) loading.value = true;
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
  fetchBuckets(true)
})

let interval: ReturnType<typeof setInterval>
onMounted(async () => {
  await fetchBuckets(true)
  interval = setInterval(() => fetchBuckets(false), 15000)
})

onUnmounted(() => {
  setBuckets([])
  clearInterval(interval)
})

</script>

<template>
  <div class="flex w-full" v-if="loading">
    <ProgressSpinner/>
  </div>
  <div v-if="!loading" class="flex flex-wrap gap-4">
    <BucketTile v-for="bucket in buckets" :key="bucket.id" :bucket="bucket" class="flex-grow"
                @refresh="fetchBuckets(true)"/>
    <div class="flex w-full flex-col flex-grow justify-center items-center" v-if="buckets.length == 0">
      <span class="pi pi-warehouse text-gray-400" style="font-size: 5rem"></span>
      <span class="text-thin text-gray-400 m-3">{{t('app.bucket.empty')}}</span>
    </div>
  </div>
</template>

<style scoped>

</style>