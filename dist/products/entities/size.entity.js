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
exports.SizeEntity = void 0;
const typeorm_1 = require("typeorm");
let SizeEntity = class SizeEntity {
    sizeId;
    sizeName;
    sizeCode;
    sortOrder;
    createdAt;
    updatedAt;
};
exports.SizeEntity = SizeEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        name: 'size_id',
        type: 'bigint',
        unsigned: true,
    }),
    __metadata("design:type", String)
], SizeEntity.prototype, "sizeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'size_name', type: 'varchar', length: 80 }),
    __metadata("design:type", String)
], SizeEntity.prototype, "sizeName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'size_code', type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", Object)
], SizeEntity.prototype, "sizeCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sort_order', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], SizeEntity.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], SizeEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], SizeEntity.prototype, "updatedAt", void 0);
exports.SizeEntity = SizeEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'sizes' })
], SizeEntity);
//# sourceMappingURL=size.entity.js.map