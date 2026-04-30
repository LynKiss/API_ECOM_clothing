import { Repository } from 'typeorm';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { ProductEntity } from '../products/entities/product.entity';
import { ApplyPriceDto, CalcPriceSuggestionDto } from './dto/price-suggestion.dto';
import { PriceSuggestionEntity } from './entities/price-suggestion.entity';
export declare class PricingService {
    private readonly repo;
    private readonly productRepo;
    private readonly auditLogs;
    constructor(repo: Repository<PriceSuggestionEntity>, productRepo: Repository<ProductEntity>, auditLogs: AuditLogsService);
    calculate(dto: CalcPriceSuggestionDto, userId?: string): Promise<{
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
    applyPrice(suggestionId: string, dto: ApplyPriceDto, userId?: string, performer?: {
        userId: string;
        username: string;
        ip?: string;
    }): Promise<PriceSuggestionEntity>;
    findByProduct(productId: string): Promise<PriceSuggestionEntity[]>;
    findAll(page?: number, limit?: number): Promise<{
        items: PriceSuggestionEntity[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    preview(dto: CalcPriceSuggestionDto): {
        landedCost: number;
        totalMarkupPct: number;
        rawRetail: number;
        suggestedRetail: number;
        unitPerBulk: number;
        bulkDiscountPct: number;
        suggestedBulk: number;
    };
}
