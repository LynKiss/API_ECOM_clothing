import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { RolePermissionEntity } from '../roles/entities/role-permission.entity';
import { UserEntity, UserRole } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';
import { UpdateUserPermissionsDto } from './dto/update-user-permissions.dto';
import { PermissionEntity } from './entities/permission.entity';
import { UserPermissionEntity } from './entities/user-permission.entity';
import { UserPermissionOverrideEntity } from './entities/user-permission-override.entity';
import { PermissionActor } from './permission-actor.guard';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionsRepository: Repository<PermissionEntity>,
    @InjectRepository(RolePermissionEntity)
    private readonly rolePermissionsRepository: Repository<RolePermissionEntity>,
    @InjectRepository(UserPermissionEntity)
    private readonly userPermissionsRepository: Repository<UserPermissionEntity>,
    @InjectRepository(UserPermissionOverrideEntity)
    private readonly userPermissionOverridesRepository: Repository<UserPermissionOverrideEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly usersService: UsersService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async findAll() {
    const permissions = await this.permissionsRepository.find({
      order: { permissionId: 'ASC' },
    });

    return permissions.map((permission) => this.mapPermission(permission));
  }

  async findPermissionsByRole(role: string) {
    const normalizedRole = this.parseRole(role);
    const rolePermissions = await this.rolePermissionsRepository.find({
      where: { role: normalizedRole },
      order: { permissionId: 'ASC' },
    });

    return {
      role: normalizedRole,
      permissions: rolePermissions.map(({ permission }) =>
        this.mapPermission(permission),
      ),
    };
  }

  async findAssignableUsers(actor: PermissionActor) {
    const users = await this.usersRepository.find({
      where: [{ role: UserRole.ADMIN }, { role: UserRole.STAFF }],
      order: { createdAt: 'DESC' },
    });

    return Promise.all(
      users.map(async (user) => {
        const permissions = await this.findEffectivePermissionsForUserEntity(user);
        return {
          _id: user.userId,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: { _id: user.role, name: user.role },
          isActive: user.isActive,
          isSelf:
            actor.type === 'user' ? actor.user._id === user.userId : false,
          permissions,
        };
      }),
    );
  }

  async findPermissionsByUser(userId: string) {
    const user = await this.findAssignableUserOrThrow(userId);
    const [permissions, override] = await Promise.all([
      this.findEffectivePermissionsForUserEntity(user),
      this.userPermissionOverridesRepository.findOneBy({ userId }),
    ]);
    return {
      user: {
        _id: user.userId,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: { _id: user.role, name: user.role },
        isActive: user.isActive,
      },
      source: override ? 'user' : 'role',
      permissions,
    };
  }

  async updateUserPermissions(
    actor: PermissionActor,
    userId: string,
    dto: UpdateUserPermissionsDto,
    ipAddress?: string,
  ) {
    const target = await this.findAssignableUserOrThrow(userId);

    if (actor.type === 'user' && actor.user._id === userId) {
      throw new BadRequestException('Khong the tu phan quyen cho chinh minh');
    }

    const uniquePermissionIds = [...new Set(dto.permissionIds)];
    const permissions = uniquePermissionIds.length
      ? await this.permissionsRepository.find({
          where: { permissionId: In(uniquePermissionIds) },
          order: { permissionId: 'ASC' },
        })
      : [];

    if (permissions.length !== uniquePermissionIds.length) {
      throw new NotFoundException('One or more permissions were not found');
    }

    if (actor.type === 'user') {
      const actorPermissionIds = new Set(
        actor.user.permissions.map((permission) => permission._id),
      );
      const actorPermissionKeys = new Set(
        actor.user.permissions.map((permission) => permission.key),
      );
      const canGrantAll = permissions.every(
        (permission) =>
          actorPermissionIds.has(permission.permissionId.toString()) ||
          actorPermissionKeys.has(permission.permissionKey),
      );
      if (!canGrantAll) {
        throw new ForbiddenException('Khong the cap quyen vuot qua quyen hien co');
      }
    }

    const before = await this.findPermissionsByUser(userId);

    await this.userPermissionsRepository.delete({ userId });
    await this.userPermissionOverridesRepository.save(
      this.userPermissionOverridesRepository.create({
        userId,
        updatedBy: this.actorId(actor),
        updatedAt: new Date(),
      }),
    );

    if (permissions.length > 0) {
      await this.userPermissionsRepository.save(
        permissions.map((permission) =>
          this.userPermissionsRepository.create({
            userId,
            permissionId: permission.permissionId,
            grantedBy: this.actorId(actor),
            createdAt: new Date(),
          }),
        ),
      );
    }

    await this.usersService.revokeActiveRefreshTokens(userId);
    const after = await this.findPermissionsByUser(userId);

    await this.auditLogsService.log({
      changedBy: this.actorId(actor),
      entityType: 'user_permissions',
      entityId: target.userId,
      action: 'update',
      beforeData: {
        permissionKeys: before.permissions.map((permission) => permission.key),
      },
      afterData: {
        permissionKeys: after.permissions.map((permission) => permission.key),
      },
      ipAddress,
      notes:
        actor.type === 'super_admin'
          ? 'Updated by super admin'
          : 'Updated by admin',
    });

    return after;
  }

  async updateRolePermissions(
    role: string,
    updateRolePermissionsDto: UpdateRolePermissionsDto,
  ) {
    const normalizedRole = this.parseRole(role);
    const uniquePermissionIds = [
      ...new Set(updateRolePermissionsDto.permissionIds),
    ];

    const permissions = await this.permissionsRepository.find({
      where: {
        permissionId: In(uniquePermissionIds),
      },
      order: { permissionId: 'ASC' },
    });

    if (permissions.length !== uniquePermissionIds.length) {
      throw new NotFoundException('One or more permissions were not found');
    }

    await this.rolePermissionsRepository.delete({ role: normalizedRole });

    const rolePermissions = permissions.map((permission) =>
      this.rolePermissionsRepository.create({
        role: normalizedRole,
        permissionId: permission.permissionId,
      }),
    );

    await this.rolePermissionsRepository.save(rolePermissions);

    return this.findPermissionsByRole(normalizedRole);
  }

  private parseRole(role: string) {
    const normalizedRole = role.toLowerCase() as UserRole;
    const supportedRoles = Object.values(UserRole);

    if (!supportedRoles.includes(normalizedRole)) {
      throw new BadRequestException('Role is invalid');
    }

    return normalizedRole;
  }

  private async findAssignableUserOrThrow(userId: string) {
    const user = await this.usersRepository.findOneBy({ userId });
    if (!user) {
      throw new NotFoundException('Nguoi dung khong ton tai');
    }
    if (![UserRole.ADMIN, UserRole.STAFF].includes(user.role)) {
      throw new BadRequestException('Chi ho tro phan quyen cho admin/staff');
    }
    return user;
  }

  private async findEffectivePermissionsForUserEntity(user: UserEntity) {
    const override = await this.userPermissionOverridesRepository.findOneBy({
      userId: user.userId,
    });

    if (override) {
      const userPermissions = await this.userPermissionsRepository.find({
        where: { userId: user.userId },
        order: { permissionId: 'ASC' },
      });
      return userPermissions.map(({ permission }) =>
        this.mapPermission(permission),
      );
    }

    return (await this.findPermissionsByRole(user.role)).permissions;
  }

  private actorId(actor: PermissionActor) {
    return actor.type === 'super_admin'
      ? `super:${actor.superAdmin._id}`
      : actor.user._id;
  }

  private mapPermission(permission: PermissionEntity) {
    return {
      _id: permission.permissionId.toString(),
      key: permission.permissionKey,
      name: permission.permissionName,
    };
  }
}
