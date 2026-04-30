import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';
import { PermissionsService } from './permissions.service';
export declare class PermissionsController {
    private readonly permissionsService;
    constructor(permissionsService: PermissionsService);
    getPermissions(): Promise<{
        _id: string;
        key: string;
        name: string;
    }[]>;
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
}
