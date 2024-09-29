interface RegisterRequest {
    username: string;
    password: string;
}

interface BasicLoginRequest {
    username: string;
    password: string;
}

interface CatIdLoginRequest {
    code: string;
}

interface AuthResponse {
    token: string;
}
