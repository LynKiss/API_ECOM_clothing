import { UserRole } from '../entities/user.entity';
export declare class CreateAdminUserDto {
    username: string;
    email: string;
    password: string;
    fullName?: string;
    phoneNumber?: string;
    avatarUrl?: string;
    role?: UserRole;
    isActive?: boolean;
}
