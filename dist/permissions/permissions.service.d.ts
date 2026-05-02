import { Repository } from 'typeorm';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { RolePermissionEntity } from '../roles/entities/role-permission.entity';
import { UserEntity, UserRole } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';
import { UpdateUserPermissionsDto } from './dto/update-user-permissions.dto';
import { PermissionEntity } from './entities/permission.entity';
import { UserPermissionEntity } from './entities/user-permission.entity';
import { UserPermissionOverrideEntity } from './entities/user-permission-override.entity';
import { PermissionActor } from './permission-actor.guard';
export declare class PermissionsService {
    private readonly permissionsRepository;
    private readonly rolePermissionsRepository;
    private readonly userPermissionsRepository;
    private readonly userPermissionOverridesRepository;
    private readonly usersRepository;
    private readonly usersService;
    private readonly auditLogsService;
    constructor(permissionsRepository: Repository<PermissionEntity>, rolePermissionsRepository: Repository<RolePermissionEntity>, userPermissionsRepository: Repository<UserPermissionEntity>, userPermissionOverridesRepository: Repository<UserPermissionOverrideEntity>, usersRepository: Repository<UserEntity>, usersService: UsersService, auditLogsService: AuditLogsService);
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
    findAssignableUsers(actor: PermissionActor): Promise<{
        _id: string;
        username: string;
        email: string;
        fullName: string | null;
        role: {
            _id: UserRole;
            name: UserRole;
        };
        isActive: boolean;
        isSelf: boolean;
        permissions: {
            _id: string;
            key: string;
            name: string;
        }[];
    }[]>;
    findPermissionsByUser(userId: string): Promise<{
        user: {
            _id: string;
            username: string;
            email: string;
            fullName: string | null;
            role: {
                _id: UserRole;
                name: UserRole;
            };
            isActive: boolean;
        };
        source: string;
        permissions: {
            _id: string;
            key: string;
            name: string;
        }[];
    }>;
    updateUserPermissions(actor: PermissionActor, userId: string, dto: UpdateUserPermissionsDto, ipAddress?: string): Promise<{
        user: {
            _id: string;
            username: string;
            email: string;
            fullName: string | null;
            role: {
                _id: UserRole;
                name: UserRole;
            };
            isActive: boolean;
        };
        source: string;
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
    private findAssignableUserOrThrow;
    private findEffectivePermissionsForUserEntity;
    private actorId;
    private mapPermission;
}
