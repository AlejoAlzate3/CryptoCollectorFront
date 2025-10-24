export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface UserResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}
export interface AuthResponse {
    token: string;
}
export interface ErrorResponse {
    message: string;
    status: number;
    timestamp: string;
}
