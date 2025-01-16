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
import {definePreset} from "@primevue/themes";
import tinycolor from "tinycolor2";

function generateShades(hexColor: string) {
    const shades: { [key: string]: string; } = {};

    const levels = {
        50: 0.4,
        100: 0.3,
        200: 0.2,
        300: 0.1,
        400: 0,
        500: -0.1,
        600: -0.15,
        700: -0.2,
        800: -0.3,
        900: -0.4,
        950: -0.45,
    };

    for (const [key, amount] of Object.entries(levels)) {
        shades[key] = amount > 0
            ? tinycolor(hexColor).lighten(amount * 100).toHexString()
            : tinycolor(hexColor).darken(Math.abs(amount) * 100).toHexString();
    }

    return shades;
}

const primaryShades = generateShades("#08c3f7");

const app = createApp(LoadingScreen);
app
    .use(ToastService)
    .use(PrimeVue, {
        theme: {
            preset: definePreset(Aura, {
                semantic: {
                    primary: primaryShades
                }
            })
        }
    })
    .use(I18NextVue, {i18next, rerenderOn: ['added', 'languageChanged']})
    .use(createPinia())
    .use(ConfirmationService)
    .use(router)

app.directive('tooltip', Tooltip)
app.directive('ripple', Ripple)

app.mount('#app')
