<script setup lang="ts">
import {ref, watch} from "vue";
import {useTranslation} from "i18next-vue";
import {setupRegisterRequest} from "@/service/api-access";
import {RegistrationRequest} from "@vue/language-server";
import {useRouter} from "vue-router";

const props = defineProps<{
  setup: boolean
}>()

const username = ref('');
const password = ref('');
const passwordConfirm = ref('');
const errorMessage = ref('');
const {t} = useTranslation()
const loading = ref(false)
const register = ref(props.setup)
const router = useRouter();

function validatePassword() {
  if (register.value && passwordConfirm.value != password.value) {
    errorMessage.value = t('login.error.password-mismatch')
    return false
  }
  return true
}

async function performLogin() {
  if (register.value) {
    return await performRegister()
  }
  loading.value = true;
}

async function performRegister() {
  if (!validatePassword()) return
  loading.value = true;
  let req: RegisterRequest = {
    password: password.value, username: username.value,
  }
  if (props.setup) {
    try {
      await setupRegisterRequest(req)
    } catch (error) {
      errorMessage.value = t('setup.fail') + error
    }
  }
  loading.value = false;
  await router.push({path: '/login'})
}

watch(username, () => errorMessage.value = '')
watch(password, () => errorMessage.value = '')
watch(passwordConfirm, () => errorMessage.value = '')

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
    <Message severity="error" v-if="errorMessage">{{ errorMessage }}</Message>
    <Button icon="pi pi-arrow-right" class="self-end" :label="t(register ? 'setup.reg-button' : 'login.button')"
            :loading="loading"
            @click="performLogin"></Button>
  </div>
</template>

<style scoped>
.label {
  margin-left: 38px
}
</style>
