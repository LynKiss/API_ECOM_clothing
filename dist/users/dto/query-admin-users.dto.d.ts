import { UserRole } from '../entities/user.entity';
export declare class QueryAdminUsersDto {
    page?: number;
    limit?: number;
    search?: string;
    role?: UserRole;
    isActive?: string;
}
