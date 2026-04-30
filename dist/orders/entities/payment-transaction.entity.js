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
exports.PaymentTransactionEntity = exports.PaymentTransactionStatus = void 0;
const typeorm_1 = require("typeorm");
const order_entity_1 = require("./order.entity");
var PaymentTransactionStatus;
(function (PaymentTransactionStatus) {
    PaymentTransactionStatus["PENDING"] = "pending";
    PaymentTransactionStatus["SUCCESS"] = "success";
    PaymentTransactionStatus["FAILED"] = "failed";
})(PaymentTransactionStatus || (exports.PaymentTransactionStatus = PaymentTransactionStatus = {}));
let PaymentTransactionEntity = class PaymentTransactionEntity {
    paymentTransactionId;
    orderId;
    userId;
    provider;
    transactionRef;
    transactionStatus;
    paymentStatus;
    amount;
    gatewayCode;
    gatewayMessage;
    rawPayload;
    createdAt;
    updatedAt;
};
exports.PaymentTransactionEntity = PaymentTransactionEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        name: 'payment_transaction_id',
        type: 'bigint',
        unsigned: true,
    }),
    __metadata("design:type", String)
], PaymentTransactionEntity.prototype, "paymentTransactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], PaymentTransactionEntity.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], PaymentTransactionEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'provider',
        type: 'enum',
        enum: order_entity_1.PaymentMethod,
    }),
    __metadata("design:type", String)
], PaymentTransactionEntity.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transaction_ref', type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], PaymentTransactionEntity.prototype, "transactionRef", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'transaction_status',
        type: 'enum',
        enum: PaymentTransactionStatus,
        default: PaymentTransactionStatus.PENDING,
    }),
    __metadata("design:type", String)
], PaymentTransactionEntity.prototype, "transactionStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'payment_status',
        type: 'enum',
        enum: order_entity_1.PaymentStatus,
        default: order_entity_1.PaymentStatus.UNPAID,
    }),
    __metadata("design:type", String)
], PaymentTransactionEntity.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'amount',
        type: 'decimal',
        precision: 15,
        scale: 2,
        default: '0.00',
    }),
    __metadata("design:type", String)
], PaymentTransactionEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'gateway_code',
        type: 'varchar',
        length: 100,
        nullable: true,
    }),
    __metadata("design:type", Object)
], PaymentTransactionEntity.prototype, "gatewayCode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'gateway_message',
        type: 'varchar',
        length: 255,
        nullable: true,
    }),
    __metadata("design:type", Object)
], PaymentTransactionEntity.prototype, "gatewayMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'raw_payload', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], PaymentTransactionEntity.prototype, "rawPayload", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], PaymentTransactionEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], PaymentTransactionEntity.prototype, "updatedAt", void 0);
exports.PaymentTransactionEntity = PaymentTransactionEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'payment_transactions' })
], PaymentTransactionEntity);
//# sourceMappingURL=payment-transaction.entity.js.map