import {useStateStore} from "@/stores/state";
import axios from "axios";
import {controllerAddress, dashboardAddress} from "@/service/api-access";
import {type Router} from "vue-router";
import type {UserDTO} from "@/dto/user";

export async function fetchCurrentUserController(router: Router) {
    await currentUser(controllerAddress('/api/public/user/me'), router)
}

export async function fetchCurrentUser(router: Router) {
    await currentUser(dashboardAddress('/api/public/user/me'), router)
}

export async function fetchUserByName(name: string): Promise<UserDTO | undefined> {
    return (await axios.get(dashboardAddress(`/api/public/user/lookup/name/${name}`))).data.user;
}

export async function fetchUserById(id: string): Promise<UserDTO | undefined> {
    return (await axios.get(dashboardAddress(`/api/public/user/lookup/id/${id}`))).data.user;
}

async function currentUser(address: string, router: Router) {
    const store = useStateStore()
    if (!store.globalUser) {
        try {
            let user = (await axios.get(address)).data
            store.setUser({
                created: new Date(user.created),
                globalRole: user.global_role,
                id: user.id,
                lastModified: new Date(user.last_modified),
                name: user.name
            });
        } catch (e) {
            await router.push({path: '/login'})
        }
    }
}