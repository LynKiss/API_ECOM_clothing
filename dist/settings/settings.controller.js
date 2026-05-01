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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsController = void 0;
const common_1 = require("@nestjs/common");
const customize_1 = require("../decorator/customize");
const settings_service_1 = require("./settings.service");
let SettingsController = class SettingsController {
    settingsService;
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    getPublicCommerceSettings() {
        return this.settingsService.getPublicCommerceSettings();
    }
    getAdminCommerceSettings() {
        return this.settingsService.getAdminCommerceSettings();
    }
    updatePaymentSettings(body) {
        return this.settingsService.savePaymentSettings(body.payments ?? {});
    }
    updateSmtpSettings(body) {
        return this.settingsService.saveSmtpSettings(body.smtp ?? {});
    }
    getAdminSidebarSettings() {
        return this.settingsService.getAdminSidebarSettings();
    }
    updateAdminSidebarSettings(body) {
        return this.settingsService.saveAdminSidebarSettings(body);
    }
    getClientFeatureSettings() {
        return this.settingsService.getClientFeatureSettings();
    }
    updateClientFeatureSettings(body) {
        return this.settingsService.saveClientFeatureSettings(body);
    }
};
exports.SettingsController = SettingsController;
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Get)('public/commerce'),
    (0, customize_1.ResponseMessage)('Get public commerce settings'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getPublicCommerceSettings", null);
__decorate([
    (0, customize_1.RequirePermissions)('manage_settings'),
    (0, common_1.Get)('admin/commerce'),
    (0, customize_1.ResponseMessage)('Get commerce settings'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getAdminCommerceSettings", null);
__decorate([
    (0, customize_1.RequirePermissions)('manage_settings'),
    (0, common_1.Put)('admin/payments'),
    (0, customize_1.ResponseMessage)('Update payment settings'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "updatePaymentSettings", null);
__decorate([
    (0, customize_1.RequirePermissions)('manage_settings'),
    (0, common_1.Put)('admin/smtp'),
    (0, customize_1.ResponseMessage)('Update SMTP settings'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "updateSmtpSettings", null);
__decorate([
    (0, customize_1.RequirePermissions)('manage_settings'),
    (0, common_1.Get)('admin/sidebar'),
    (0, customize_1.ResponseMessage)('Get admin sidebar settings'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getAdminSidebarSettings", null);
__decorate([
    (0, customize_1.RequirePermissions)('manage_settings'),
    (0, common_1.Put)('admin/sidebar'),
    (0, customize_1.ResponseMessage)('Update admin sidebar settings'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "updateAdminSidebarSettings", null);
__decorate([
    (0, customize_1.RequirePermissions)('manage_settings'),
    (0, common_1.Get)('admin/client-features'),
    (0, customize_1.ResponseMessage)('Get client feature settings'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getClientFeatureSettings", null);
__decorate([
    (0, customize_1.RequirePermissions)('manage_settings'),
    (0, common_1.Put)('admin/client-features'),
    (0, customize_1.ResponseMessage)('Update client feature settings'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "updateClientFeatureSettings", null);
exports.SettingsController = SettingsController = __decorate([
    (0, common_1.Controller)('settings'),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], SettingsController);
//# sourceMappingURL=settings.controller.js.map