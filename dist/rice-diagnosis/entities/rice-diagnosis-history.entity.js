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
exports.RiceDiagnosisHistoryEntity = exports.RiceDiagnosisRecommendationLevel = void 0;
const typeorm_1 = require("typeorm");
var RiceDiagnosisRecommendationLevel;
(function (RiceDiagnosisRecommendationLevel) {
    RiceDiagnosisRecommendationLevel["LOW"] = "low";
    RiceDiagnosisRecommendationLevel["REVIEW"] = "review";
    RiceDiagnosisRecommendationLevel["HIGH"] = "high";
})(RiceDiagnosisRecommendationLevel || (exports.RiceDiagnosisRecommendationLevel = RiceDiagnosisRecommendationLevel = {}));
let RiceDiagnosisHistoryEntity = class RiceDiagnosisHistoryEntity {
    diagnosisId;
    userId;
    diseaseId;
    originalFileName;
    imageMimeType;
    imageSizeBytes;
    imageSha256;
    predictedLabel;
    predictedDiseaseKey;
    confidence;
    recommendationLevel;
    modelVersion;
    modelTask;
    topPredictions;
    rawResponse;
    createdAt;
};
exports.RiceDiagnosisHistoryEntity = RiceDiagnosisHistoryEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'diagnosis_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], RiceDiagnosisHistoryEntity.prototype, "diagnosisId", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_rice_diagnosis_history_user'),
    (0, typeorm_1.Column)({ name: 'user_id', type: 'char', length: 36, nullable: true }),
    __metadata("design:type", Object)
], RiceDiagnosisHistoryEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_rice_diagnosis_history_disease'),
    (0, typeorm_1.Column)({ name: 'disease_id', type: 'bigint', unsigned: true, nullable: true }),
    __metadata("design:type", Object)
], RiceDiagnosisHistoryEntity.prototype, "diseaseId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'original_file_name',
        type: 'varchar',
        length: 255,
        nullable: true,
    }),
    __metadata("design:type", Object)
], RiceDiagnosisHistoryEntity.prototype, "originalFileName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'image_mime_type',
        type: 'varchar',
        length: 100,
        nullable: true,
    }),
    __metadata("design:type", Object)
], RiceDiagnosisHistoryEntity.prototype, "imageMimeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'image_size_bytes', type: 'int', unsigned: true, nullable: true }),
    __metadata("design:type", Object)
], RiceDiagnosisHistoryEntity.prototype, "imageSizeBytes", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'image_sha256',
        type: 'varchar',
        length: 64,
        nullable: true,
    }),
    __metadata("design:type", Object)
], RiceDiagnosisHistoryEntity.prototype, "imageSha256", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'predicted_label',
        type: 'varchar',
        length: 180,
        nullable: true,
    }),
    __metadata("design:type", Object)
], RiceDiagnosisHistoryEntity.prototype, "predictedLabel", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'predicted_disease_key',
        type: 'varchar',
        length: 120,
        nullable: true,
    }),
    __metadata("design:type", Object)
], RiceDiagnosisHistoryEntity.prototype, "predictedDiseaseKey", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'confidence',
        type: 'decimal',
        precision: 6,
        scale: 5,
        default: 0,
    }),
    __metadata("design:type", String)
], RiceDiagnosisHistoryEntity.prototype, "confidence", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'recommendation_level',
        type: 'enum',
        enum: RiceDiagnosisRecommendationLevel,
        default: RiceDiagnosisRecommendationLevel.LOW,
    }),
    __metadata("design:type", String)
], RiceDiagnosisHistoryEntity.prototype, "recommendationLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'model_version',
        type: 'varchar',
        length: 120,
        nullable: true,
    }),
    __metadata("design:type", Object)
], RiceDiagnosisHistoryEntity.prototype, "modelVersion", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'model_task',
        type: 'varchar',
        length: 80,
        nullable: true,
    }),
    __metadata("design:type", Object)
], RiceDiagnosisHistoryEntity.prototype, "modelTask", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'top_predictions',
        type: 'simple-json',
        nullable: true,
    }),
    __metadata("design:type", Object)
], RiceDiagnosisHistoryEntity.prototype, "topPredictions", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'raw_response',
        type: 'simple-json',
        nullable: true,
    }),
    __metadata("design:type", Object)
], RiceDiagnosisHistoryEntity.prototype, "rawResponse", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], RiceDiagnosisHistoryEntity.prototype, "createdAt", void 0);
exports.RiceDiagnosisHistoryEntity = RiceDiagnosisHistoryEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'rice_diagnosis_history' })
], RiceDiagnosisHistoryEntity);
//# sourceMappingURL=rice-diagnosis-history.entity.js.map