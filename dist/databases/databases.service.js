"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DatabasesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabasesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const permission_entity_1 = require("../permissions/entities/permission.entity");
const role_permission_entity_1 = require("../roles/entities/role-permission.entity");
const refresh_token_entity_1 = require("../users/entities/refresh-token.entity");
const user_entity_1 = require("../users/entities/user.entity");
const CORE_PERMISSIONS = [
    { permissionKey: 'manage_products', permissionName: 'Quáº£n lÃ½ sáº£n pháº©m' },
    { permissionKey: 'manage_orders', permissionName: 'Quáº£n lÃ½ Ä‘Æ¡n hÃ ng' },
    { permissionKey: 'manage_permissions', permissionName: 'Quáº£n lÃ½ phÃ¢n quyá»n' },
    { permissionKey: 'manage_news', permissionName: 'Quáº£n lÃ½ bÃ i viáº¿t' },
    { permissionKey: 'manage_inventory', permissionName: 'Quáº£n lÃ½ kho hÃ ng' },
    { permissionKey: 'manage_users', permissionName: 'Quáº£n lÃ½ ngÆ°á»i dÃ¹ng' },
    { permissionKey: 'manage_discounts', permissionName: 'Quáº£n lÃ½ khuyáº¿n mÃ£i' },
    { permissionKey: 'manage_payments', permissionName: 'Quan ly thanh toan' },
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
const STAFF_PERMISSIONS = [
    'manage_orders',
    'manage_payments',
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
let DatabasesService = DatabasesService_1 = class DatabasesService {
    usersRepository;
    permissionsRepository;
    refreshTokensRepository;
    rolePermissionsRepository;
    logger = new common_1.Logger(DatabasesService_1.name);
    constructor(usersRepository, permissionsRepository, refreshTokensRepository, rolePermissionsRepository) {
        this.usersRepository = usersRepository;
        this.permissionsRepository = permissionsRepository;
        this.refreshTokensRepository = refreshTokensRepository;
        this.rolePermissionsRepository = rolePermissionsRepository;
    }
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
        this.logger.log(`MySQL ready. users=${summary.users}, permissions=${summary.permissions}, refreshTokens=${summary.refreshTokens}`);
    }
    async seedCorePermissions() {
        const permMap = new Map();
        for (const perm of CORE_PERMISSIONS) {
            let entity = await this.permissionsRepository.findOneBy({
                permissionKey: perm.permissionKey,
            });
            if (!entity) {
                entity = await this.permissionsRepository.save(this.permissionsRepository.create({
                    permissionKey: perm.permissionKey,
                    permissionName: perm.permissionName,
                }));
                this.logger.log(`Seeded permission: ${perm.permissionKey}`);
            }
            permMap.set(perm.permissionKey, entity);
            const hasAdminPerm = await this.rolePermissionsRepository.findOneBy({
                role: user_entity_1.UserRole.ADMIN,
                permissionId: entity.permissionId,
            });
            if (!hasAdminPerm) {
                await this.rolePermissionsRepository.save(this.rolePermissionsRepository.create({
                    role: user_entity_1.UserRole.ADMIN,
                    permissionId: entity.permissionId,
                    createdAt: new Date(),
                }));
            }
        }
        for (const key of STAFF_PERMISSIONS) {
            const entity = permMap.get(key);
            if (!entity)
                continue;
            const exists = await this.rolePermissionsRepository.findOneBy({
                role: user_entity_1.UserRole.STAFF,
                permissionId: entity.permissionId,
            });
            if (!exists) {
                await this.rolePermissionsRepository.save(this.rolePermissionsRepository.create({
                    role: user_entity_1.UserRole.STAFF,
                    permissionId: entity.permissionId,
                    createdAt: new Date(),
                }));
            }
        }
    }
};
exports.DatabasesService = DatabasesService;
exports.DatabasesService = DatabasesService = DatabasesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(permission_entity_1.PermissionEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(refresh_token_entity_1.RefreshTokenEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(role_permission_entity_1.RolePermissionEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DatabasesService);
//# sourceMappingURL=databases.service.js.map