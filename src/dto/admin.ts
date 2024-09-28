import type {GlobalRole} from "@/stores/state";

export interface DashboardNode {
    addr: string
    id: string
    created: Date
    access_token_issued_at: Date,
    last_beat: Date,
}

export interface StorageNode {
    addr: string,
    id: string,
    created: Date,
    access_token_issued_at: Date,
    last_beat: Date,
    max_space: number,
    used_space: number,
}

export interface RegisterCodeResponse {
    code: string
}

export interface NodeStatusResponse {
    nodes: NodeStatus[]
}

export interface NodeStatus {
    microservice_type: number,
    id: string,
    address: string,
    max_space: number | undefined,
    used_space: number | undefined,
    created: string,
    last_beat: string,
    access_token_issued_at: string,
}

export enum MicroserviceType {
    StorageNode = 1,
    Dashboard = 2,
}

export interface ServiceRegisterCodeDto {
    code: string,
    created: string,
    valid: boolean
}

export interface UserUpdateRoleRequest {
    role: "User" | "Admin"
}