import {ref, computed, reactive, watch} from 'vue'
import {defineStore} from 'pinia'
import {KNOWN_NODES} from "@/env";

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

export enum MeowithNodeType {
    Controller,
    Dashboard
}

export type MeowithNode = {
    addr: string
}

export type NodeMap = {
    controllers: MeowithNode[],
    dashboards: MeowithNode[]
};

export const useNodesStore = defineStore('node', () => {
    const nodes = reactive<NodeMap>(KNOWN_NODES)

    return {nodes}
})
