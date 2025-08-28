import { UserRole } from "@/types";
import { Shop } from "@/types/shop-type";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload extends LoginPayload {
    confirm_password: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    isVerified: boolean;
    isBlocked: boolean;
    name: string;
    createdAt: string;
    photoUrl: string;
    role: UserRole;
    shop: Shop;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface AuthPayload {
    name: string;
    email: string;
    password: string;
    action: "login" | "register";
    callbackUrl: string;
}
