export const APP_ID = "00000000-0000-0000-0000-000000000000"

export enum UserPermission {
    Read = 1,
    Write = 2,
    Overwrite = 3,
    ListDirectory = 4,
    ListBucket = 5,
    Rename = 6,
    Delete = 7,
    FetchBucketInfo = 8,
}

export enum AppPermission {
    CreateBucket = 1,
    DeleteBucket = 2,
    ListAllTokens = 3,
    DeleteAllTokens = 4,
    ManageRoles = 5,
}

export interface ScopedPermission {
    bucket_id: string;
    allowance: number
}

export interface UserRoleDTO {
    app_id: string,
    name: string,
    scopes: ScopedPermission[],
    created: string,
    last_modified: string,
}

export interface RoleResponse {
    roles: UserRoleDTO[]
}

export interface ModifyRoleRequest {
    perms: ScopedPermission[],
}

export interface MemberRoleRequest {
    roles: string[]
}