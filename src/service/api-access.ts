import axios from "axios";
import {usePreferenceStore} from "@/stores/preferences";
import type {Reactive} from "vue";
import {type NodeMap, useNodesStore} from "@/stores/nodes";
import {useStateStore} from "@/stores/state";

export let nodes: Reactive<NodeMap>;

export function initApiAccess() {
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

export function logout() {
    const state = useStateStore()
    state.setUser(undefined)
    const preferenceStore = usePreferenceStore();
    preferenceStore.preferences.token = ''
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

export async function dashboardBasicLogin(req: BasicLoginRequest): Promise<AuthResponse> {
    return (await axios.post(nodes.dashboards[0].addr + "/api/public/login/BASIC", {}, {
        headers: {
            "username": req.username,
            "password": req.password
        }
    })).data;
}