import axios from "axios";
import {usePreferenceStore} from "@/stores/preferences";
import type {Reactive} from "vue";
import {type NodeMap, useNodesStore} from "@/stores/nodes";
import {useStateStore} from "@/stores/state";
import {APP_ID, AppPermission} from "@/dto/role";
import {decodePermSet} from "@/service/role-management";

let nodes: Reactive<NodeMap>;

export function controllerAddress(path: string): string {
    return nodes.controllers[0].addr + path
}

export function dashboardAddress(path: string): string {
    return nodes.dashboards[0].addr + path
}

export async function getLoginMethods(): Promise<string[]> {
    return (await axios.get(dashboardAddress("/api/auth/methods"))).data.methods
}

export async function getSetupLoginMethods(): Promise<string[]> {
    return (await axios.get(controllerAddress("/api/auth/methods"))).data.methods
}

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
    await axios.post(controllerAddress("/api/auth/register"), req);
}

export async function registerRequest(req: RegisterRequest): Promise<AuthResponse> {
    return (await axios.post(dashboardAddress("/api/auth/register"), req)).data;
}

export async function controllerBasicLogin(req: BasicLoginRequest): Promise<AuthResponse> {
    return (await axios.post(controllerAddress('/api/auth/login/BASIC'), {}, {
        headers: {
            "username": req.username,
            "password": req.password
        }
    })).data;
}

export async function controllerCatidLogin(req: CatIdLoginRequest): Promise<AuthResponse> {
    return (await axios.post(controllerAddress("/api/auth/login/CATID?code=" + req.code))).data;
}


export async function dashboardBasicLogin(req: BasicLoginRequest): Promise<AuthResponse> {
    return (await axios.post(dashboardAddress("/api/auth/login"), {
        method: 'BASIC'
    }, {
        headers: {
            "username": req.username,
            "password": req.password
        }
    })).data;
}

export async function dashboardCatidLogin(req: CatIdLoginRequest): Promise<AuthResponse> {
    return (await axios.post(dashboardAddress("/api/auth/login?code=" + req.code), {
        method: 'CATID'
    })).data;
}

export function hasPermission(req: AppPermission[]): boolean {
    let state = useStateStore()
    if (!state.ownApps || !state.globalUser || !state.currentApp || !state.currentRoles) return false
    if (state.currentApp.owner_id == state.globalUser!.id) return true
    let member = state.ownApps.members.find(x => x.app_id == state.currentApp!.id)
    if (!member) return false
    let check = new Set(req)
    for (let roleName of member.member_roles) {
        let role = state.currentRoles.find(x => x.name == roleName)
        if (!role) continue
        for (let scope of role.scopes.filter(x => x.bucket_id == APP_ID)) {
            decodePermSet(AppPermission, scope.allowance).forEach((permission) => {
                check.delete(permission as unknown as AppPermission)
            })
            if (check.size == 0) return true
        }
    }
    return false
}
