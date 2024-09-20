interface RegisterRequest {
    username: string;
    password: string;
}

interface BasicLoginRequest {
    username: string;
    password: string;
}

interface AuthResponse {
    token: string;
}