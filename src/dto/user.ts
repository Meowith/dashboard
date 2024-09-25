import {GlobalRole} from "@/stores/state";
import type {MemberDto} from "@/dto/app";

export interface UserDTO {
    id: string,
    name: string,
    global_role: GlobalRole,
    created: string,
    last_modified: string,
}
export interface MembersDTO {
    members: MemberDto[]
}