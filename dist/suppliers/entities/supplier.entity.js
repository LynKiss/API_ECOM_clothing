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
exports.SupplierEntity = void 0;
const typeorm_1 = require("typeorm");
let SupplierEntity = class SupplierEntity {
    supplierId;
    name;
    code;
    phone;
    email;
    address;
    taxCode;
    contactPerson;
    paymentTerms;
    notes;
    isActive;
    createdAt;
    updatedAt;
};
exports.SupplierEntity = SupplierEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'supplier_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], SupplierEntity.prototype, "supplierId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], SupplierEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'code', type: 'varchar', length: 50, unique: true, nullable: true }),
    __metadata("design:type", Object)
], SupplierEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], SupplierEntity.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], SupplierEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], SupplierEntity.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax_code', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], SupplierEntity.prototype, "taxCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_person', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], SupplierEntity.prototype, "contactPerson", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_terms', type: 'int', default: 30 }),
    __metadata("design:type", Number)
], SupplierEntity.prototype, "paymentTerms", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notes', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], SupplierEntity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', width: 1, default: 1 }),
    __metadata("design:type", Boolean)
], SupplierEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], SupplierEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], SupplierEntity.prototype, "updatedAt", void 0);
exports.SupplierEntity = SupplierEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'suppliers' })
], SupplierEntity);
//# sourceMappingURL=supplier.entity.js.map