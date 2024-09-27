<script setup lang="ts">

import {APP_ID, AppPermission, type ScopedPermission, UserPermission} from "@/dto/role";
import {decodePermSet, encodePermSet} from "@/service/role-management";
import Select from "primevue/select";
import {listBuckets} from "@/service/app-management";
import {type App, type Bucket, bucketFrom} from "@/models/entity";
import {errorToast} from "@/service/error";
import {computed, onMounted, ref, toRaw, watch} from "vue";
import {enumValues} from "@/enumIter";
import {useStateStore} from "@/stores/state";
import {useTranslation} from "i18next-vue";
import {useToast} from "primevue/usetoast";

const props = defineProps<{
  app: App,
  allowAppScope?: boolean,
  saveLoading: boolean,
  saveDisable?: boolean
  scopes: ScopedPermission[]
}>()

const toast = useToast()
const {t} = useTranslation()

const buckets = ref<Bucket[]>([])
const {setBuckets, currentBuckets} = useStateStore()
const newScope = ref<{
  value: {
    app: boolean,
    id: string
  }
}>()
const scopeEnum = computed(() => {
  return newScope.value?.value.app ? AppPermission : UserPermission
})
const scopeKey = computed(() => {
  return newScope.value?.value.app ? 'app.roles.permissions.app' : 'app.roles.permissions.user'
})
const scopeOptions = ref<any[]>([])
type EitherPerm = { id: UserPermission }[] | { id: AppPermission }[];
const currentPermissions = ref<[EitherPerm, EitherPerm]>([[], []])
const permEdit = ref<ScopedPermission[]>([])
const modified = computed(() => {
  let a = props.scopes
  let b = permEdit.value

  if (a.length != b.length) return true
  let setA = new Set(a.map(x => JSON.stringify(x)))
  let setB = new Set(b.map(x => JSON.stringify(x)))

  for (let elem of setA) {
    if (!setB.has(elem)) {
      return true
    }
  }

  return false
})
const emit = defineEmits(['update:visible', 'update:scopes', 'save'])

watch(() => props.scopes, (v) => {
  reset()
}, {immediate: true})

function resetCurrent() {
  newScope.value = undefined
}

function reset() {
  resetCurrent()
  permEdit.value = JSON.parse(JSON.stringify(props.scopes))
}

async function addScope() {
  if (!permEdit.value || !newScope.value) return
  let newScoped: ScopedPermission = {
    allowance: encodePermSet(currentPermissions.value[1].map(x => x.id)), bucket_id: newScope.value.value.id
  }
  permEdit.value.push(newScoped)
  resetCurrent()
}

async function deleteScope(idx: number) {
  if (!permEdit.value) return
  permEdit.value.splice(idx, 1)
}

async function fetchBuckets() {
  if (!currentBuckets || currentBuckets.length == 0) {
    try {
      let new_buckets = await listBuckets(props.app.id)
      buckets.value = []
      new_buckets.buckets.forEach(bucket => {
        buckets.value.push(bucketFrom(bucket))
      })
      setBuckets(buckets.value)
    } catch (e) {
      errorToast(toast, e)
    }
  } else {
    buckets.value = currentBuckets
  }
  scopeOptions.value = [
    {
      label: 'Bucket',
      items: buckets.value.map(x => {
        return {
          label: x.name,
          value: {app: false, id: x.id}
        }
      })
    },
  ]
  if (props.allowAppScope) {
    scopeOptions.value.splice(0, 0, {
      label: 'App',
      items: [
        {label: 'App', value: {app: true, id: APP_ID}},
      ]
    })
  }
}

onMounted(() => {
  reset()
  fetchBuckets()
})

watch(newScope, (v) => {
  currentPermissions.value = [
    (v?.value?.app ? enumValues(AppPermission) : enumValues(UserPermission)).map(x => {
      return {
        id: x,
      }
    }) as unknown as EitherPerm,
    []
  ]
}, {immediate: true})

function save() {
  emit('update:scopes', permEdit.value)
  emit('save')
}

</script>

<template>
  <div class="flex flex-col gap-4">
    <div v-for="(scope, index) in permEdit" class="flex flex-col gap-2 font-thin text-xs">
      <div class="flex gap-1 items-center flex-wrap" v-if="scope.bucket_id != APP_ID">
        <Chip icon="pi pi-warehouse" :label="buckets.find(x => x.id == scope.bucket_id)?.name"></Chip>
        <Chip v-for="i in decodePermSet(UserPermission, scope.allowance)" label="">
          {{ t('app.roles.permissions.user.' + UserPermission[i as unknown as keyof typeof UserPermission] as any) }}
        </Chip>
        <Button severity="danger" outlined icon="pi pi-trash" @click="deleteScope(index)"></Button>
      </div>
      <div class="flex gap-1 items-center flex-wrap" v-else>
        <Chip icon="pi pi-address-book"></Chip>
        <Chip v-for="i in decodePermSet(AppPermission, scope.allowance)" label="">
          {{ t('app.roles.permissions.app.' + AppPermission[i as unknown as keyof typeof AppPermission] as any) }}
        </Chip>
        <Button severity="danger" outlined icon="pi pi-trash" @click="deleteScope(index)"></Button>
      </div>
    </div>
  </div>
  <Divider/>
  <div class="flex flex-col gap-4">
    <label for="scope-sel">{{ t('app.roles.role-create.label-scope') }}</label>
    <Select id="scope-sel" v-model="newScope" :options="scopeOptions" optionLabel="label"
            optionGroupLabel="label" optionGroupChildren="items"
            :placeholder="t('app.roles.role-create.placeholder-scope')"
            class="w-full md:w-56">
      <template #optiongroup="slotProps">
        <div class="flex items-center">
          <div>{{ slotProps.option.label }}</div>
        </div>
      </template>
    </Select>
    <label for="allowances">{{ t('app.roles.role-create.label-allowances') }}</label>
    <PickList v-model="currentPermissions" data-key="id" id="allowances" :disabled="!newScope"
              :show-source-controls="false"
              :show-target-controls="false">
      <template #option="{ option  }">
        {{ t(scopeKey + '.' + scopeEnum[option.id] as any) }}
      </template>
    </PickList>
    <div class="flex">
      <Button icon="pi pi-plus" @click="addScope()" :disabled="!newScope"></Button>
      <div class="flex-grow"></div>
      <Button icon="pi pi-save" @click="save" :loading="saveLoading" :disabled="!modified || saveDisable"></Button>
    </div>
  </div>
</template>

<style scoped>

</style>