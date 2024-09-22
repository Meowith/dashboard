import {useStateStore} from "@/stores/state";
import axios from "axios";
import {controllerAddress, dashboardAddress} from "@/service/api-access";

export async function fetchCurrentUserController() {
    const store = useStateStore()
    if (!store.globalUser) {
        let user = (await axios.get(controllerAddress('/api/public/user/me'))).data
        store.setUser({
            created: new Date(user.created),
            globalRole: user.global_role,
            id: user.id,
            lastModified: new Date(user.last_modified),
            name: user.name
        });
    }
}

export async function fetchCurrentUser() {
    const store = useStateStore()
    if (!store.globalUser) {
        let user = (await axios.get(dashboardAddress('/api/public/user/me'))).data
        store.setUser({
            created: new Date(user.created),
            globalRole: user.global_role,
            id: user.id,
            lastModified: new Date(user.last_modified),
            name: user.name
        });
    }
}