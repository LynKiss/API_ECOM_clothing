"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const mongoose_1 = require("@nestjs/mongoose");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const common_module_1 = require("./common/common.module");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
const logging_interceptor_1 = require("./common/interceptors/logging/logging.interceptor");
const health_module_1 = require("./health/health.module");
const intelligence_module_1 = require("./intelligence/intelligence.module");
const typeorm_config_1 = require("./config/typeorm.config");
const databases_module_1 = require("./databases/databases.module");
const permissions_module_1 = require("./permissions/permissions.module");
const categories_module_1 = require("./categories/categories.module");
const products_module_1 = require("./products/products.module");
const carts_module_1 = require("./carts/carts.module");
const orders_module_1 = require("./orders/orders.module");
const discounts_module_1 = require("./discounts/discounts.module");
const news_module_1 = require("./news/news.module");
const comments_module_1 = require("./comments/comments.module");
const contacts_module_1 = require("./contacts/contacts.module");
const notifications_module_1 = require("./notifications/notifications.module");
const reports_module_1 = require("./reports/reports.module");
const newsletter_module_1 = require("./newsletter/newsletter.module");
const rice_diagnosis_module_1 = require("./rice-diagnosis/rice-diagnosis.module");
const settings_module_1 = require("./settings/settings.module");
const support_chat_module_1 = require("./support-chat/support-chat.module");
const suppliers_module_1 = require("./suppliers/suppliers.module");
const procurement_module_1 = require("./procurement/procurement.module");
const pricing_module_1 = require("./pricing/pricing.module");
const warehouses_module_1 = require("./warehouses/warehouses.module");
const credit_limits_module_1 = require("./credit-limits/credit-limits.module");
const audit_logs_module_1 = require("./audit-logs/audit-logs.module");
const admin_search_module_1 = require("./admin-search/admin-search.module");
const banners_module_1 = require("./banners/banners.module");
const virtual_try_on_module_1 = require("./virtual-try-on/virtual-try-on.module");
const super_admin_module_1 = require("./super-admin/super-admin.module");
const super_admin_sync_module_1 = require("./super-admin-sync/super-admin-sync.module");
const membership_module_1 = require("./membership/membership.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            schedule_1.ScheduleModule.forRoot(),
            typeorm_1.TypeOrmModule.forRootAsync(typeorm_config_1.typeOrmConfig),
            mongoose_1.MongooseModule.forRootAsync({
                connectionName: 'superAdminConnection',
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    uri: configService.get('MONGO_SUPER_ADMIN_URI') ??
                        'mongodb://127.0.0.1:27017/coolmate_super_admin',
                }),
            }),
            common_module_1.CommonModule,
            auth_module_1.AuthModule,
            super_admin_module_1.SuperAdminModule,
            super_admin_sync_module_1.SuperAdminSyncModule,
            databases_module_1.DatabasesModule,
            permissions_module_1.PermissionsModule,
            categories_module_1.CategoriesModule,
            products_module_1.ProductsModule,
            carts_module_1.CartsModule,
            orders_module_1.OrdersModule,
            discounts_module_1.DiscountsModule,
            news_module_1.NewsModule,
            comments_module_1.CommentsModule,
            contacts_module_1.ContactsModule,
            notifications_module_1.NotificationsModule,
            reports_module_1.ReportsModule,
            newsletter_module_1.NewsletterModule,
            rice_diagnosis_module_1.RiceDiagnosisModule,
            settings_module_1.SettingsModule,
            support_chat_module_1.SupportChatModule,
            suppliers_module_1.SuppliersModule,
            procurement_module_1.ProcurementModule,
            pricing_module_1.PricingModule,
            warehouses_module_1.WarehousesModule,
            credit_limits_module_1.CreditLimitsModule,
            audit_logs_module_1.AuditLogsModule,
            admin_search_module_1.AdminSearchModule,
            banners_module_1.BannersModule,
            virtual_try_on_module_1.VirtualTryOnModule,
            intelligence_module_1.IntelligenceModule,
            health_module_1.HealthModule,
            membership_module_1.MembershipModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            { provide: core_1.APP_FILTER, useClass: all_exceptions_filter_1.AllExceptionsFilter },
            { provide: core_1.APP_INTERCEPTOR, useClass: logging_interceptor_1.LoggingInterceptor },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map