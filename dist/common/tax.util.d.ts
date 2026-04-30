export interface TaxConfig {
    enabled: boolean;
    taxRate: number;
    taxInclusive: boolean;
}
export declare const DEFAULT_TAX_CONFIG: TaxConfig;
export interface TaxBreakdown {
    netAmount: number;
    vatAmount: number;
    grossAmount: number;
    taxRate: number;
    config: TaxConfig;
}
export declare function calculateTax(subtotal: number, config: TaxConfig): TaxBreakdown;
