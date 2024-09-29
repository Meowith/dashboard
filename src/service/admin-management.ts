import type {UserDTO} from "@/dto/user";
import {controllerAddress} from "@/service/api-access";
import axios from "axios";
import type {UserUpdateQuotaRequest, UserUpdateRoleRequest} from "@/dto/admin";

export async function fetchAllUsers(): Promise<{
    users: UserDTO[]
}> {
    return (await axios.get(controllerAddress("/api/public/user/"))).data
}

export async function alterUserRole(user_id: string, req: UserUpdateRoleRequest) {
    await axios.post(controllerAddress(`/api/public/user/update/role/${user_id}`), req)
}

export async function alterUserQuota(user_id: string, req: UserUpdateQuotaRequest) {
    await axios.post(controllerAddress(`/api/public/user/update/quota/${user_id}`), req)
}