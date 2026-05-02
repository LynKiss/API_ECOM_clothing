import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { RolePermissionEntity } from '../roles/entities/role-permission.entity';
import { RolesModule } from '../roles/roles.module';
import { SuperAdminModule } from '../super-admin/super-admin.module';
import { UserEntity } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { PermissionsController } from './permissions.controller';
import { PermissionEntity } from './entities/permission.entity';
import { UserPermissionEntity } from './entities/user-permission.entity';
import { UserPermissionOverrideEntity } from './entities/user-permission-override.entity';
import { PermissionActorGuard } from './permission-actor.guard';
import { PermissionsService } from './permissions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PermissionEntity,
      RolePermissionEntity,
      UserPermissionEntity,
      UserPermissionOverrideEntity,
      UserEntity,
    ]),
    UsersModule,
    RolesModule,
    SuperAdminModule,
    AuditLogsModule,
    JwtModule.register({}),
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionActorGuard],
  exports: [PermissionsService, TypeOrmModule],
})
export class PermissionsModule {}
