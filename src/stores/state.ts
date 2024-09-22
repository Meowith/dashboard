import {defineStore} from "pinia";
import type {OwnApps} from "@/models/entity";

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
            globalUser: undefined,
            ownApps: undefined
        } as {
            globalUser: GlobalUserInfo | undefined,
            ownApps: OwnApps | undefined,
        }),
        actions: {
            setUser(user: GlobalUserInfo | undefined) {
                this.globalUser = user;
            },
            setApps(ownedApps: OwnApps | undefined) {
                this.ownApps = ownedApps;
            }
        }
    }
)

