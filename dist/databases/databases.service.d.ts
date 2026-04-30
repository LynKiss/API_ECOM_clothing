import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PermissionEntity } from '../permissions/entities/permission.entity';
import { RolePermissionEntity } from '../roles/entities/role-permission.entity';
import { RefreshTokenEntity } from '../users/entities/refresh-token.entity';
import { UserEntity } from '../users/entities/user.entity';
export declare class DatabasesService implements OnModuleInit {
    private readonly usersRepository;
    private readonly permissionsRepository;
    private readonly refreshTokensRepository;
    private readonly rolePermissionsRepository;
    private readonly logger;
    constructor(usersRepository: Repository<UserEntity>, permissionsRepository: Repository<PermissionEntity>, refreshTokensRepository: Repository<RefreshTokenEntity>, rolePermissionsRepository: Repository<RolePermissionEntity>);
    getSummary(): Promise<{
        users: number;
        permissions: number;
        refreshTokens: number;
    }>;
    onModuleInit(): Promise<void>;
    private seedCorePermissions;
}
