import {type MemberRoleRequest, type ModifyRoleRequest, type RoleResponse} from "@/dto/role";
import {dashboardAddress} from "@/service/api-access";
import axios from "axios";
import {enumBit, enumKeys, enumValBit} from "@/enumIter";

export async function getRoles(app_id: string): Promise<RoleResponse> {
    return (await axios.get(dashboardAddress("/api/role/" + app_id))).data
}

export async function createRole(app_id: string, name: string): Promise<void> {
    await axios.post(dashboardAddress(`/api/role/${app_id}/${name}`))
}

export async function deleteRole(app_id: string, name: string): Promise<void> {
    await axios.delete(dashboardAddress(`/api/role/${app_id}/${name}`))
}

export async function modifyRole(app_id: string, name: string, req: ModifyRoleRequest): Promise<void> {
    await axios.patch(dashboardAddress(`/api/role/${app_id}/${name}`), req)
}

export async function modifyUserRoles(app_id: string, user_id: string, roles: MemberRoleRequest) {
    await axios.patch(dashboardAddress(`/api/role/${app_id}/${user_id}/roles`), roles)
}

export function decodePermSet<O extends object>(e: O, allowance: number): O[] {
    let res: O[] = []
    for (let perm of enumKeys(e)) {
        if (allowance & enumBit(e, perm)) {
            res.push(e[perm] as O)
        }
    }
    return res
}

export function encodePermSet<O extends number>(allowance: O[]): number {
    let res = 0
    for (let perm of allowance) {
        res |= enumValBit(perm)
    }
    return res
}