import {defineStore} from "pinia";
import {reactive} from "vue";
import {KNOWN_NODES} from "@/env";

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
}

export const useNodesStore = defineStore('node', () => {
    const nodes = reactive<NodeMap>(KNOWN_NODES)

    return {nodes}
})