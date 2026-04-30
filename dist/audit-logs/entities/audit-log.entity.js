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
exports.AuditLogEntity = void 0;
const typeorm_1 = require("typeorm");
let AuditLogEntity = class AuditLogEntity {
    logId;
    entityType;
    entityId;
    action;
    changedBy;
    beforeData;
    afterData;
    ipAddress;
    notes;
    changedAt;
};
exports.AuditLogEntity = AuditLogEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'log_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], AuditLogEntity.prototype, "logId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'entity_type', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], AuditLogEntity.prototype, "entityType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'entity_id', type: 'varchar', length: 36 }),
    __metadata("design:type", String)
], AuditLogEntity.prototype, "entityId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'action',
        type: 'enum',
        enum: ['create', 'update', 'delete', 'confirm', 'cancel', 'approve', 'reject', 'apply_price'],
    }),
    __metadata("design:type", String)
], AuditLogEntity.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'changed_by', type: 'char', length: 36, nullable: true }),
    __metadata("design:type", Object)
], AuditLogEntity.prototype, "changedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'before_data', type: 'longtext', nullable: true }),
    __metadata("design:type", Object)
], AuditLogEntity.prototype, "beforeData", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'after_data', type: 'longtext', nullable: true }),
    __metadata("design:type", Object)
], AuditLogEntity.prototype, "afterData", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ip_address', type: 'varchar', length: 45, nullable: true }),
    __metadata("design:type", Object)
], AuditLogEntity.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notes', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], AuditLogEntity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'changed_at', type: 'datetime' }),
    __metadata("design:type", Date)
], AuditLogEntity.prototype, "changedAt", void 0);
exports.AuditLogEntity = AuditLogEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'audit_logs' })
], AuditLogEntity);
//# sourceMappingURL=audit-log.entity.js.map