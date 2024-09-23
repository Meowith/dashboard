import axios from "axios";
import type {NodeStatusResponse, RegisterCodeResponse, ServiceRegisterCodeDto} from "@/dto/admin";
import {controllerAddress} from "@/service/api-access";

export async function createNodeRegisterCode(): Promise<RegisterCodeResponse> {
    return (await axios.post(controllerAddress('/api/public/register-codes/create'))).data
}

export async function deleteNodeRegisterCode(code: string): Promise<RegisterCodeResponse> {
    return (await axios.delete(controllerAddress('/api/public/register-codes/delete/' + code))).data
}

export async function listNodeRegisterCodes(): Promise<ServiceRegisterCodeDto[]> {
    return (await axios.get(controllerAddress('/api/public/register-codes/list'))).data
}

export async function fetchNodeStatus(): Promise<NodeStatusResponse> {
    return (await axios.get(controllerAddress('/api/public/node/status'))).data;
}