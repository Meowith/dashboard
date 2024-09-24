<script lang="ts" setup>
import {useTranslation} from "i18next-vue";
import DefaultLoginForm from "@/components/DefaultLoginForm.vue";
import {ref} from "vue";
import StepList from 'primevue/steplist';
import StepPanels from 'primevue/steppanels';
import Step from 'primevue/step';
import StepPanel from 'primevue/steppanel';
import CatIDLoginForm from "@/components/CatIDLoginForm.vue";

defineProps<{
  setup: boolean
}>()
const step = ref(1)
const {t} = useTranslation();
const selectedLoginMethod = ref();
const loginMethods = ref([
  {name: 'Meowith'},
  {name: 'CatID'}
])
</script>

<template>
  <Stepper :value="step.toString()" linear>
    <StepList>
      <Step value="1">{{ t('login.method') }}</Step>
      <Step value="2">{{ t(setup ? 'setup.register' : 'login.title') }}</Step>
    </StepList>
    <StepPanels>
      <StepPanel class="flex justify-center items-center flex-col gap-6" value="1">
        <p>{{ t('login.choose-method') }}</p>
        <Listbox v-model="selectedLoginMethod" :highlightOnSelect="false" :options="loginMethods" checkmark
                 class="w-full" optionLabel="name"/>
        <Button :disabled="!selectedLoginMethod" icon="pi pi-arrow-right" @click="step++"></Button>
      </StepPanel>
      <StepPanel value="2">
        <DefaultLoginForm v-if="selectedLoginMethod?.name === 'Meowith'" :setup="setup"/>
        <CatIDLoginForm v-if="selectedLoginMethod?.name === 'CatID'"/>
      </StepPanel>
    </StepPanels>
  </Stepper>
</template>

<style scoped>

</style>
