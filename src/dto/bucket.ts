export interface BucketDto {
    app_id: string,
    id: string,
    name: string,
    encrypted: boolean,
    atomic_upload: boolean,
    quota: number,
    file_count: number,
    space_taken: number,
    created: string,
    last_modified: string,
}

export interface CreateBucketRequest {
    name: string,
    app_id: string,
    quota: number,
    atomic_upload: boolean,
}