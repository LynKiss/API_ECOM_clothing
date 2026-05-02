import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { RolesService } from '../roles/roles.service';
import { SuperAdminService } from '../super-admin/super-admin.service';
import type { SuperAdminRequestUser } from '../super-admin/super-admin.types';
import { UserRole } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import type { IUser } from '../users/users.interface';

type JwtPayload = {
  _id: string;
  username: string;
  email: string;
  role?: { _id: UserRole; name: UserRole };
  authType?: string;
};

export type PermissionActor =
  | { type: 'super_admin'; superAdmin: SuperAdminRequestUser }
  | { type: 'user'; user: IUser };

export type RequestWithPermissionActor = Request & {
  permissionActor?: PermissionActor;
};

@Injectable()
export class PermissionActorGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly superAdminService: SuperAdminService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request =
      context.switchToHttp().getRequest<RequestWithPermissionActor>();
    const token = this.extractBearerToken(request);
    if (!token) {
      throw new UnauthorizedException('Missing access token');
    }

    try {
      const superAdmin = await this.superAdminService.validateAccessToken(token);
      request.permissionActor = { type: 'super_admin', superAdmin };
      return true;
    } catch {
      // Continue with normal admin token validation.
    }

    const payload = this.jwtService.verify<JwtPayload>(token, {
      secret: this.configService.get<string>('JWT__ACCESS_SECRET') ?? 'change-me',
    });

    if (!payload.role?._id) {
      throw new UnauthorizedException('Token khong hop le');
    }

    const userEntity = await this.usersService.findOneByIdForAuth(payload._id);
    if (!userEntity || !userEntity.isActive) {
      throw new UnauthorizedException('Tai khoan khong hop le');
    }

    const permissions = await this.rolesService.findEffectivePermissionsForUser(
      userEntity.userId,
      userEntity.role,
    );
    const canManagePermissions = permissions.some(
      (permission) => permission.key === 'manage_permissions',
    );
    if (!canManagePermissions) {
      throw new ForbiddenException('Ban khong co quyen phan quyen');
    }

    request.permissionActor = {
      type: 'user',
      user: {
        _id: userEntity.userId,
        username: userEntity.username,
        email: userEntity.email,
        fullName: userEntity.fullName,
        phoneNumber: userEntity.phoneNumber,
        avatarUrl: userEntity.avatarUrl,
        role: { _id: userEntity.role, name: userEntity.role },
        permissions,
      },
    };
    return true;
  }

  private extractBearerToken(request: Request) {
    const header = request.headers.authorization;
    if (!header || !header.toLowerCase().startsWith('bearer ')) return null;
    return header.slice(7).trim();
  }
}
