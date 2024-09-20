export interface DashboardNode {
    addr: string
    id: string
    created: string
    access_token_issued_at: string,
}

export interface StorageNode {
    addr: string,
    id: string,
    created: string,
    access_token_issued_at: string,
    max_space: number,
    used_space: number,
}

export interface RegisterCodeResponse {
    code: string
}