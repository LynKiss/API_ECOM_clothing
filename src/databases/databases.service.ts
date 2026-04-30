import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionEntity } from '../permissions/entities/permission.entity';
import { RolePermissionEntity } from '../roles/entities/role-permission.entity';
import { RefreshTokenEntity } from '../users/entities/refresh-token.entity';
import { UserEntity, UserRole } from '../users/entities/user.entity';

const CORE_PERMISSIONS = [
  // Manage = full CRUD
  { permissionKey: 'manage_products', permissionName: 'Quáº£n lÃ½ sáº£n pháº©m' },
  { permissionKey: 'manage_orders', permissionName: 'Quáº£n lÃ½ Ä‘Æ¡n hÃ ng' },
  { permissionKey: 'manage_permissions', permissionName: 'Quáº£n lÃ½ phÃ¢n quyá»n' },
  { permissionKey: 'manage_news', permissionName: 'Quáº£n lÃ½ bÃ i viáº¿t' },
  { permissionKey: 'manage_inventory', permissionName: 'Quáº£n lÃ½ kho hÃ ng' },
  { permissionKey: 'manage_users', permissionName: 'Quáº£n lÃ½ ngÆ°á»i dÃ¹ng' },
  { permissionKey: 'manage_discounts', permissionName: 'Quáº£n lÃ½ khuyáº¿n mÃ£i' },
  { permissionKey: 'manage_reports', permissionName: 'Quáº£n lÃ½ bÃ¡o cÃ¡o' },
  { permissionKey: 'manage_settings', permissionName: 'Quáº£n lÃ½ cÃ i Ä‘áº·t há»‡ thá»‘ng' },
  { permissionKey: 'manage_delivery', permissionName: 'Quáº£n lÃ½ váº­n chuyá»ƒn' },
  { permissionKey: 'manage_interface', permissionName: 'Quáº£n lÃ½ giao diá»‡n' },
  { permissionKey: 'manage_reviews', permissionName: 'Quáº£n lÃ½ Ä‘Ã¡nh giÃ¡ sáº£n pháº©m' },
  { permissionKey: 'manage_categories', permissionName: 'Quáº£n lÃ½ danh má»¥c' },
  { permissionKey: 'manage_customers', permissionName: 'Quáº£n lÃ½ khÃ¡ch hÃ ng' },
  { permissionKey: 'manage_support', permissionName: 'Quáº£n lÃ½ chatbox' },
  { permissionKey: 'manage_ai_diagnosis', permissionName: 'Quan ly AI phoi do va chon size' },
  { permissionKey: 'manage_suppliers', permissionName: 'Quáº£n lÃ½ nhÃ  cung cáº¥p' },
  { permissionKey: 'manage_procurement', permissionName: 'Quáº£n lÃ½ mua hÃ ng' },
  { permissionKey: 'manage_returns', permissionName: 'Quáº£n lÃ½ tráº£ hÃ ng' },
  { permissionKey: 'manage_audit_logs', permissionName: 'Quáº£n lÃ½ nháº­t kÃ½ thao tÃ¡c' },

  // View = read-only
  { permissionKey: 'view_orders', permissionName: 'Xem Ä‘Æ¡n hÃ ng' },
  { permissionKey: 'view_products', permissionName: 'Xem sáº£n pháº©m' },
  { permissionKey: 'view_news', permissionName: 'Xem bÃ i viáº¿t' },
  { permissionKey: 'view_inventory', permissionName: 'Xem kho hÃ ng' },
  { permissionKey: 'view_users', permissionName: 'Xem ngÆ°á»i dÃ¹ng' },
  { permissionKey: 'view_discounts', permissionName: 'Xem khuyáº¿n mÃ£i' },
  { permissionKey: 'view_reports', permissionName: 'Xem bÃ¡o cÃ¡o' },
  { permissionKey: 'view_settings', permissionName: 'Xem cÃ i Ä‘áº·t' },
  { permissionKey: 'view_delivery', permissionName: 'Xem váº­n chuyá»ƒn' },
  { permissionKey: 'view_categories', permissionName: 'Xem danh má»¥c' },
  { permissionKey: 'view_customers', permissionName: 'Xem khÃ¡ch hÃ ng' },
  { permissionKey: 'view_audit_logs', permissionName: 'Xem nháº­t kÃ½' },
  { permissionKey: 'view_suppliers', permissionName: 'Xem nhÃ  cung cáº¥p' },
  { permissionKey: 'view_procurement', permissionName: 'Xem mua hÃ ng' },
  { permissionKey: 'view_returns', permissionName: 'Xem tráº£ hÃ ng' },
  { permissionKey: 'view_dashboard', permissionName: 'Xem trang tá»•ng quan' },
];

