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
exports.OrderEntity = exports.PaymentStatus = exports.PaymentMethod = exports.OrderStatus = void 0;
const typeorm_1 = require("typeorm");
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["BACKORDERED"] = "backordered";
    OrderStatus["CONFIRMED"] = "confirmed";
    OrderStatus["PROCESSING"] = "processing";
    OrderStatus["SHIPPING"] = "shipping";
    OrderStatus["DELIVERED"] = "delivered";
    OrderStatus["PARTIAL_DELIVERED"] = "partial_delivered";
    OrderStatus["CANCELLED"] = "cancelled";
    OrderStatus["RETURNED"] = "returned";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["COD"] = "cod";
    PaymentMethod["BANK_TRANSFER"] = "bank_transfer";
    PaymentMethod["MOMO"] = "momo";
    PaymentMethod["VNPAY"] = "vnpay";
    PaymentMethod["ZALOPAY"] = "zalopay";
    PaymentMethod["PAYPAL"] = "paypal";
    PaymentMethod["CREDIT"] = "credit";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["UNPAID"] = "unpaid";
    PaymentStatus["PAID"] = "paid";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["REFUNDED"] = "refunded";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
let OrderEntity = class OrderEntity {
    orderId;
    userId;
    shippingAddressId;
    deliveryId;
    discountId;
    orderStatus;
    paymentMethod;
    paymentStatus;
    subtotalAmount;
    discountAmount;
    deliveryCost;
    totalPayment;
    totalQuantity;
    note;
    fullName;
    phone;
    address;
    idempotencyKey;
    createdAt;
    updatedAt;
};
exports.OrderEntity = OrderEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'order_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], OrderEntity.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], OrderEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'shipping_address_id',
        type: 'bigint',
        unsigned: true,
        nullable: true,
    }),
    __metadata("design:type", Object)
], OrderEntity.prototype, "shippingAddressId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'delivery_id',
        type: 'bigint',
        unsigned: true,
        nullable: true,
    }),
    __metadata("design:type", Object)
], OrderEntity.prototype, "deliveryId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'discount_id',
        type: 'bigint',
        unsigned: true,
        nullable: true,
    }),
    __metadata("design:type", Object)
], OrderEntity.prototype, "discountId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'order_status',
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    }),
    __metadata("design:type", String)
], OrderEntity.prototype, "orderStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'payment_method',
        type: 'enum',
        enum: PaymentMethod,
    }),
    __metadata("design:type", String)
], OrderEntity.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'payment_status',
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.UNPAID,
    }),
    __metadata("design:type", String)
], OrderEntity.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'subtotal_amount',
        type: 'decimal',
        precision: 15,
        scale: 2,
        default: '0.00',
    }),
    __metadata("design:type", String)
], OrderEntity.prototype, "subtotalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'discount_amount',
        type: 'decimal',
        precision: 15,
        scale: 2,
        default: '0.00',
    }),
    __metadata("design:type", String)
], OrderEntity.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'delivery_cost',
        type: 'decimal',
        precision: 15,
        scale: 2,
        default: '0.00',
    }),
    __metadata("design:type", String)
], OrderEntity.prototype, "deliveryCost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_payment',
        type: 'decimal',
        precision: 15,
        scale: 2,
        default: '0.00',
    }),
    __metadata("design:type", String)
], OrderEntity.prototype, "totalPayment", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_quantity', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], OrderEntity.prototype, "totalQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'note', type: 'varchar', length: 1000, nullable: true }),
    __metadata("design:type", Object)
], OrderEntity.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'full_name', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], OrderEntity.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], OrderEntity.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address', type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], OrderEntity.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_orders_idempotency_key', { unique: true }),
    (0, typeorm_1.Column)({
        name: 'idempotency_key',
        type: 'varchar',
        length: 100,
        nullable: true,
    }),
    __metadata("design:type", Object)
], OrderEntity.prototype, "idempotencyKey", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], OrderEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], OrderEntity.prototype, "updatedAt", void 0);
exports.OrderEntity = OrderEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'orders' })
], OrderEntity);
//# sourceMappingURL=order.entity.js.map