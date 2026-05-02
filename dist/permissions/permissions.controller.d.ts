import { UpdateUserPermissionsDto } from './dto/update-user-permissions.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';
import type { RequestWithPermissionActor } from './permission-actor.guard';
import { PermissionsService } from './permissions.service';
export declare class PermissionsController {
    private readonly permissionsService;
    constructor(permissionsService: PermissionsService);
    getPermissions(): Promise<{
        _id: string;
        key: string;
        name: string;
    }[]>;
    getPermissionUsers(req: RequestWithPermissionActor): Promise<{
        _id: string;
        username: string;
        email: string;
        fullName: string | null;
        role: {
            _id: import("../users/entities/user.entity").UserRole;
            name: import("../users/entities/user.entity").UserRole;
        };
        isActive: boolean;
        isSelf: boolean;
        permissions: {
            _id: string;
            key: string;
            name: string;
        }[];
    }[]>;
    getPermissionsByUser(userId: string): Promise<{
        user: {
            _id: string;
            username: string;
            email: string;
            fullName: string | null;
            role: {
                _id: import("../users/entities/user.entity").UserRole;
                name: import("../users/entities/user.entity").UserRole;
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
    updateUserPermissions(req: RequestWithPermissionActor, userId: string, updateUserPermissionsDto: UpdateUserPermissionsDto): Promise<{
        user: {
            _id: string;
            username: string;
            email: string;
            fullName: string | null;
            role: {
                _id: import("../users/entities/user.entity").UserRole;
                name: import("../users/entities/user.entity").UserRole;
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
    getPermissionsByRole(role: string): Promise<{
        role: import("../users/entities/user.entity").UserRole;
        permissions: {
            _id: string;
            key: string;
            name: string;
        }[];
    }>;
    updateRolePermissions(role: string, updateRolePermissionsDto: UpdateRolePermissionsDto): Promise<{
        role: import("../users/entities/user.entity").UserRole;
        permissions: {
            _id: string;
            key: string;
            name: string;
        }[];
    }>;
    private getIpAddress;
}
