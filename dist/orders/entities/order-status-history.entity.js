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
exports.OrderStatusHistoryEntity = void 0;
const typeorm_1 = require("typeorm");
const order_entity_1 = require("./order.entity");
let OrderStatusHistoryEntity = class OrderStatusHistoryEntity {
    historyId;
    orderId;
    oldStatus;
    newStatus;
    changedBy;
    note;
    createdAt;
};
exports.OrderStatusHistoryEntity = OrderStatusHistoryEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        name: 'history_id',
        type: 'bigint',
        unsigned: true,
    }),
    __metadata("design:type", String)
], OrderStatusHistoryEntity.prototype, "historyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], OrderStatusHistoryEntity.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'old_status',
        type: 'enum',
        enum: order_entity_1.OrderStatus,
        nullable: true,
    }),
    __metadata("design:type", Object)
], OrderStatusHistoryEntity.prototype, "oldStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'new_status',
        type: 'enum',
        enum: order_entity_1.OrderStatus,
    }),
    __metadata("design:type", String)
], OrderStatusHistoryEntity.prototype, "newStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'changed_by', type: 'char', length: 36, nullable: true }),
    __metadata("design:type", Object)
], OrderStatusHistoryEntity.prototype, "changedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'note', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], OrderStatusHistoryEntity.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], OrderStatusHistoryEntity.prototype, "createdAt", void 0);
exports.OrderStatusHistoryEntity = OrderStatusHistoryEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'order_status_history' })
], OrderStatusHistoryEntity);
//# sourceMappingURL=order-status-history.entity.js.map