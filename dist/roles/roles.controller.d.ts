import { RolesService } from './roles.service';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    getRoles(): Promise<{
        _id: import("../users/entities/user.entity").UserRole;
        name: import("../users/entities/user.entity").UserRole;
        permissions: {
            _id: string;
            key: string;
            name: string;
        }[];
    }[]>;
}
