import {useStateStore} from "@/stores/state";
import axios from "axios";
import {controllerAddress, dashboardAddress} from "@/service/api-access";
import {type Router} from "vue-router";

export async function fetchCurrentUserController(router: Router) {
    await currentUser(controllerAddress('/api/public/user/me'), router)
}

export async function fetchCurrentUser(router: Router) {
    await currentUser(dashboardAddress('/api/public/user/me'), router)
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
            await router.push({path:'/login'})
        }
    }
}