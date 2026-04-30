import { Repository } from 'typeorm';
import { UserRole } from '../users/entities/user.entity';
import { RolePermissionEntity } from './entities/role-permission.entity';
export declare class RolesService {
    private readonly rolePermissionsRepository;
    constructor(rolePermissionsRepository: Repository<RolePermissionEntity>);
    findOne(role: UserRole): Promise<{
        _id: UserRole;
        name: UserRole;
        permissions: {
            _id: string;
            key: string;
            name: string;
        }[];
    }>;
    findAll(): Promise<{
        _id: UserRole;
        name: UserRole;
        permissions: {
            _id: string;
            key: string;
            name: string;
        }[];
    }[]>;
    private mapPermission;
}
