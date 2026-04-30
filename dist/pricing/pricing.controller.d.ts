import { ApplyPriceDto, CalcPriceSuggestionDto } from './dto/price-suggestion.dto';
import { PricingService } from './pricing.service';
export declare class PricingController {
    private readonly service;
    constructor(service: PricingService);
    findAll(page?: string, limit?: string): Promise<{
        items: import("./entities/price-suggestion.entity").PriceSuggestionEntity[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findByProduct(productId: string): Promise<import("./entities/price-suggestion.entity").PriceSuggestionEntity[]>;
    preview(dto: CalcPriceSuggestionDto): {
        landedCost: number;
        totalMarkupPct: number;
        rawRetail: number;
        suggestedRetail: number;
        unitPerBulk: number;
        bulkDiscountPct: number;
        suggestedBulk: number;
    };
    calculate(dto: CalcPriceSuggestionDto, req: any): Promise<{
        breakdown: {
            landedCost: number;
            wastePct: number;
            sellingCostPct: number;
            profitPct: number;
            totalMarkupPct: number;
            rawRetailBeforeRound: number;
            suggestedRetail: number;
            unitPerBulk: number;
            bulkDiscountPct: number;
            suggestedBulk: number;
        };
        suggestionId: string;
        productId: string;
        grId: string | null;
        landedCost: string;
        wastePct: string;
        sellingCostPct: string;
        profitPct: string;
        bulkDiscountPct: string;
        unitPerBulk: number;
        suggestedRetail: string | null;
        suggestedBulk: string | null;
        appliedRetail: string | null;
        appliedBulk: string | null;
        appliedBy: string | null;
        appliedAt: Date | null;
        notes: string | null;
        createdBy: string | null;
        createdAt: Date;
    }>;
    applyPrice(id: string, dto: ApplyPriceDto, req: any): Promise<import("./entities/price-suggestion.entity").PriceSuggestionEntity>;
}
