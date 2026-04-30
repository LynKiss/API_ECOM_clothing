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
exports.ColorEntity = void 0;
const typeorm_1 = require("typeorm");
let ColorEntity = class ColorEntity {
    colorId;
    colorName;
    colorCode;
    createdAt;
    updatedAt;
};
exports.ColorEntity = ColorEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        name: 'color_id',
        type: 'bigint',
        unsigned: true,
    }),
    __metadata("design:type", String)
], ColorEntity.prototype, "colorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'color_name', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], ColorEntity.prototype, "colorName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'color_code', type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", Object)
], ColorEntity.prototype, "colorCode", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], ColorEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], ColorEntity.prototype, "updatedAt", void 0);
exports.ColorEntity = ColorEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'colors' })
], ColorEntity);
//# sourceMappingURL=color.entity.js.map