<script lang="ts" setup>
import {useTranslation} from "i18next-vue";
import DefaultLoginForm from "@/components/DefaultLoginForm.vue";
import {onMounted, ref} from "vue";
import StepList from 'primevue/steplist';
import StepPanels from 'primevue/steppanels';
import Step from 'primevue/step';
import StepPanel from 'primevue/steppanel';
import CatIDLoginForm from "@/components/CatIDLoginForm.vue";
import {getLoginMethods, getSetupLoginMethods} from "@/service/api-access";
import {errorToast} from "@/service/error";
import {useToast} from "primevue/usetoast";
import Toast from "primevue/toast";

const props = defineProps<{
  setup: boolean
}>()
const loading = ref(true)
const step = ref(1)
const {t} = useTranslation();
const selectedLoginMethod = ref();
const loginMethods = ref([
  {name: 'BASIC'},
  {name: 'CATID'}
])

onMounted(async () => {
  try {
    let methods;
    if (props.setup) {
      methods = await getSetupLoginMethods()
    } else {
      methods = await getLoginMethods()
    }
    loginMethods.value = methods.map(x => {
      return {
        name: x
      }
    })
  } catch (e) {
    errorToast(useToast(), e)
  }
  loading.value = false
})

</script>

<template>
  <Stepper :value="step.toString()" linear>
    <Toast/>
    <StepList>
      <Step value="1">{{ t('login.method') }}</Step>
      <Step value="2">{{ t(setup ? 'setup.register' : 'login.title') }}</Step>
    </StepList>
    <StepPanels>
      <StepPanel class="flex justify-center items-center flex-col gap-6" value="1">
        <p>{{ t('login.choose-method') }}</p>
        <div></div>
        <ProgressSpinner v-if="loading"></ProgressSpinner>
        <Listbox v-model="selectedLoginMethod" :highlightOnSelect="false" :options="loginMethods" checkmark
                 class="w-full" optionLabel="name" v-else/>
        <Button :disabled="!selectedLoginMethod || loading" icon="pi pi-arrow-right" @click="step++"></Button>
      </StepPanel>
      <StepPanel value="2">
        <DefaultLoginForm v-if="selectedLoginMethod?.name === 'BASIC'" :setup="setup"/>
        <CatIDLoginForm v-if="selectedLoginMethod?.name === 'CATID'"/>
      </StepPanel>
    </StepPanels>
  </Stepper>
</template>

<style scoped>

</style>
