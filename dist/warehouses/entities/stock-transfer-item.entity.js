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
exports.StockTransferItemEntity = void 0;
const typeorm_1 = require("typeorm");
const stock_transfer_entity_1 = require("./stock-transfer.entity");
let StockTransferItemEntity = class StockTransferItemEntity {
    itemId;
    transferId;
    productId;
    qtyRequested;
    qtyReceived;
    notes;
    transfer;
};
exports.StockTransferItemEntity = StockTransferItemEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'item_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], StockTransferItemEntity.prototype, "itemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transfer_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], StockTransferItemEntity.prototype, "transferId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], StockTransferItemEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_requested', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], StockTransferItemEntity.prototype, "qtyRequested", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_received', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], StockTransferItemEntity.prototype, "qtyReceived", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notes', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], StockTransferItemEntity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stock_transfer_entity_1.StockTransferEntity, (t) => t.items, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'transfer_id' }),
    __metadata("design:type", stock_transfer_entity_1.StockTransferEntity)
], StockTransferItemEntity.prototype, "transfer", void 0);
exports.StockTransferItemEntity = StockTransferItemEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'stock_transfer_items' })
], StockTransferItemEntity);
//# sourceMappingURL=stock-transfer-item.entity.js.map