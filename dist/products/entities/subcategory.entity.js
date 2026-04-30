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
exports.SubcategoryEntity = void 0;
const typeorm_1 = require("typeorm");
let SubcategoryEntity = class SubcategoryEntity {
    subcategoryId;
    categoryId;
    subcategoryName;
    subcategorySlug;
    isActive;
    createdAt;
    updatedAt;
};
exports.SubcategoryEntity = SubcategoryEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        name: 'subcategory_id',
        type: 'bigint',
        unsigned: true,
    }),
    __metadata("design:type", String)
], SubcategoryEntity.prototype, "subcategoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], SubcategoryEntity.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'subcategory_name', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], SubcategoryEntity.prototype, "subcategoryName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'subcategory_slug', type: 'varchar', length: 180 }),
    __metadata("design:type", String)
], SubcategoryEntity.prototype, "subcategorySlug", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', width: 1, default: () => '1' }),
    __metadata("design:type", Boolean)
], SubcategoryEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], SubcategoryEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], SubcategoryEntity.prototype, "updatedAt", void 0);
exports.SubcategoryEntity = SubcategoryEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'subcategories' })
], SubcategoryEntity);
//# sourceMappingURL=subcategory.entity.js.map