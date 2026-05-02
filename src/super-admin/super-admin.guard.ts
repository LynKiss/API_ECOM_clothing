import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { SuperAdminService } from './super-admin.service';
import type { SuperAdminRequestUser } from './super-admin.types';

export type RequestWithSuperAdmin = Request & {
  superAdmin?: SuperAdminRequestUser;
};

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(private readonly superAdminService: SuperAdminService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<RequestWithSuperAdmin>();
    const token = this.extractBearerToken(request);
    if (!token) {
      throw new UnauthorizedException('Missing super admin token');
    }
    request.superAdmin = await this.superAdminService.validateAccessToken(token);
    return true;
  }

  private extractBearerToken(request: Request) {
    const header = request.headers.authorization;
    if (!header || !header.toLowerCase().startsWith('bearer ')) return null;
    return header.slice(7).trim();
  }
}
