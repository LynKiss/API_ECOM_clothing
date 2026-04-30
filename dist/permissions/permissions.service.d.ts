import { Repository } from 'typeorm';
import { RolePermissionEntity } from '../roles/entities/role-permission.entity';
import { UserRole } from '../users/entities/user.entity';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';
import { PermissionEntity } from './entities/permission.entity';
export declare class PermissionsService {
    private readonly permissionsRepository;
    private readonly rolePermissionsRepository;
    constructor(permissionsRepository: Repository<PermissionEntity>, rolePermissionsRepository: Repository<RolePermissionEntity>);
    findAll(): Promise<{
        _id: string;
        key: string;
        name: string;
    }[]>;
    findPermissionsByRole(role: string): Promise<{
        role: UserRole;
        permissions: {
            _id: string;
            key: string;
            name: string;
        }[];
    }>;
    updateRolePermissions(role: string, updateRolePermissionsDto: UpdateRolePermissionsDto): Promise<{
        role: UserRole;
        permissions: {
            _id: string;
            key: string;
            name: string;
        }[];
    }>;
    private parseRole;
    private mapPermission;
}
