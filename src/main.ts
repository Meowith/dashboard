import "./assets/global.scss"
import './index.css'

import {createApp} from 'vue'
import {createPinia} from 'pinia'

import router from './router'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';
import ConfirmationService from 'primevue/confirmationservice';
import Ripple from "primevue/ripple";

import {i18next} from '@/i18n';
import I18NextVue from 'i18next-vue';
import LoadingScreen from "./LoadingScreen.vue"

const app = createApp(LoadingScreen);
app
    .use(ToastService)
    .use(PrimeVue, {
        theme: {
            preset: Aura
        }
    })
    .use(I18NextVue, {i18next, rerenderOn: ['added', 'languageChanged']})
    .use(createPinia())
    .use(ConfirmationService)
    .use(router)

app.directive('tooltip', Tooltip)
app.directive('ripple', Ripple)

app.mount('#app')
