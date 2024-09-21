import axios from "axios";
import {nodes} from "@/service/api-access";
import type {NodeStatusResponse, RegisterCodeResponse} from "@/dto/admin";

export async function fetchNodeRegisterCode(): Promise<RegisterCodeResponse> {
    return (await axios.post(nodes.controllers[0].addr + '/api/public/register-codes/create')).data
}

export async function fetchNodeStatus(): Promise<NodeStatusResponse> {
    return (await axios.get(nodes.controllers[0].addr + '/api/public/node/status')).data;
}