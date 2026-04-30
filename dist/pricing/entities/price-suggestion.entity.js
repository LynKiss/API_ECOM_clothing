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
exports.PriceSuggestionEntity = void 0;
const typeorm_1 = require("typeorm");
let PriceSuggestionEntity = class PriceSuggestionEntity {
    suggestionId;
    productId;
    grId;
    landedCost;
    wastePct;
    sellingCostPct;
    profitPct;
    bulkDiscountPct;
    unitPerBulk;
    suggestedRetail;
    suggestedBulk;
    appliedRetail;
    appliedBulk;
    appliedBy;
    appliedAt;
    notes;
    createdBy;
    createdAt;
};
exports.PriceSuggestionEntity = PriceSuggestionEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'suggestion_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], PriceSuggestionEntity.prototype, "suggestionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], PriceSuggestionEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gr_id', type: 'char', length: 36, nullable: true }),
    __metadata("design:type", Object)
], PriceSuggestionEntity.prototype, "grId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'landed_cost', type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", String)
], PriceSuggestionEntity.prototype, "landedCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'waste_pct', type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", String)
], PriceSuggestionEntity.prototype, "wastePct", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'selling_cost_pct', type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", String)
], PriceSuggestionEntity.prototype, "sellingCostPct", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'profit_pct', type: 'decimal', precision: 5, scale: 2, default: 30 }),
    __metadata("design:type", String)
], PriceSuggestionEntity.prototype, "profitPct", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bulk_discount_pct', type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", String)
], PriceSuggestionEntity.prototype, "bulkDiscountPct", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_per_bulk', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], PriceSuggestionEntity.prototype, "unitPerBulk", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'suggested_retail', type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], PriceSuggestionEntity.prototype, "suggestedRetail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'suggested_bulk', type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], PriceSuggestionEntity.prototype, "suggestedBulk", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'applied_retail', type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], PriceSuggestionEntity.prototype, "appliedRetail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'applied_bulk', type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], PriceSuggestionEntity.prototype, "appliedBulk", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'applied_by', type: 'char', length: 36, nullable: true }),
    __metadata("design:type", Object)
], PriceSuggestionEntity.prototype, "appliedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'applied_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], PriceSuggestionEntity.prototype, "appliedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notes', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], PriceSuggestionEntity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'char', length: 36, nullable: true }),
    __metadata("design:type", Object)
], PriceSuggestionEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], PriceSuggestionEntity.prototype, "createdAt", void 0);
exports.PriceSuggestionEntity = PriceSuggestionEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'price_suggestions' })
], PriceSuggestionEntity);
//# sourceMappingURL=price-suggestion.entity.js.map