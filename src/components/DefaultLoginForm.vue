<script lang="ts" setup>
import {ref, watch} from "vue";
import {useTranslation} from "i18next-vue";
import {controllerBasicLogin, dashboardBasicLogin, registerRequest, setupRegisterRequest} from "@/service/api-access";
import {useRouter} from "vue-router";
import {usePreferenceStore} from "@/stores/preferences";
import {isAxiosError} from "axios";

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
const preferences = usePreferenceStore()

function validatePassword() {
  if (register.value && passwordConfirm.value != password.value) {
    errorMessage.value = t('login.error.password-mismatch')
    return false
  }
  return true
}

async function performLogin() {
  loading.value = true;
  if (register.value) {
    return await performRegister()
  }

  let req: BasicLoginRequest = {
    password: password.value, username: username.value
  }

  try {
    let response = await dashboardBasicLogin(req);
    preferences.preferences.token = response.token;
    await router.push({path: '/'})
  } catch (e) {
    if (isAxiosError(e)) {
      if (!e.response) {
        try {
          let response = await controllerBasicLogin(req);
          preferences.preferences.token = response.token;
          await router.push({path: '/admin'})
        } catch (e) {
          errorMessage.value = t('login.error.password-incorrect')
        }
      }
    }
    errorMessage.value = t('login.error.password-incorrect')
  }
  loading.value = false;
}

async function performRegister() {
  if (!validatePassword()) return
  loading.value = true;
  let req: RegisterRequest = {
    password: password.value, username: username.value,
  }

  try {
    if (props.setup) {
      await setupRegisterRequest(req)

      await router.push({path: '/login'})
    } else {
      let response = await registerRequest(req)

      preferences.preferences.token = response.token;

      await router.push({path: '/'})
    }
  } catch (error) {
    errorMessage.value = t('setup.fail') + error
  }
  loading.value = false;
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
        <InputText id="username" v-model="username" :disabled="loading" placeholer="" type="email"/>
      </InputGroup>
      <label class="label" for="username">{{ t('login.basic.username') }}</label>
    </FloatLabel>
    <FloatLabel>
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-key"></i>
        </InputGroupAddon>
        <Password id="password" v-model="password" :disabled="loading" :feedback="false"/>
      </InputGroup>
      <label class="label" for="password">{{ t('login.basic.password') }}</label>
    </FloatLabel>
    <FloatLabel v-if="register">
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-key"></i>
        </InputGroupAddon>
        <Password id="password-2" v-model="passwordConfirm" :disabled="loading" :feedback="false"
                  :invalid="password != passwordConfirm"/>
      </InputGroup>
      <label class="label" for="password-2">{{ t('login.basic.password-confirm') }}</label>
    </FloatLabel>
    <div v-if="!register" style="height: 42px">
      <small class="text-gray-500 mr-1">{{ t('login.basic.register-prompt') }}</small>
      <small class="text-blue-400 cursor-pointer" @click="register = true">{{
          t('login.basic.register-button')
        }}</small>
    </div>
    <Message v-if="errorMessage" severity="error">{{ errorMessage }}</Message>
    <Button :label="t(register ? 'setup.reg-button' : 'login.button')" :loading="loading" class="self-end"
            icon="pi pi-arrow-right"
            @click="performLogin"></Button>
  </div>
</template>

<style scoped>
.label {
  margin-left: 38px
}
</style>
