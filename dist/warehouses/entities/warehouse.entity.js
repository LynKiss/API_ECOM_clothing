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
exports.WarehouseEntity = void 0;
const typeorm_1 = require("typeorm");
let WarehouseEntity = class WarehouseEntity {
    warehouseId;
    name;
    code;
    address;
    managerName;
    phone;
    isActive;
    isDefault;
    createdAt;
    updatedAt;
};
exports.WarehouseEntity = WarehouseEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'warehouse_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], WarehouseEntity.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], WarehouseEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'code', type: 'varchar', length: 50, unique: true, nullable: true }),
    __metadata("design:type", Object)
], WarehouseEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], WarehouseEntity.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'manager_name', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], WarehouseEntity.prototype, "managerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], WarehouseEntity.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', width: 1, default: 1 }),
    __metadata("design:type", Boolean)
], WarehouseEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_default', type: 'tinyint', width: 1, default: 0 }),
    __metadata("design:type", Boolean)
], WarehouseEntity.prototype, "isDefault", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], WarehouseEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], WarehouseEntity.prototype, "updatedAt", void 0);
exports.WarehouseEntity = WarehouseEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'warehouses' })
], WarehouseEntity);
//# sourceMappingURL=warehouse.entity.js.map