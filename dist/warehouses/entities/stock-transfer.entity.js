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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockTransferEntity = exports.StockTransferStatus = void 0;
const typeorm_1 = require("typeorm");
const stock_transfer_item_entity_1 = require("./stock-transfer-item.entity");
var StockTransferStatus;
(function (StockTransferStatus) {
    StockTransferStatus["DRAFT"] = "draft";
    StockTransferStatus["SHIPPING"] = "shipping";
    StockTransferStatus["RECEIVED"] = "received";
    StockTransferStatus["CANCELLED"] = "cancelled";
})(StockTransferStatus || (exports.StockTransferStatus = StockTransferStatus = {}));
let StockTransferEntity = class StockTransferEntity {
    transferId;
    transferCode;
    fromWarehouseId;
    toWarehouseId;
    status;
    transferDate;
    receivedDate;
    notes;
    createdBy;
    items;
    createdAt;
    updatedAt;
};
exports.StockTransferEntity = StockTransferEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'transfer_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], StockTransferEntity.prototype, "transferId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transfer_code', type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], StockTransferEntity.prototype, "transferCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'from_warehouse_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], StockTransferEntity.prototype, "fromWarehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'to_warehouse_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], StockTransferEntity.prototype, "toWarehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', enum: StockTransferStatus, default: StockTransferStatus.DRAFT }),
    __metadata("design:type", String)
], StockTransferEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transfer_date', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], StockTransferEntity.prototype, "transferDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'received_date', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], StockTransferEntity.prototype, "receivedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notes', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], StockTransferEntity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'char', length: 36, nullable: true }),
    __metadata("design:type", Object)
], StockTransferEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => stock_transfer_item_entity_1.StockTransferItemEntity, (item) => item.transfer, { cascade: true, eager: false }),
    __metadata("design:type", Array)
], StockTransferEntity.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], StockTransferEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], StockTransferEntity.prototype, "updatedAt", void 0);
exports.StockTransferEntity = StockTransferEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'stock_transfers' })
], StockTransferEntity);
//# sourceMappingURL=stock-transfer.entity.js.map