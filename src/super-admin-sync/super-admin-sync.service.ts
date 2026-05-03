import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PermissionEntity } from '../permissions/entities/permission.entity';
import { UserPermissionEntity } from '../permissions/entities/user-permission.entity';
import { UserPermissionOverrideEntity } from '../permissions/entities/user-permission-override.entity';
import { UserEntity, UserRole } from '../users/entities/user.entity';

@Injectable()
export class SuperAdminSyncService {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionsRepo: Repository<PermissionEntity>,
    @InjectRepository(UserPermissionEntity)
    private readonly userPermissionsRepo: Repository<UserPermissionEntity>,
    @InjectRepository(UserPermissionOverrideEntity)
    private readonly overridesRepo: Repository<UserPermissionOverrideEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
  ) {}

  async listPermissions() {
    const permissions = await this.permissionsRepo.find({
      order: { permissionKey: 'ASC' },
    });
    return permissions.map((p) => ({
      permissionId: p.permissionId,
      permissionKey: p.permissionKey,
      permissionName: p.permissionName,
    }));
  }

  async listAdmins() {
    const admins = await this.usersRepo.find({
      where: [{ role: UserRole.ADMIN }, { role: UserRole.STAFF }],
      order: { createdAt: 'ASC' },
    });

    const adminIds = admins.map((u) => u.userId);
    const overrideFlags = adminIds.length
      ? await this.overridesRepo.findBy({ userId: In(adminIds) })
      : [];
    const overriddenUserIds = new Set(overrideFlags.map((o) => o.userId));

    const userPermissions = overriddenUserIds.size
      ? await this.userPermissionsRepo.find({
          where: { userId: In([...overriddenUserIds]) },
          relations: ['permission'],
        })
      : [];

    const permsByUser = new Map<string, string[]>();
    for (const up of userPermissions) {
      const list = permsByUser.get(up.userId) ?? [];
      list.push(up.permission.permissionKey);
      permsByUser.set(up.userId, list);
    }

    return admins.map((u) => ({
      userId: u.userId,
      username: u.username,
      email: u.email,
      fullName: u.fullName,
      role: u.role,
      isActive: u.isActive,
      hasOverride: overriddenUserIds.has(u.userId),
      permissionKeys: overriddenUserIds.has(u.userId)
        ? (permsByUser.get(u.userId) ?? [])
        : null,
    }));
  }

  async applyPermissions(userId: string, permissionKeys: string[], syncedBy: string) {
    const user = await this.usersRepo.findOneBy({ userId });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.STAFF) {
      throw new NotFoundException(`User ${userId} is not an admin or staff`);
    }

    await this.userPermissionsRepo.delete({ userId });
    await this.overridesRepo.delete({ userId });

    if (permissionKeys.length > 0) {
      const permissions = await this.permissionsRepo.findBy({
        permissionKey: In(permissionKeys),
      });

      const now = new Date();
      const rows = permissions.map((p) =>
        this.userPermissionsRepo.create({
          userId,
          permissionId: p.permissionId,
          grantedBy: syncedBy,
          createdAt: now,
        }),
      );
      if (rows.length > 0) {
        await this.userPermissionsRepo.save(rows);
      }
    }

    await this.overridesRepo.save(
      this.overridesRepo.create({
        userId,
        updatedBy: syncedBy,
        updatedAt: new Date(),
      }),
    );

    return { userId, appliedCount: permissionKeys.length };
  }
}
