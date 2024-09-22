import {defineStore} from "pinia";
import {ref} from "vue";

export enum GlobalRole {
    User = 1,
    Admin = 2
}

export interface GlobalUserInfo {
    id: string;
    name: string;
    lastModified: Date,
    created: Date,
    globalRole: GlobalRole
}

export const useStateStore = defineStore('state', {
        state: () => ({
            globalUser: undefined
        } as {
            globalUser: GlobalUserInfo | undefined
        }),
        actions: {
            setUser(user: GlobalUserInfo | undefined) {
                this.globalUser = user;
            }
        }
    }
)

