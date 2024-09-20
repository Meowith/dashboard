import axios from "axios";
import {nodes} from "@/service/api-access";
import type {RegisterCodeResponse} from "@/dto/admin";

export async function fetchNodeRegisterCode(): Promise<RegisterCodeResponse> {
    return (await axios.post(nodes.controllers[0].addr + '/api/public/register-codes/create')).data
}