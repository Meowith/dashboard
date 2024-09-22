import type {AppDto, CreateAppRequest, OwnAppDto} from "@/dto/app";
import axios from "axios";
import {dashboardAddress} from "@/service/api-access";

export async function createApp(req: CreateAppRequest): Promise<AppDto> {
    return (await axios.post(dashboardAddress('/api/app/create'), req)).data
}

export async function listOwnedApps(): Promise<OwnAppDto> {
    return (await axios.get(dashboardAddress('/api/app/list'))).data
}