interface RegisterRequest {
    username: string;
    password: string;
}

interface LoginRequest {
    username: string;
    password: string;
}

interface AuthResponse {
    token: string;
}