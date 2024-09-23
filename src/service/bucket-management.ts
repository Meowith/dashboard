import type {BucketDto, CreateBucketRequest} from "@/dto/bucket";
import axios from "axios";
import {dashboardAddress} from "@/service/api-access";

export async function createBucket(req: CreateBucketRequest): Promise<BucketDto> {
    return (await axios.post(dashboardAddress("/api/public/bucket/create"), req)).data
}