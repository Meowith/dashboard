import type {AppDto, MemberDto, OwnAppDto} from "@/dto/app";
import type {BucketDto} from "@/dto/bucket";
import type {ScopedPermission, UserRoleDTO} from "@/dto/role";

export interface App {
    id: string,
    owner_id: string,
    name: string,
    quota: number,
    created: Date,
    last_modified: Date,
}

export interface OwnApps {
    apps: (App & { is_member: boolean })[],
    members: MemberDto[]
}

export const appFrom = ({created, last_modified, ...rest}: AppDto): App => ({
    ...rest,
    created: new Date(created),
    last_modified: new Date(last_modified)
});

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

export const bucketFrom = ({created, last_modified, ...rest}: BucketDto): Bucket => ({
    ...rest,
    created: new Date(created),
    last_modified: new Date(last_modified)
});

export interface Bucket {
    app_id: string,
    id: string,
    name: string,
    encrypted: boolean,
    atomic_upload: boolean,
    quota: number,
    file_count: number,
    space_taken: number,
    created: Date,
    last_modified: Date,
}

export const userRoleFrom = ({created, last_modified, ...rest}: UserRoleDTO): UserRole => ({
    ...rest,
    created: new Date(created),
    last_modified: new Date(last_modified)
});

export interface UserRole {
    app_id: string,
    name: string,
    scopes: ScopedPermission[],
    created: Date,
    last_modified: Date,
}