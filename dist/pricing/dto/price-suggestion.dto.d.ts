export declare class CalcPriceSuggestionDto {
    productId: string;
    grId?: string;
    landedCost: number;
    wastePct?: number;
    sellingCostPct?: number;
    profitPct: number;
    bulkDiscountPct?: number;
    unitPerBulk?: number;
    notes?: string;
}
export declare class ApplyPriceDto {
    retailPrice: number;
    bulkPrice?: number;
}
