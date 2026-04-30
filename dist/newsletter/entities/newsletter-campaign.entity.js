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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterCampaignEntity = exports.CampaignStatus = void 0;
const typeorm_1 = require("typeorm");
var CampaignStatus;
(function (CampaignStatus) {
    CampaignStatus["DRAFT"] = "draft";
    CampaignStatus["SCHEDULED"] = "scheduled";
    CampaignStatus["SENT"] = "sent";
})(CampaignStatus || (exports.CampaignStatus = CampaignStatus = {}));
let NewsletterCampaignEntity = class NewsletterCampaignEntity {
    campaignId;
    subject;
    body;
    status;
    sentAt;
    scheduledAt;
    recipientCount;
    totalRecipientCount;
    createdAt;
    updatedAt;
};
exports.NewsletterCampaignEntity = NewsletterCampaignEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'campaign_id' }),
    __metadata("design:type", String)
], NewsletterCampaignEntity.prototype, "campaignId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], NewsletterCampaignEntity.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], NewsletterCampaignEntity.prototype, "body", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: CampaignStatus, default: CampaignStatus.DRAFT }),
    __metadata("design:type", String)
], NewsletterCampaignEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sent_at', nullable: true, type: 'datetime' }),
    __metadata("design:type", Object)
], NewsletterCampaignEntity.prototype, "sentAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'scheduled_at', nullable: true, type: 'datetime' }),
    __metadata("design:type", Object)
], NewsletterCampaignEntity.prototype, "scheduledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recipient_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], NewsletterCampaignEntity.prototype, "recipientCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_recipient_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], NewsletterCampaignEntity.prototype, "totalRecipientCount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], NewsletterCampaignEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], NewsletterCampaignEntity.prototype, "updatedAt", void 0);
exports.NewsletterCampaignEntity = NewsletterCampaignEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'newsletter_campaigns' })
], NewsletterCampaignEntity);
//# sourceMappingURL=newsletter-campaign.entity.js.map