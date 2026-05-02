import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity } from '../permissions/entities/permission.entity';
import { UserPermissionEntity } from '../permissions/entities/user-permission.entity';
import { UserPermissionOverrideEntity } from '../permissions/entities/user-permission-override.entity';
import { RolePermissionEntity } from './entities/role-permission.entity';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PermissionEntity,
      RolePermissionEntity,
      UserPermissionEntity,
      UserPermissionOverrideEntity,
    ]),
  ],
  providers: [RolesService],
  exports: [RolesService, TypeOrmModule],
  controllers: [RolesController],
})
export class RolesModule {}
