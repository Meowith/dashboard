export interface AppDto {
    id: string,
    name: string,
    quota: number,
    created: string,
    last_modified: string,
}

export interface MemberDto {
    app_id: string,
    member_id: string,
    member_roles: string[]
}

export interface MemberedApp {
    app: AppDto,
    member: MemberDto
}

export interface OwnAppDto {
    owned: AppDto[],
    member_of: MemberedApp[],
}

export interface CreateAppRequest {
    name: string,
}