export enum NodeClientError {
    InternalError = "InternalError",
    BadRequest = "BadRequest",
    NotFound = "NotFound",
    EntityExists = "EntityExists",
    NoSuchSession = "NoSuchSession",
    BadAuth = "BadAuth",
    InsufficientStorage = "InsufficientStorage",
    NotEmpty = "NotEmpty",
    RangeUnsatisfiable = "RangeUnsatisfiable",
}

export interface ErrorResponse {
    code: NodeClientError
}