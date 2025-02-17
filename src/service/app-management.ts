import type {
    AppDto,
    CreateAppRequest,
    DeleteApplicationRequest,
    EditApplicationQuotaRequest,
    OwnAppDto
} from "@/dto/app";
import axios from "axios";
import {dashboardAddress} from "@/service/api-access";
import type {BucketDto} from "@/dto/bucket";
import type {MembersDTO, UserDTO} from "@/dto/user";

export async function createApp(req: CreateAppRequest): Promise<AppDto> {
    return (await axios.post(dashboardAddress('/api/app/create'), req)).data
}

export async function listOwnedApps(): Promise<OwnAppDto> {
    return (await axios.get(dashboardAddress('/api/app/list'))).data
}

export async function deleteApp(req: DeleteApplicationRequest): Promise<void> {
    await axios.delete(dashboardAddress('/api/app/delete'), {
        data: req
    })
}

export async function listAppMembers(id: string): Promise<MembersDTO> {
    return (await axios.get(dashboardAddress(`/api/app/${id}/members`))).data;
}

export async function listBuckets(app_id: string): Promise<{ buckets: BucketDto[] }> {
    return (await axios.get(dashboardAddress('/api/app/buckets/' + app_id))).data
}

export async function modifyAppQuota(app_id: string, req: EditApplicationQuotaRequest) {
    await axios.patch(dashboardAddress(`/api/app/edit/${app_id}`), req)
}
