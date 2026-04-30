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
exports.NewsletterController = void 0;
const common_1 = require("@nestjs/common");
const customize_1 = require("../decorator/customize");
const newsletter_service_1 = require("./newsletter.service");
let NewsletterController = class NewsletterController {
    newsletterService;
    constructor(newsletterService) {
        this.newsletterService = newsletterService;
    }
    subscribe(body) {
        return this.newsletterService.subscribe(body.email, body.name);
    }
    unsubscribe(token) {
        return this.newsletterService.unsubscribeByToken(token);
    }
    getSubscribers(page = '1', limit = '50', status) {
        return this.newsletterService.findSubscribers(Math.max(1, parseInt(page, 10) || 1), Math.min(200, Math.max(1, parseInt(limit, 10) || 50)), status);
    }
    deleteSubscriber(id) {
        return this.newsletterService.deleteSubscriber(id);
    }
    getCampaigns() {
        return this.newsletterService.findCampaigns();
    }
    getAutomationSettings() {
        return this.newsletterService.getAutomationSettings();
    }
    createCampaign(body) {
        const scheduledAt = body.scheduledAt ? new Date(body.scheduledAt) : null;
        return this.newsletterService.createCampaign(body.subject, body.body, scheduledAt);
    }
    updateCampaign(id, body) {
        const scheduledAt = body.scheduledAt ? new Date(body.scheduledAt) : null;
        return this.newsletterService.updateCampaign(id, body.subject, body.body, scheduledAt);
    }
    updateAutomationSmtpSettings(body) {
        return this.newsletterService.updateAutomationSmtpSettings(body.smtp ?? {});
    }
    deleteCampaign(id) {
        return this.newsletterService.deleteCampaign(id);
    }
    sendCampaign(id) {
        return this.newsletterService.sendCampaign(id);
    }
};
exports.NewsletterController = NewsletterController;
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Post)('subscribe'),
    (0, customize_1.ResponseMessage)('Dang ky nhan tin thanh cong'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NewsletterController.prototype, "subscribe", null);
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Get)('unsubscribe'),
    (0, customize_1.ResponseMessage)('Huy dang ky thanh cong'),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NewsletterController.prototype, "unsubscribe", null);
__decorate([
    (0, customize_1.RequirePermissions)('manage_orders'),
    (0, common_1.Get)('subscribers'),
    (0, customize_1.ResponseMessage)('Danh sach nguoi dang ky'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", void 0)
], NewsletterController.prototype, "getSubscribers", null);
__decorate([
    (0, customize_1.RequirePermissions)('manage_orders'),
    (0, common_1.Delete)('subscribers/:id'),
    (0, customize_1.ResponseMessage)('Xoa nguoi dang ky thanh cong'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NewsletterController.prototype, "deleteSubscriber", null);
__decorate([
    (0, customize_1.RequirePermissions)('manage_orders'),
    (0, common_1.Get)('campaigns'),
    (0, customize_1.ResponseMessage)('Danh sach chien dich'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NewsletterController.prototype, "getCampaigns", null);
__decorate([
    (0, customize_1.RequirePermissions)('manage_orders'),
    (0, common_1.Get)('automation'),
    (0, customize_1.ResponseMessage)('Cau hinh gui mail tu dong'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NewsletterController.prototype, "getAutomationSettings", null);
__decorate([
    (0, customize_1.RequirePermissions)('manage_orders'),
    (0, common_1.Post)('campaigns'),
    (0, customize_1.ResponseMessage)('Tao chien dich thanh cong'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NewsletterController.prototype, "createCampaign", null);
__decorate([
    (0, customize_1.RequirePermissions)('manage_orders'),
    (0, common_1.Put)('campaigns/:id'),
    (0, customize_1.ResponseMessage)('Cap nhat chien dich thanh cong'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], NewsletterController.prototype, "updateCampaign", null);
__decorate([
    (0, customize_1.RequirePermissions)('manage_orders'),
    (0, common_1.Put)('automation/smtp'),
    (0, customize_1.ResponseMessage)('Cap nhat cau hinh SMTP thanh cong'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NewsletterController.prototype, "updateAutomationSmtpSettings", null);
__decorate([
    (0, customize_1.RequirePermissions)('manage_orders'),
    (0, common_1.Delete)('campaigns/:id'),
    (0, customize_1.ResponseMessage)('Xoa chien dich thanh cong'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NewsletterController.prototype, "deleteCampaign", null);
__decorate([
    (0, customize_1.RequirePermissions)('manage_orders'),
    (0, common_1.Post)('campaigns/:id/send'),
    (0, customize_1.ResponseMessage)('Gui chien dich thanh cong'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NewsletterController.prototype, "sendCampaign", null);
exports.NewsletterController = NewsletterController = __decorate([
    (0, common_1.Controller)('newsletter'),
    __metadata("design:paramtypes", [newsletter_service_1.NewsletterService])
], NewsletterController);
//# sourceMappingURL=newsletter.controller.js.map