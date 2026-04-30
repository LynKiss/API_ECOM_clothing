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
exports.RiceDiseaseEntity = exports.RiceDiseaseSeverity = void 0;
const typeorm_1 = require("typeorm");
var RiceDiseaseSeverity;
(function (RiceDiseaseSeverity) {
    RiceDiseaseSeverity["LOW"] = "low";
    RiceDiseaseSeverity["MEDIUM"] = "medium";
    RiceDiseaseSeverity["HIGH"] = "high";
    RiceDiseaseSeverity["CRITICAL"] = "critical";
})(RiceDiseaseSeverity || (exports.RiceDiseaseSeverity = RiceDiseaseSeverity = {}));
let RiceDiseaseEntity = class RiceDiseaseEntity {
    diseaseId;
    diseaseKey;
    diseaseSlug;
    diseaseName;
    summary;
    symptoms;
    causes;
    treatmentGuidance;
    preventionGuidance;
    severity;
    recommendedIngredients;
    searchKeywords;
    confidenceThreshold;
    coverImageUrl;
    isActive;
    createdAt;
    updatedAt;
};
exports.RiceDiseaseEntity = RiceDiseaseEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        name: 'disease_id',
        type: 'bigint',
        unsigned: true,
    }),
    __metadata("design:type", String)
], RiceDiseaseEntity.prototype, "diseaseId", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_rice_diseases_key', { unique: true }),
    (0, typeorm_1.Column)({ name: 'disease_key', type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], RiceDiseaseEntity.prototype, "diseaseKey", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_rice_diseases_slug', { unique: true }),
    (0, typeorm_1.Column)({ name: 'disease_slug', type: 'varchar', length: 180 }),
    __metadata("design:type", String)
], RiceDiseaseEntity.prototype, "diseaseSlug", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'disease_name', type: 'varchar', length: 180 }),
    __metadata("design:type", String)
], RiceDiseaseEntity.prototype, "diseaseName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'summary', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], RiceDiseaseEntity.prototype, "summary", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'symptoms', type: 'longtext', nullable: true }),
    __metadata("design:type", Object)
], RiceDiseaseEntity.prototype, "symptoms", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'causes', type: 'longtext', nullable: true }),
    __metadata("design:type", Object)
], RiceDiseaseEntity.prototype, "causes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'treatment_guidance', type: 'longtext', nullable: true }),
    __metadata("design:type", Object)
], RiceDiseaseEntity.prototype, "treatmentGuidance", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'prevention_guidance', type: 'longtext', nullable: true }),
    __metadata("design:type", Object)
], RiceDiseaseEntity.prototype, "preventionGuidance", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'severity',
        type: 'enum',
        enum: RiceDiseaseSeverity,
        default: RiceDiseaseSeverity.MEDIUM,
    }),
    __metadata("design:type", String)
], RiceDiseaseEntity.prototype, "severity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'recommended_ingredients',
        type: 'simple-json',
        nullable: true,
    }),
    __metadata("design:type", Object)
], RiceDiseaseEntity.prototype, "recommendedIngredients", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'search_keywords',
        type: 'simple-json',
        nullable: true,
    }),
    __metadata("design:type", Object)
], RiceDiseaseEntity.prototype, "searchKeywords", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'confidence_threshold',
        type: 'decimal',
        precision: 5,
        scale: 4,
        default: 0.9,
    }),
    __metadata("design:type", String)
], RiceDiseaseEntity.prototype, "confidenceThreshold", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'cover_image_url',
        type: 'varchar',
        length: 500,
        nullable: true,
    }),
    __metadata("design:type", Object)
], RiceDiseaseEntity.prototype, "coverImageUrl", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_rice_diseases_is_active'),
    (0, typeorm_1.Column)({
        name: 'is_active',
        type: 'tinyint',
        width: 1,
        default: 1,
    }),
    __metadata("design:type", Boolean)
], RiceDiseaseEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], RiceDiseaseEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], RiceDiseaseEntity.prototype, "updatedAt", void 0);
exports.RiceDiseaseEntity = RiceDiseaseEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'rice_diseases' })
], RiceDiseaseEntity);
//# sourceMappingURL=rice-disease.entity.js.map