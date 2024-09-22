import type {AppDto, MemberDto, OwnAppDto} from "@/dto/app";
import {listOwnedApps} from "@/service/app-management";

export interface App {
    id: string,
    name: string,
    quota: number,
    created: Date,
    last_modified: Date,
}

export interface OwnApps {
    apps: (App & { is_member: boolean })[],
    members: MemberDto[]
}

export function appFrom(item: AppDto): App {
    return {
        created: new Date(item.created),
        id: item.id,
        last_modified: new Date(item.last_modified),
        name: item.name,
        quota: item.quota
    }
}

export function fromOwnedApps(owned: OwnAppDto): OwnApps {
    let appList: (App & { is_member: boolean })[] = []
    owned.owned.forEach((item) => {
        appList.push({...appFrom(item), is_member: false})
    })
    owned.member_of.forEach((item) => {
        appList.push({...appFrom(item.app), is_member: true})
    })

    return {
        apps: appList, members: owned.member_of.map(x => x.member)
    }
}