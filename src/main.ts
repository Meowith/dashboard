import "./assets/global.scss"
import './index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import router from './router'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

import { i18next } from '@/i18n';
import I18NextVue from 'i18next-vue';
import LoadingScreen from "./LoadingScreen.vue"

const app = createApp(LoadingScreen);
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
}).use(I18NextVue, { i18next, rerenderOn: ['added', 'languageChanged'] });

app.use(createPinia())
app.use(router)
app.mount('#app')
