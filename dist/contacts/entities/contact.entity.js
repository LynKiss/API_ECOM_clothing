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
exports.ContactEntity = exports.ContactStatus = void 0;
const typeorm_1 = require("typeorm");
var ContactStatus;
(function (ContactStatus) {
    ContactStatus["PENDING"] = "pending";
    ContactStatus["PROCESSING"] = "processing";
    ContactStatus["RESOLVED"] = "resolved";
    ContactStatus["CLOSED"] = "closed";
})(ContactStatus || (exports.ContactStatus = ContactStatus = {}));
let ContactEntity = class ContactEntity {
    contactId;
    userId;
    subject;
    message;
    status;
    createdAt;
    updatedAt;
};
exports.ContactEntity = ContactEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        name: 'contact_id',
        type: 'bigint',
        unsigned: true,
    }),
    __metadata("design:type", String)
], ContactEntity.prototype, "contactId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'char', length: 36, nullable: true }),
    __metadata("design:type", Object)
], ContactEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'subject', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], ContactEntity.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'message', type: 'text' }),
    __metadata("design:type", String)
], ContactEntity.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'status',
        type: 'enum',
        enum: ContactStatus,
        default: ContactStatus.PENDING,
    }),
    __metadata("design:type", String)
], ContactEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], ContactEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], ContactEntity.prototype, "updatedAt", void 0);
exports.ContactEntity = ContactEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'contacts' })
], ContactEntity);
//# sourceMappingURL=contact.entity.js.map