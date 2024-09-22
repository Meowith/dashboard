import axios from "axios";
import type {NodeStatusResponse, RegisterCodeResponse} from "@/dto/admin";
import {controllerAddress} from "@/service/api-access";

export async function fetchNodeRegisterCode(): Promise<RegisterCodeResponse> {
    return (await axios.post(controllerAddress('/api/public/register-codes/create'))).data
}

export async function fetchNodeStatus(): Promise<NodeStatusResponse> {
    return (await axios.get(controllerAddress('/api/public/node/status'))).data;
}