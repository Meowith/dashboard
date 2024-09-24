import type {ModifyRoleRequest, RoleResponse} from "@/dto/role";
import {dashboardAddress} from "@/service/api-access";
import axios from "axios";

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

