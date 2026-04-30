import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IUser } from '../users/users.interface';
declare const JwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    private readonly reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | import("rxjs").Observable<boolean>;
    handleRequest<TUser = IUser>(err: unknown, user: IUser | false, _info: unknown, context: ExecutionContext): TUser;
}
export {};
