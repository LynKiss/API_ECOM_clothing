import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity } from '../permissions/entities/permission.entity';
import { UserPermissionEntity } from '../permissions/entities/user-permission.entity';
import { UserPermissionOverrideEntity } from '../permissions/entities/user-permission-override.entity';
import { UserEntity } from '../users/entities/user.entity';
import { InternalHmacGuard } from './internal-hmac.guard';
import { SuperAdminSyncService } from './super-admin-sync.service';
import { SuperAdminSyncController } from './super-admin-sync.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PermissionEntity,
      UserPermissionEntity,
      UserPermissionOverrideEntity,
      UserEntity,
    ]),
  ],
  controllers: [SuperAdminSyncController],
  providers: [InternalHmacGuard, SuperAdminSyncService],
})
export class SuperAdminSyncModule {}
