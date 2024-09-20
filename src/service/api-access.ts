import axios from "axios";
import {useNodesStore, usePreferenceStore} from "@/stores/counter";
import type {NodeMap} from '@/stores/counter'
import type {Reactive} from "vue";

let nodes: Reactive<NodeMap>;

export function init_api_access() {
    let store = usePreferenceStore();
    let nodeStore = useNodesStore();
    nodes = nodeStore.nodes

    axios.interceptors.request.use(function (config) {
        config.headers["Authorization"] = "Bearer " + store.preferences.token;
        return config;
    }, function (error) {
        return Promise.reject(error);
    });
}

export async function setupRegisterRequest(req: RegisterRequest) {
    await axios.post(nodes.controllers[0].addr + "/api/auth/register", req);
}