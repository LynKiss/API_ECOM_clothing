"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcurementModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const audit_logs_module_1 = require("../audit-logs/audit-logs.module");
const inventory_transaction_entity_1 = require("../products/entities/inventory-transaction.entity");
const product_entity_1 = require("../products/entities/product.entity");
const product_variant_entity_1 = require("../products/entities/product-variant.entity");
const warehouse_entity_1 = require("../warehouses/entities/warehouse.entity");
const warehouse_stock_entity_1 = require("../warehouses/entities/warehouse-stock.entity");
const goods_receipt_item_entity_1 = require("./entities/goods-receipt-item.entity");
const goods_receipt_entity_1 = require("./entities/goods-receipt.entity");
const product_cost_history_entity_1 = require("./entities/product-cost-history.entity");
const purchase_order_item_entity_1 = require("./entities/purchase-order-item.entity");
const purchase_order_entity_1 = require("./entities/purchase-order.entity");
const supplier_return_item_entity_1 = require("./entities/supplier-return-item.entity");
const supplier_return_entity_1 = require("./entities/supplier-return.entity");
const procurement_controller_1 = require("./procurement.controller");
const procurement_service_1 = require("./procurement.service");
let ProcurementModule = class ProcurementModule {
};
exports.ProcurementModule = ProcurementModule;
exports.ProcurementModule = ProcurementModule = __decorate([
    (0, common_1.Module)({
        imports: [
            audit_logs_module_1.AuditLogsModule,
            typeorm_1.TypeOrmModule.forFeature([
                purchase_order_entity_1.PurchaseOrderEntity,
                purchase_order_item_entity_1.PurchaseOrderItemEntity,
                goods_receipt_entity_1.GoodsReceiptEntity,
                goods_receipt_item_entity_1.GoodsReceiptItemEntity,
                supplier_return_entity_1.SupplierReturnEntity,
                supplier_return_item_entity_1.SupplierReturnItemEntity,
                product_cost_history_entity_1.ProductCostHistoryEntity,
                product_entity_1.ProductEntity,
                product_variant_entity_1.ProductVariantEntity,
                inventory_transaction_entity_1.InventoryTransactionEntity,
                warehouse_entity_1.WarehouseEntity,
                warehouse_stock_entity_1.WarehouseStockEntity,
            ]),
        ],
        controllers: [procurement_controller_1.ProcurementController],
        providers: [procurement_service_1.ProcurementService],
        exports: [procurement_service_1.ProcurementService, typeorm_1.TypeOrmModule],
    })
], ProcurementModule);
//# sourceMappingURL=procurement.module.js.map