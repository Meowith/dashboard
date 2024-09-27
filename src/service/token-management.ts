import type {TokenIssueRequest, TokenListResponse, TokenResponse} from "@/dto/token";
import axios from "axios";
import {dashboardAddress} from "@/service/api-access";

export async function listTokens(app_id: string, issuer_id: string, ): Promise<TokenListResponse> {
    return (await axios.get(dashboardAddress(`/api/app/token/${app_id}/${issuer_id}`))).data
}

export async function createToken(req: TokenIssueRequest): Promise<TokenResponse> {
    return (await axios.post(dashboardAddress("/api/app/token/issue"), req)).data
}

export async function deleteToken(app_id: string, owner_id: string, name: string): Promise<void> {
    return (await axios.delete(dashboardAddress(`/api/app/token/${app_id}/${owner_id}/${name}`))).data
}