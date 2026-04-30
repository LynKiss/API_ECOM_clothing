import { PermissionEntity } from '../../permissions/entities/permission.entity';
import { UserRole } from '../../users/entities/user.entity';
export declare class RolePermissionEntity {
    role: UserRole;
    permissionId: string;
    createdAt: Date;
    permission: PermissionEntity;
}
