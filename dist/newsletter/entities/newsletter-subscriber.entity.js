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
exports.NewsletterSubscriberEntity = exports.SubscriberStatus = void 0;
const typeorm_1 = require("typeorm");
var SubscriberStatus;
(function (SubscriberStatus) {
    SubscriberStatus["ACTIVE"] = "active";
    SubscriberStatus["UNSUBSCRIBED"] = "unsubscribed";
})(SubscriberStatus || (exports.SubscriberStatus = SubscriberStatus = {}));
let NewsletterSubscriberEntity = class NewsletterSubscriberEntity {
    subscriberId;
    email;
    name;
    status;
    unsubscribeToken;
    createdAt;
    updatedAt;
};
exports.NewsletterSubscriberEntity = NewsletterSubscriberEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'subscriber_id' }),
    __metadata("design:type", String)
], NewsletterSubscriberEntity.prototype, "subscriberId", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 255 }),
    __metadata("design:type", String)
], NewsletterSubscriberEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 100 }),
    __metadata("design:type", Object)
], NewsletterSubscriberEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SubscriberStatus, default: SubscriberStatus.ACTIVE }),
    __metadata("design:type", String)
], NewsletterSubscriberEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unsubscribe_token', unique: true, length: 64 }),
    __metadata("design:type", String)
], NewsletterSubscriberEntity.prototype, "unsubscribeToken", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], NewsletterSubscriberEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], NewsletterSubscriberEntity.prototype, "updatedAt", void 0);
exports.NewsletterSubscriberEntity = NewsletterSubscriberEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'newsletter_subscribers' })
], NewsletterSubscriberEntity);
//# sourceMappingURL=newsletter-subscriber.entity.js.map