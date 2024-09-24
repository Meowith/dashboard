import {defineStore} from "pinia";
import type {Bucket, OwnApps} from "@/models/entity";

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
            currentBuckets: []
        } as {
            globalUser: GlobalUserInfo | undefined,
            ownApps: OwnApps | undefined,
            currentBuckets: Bucket[],
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
            }
        }
    }
)

