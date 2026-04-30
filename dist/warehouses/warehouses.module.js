"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehousesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const audit_logs_module_1 = require("../audit-logs/audit-logs.module");
const inventory_transaction_entity_1 = require("../products/entities/inventory-transaction.entity");
const product_entity_1 = require("../products/entities/product.entity");
const stock_adjustment_item_entity_1 = require("./entities/stock-adjustment-item.entity");
const stock_adjustment_entity_1 = require("./entities/stock-adjustment.entity");
const stock_transfer_item_entity_1 = require("./entities/stock-transfer-item.entity");
const stock_transfer_entity_1 = require("./entities/stock-transfer.entity");
const warehouse_stock_entity_1 = require("./entities/warehouse-stock.entity");
const warehouse_entity_1 = require("./entities/warehouse.entity");
const warehouses_controller_1 = require("./warehouses.controller");
const warehouses_service_1 = require("./warehouses.service");
let WarehousesModule = class WarehousesModule {
};
exports.WarehousesModule = WarehousesModule;
exports.WarehousesModule = WarehousesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                warehouse_entity_1.WarehouseEntity,
                warehouse_stock_entity_1.WarehouseStockEntity,
                stock_transfer_entity_1.StockTransferEntity,
                stock_transfer_item_entity_1.StockTransferItemEntity,
                stock_adjustment_entity_1.StockAdjustmentEntity,
                stock_adjustment_item_entity_1.StockAdjustmentItemEntity,
                product_entity_1.ProductEntity,
                inventory_transaction_entity_1.InventoryTransactionEntity,
            ]),
            audit_logs_module_1.AuditLogsModule,
        ],
        controllers: [warehouses_controller_1.WarehousesController],
        providers: [warehouses_service_1.WarehousesService],
        exports: [warehouses_service_1.WarehousesService, typeorm_1.TypeOrmModule],
    })
], WarehousesModule);
//# sourceMappingURL=warehouses.module.js.map