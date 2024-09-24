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