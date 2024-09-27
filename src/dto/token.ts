import type {ScopedPermission} from "@/dto/role";

export interface TokenIssueRequest {
    app_id: string,
    name: string,
    perms: ScopedPermission[],
}

export interface TokenDto {
    created: string,
    last_modified: string,
    issuer_id: string,
    name: string,
}

export interface TokenListResponse {
    tokens: TokenDto[]
}

export interface TokenResponse {
    token: string
}
