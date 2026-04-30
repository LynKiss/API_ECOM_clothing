import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { RolesService } from '../../roles/roles.service';
import { UserRole } from '../../users/entities/user.entity';
type JwtPayload = {
    _id: string;
    username: string;
    email: string;
    role: {
        _id: UserRole;
        name: UserRole;
    };
};
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly rolesService;
    constructor(configService: ConfigService, rolesService: RolesService);
    validate(payload: JwtPayload): Promise<{
        _id: string;
        username: string;
        email: string;
        role: {
            _id: UserRole;
            name: UserRole;
        };
        permissions: {
            _id: string;
            key: string;
            name: string;
        }[];
    }>;
}
export {};
