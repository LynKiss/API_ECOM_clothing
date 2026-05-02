import { Body, Controller, Get, Param, Put, Req, UseGuards } from '@nestjs/common';
import { Public, RequirePermissions, ResponseMessage } from '../decorator/customize';
import { UpdateUserPermissionsDto } from './dto/update-user-permissions.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';
import { PermissionActorGuard } from './permission-actor.guard';
import type { RequestWithPermissionActor } from './permission-actor.guard';
import { PermissionsService } from './permissions.service';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Public()
  @UseGuards(PermissionActorGuard)
  @Get()
  @ResponseMessage('Get permissions list')
  getPermissions() {
    return this.permissionsService.findAll();
  }

  @Public()
  @UseGuards(PermissionActorGuard)
  @Get('users')
  @ResponseMessage('Get permission users')
  getPermissionUsers(@Req() req: RequestWithPermissionActor) {
    return this.permissionsService.findAssignableUsers(req.permissionActor!);
  }

  @Public()
  @UseGuards(PermissionActorGuard)
  @Get('users/:userId')
  @ResponseMessage('Get permissions by user')
  getPermissionsByUser(@Param('userId') userId: string) {
    return this.permissionsService.findPermissionsByUser(userId);
  }

  @Public()
  @UseGuards(PermissionActorGuard)
  @Put('users/:userId')
  @ResponseMessage('Update permissions by user')
  updateUserPermissions(
    @Req() req: RequestWithPermissionActor,
    @Param('userId') userId: string,
    @Body() updateUserPermissionsDto: UpdateUserPermissionsDto,
  ) {
    return this.permissionsService.updateUserPermissions(
      req.permissionActor!,
      userId,
      updateUserPermissionsDto,
      this.getIpAddress(req),
    );
  }

  @Get('roles/:role')
  @RequirePermissions('manage_permissions')
  @ResponseMessage('Get permissions by role')
  getPermissionsByRole(@Param('role') role: string) {
    return this.permissionsService.findPermissionsByRole(role);
  }

  @Put('roles/:role')
  @RequirePermissions('manage_permissions')
  @ResponseMessage('Update permissions by role')
  updateRolePermissions(
    @Param('role') role: string,
    @Body() updateRolePermissionsDto: UpdateRolePermissionsDto,
  ) {
    return this.permissionsService.updateRolePermissions(
      role,
      updateRolePermissionsDto,
    );
  }

  private getIpAddress(req: RequestWithPermissionActor) {
    const forwardedFor = req.headers['x-forwarded-for'];
    if (Array.isArray(forwardedFor)) return forwardedFor[0];
    if (forwardedFor) return forwardedFor.split(',')[0]?.trim();
    return req.ip ?? req.socket.remoteAddress;
  }
}
