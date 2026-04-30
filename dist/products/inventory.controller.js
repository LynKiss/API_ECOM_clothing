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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const customize_1 = require("../decorator/customize");
const adjust_inventory_dto_1 = require("./dto/adjust-inventory.dto");
const import_inventory_dto_1 = require("./dto/import-inventory.dto");
const query_inventory_transactions_dto_1 = require("./dto/query-inventory-transactions.dto");
const record_damage_return_dto_1 = require("./dto/record-damage-return.dto");
const products_service_1 = require("./products.service");
let InventoryController = class InventoryController {
    productsService;
    constructor(productsService) {
        this.productsService = productsService;
    }
    getInventoryTransactions(query) {
        return this.productsService.findInventoryTransactions(query);
    }
    importInventory(currentUser, dto) {
        return this.productsService.importInventory(currentUser._id, dto);
    }
    adjustInventory(currentUser, dto) {
        return this.productsService.adjustInventory(currentUser._id, dto);
    }
    recordDamage(currentUser, dto) {
        return this.productsService.recordDamage(currentUser._id, dto);
    }
    recordReturn(currentUser, dto) {
        return this.productsService.recordReturn(currentUser._id, dto);
    }
    getInventorySummary() {
        return this.productsService.getInventorySummary();
    }
    getLowStockProducts(threshold) {
        return this.productsService.getLowStockProducts(threshold ? Number(threshold) : 10);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)('transactions'),
    (0, customize_1.RequirePermissions)('manage_inventory'),
    (0, customize_1.ResponseMessage)('Get inventory transactions'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_inventory_transactions_dto_1.QueryInventoryTransactionsDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getInventoryTransactions", null);
__decorate([
    (0, common_1.Post)('transactions/import'),
    (0, customize_1.RequirePermissions)('manage_inventory'),
    (0, customize_1.ResponseMessage)('Import inventory'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, import_inventory_dto_1.ImportInventoryDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "importInventory", null);
__decorate([
    (0, common_1.Post)('transactions/adjust'),
    (0, customize_1.RequirePermissions)('manage_inventory'),
    (0, customize_1.ResponseMessage)('Adjust inventory'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, adjust_inventory_dto_1.AdjustInventoryDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "adjustInventory", null);
__decorate([
    (0, common_1.Post)('transactions/damage'),
    (0, customize_1.RequirePermissions)('manage_inventory'),
    (0, customize_1.ResponseMessage)('Record damaged goods'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, record_damage_return_dto_1.RecordDamageDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "recordDamage", null);
__decorate([
    (0, common_1.Post)('transactions/return'),
    (0, customize_1.RequirePermissions)('manage_inventory'),
    (0, customize_1.ResponseMessage)('Record returned goods'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, record_damage_return_dto_1.RecordReturnDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "recordReturn", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, customize_1.RequirePermissions)('manage_inventory'),
    (0, customize_1.ResponseMessage)('Get inventory summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getInventorySummary", null);
__decorate([
    (0, common_1.Get)('low-stock'),
    (0, customize_1.RequirePermissions)('manage_inventory'),
    (0, customize_1.ResponseMessage)('Get low stock products'),
    __param(0, (0, common_1.Query)('threshold')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getLowStockProducts", null);
exports.InventoryController = InventoryController = __decorate([
    (0, common_1.Controller)('inventory'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map