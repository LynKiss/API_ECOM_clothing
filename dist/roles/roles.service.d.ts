import { Repository } from 'typeorm';
import { UserPermissionEntity } from '../permissions/entities/user-permission.entity';
import { UserPermissionOverrideEntity } from '../permissions/entities/user-permission-override.entity';
import { UserRole } from '../users/entities/user.entity';
import { RolePermissionEntity } from './entities/role-permission.entity';
export declare class RolesService {
    private readonly rolePermissionsRepository;
    private readonly userPermissionsRepository;
    private readonly userPermissionOverridesRepository;
    constructor(rolePermissionsRepository: Repository<RolePermissionEntity>, userPermissionsRepository: Repository<UserPermissionEntity>, userPermissionOverridesRepository: Repository<UserPermissionOverrideEntity>);
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
    findEffectivePermissionsForUser(userId: string, role: UserRole): Promise<{
        _id: string;
        key: string;
        name: string;
    }[]>;
    private mapPermission;
}
