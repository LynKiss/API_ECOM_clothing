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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
const product_entity_1 = require("../products/entities/product.entity");
const price_suggestion_entity_1 = require("./entities/price-suggestion.entity");
function calcSuggestedPrices(params) {
    const { landedCost, wastePct, sellingCostPct, profitPct, bulkDiscountPct, unitPerBulk } = params;
    const multiplier = 1 + (wastePct + sellingCostPct + profitPct) / 100;
    const rawRetail = landedCost * multiplier;
    const retail = Math.ceil(rawRetail / 1000) * 1000;
    const rawBulk = retail * unitPerBulk * (1 - bulkDiscountPct / 100);
    const bulk = Math.floor(rawBulk / 1000) * 1000;
    return { retail, bulk };
}
let PricingService = class PricingService {
    repo;
    productRepo;
    auditLogs;
    constructor(repo, productRepo, auditLogs) {
        this.repo = repo;
        this.productRepo = productRepo;
        this.auditLogs = auditLogs;
    }
    async calculate(dto, userId) {
        const wastePct = dto.wastePct ?? 0;
        const sellingCostPct = dto.sellingCostPct ?? 0;
        const bulkDiscountPct = dto.bulkDiscountPct ?? 0;
        const unitPerBulk = dto.unitPerBulk ?? 1;
        const { retail, bulk } = calcSuggestedPrices({
            landedCost: dto.landedCost,
            wastePct,
            sellingCostPct,
            profitPct: dto.profitPct,
            bulkDiscountPct,
            unitPerBulk,
        });
        const suggestion = this.repo.create({
            suggestionId: (0, uuid_1.v4)(),
            productId: dto.productId,
            grId: dto.grId ?? null,
            landedCost: String(dto.landedCost),
            wastePct: String(wastePct),
            sellingCostPct: String(sellingCostPct),
            profitPct: String(dto.profitPct),
            bulkDiscountPct: String(bulkDiscountPct),
            unitPerBulk,
            suggestedRetail: String(retail),
            suggestedBulk: String(bulk),
            notes: dto.notes ?? null,
            createdBy: userId ?? null,
        });
        await this.repo.save(suggestion);
        return {
            ...suggestion,
            breakdown: {
                landedCost: dto.landedCost,
                wastePct,
                sellingCostPct,
                profitPct: dto.profitPct,
                totalMarkupPct: wastePct + sellingCostPct + dto.profitPct,
                rawRetailBeforeRound: Math.round(dto.landedCost * (1 + (wastePct + sellingCostPct + dto.profitPct) / 100)),
                suggestedRetail: retail,
                unitPerBulk,
                bulkDiscountPct,
                suggestedBulk: bulk,
            },
        };
    }
    async applyPrice(suggestionId, dto, userId, performer) {
        const suggestion = await this.repo.findOne({ where: { suggestionId } });
        if (!suggestion)
            throw new common_1.NotFoundException('Không tìm thấy đề xuất giá');
        suggestion.appliedRetail = String(dto.retailPrice);
        suggestion.appliedBulk = dto.bulkPrice != null ? String(dto.bulkPrice) : null;
        suggestion.appliedBy = userId ?? null;
        suggestion.appliedAt = new Date();
        await this.repo.save(suggestion);
        const product = await this.productRepo.findOne({ where: { productId: suggestion.productId } });
        let priceBefore = null;
        if (product) {
            priceBefore = { product: product.productPrice, bulk: product.bulkPrice };
            product.productPrice = String(dto.retailPrice);
            if (dto.bulkPrice != null) {
                product.bulkPrice = String(dto.bulkPrice);
            }
            await this.productRepo.save(product);
        }
        void this.auditLogs.log({
            entityType: 'PRODUCT_PRICE',
            entityId: suggestion.productId,
            action: 'APPLY',
            changedBy: performer?.username,
            ipAddress: performer?.ip,
            beforeData: priceBefore ?? undefined,
            afterData: { retailPrice: dto.retailPrice, bulkPrice: dto.bulkPrice },
        });
        return suggestion;
    }
    async findByProduct(productId) {
        return this.repo.find({
            where: { productId },
            order: { createdAt: 'DESC' },
            take: 20,
        });
    }
    async findAll(page = 1, limit = 20) {
        const [items, total] = await this.repo.findAndCount({
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    preview(dto) {
        const wastePct = dto.wastePct ?? 0;
        const sellingCostPct = dto.sellingCostPct ?? 0;
        const bulkDiscountPct = dto.bulkDiscountPct ?? 0;
        const unitPerBulk = dto.unitPerBulk ?? 1;
        const { retail, bulk } = calcSuggestedPrices({
            landedCost: dto.landedCost,
            wastePct,
            sellingCostPct,
            profitPct: dto.profitPct,
            bulkDiscountPct,
            unitPerBulk,
        });
        return {
            landedCost: dto.landedCost,
            totalMarkupPct: wastePct + sellingCostPct + dto.profitPct,
            rawRetail: Math.round(dto.landedCost * (1 + (wastePct + sellingCostPct + dto.profitPct) / 100)),
            suggestedRetail: retail,
            unitPerBulk,
            bulkDiscountPct,
            suggestedBulk: bulk,
        };
    }
};
exports.PricingService = PricingService;
exports.PricingService = PricingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(price_suggestion_entity_1.PriceSuggestionEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.ProductEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        audit_logs_service_1.AuditLogsService])
], PricingService);
//# sourceMappingURL=pricing.service.js.map