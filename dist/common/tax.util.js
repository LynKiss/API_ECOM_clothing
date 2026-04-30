"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_TAX_CONFIG = void 0;
exports.calculateTax = calculateTax;
exports.DEFAULT_TAX_CONFIG = {
    enabled: false,
    taxRate: 10,
    taxInclusive: true,
};
function calculateTax(subtotal, config) {
    if (!config.enabled || config.taxRate <= 0) {
        return {
            netAmount: subtotal,
            vatAmount: 0,
            grossAmount: subtotal,
            taxRate: 0,
            config,
        };
    }
    const rate = config.taxRate / 100;
    if (config.taxInclusive) {
        const netAmount = subtotal / (1 + rate);
        const vatAmount = subtotal - netAmount;
        return {
            netAmount: Math.round(netAmount * 100) / 100,
            vatAmount: Math.round(vatAmount * 100) / 100,
            grossAmount: subtotal,
            taxRate: config.taxRate,
            config,
        };
    }
    const vatAmount = Math.round(subtotal * rate * 100) / 100;
    return {
        netAmount: subtotal,
        vatAmount,
        grossAmount: subtotal + vatAmount,
        taxRate: config.taxRate,
        config,
    };
}
//# sourceMappingURL=tax.util.js.map