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
exports.OrderTrackingEntity = exports.OrderTrackingMode = void 0;
const typeorm_1 = require("typeorm");
var OrderTrackingMode;
(function (OrderTrackingMode) {
    OrderTrackingMode["DEMO"] = "demo";
    OrderTrackingMode["LIVE"] = "live";
    OrderTrackingMode["AUTO_FALLBACK"] = "auto_fallback";
})(OrderTrackingMode || (exports.OrderTrackingMode = OrderTrackingMode = {}));
let OrderTrackingEntity = class OrderTrackingEntity {
    trackingId;
    orderId;
    mode;
    manualLatitude;
    manualLongitude;
    manualNote;
    manualUpdatedBy;
    manualUpdatedAt;
    gpsLatitude;
    gpsLongitude;
    gpsHeading;
    gpsSpeedKph;
    gpsProvider;
    gpsUpdatedAt;
    createdAt;
    updatedAt;
};
exports.OrderTrackingEntity = OrderTrackingEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'tracking_id' }),
    __metadata("design:type", String)
], OrderTrackingEntity.prototype, "trackingId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_id', type: 'char', length: 36, unique: true }),
    __metadata("design:type", String)
], OrderTrackingEntity.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'mode',
        type: 'enum',
        enum: OrderTrackingMode,
        default: OrderTrackingMode.AUTO_FALLBACK,
    }),
    __metadata("design:type", String)
], OrderTrackingEntity.prototype, "mode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'manual_latitude',
        type: 'decimal',
        precision: 10,
        scale: 7,
        nullable: true,
    }),
    __metadata("design:type", Object)
], OrderTrackingEntity.prototype, "manualLatitude", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'manual_longitude',
        type: 'decimal',
        precision: 10,
        scale: 7,
        nullable: true,
    }),
    __metadata("design:type", Object)
], OrderTrackingEntity.prototype, "manualLongitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'manual_note', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], OrderTrackingEntity.prototype, "manualNote", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'manual_updated_by',
        type: 'char',
        length: 36,
        nullable: true,
    }),
    __metadata("design:type", Object)
], OrderTrackingEntity.prototype, "manualUpdatedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'manual_updated_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], OrderTrackingEntity.prototype, "manualUpdatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'gps_latitude',
        type: 'decimal',
        precision: 10,
        scale: 7,
        nullable: true,
    }),
    __metadata("design:type", Object)
], OrderTrackingEntity.prototype, "gpsLatitude", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'gps_longitude',
        type: 'decimal',
        precision: 10,
        scale: 7,
        nullable: true,
    }),
    __metadata("design:type", Object)
], OrderTrackingEntity.prototype, "gpsLongitude", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'gps_heading',
        type: 'decimal',
        precision: 6,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Object)
], OrderTrackingEntity.prototype, "gpsHeading", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'gps_speed_kph',
        type: 'decimal',
        precision: 8,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Object)
], OrderTrackingEntity.prototype, "gpsSpeedKph", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gps_provider', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], OrderTrackingEntity.prototype, "gpsProvider", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gps_updated_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], OrderTrackingEntity.prototype, "gpsUpdatedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], OrderTrackingEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], OrderTrackingEntity.prototype, "updatedAt", void 0);
exports.OrderTrackingEntity = OrderTrackingEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'order_tracking' })
], OrderTrackingEntity);
//# sourceMappingURL=order-tracking.entity.js.map