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
exports.TagEntity = void 0;
const typeorm_1 = require("typeorm");
let TagEntity = class TagEntity {
    tagId;
    tagName;
    createdAt;
    updatedAt;
};
exports.TagEntity = TagEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        name: 'tag_id',
        type: 'bigint',
        unsigned: true,
    }),
    __metadata("design:type", String)
], TagEntity.prototype, "tagId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tag_name', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], TagEntity.prototype, "tagName", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], TagEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], TagEntity.prototype, "updatedAt", void 0);
exports.TagEntity = TagEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'tags' })
], TagEntity);
//# sourceMappingURL=tag.entity.js.map