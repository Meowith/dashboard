import {useStateStore} from "@/stores/state";
import axios from "axios";
import {controllerAddress, dashboardAddress, logout} from "@/service/api-access";
import {type Router} from "vue-router";
import type {UserDTO} from "@/dto/user";
import {fromUserDto} from "@/models/entity";

export async function fetchCurrentUserController(router: Router) {
    await currentUser(controllerAddress('/api/public/user/me'), router)
}

export async function fetchCurrentUser(router: Router) {
    await currentUser(dashboardAddress('/api/public/user/me'), router)
}

const memberIdCache = new Map<string, Promise<UserDTO | undefined>>()

export async function fetchUserByName(name: string): Promise<UserDTO | undefined> {
    return (await axios.get(dashboardAddress(`/api/public/user/lookup/name/${name}`))).data.user;
}

export async function fetchUserById(id: string): Promise<UserDTO | undefined> {
    if (memberIdCache.has(id)) {
        return await memberIdCache.get(id);
    }

    const p = doFetchUserById(id)
    memberIdCache.set(id, p);
    return p
}

async function doFetchUserById(id: string): Promise<UserDTO | undefined> {
    return (await axios.get(dashboardAddress(`/api/public/user/lookup/id/${id}`))).data.user;
}

async function currentUser(address: string, router: Router) {
    const store = useStateStore()
    if (!store.globalUser) {
        try {
            let user = (await axios.get(address)).data
            store.setUser(fromUserDto(user));
        } catch (e) {
            console.log(e)
            logout()
            await router.push({path: '/login'})
        }
    }
}