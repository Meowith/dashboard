import axios from "axios";
import {dashboardAddress} from "@/service/api-access";

export async function addAppMember(app_id: string, member_id: string) {
    await axios.post(dashboardAddress(`/api/app/${app_id}/member/${member_id}`))
}

export async function deleteAppMember(app_id: string, member_id: string) {
    await axios.delete(dashboardAddress(`/api/app/${app_id}/member/${member_id}`))
}