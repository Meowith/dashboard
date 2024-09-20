import axios from "axios";
import {useNodesStore, usePreferenceStore} from "@/stores/counter";
import type {NodeMap} from '@/stores/counter'
import type {Reactive} from "vue";

export let nodes: Reactive<NodeMap>;

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

export async function controllerBasicLogin(req: BasicLoginRequest): Promise<AuthResponse> {
    return (await axios.post(nodes.controllers[0].addr + "/api/public/login/BASIC", {}, {
        headers: {
            "username": req.username,
            "password": req.password
        }
    })).data;
}