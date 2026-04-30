import { CanActivate } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class PermissionGuard implements CanActivate {
    canActivate(): boolean | Promise<boolean> | Observable<boolean>;
}
