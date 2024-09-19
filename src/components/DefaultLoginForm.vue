<script setup lang="ts">
import {ref} from "vue";
import {useTranslation} from "i18next-vue";
const props = defineProps<{
  setup: boolean
}>()

const username = ref('');
const password = ref('');
const passwordConfirm = ref('');
const {t} = useTranslation()
const loading = ref(false)
const register = ref(props.setup)

async function performLogin() {
  loading.value = true;
}

async function performRegister() {
  loading.value = true;
}

</script>

<template>
  <div class="flex flex-col items-center justify-center w-full pt-4 gap-6">
    <FloatLabel>
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-user"></i>
        </InputGroupAddon>
        <InputText placeholer="" type="email" id="username" v-model="username" :disabled="loading"/>
      </InputGroup>
      <label class="label" for="username">{{ t('login.basic.username') }}</label>
    </FloatLabel>
    <FloatLabel>
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-key"></i>
        </InputGroupAddon>
        <Password id="password" v-model="password" :feedback="false" :disabled="loading"/>
      </InputGroup>
      <label class="label" for="password">{{ t('login.basic.password') }}</label>
    </FloatLabel>
    <FloatLabel v-if="register">
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-key"></i>
        </InputGroupAddon>
        <Password :invalid="password != passwordConfirm" id="password-2" v-model="passwordConfirm" :feedback="false"
                  :disabled="loading"/>
      </InputGroup>
      <label class="label" for="password-2">{{ t('login.basic.password-confirm') }}</label>
    </FloatLabel>
    <div v-if="!register" style="height: 42px">
      <small class="text-gray-500 mr-1">{{ t('login.basic.register-prompt') }}</small>
      <small class="text-blue-400 cursor-pointer" @click="register = true">{{
          t('login.basic.register-button')
        }}</small>
    </div>
    <Button icon="pi pi-arrow-right" class="self-end" :label="t(register ? 'setup.reg-button' : 'login.button')" :loading="loading"
            @click="performLogin"></Button>
  </div>
</template>

<style scoped>
.label {
  margin-left: 38px
}
</style>
