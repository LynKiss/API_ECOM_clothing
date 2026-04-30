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
exports.WarehouseStockEntity = void 0;
const typeorm_1 = require("typeorm");
let WarehouseStockEntity = class WarehouseStockEntity {
    stockId;
    warehouseId;
    productId;
    variantId;
    quantity;
    createdAt;
    updatedAt;
};
exports.WarehouseStockEntity = WarehouseStockEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        name: 'warehouse_stock_id',
        type: 'bigint',
        unsigned: true,
    }),
    __metadata("design:type", String)
], WarehouseStockEntity.prototype, "stockId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], WarehouseStockEntity.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], WarehouseStockEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id', type: 'char', length: 36, nullable: true }),
    __metadata("design:type", Object)
], WarehouseStockEntity.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantity', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], WarehouseStockEntity.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], WarehouseStockEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], WarehouseStockEntity.prototype, "updatedAt", void 0);
exports.WarehouseStockEntity = WarehouseStockEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'warehouse_stock' })
], WarehouseStockEntity);
//# sourceMappingURL=warehouse-stock.entity.js.map