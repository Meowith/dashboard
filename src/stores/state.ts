import {defineStore} from "pinia";
import type {App, Bucket, OwnApps, UserRole} from "@/models/entity";

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
            ownApps: undefined,
            currentBuckets: [],
            currentApp: undefined,
            currentRoles: []
        } as {
            globalUser: GlobalUserInfo | undefined,
            ownApps: OwnApps | undefined,
            currentBuckets: Bucket[],
            currentApp: App | undefined,
            currentRoles: UserRole[]
        }),
        actions: {
            setUser(user: GlobalUserInfo | undefined) {
                this.globalUser = user;
            },
            setApps(ownedApps: OwnApps | undefined) {
                this.ownApps = ownedApps;
            },
            setBuckets(buckets: Bucket[]) {
                this.currentBuckets = buckets;
            },
            setCurrentApp(app: App | undefined) {
                this.currentApp = app;
            },
            setCurrentRoles(roles: UserRole[]) {
                this.currentRoles = roles;
            }
        }
    }
)

