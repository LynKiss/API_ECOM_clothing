import type { Request, Response } from 'express';
import { RegisterUserDto } from '../users/dto/create-user.dto';
import type { IUser } from '../users/users.interface';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    handleLogin(req: Request, response: Response): Promise<{
        access_token: string;
        access_token_expires_in: number;
        refresh_token: string;
        refresh_token_expires_in: number;
        user: {
            permissions: {
                _id: string;
                key: string;
                name: string;
            }[];
            _id: string;
            username: string;
            email: string;
            fullName?: string | null;
            phoneNumber?: string | null;
            avatarUrl?: string | null;
            role: import("../users/users.interface").IUserRoleSummary;
        };
    }>;
    refresh(req: Request, response: Response): Promise<{
        access_token: string;
        access_token_expires_in: number;
        user: {
            permissions: {
                _id: string;
                key: string;
                name: string;
            }[];
            _id: string;
            username: string;
            email: string;
            fullName?: string | null;
            phoneNumber?: string | null;
            avatarUrl?: string | null;
            role: import("../users/users.interface").IUserRoleSummary;
        };
    }>;
    register(registerUserDto: RegisterUserDto): Promise<{
        _id: string;
        username: string;
        email: string;
        role: import("../users/entities/user.entity").UserRole;
        message: string;
    }>;
    logout(user: IUser, response: Response): Promise<{
        success: boolean;
    }>;
    getAccount(user: IUser): {
        user: IUser;
    };
}
