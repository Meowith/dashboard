import type {BucketDto, CreateBucketRequest, UploadSession} from "@/dto/bucket";
import axios from "axios";
import {dashboardAddress} from "@/service/api-access";
import {uploadSessionFrom} from "@/models/entity";

export async function createBucket(req: CreateBucketRequest): Promise<BucketDto> {
    return (await axios.post(dashboardAddress("/api/bucket/create"), req)).data
}

export async function deleteBucket(app_id: string, bucket_id: string) {
    await axios.delete(dashboardAddress(`/api/bucket/delete`), {
        data: {
            app_id,
            bucket_id,
        }
    })
}

export async function updateBucketQuota(app_id: string, bucket_id: string, new_quota: number) {
    await axios.patch(dashboardAddress(`/api/bucket/update/${app_id}/${bucket_id}`), {
        quota: new_quota
    })
}

export async function getBucketSessions(app_id: string, bucket_id: string): Promise<UploadSession[]> {
    return (await axios.get(dashboardAddress(`/api/bucket/sessions/${app_id}/${bucket_id}`))).data.sessions.map(uploadSessionFrom)
}
