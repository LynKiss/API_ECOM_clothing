import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RolesService } from '../roles/roles.service';
import { RegisterUserDto } from '../users/dto/create-user.dto';
import { IUser, IUserRoleSummary } from '../users/users.interface';
import { UsersService } from '../users/users.service';
type JwtPayload = {
    _id: string;
    username: string;
    email: string;
    role: IUserRoleSummary;
};
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly configService;
    private readonly rolesService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService, rolesService: RolesService);
    validateUser(username: string, pass: string): Promise<IUser | null>;
    login(user: IUser, response?: Response): Promise<{
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
            role: IUserRoleSummary;
        };
    }>;
    register(registerUserDto: RegisterUserDto): Promise<{
        _id: string;
        username: string;
        email: string;
        role: import("../users/entities/user.entity").UserRole;
        message: string;
    }>;
    refreshToken(refreshToken: string | undefined, response: Response): Promise<{
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
            role: IUserRoleSummary;
        };
    }>;
    logout(user: IUser, response: Response): Promise<{
        success: boolean;
    }>;
    createRefreshToken(payload: JwtPayload): string;
    private buildTokenPayload;
    private loadPermissionsForRole;
    private toAuthUser;
    private getAccessTokenExpires;
    private getRefreshTokenExpires;
    private getRefreshTokenSecret;
    private toExpiresInSeconds;
    private setRefreshTokenCookie;
}
export {};
