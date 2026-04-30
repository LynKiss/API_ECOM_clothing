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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const customize_1 = require("../decorator/customize");
const csv_export_util_1 = require("../common/csv-export.util");
const query_coupon_usage_dto_1 = require("./dto/query-coupon-usage.dto");
const query_inventory_ledger_dto_1 = require("./dto/query-inventory-ledger.dto");
const query_sales_summary_dto_1 = require("./dto/query-sales-summary.dto");
const reports_service_1 = require("./reports.service");
let ReportsController = class ReportsController {
    reportsService;
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    getDashboard() {
        return this.reportsService.getDashboard();
    }
    getSalesSummary(query) {
        return this.reportsService.getSalesSummary(query);
    }
    getCouponUsage(query) {
        return this.reportsService.getCouponUsage(query);
    }
    getInventoryLedger(query) {
        return this.reportsService.getInventoryLedger(query);
    }
    getInventoryValuation() {
        return this.reportsService.getInventoryValuation();
    }
    getProfitability(query) {
        return this.reportsService.getProfitability(query);
    }
    getAgingDebt(query) {
        return this.reportsService.getAgingDebt(query);
    }
    recordPoPayment(dto, user) {
        return this.reportsService.recordPoPayment(dto, user?.userId);
    }
    async exportInventoryValuation(res) {
        const data = await this.reportsService.getInventoryValuation();
        const csv = (0, csv_export_util_1.toCsv)(data.items, [
            { key: 'productId', header: 'Mã SP' },
            { key: 'productName', header: 'Tên sản phẩm' },
            { key: 'qtyAvailable', header: 'Tồn khả dụng' },
            { key: 'qtyReserved', header: 'Đang giữ' },
            { key: 'totalQty', header: 'Tổng SL' },
            { key: 'avgCost', header: 'Giá vốn TB' },
            { key: 'retailPrice', header: 'Giá bán' },
            { key: 'totalValue', header: 'Giá trị tồn' },
            { key: 'potentialRevenue', header: 'Doanh thu tiềm năng' },
            { key: 'potentialProfit', header: 'Lãi tiềm năng' },
        ]);
        const headers = (0, csv_export_util_1.csvResponseHeaders)(`inventory-valuation-${new Date().toISOString().slice(0, 10)}.csv`);
        Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v));
        res.send(csv);
    }
    async exportInventoryLedger(query, res) {
        const data = await this.reportsService.getInventoryLedger({
            ...query,
            page: 1,
            limit: 10000,
        });
        const csv = (0, csv_export_util_1.toCsv)(data.items, [
            { key: 'transactionId', header: 'ID' },
            { key: 'productName', header: 'Sản phẩm' },
            { key: 'transactionType', header: 'Loại' },
            { key: 'quantityChange', header: 'SL thay đổi' },
            { key: 'quantityBefore', header: 'SL trước' },
            { key: 'quantityAfter', header: 'SL sau' },
            { key: 'unitCostAtTime', header: 'Đơn giá' },
            { key: 'referenceType', header: 'Tham chiếu' },
            { key: 'referenceId', header: 'Mã TC' },
            { key: 'note', header: 'Ghi chú' },
            { key: 'createdAt', header: 'Thời gian' },
        ]);
        const headers = (0, csv_export_util_1.csvResponseHeaders)(`inventory-ledger-${new Date().toISOString().slice(0, 10)}.csv`);
        Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v));
        res.send(csv);
    }
    async exportProfitability(query, res) {
        const data = await this.reportsService.getProfitability({
            ...query,
            page: 1,
            limit: 10000,
        });
        const csv = (0, csv_export_util_1.toCsv)(data.items ?? [], [
            { key: 'productName', header: 'Sản phẩm' },
            { key: 'soldQty', header: 'SL bán' },
            { key: 'revenue', header: 'Doanh thu' },
            { key: 'cogs', header: 'Giá vốn' },
            { key: 'grossProfit', header: 'Lãi gộp' },
            { key: 'marginPct', header: 'Tỷ suất (%)' },
        ]);
        const headers = (0, csv_export_util_1.csvResponseHeaders)(`profitability-${new Date().toISOString().slice(0, 10)}.csv`);
        Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v));
        res.send(csv);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, customize_1.RequirePermissions)('manage_reports'),
    (0, customize_1.ResponseMessage)('Get dashboard report'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('sales-summary'),
    (0, customize_1.RequirePermissions)('manage_reports'),
    (0, customize_1.ResponseMessage)('Get sales summary'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_sales_summary_dto_1.QuerySalesSummaryDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getSalesSummary", null);
__decorate([
    (0, common_1.Get)('coupon-usage'),
    (0, customize_1.RequirePermissions)('manage_reports'),
    (0, customize_1.ResponseMessage)('Get coupon usage report'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_coupon_usage_dto_1.QueryCouponUsageDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getCouponUsage", null);
__decorate([
    (0, common_1.Get)('inventory-ledger'),
    (0, customize_1.ResponseMessage)('Get inventory ledger'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_inventory_ledger_dto_1.QueryInventoryLedgerDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getInventoryLedger", null);
__decorate([
    (0, common_1.Get)('inventory-valuation'),
    (0, customize_1.ResponseMessage)('Get inventory valuation'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getInventoryValuation", null);
__decorate([
    (0, common_1.Get)('profitability'),
    (0, customize_1.ResponseMessage)('Get profitability report'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_inventory_ledger_dto_1.QueryProfitabilityDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getProfitability", null);
__decorate([
    (0, common_1.Get)('aging-debt'),
    (0, customize_1.ResponseMessage)('Get aging debt report'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_inventory_ledger_dto_1.QueryAgingDebtDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getAgingDebt", null);
__decorate([
    (0, common_1.Post)('record-po-payment'),
    (0, customize_1.ResponseMessage)('Record PO payment'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, customize_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_inventory_ledger_dto_1.RecordPoPaymentDto, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "recordPoPayment", null);
__decorate([
    (0, common_1.Get)('inventory-valuation/export'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportInventoryValuation", null);
__decorate([
    (0, common_1.Get)('inventory-ledger/export'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_inventory_ledger_dto_1.QueryInventoryLedgerDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportInventoryLedger", null);
__decorate([
    (0, common_1.Get)('profitability/export'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_inventory_ledger_dto_1.QueryProfitabilityDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportProfitability", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map