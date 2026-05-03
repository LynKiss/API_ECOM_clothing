import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { InternalHmacGuard } from './internal-hmac.guard';
import { SuperAdminSyncService } from './super-admin-sync.service';
import { ApplyAdminPermissionsDto } from './dto/apply-admin-permissions.dto';
import { Public } from '../decorator/customize';

@Public()
@Controller('internal/super-admin')
@UseGuards(InternalHmacGuard)
export class SuperAdminSyncController {
  constructor(private readonly syncService: SuperAdminSyncService) {}

  @Get('permissions')
  listPermissions() {
    return this.syncService.listPermissions();
  }

  @Get('admins')
  listAdmins() {
    return this.syncService.listAdmins();
  }

  @Put('admins/:userId/permissions')
  applyPermissions(
    @Param('userId') userId: string,
    @Body() dto: ApplyAdminPermissionsDto,
  ) {
    return this.syncService.applyPermissions(userId, dto.permissionKeys, dto.syncedBy ?? 'super-admin-service');
  }
}
