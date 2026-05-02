import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionEntity } from '../permissions/entities/permission.entity';
import { UserPermissionEntity } from '../permissions/entities/user-permission.entity';
import { UserPermissionOverrideEntity } from '../permissions/entities/user-permission-override.entity';
import { UserRole } from '../users/entities/user.entity';
import { RolePermissionEntity } from './entities/role-permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolePermissionEntity)
    private readonly rolePermissionsRepository: Repository<RolePermissionEntity>,
    @InjectRepository(UserPermissionEntity)
    private readonly userPermissionsRepository: Repository<UserPermissionEntity>,
    @InjectRepository(UserPermissionOverrideEntity)
    private readonly userPermissionOverridesRepository: Repository<UserPermissionOverrideEntity>,
  ) {}

  async findOne(role: UserRole) {
    const rolePermissions = await this.rolePermissionsRepository.find({
      where: { role },
      order: { permissionId: 'ASC' },
    });

    return {
      _id: role,
      name: role,
      permissions: rolePermissions.map(({ permission }) =>
        this.mapPermission(permission),
      ),
    };
  }

  async findAll() {
    const roles = Object.values(UserRole);
    return Promise.all(roles.map((role) => this.findOne(role)));
  }

  async findEffectivePermissionsForUser(userId: string, role: UserRole) {
    const override = await this.userPermissionOverridesRepository.findOneBy({
      userId,
    });

    if (override) {
      const userPermissions = await this.userPermissionsRepository.find({
        where: { userId },
        order: { permissionId: 'ASC' },
      });
      return userPermissions.map(({ permission }) =>
        this.mapPermission(permission),
      );
    }

    const fullRole = await this.findOne(role);
    return fullRole.permissions;
  }

  private mapPermission(permission: PermissionEntity) {
    return {
      _id: permission.permissionId.toString(),
      key: permission.permissionKey,
      name: permission.permissionName,
    };
  }
}
