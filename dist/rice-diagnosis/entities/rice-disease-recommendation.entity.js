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
exports.RiceDiseaseRecommendationEntity = void 0;
const typeorm_1 = require("typeorm");
const rice_disease_entity_1 = require("./rice-disease.entity");
let RiceDiseaseRecommendationEntity = class RiceDiseaseRecommendationEntity {
    riceDiseaseRecommendationId;
    diseaseId;
    productId;
    note;
    rationale;
    isPrimary;
    sortOrder;
    createdAt;
    disease;
};
exports.RiceDiseaseRecommendationEntity = RiceDiseaseRecommendationEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        name: 'rice_disease_recommendation_id',
        type: 'bigint',
        unsigned: true,
    }),
    __metadata("design:type", String)
], RiceDiseaseRecommendationEntity.prototype, "riceDiseaseRecommendationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'disease_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], RiceDiseaseRecommendationEntity.prototype, "diseaseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], RiceDiseaseRecommendationEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'note', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], RiceDiseaseRecommendationEntity.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rationale', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], RiceDiseaseRecommendationEntity.prototype, "rationale", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_primary',
        type: 'tinyint',
        width: 1,
        default: 0,
    }),
    __metadata("design:type", Boolean)
], RiceDiseaseRecommendationEntity.prototype, "isPrimary", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sort_order', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], RiceDiseaseRecommendationEntity.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], RiceDiseaseRecommendationEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => rice_disease_entity_1.RiceDiseaseEntity, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'disease_id', referencedColumnName: 'diseaseId' }),
    __metadata("design:type", rice_disease_entity_1.RiceDiseaseEntity)
], RiceDiseaseRecommendationEntity.prototype, "disease", void 0);
exports.RiceDiseaseRecommendationEntity = RiceDiseaseRecommendationEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'rice_disease_recommendations' }),
    (0, typeorm_1.Index)('idx_rice_disease_recommendations_unique', ['diseaseId', 'productId'], {
        unique: true,
    })
], RiceDiseaseRecommendationEntity);
//# sourceMappingURL=rice-disease-recommendation.entity.js.map