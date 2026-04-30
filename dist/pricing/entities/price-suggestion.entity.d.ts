export declare class PriceSuggestionEntity {
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
}
