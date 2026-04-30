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
exports.CategoryEntity = void 0;
const typeorm_1 = require("typeorm");
let CategoryEntity = class CategoryEntity {
    categoryId;
    categoryName;
    categoryDescription;
    categorySlug;
    parentId;
    isActive;
    sortOrder;
    createdAt;
    updatedAt;
    parent;
    children;
};
exports.CategoryEntity = CategoryEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        name: 'category_id',
        type: 'bigint',
        unsigned: true,
    }),
    __metadata("design:type", String)
], CategoryEntity.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'category_name',
        type: 'varchar',
        length: 150,
    }),
    __metadata("design:type", String)
], CategoryEntity.prototype, "categoryName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'category_description',
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", Object)
], CategoryEntity.prototype, "categoryDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'category_slug',
        type: 'varchar',
        length: 180,
    }),
    __metadata("design:type", String)
], CategoryEntity.prototype, "categorySlug", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'parent_id',
        type: 'bigint',
        unsigned: true,
        nullable: true,
    }),
    __metadata("design:type", Object)
], CategoryEntity.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_active',
        type: 'tinyint',
        width: 1,
        default: 1,
    }),
    __metadata("design:type", Boolean)
], CategoryEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'sort_order',
        type: 'int',
        default: 0,
    }),
    __metadata("design:type", Number)
], CategoryEntity.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], CategoryEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], CategoryEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => CategoryEntity, (category) => category.children, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'parent_id', referencedColumnName: 'categoryId' }),
    __metadata("design:type", Object)
], CategoryEntity.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CategoryEntity, (category) => category.parent),
    __metadata("design:type", Array)
], CategoryEntity.prototype, "children", void 0);
exports.CategoryEntity = CategoryEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'categories' })
], CategoryEntity);
//# sourceMappingURL=category.entity.js.map