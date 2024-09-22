import {reactive, watch} from 'vue'
import {defineStore} from 'pinia'

export type AppPreferences = {
    token: string | '';
}

export const usePreferenceStore = defineStore('preferences', () => {
    const stored = JSON.parse(localStorage.getItem('preferences') || '{}');
    const preferences = reactive<AppPreferences>(stored['token'] !== undefined ? stored : {
        token: ''
    })

    watch(preferences, (v) => {
        localStorage.setItem('preferences', JSON.stringify(v))
    }, {deep: true})

    return {preferences}
})