// Mapping permission cho tá»«ng role máº·c Ä‘á»‹nh
// ADMIN: táº¥t cáº£ permissions (auto-grant á»Ÿ seeder)
// STAFF: Ä‘Æ°á»£c quáº£n lÃ½ Ä‘Æ¡n hÃ ng + sáº£n pháº©m + xem bÃ¡o cÃ¡o + xem khÃ¡ch hÃ ng
// VIEWER: chá»‰ view_*
const STAFF_PERMISSIONS = [
  'manage_orders',
  'manage_products',
  'manage_inventory',
  'manage_categories',
  'manage_news',
  'manage_returns',
  'manage_procurement',
  'manage_suppliers',
  'view_reports',
  'view_customers',
  'view_audit_logs',
  'view_dashboard',
  'view_discounts',
];

// Reserved cho role VIEWER tÆ°Æ¡ng lai (chÆ°a seed vÃ¬ UserRole enum chá»‰ cÃ³ 3 role).
// Khi cáº§n thÃªm VIEWER role: thÃªm 'viewer' vÃ o UserRole enum + seed permissions tá»« list nÃ y.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _VIEWER_PERMISSIONS = [
  'view_orders',
  'view_products',
  'view_news',
  'view_inventory',
  'view_users',
  'view_discounts',
  'view_reports',
  'view_delivery',
  'view_categories',
  'view_customers',
  'view_audit_logs',
  'view_suppliers',
  'view_procurement',
  'view_returns',
  'view_dashboard',
];

@Injectable()
export class DatabasesService implements OnModuleInit {
  private readonly logger = new Logger(DatabasesService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionsRepository: Repository<PermissionEntity>,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokensRepository: Repository<RefreshTokenEntity>,
    @InjectRepository(RolePermissionEntity)
    private readonly rolePermissionsRepository: Repository<RolePermissionEntity>,
  ) { }

  async getSummary() {
    const [users, permissions, refreshTokens] = await Promise.all([
      this.usersRepository.count(),
      this.permissionsRepository.count(),
      this.refreshTokensRepository.count(),
    ]);

    return { users, permissions, refreshTokens };
  }

  async onModuleInit() {
    await this.seedCorePermissions();
    const summary = await this.getSummary();
    this.logger.log(
      `MySQL ready. users=${summary.users}, permissions=${summary.permissions}, refreshTokens=${summary.refreshTokens}`,
    );
  }

  private async seedCorePermissions() {
    const permMap = new Map<string, PermissionEntity>();

    for (const perm of CORE_PERMISSIONS) {
      let entity = await this.permissionsRepository.findOneBy({
        permissionKey: perm.permissionKey,
      });

      if (!entity) {
        entity = await this.permissionsRepository.save(
          this.permissionsRepository.create({
            permissionKey: perm.permissionKey,
            permissionName: perm.permissionName,
          }),
        );
        this.logger.log(`Seeded permission: ${perm.permissionKey}`);
      }
      permMap.set(perm.permissionKey, entity);

      // ADMIN luÃ´n cÃ³ Táº¤T Cáº¢ permissions
      const hasAdminPerm = await this.rolePermissionsRepository.findOneBy({
        role: UserRole.ADMIN,
        permissionId: entity.permissionId,
      });
      if (!hasAdminPerm) {
        await this.rolePermissionsRepository.save(
          this.rolePermissionsRepository.create({
            role: UserRole.ADMIN,
            permissionId: entity.permissionId,
            createdAt: new Date(),
          }),
        );
      }
    }

    // STAFF: subset permissions (operational)
    for (const key of STAFF_PERMISSIONS) {
      const entity = permMap.get(key);
      if (!entity) continue;
      const exists = await this.rolePermissionsRepository.findOneBy({
        role: UserRole.STAFF,
        permissionId: entity.permissionId,
      });
      if (!exists) {
        await this.rolePermissionsRepository.save(
          this.rolePermissionsRepository.create({
            role: UserRole.STAFF,
            permissionId: entity.permissionId,
            createdAt: new Date(),
          }),
        );
      }
    }
  }
}
