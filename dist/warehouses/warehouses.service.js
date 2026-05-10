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
exports.WarehousesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
const inventory_transaction_entity_1 = require("../products/entities/inventory-transaction.entity");
const product_entity_1 = require("../products/entities/product.entity");
const stock_adjustment_entity_1 = require("./entities/stock-adjustment.entity");
const stock_adjustment_item_entity_1 = require("./entities/stock-adjustment-item.entity");
const stock_transfer_entity_1 = require("./entities/stock-transfer.entity");
const stock_transfer_item_entity_1 = require("./entities/stock-transfer-item.entity");
const warehouse_entity_1 = require("./entities/warehouse.entity");
const warehouse_stock_entity_1 = require("./entities/warehouse-stock.entity");
function genCode(prefix) {
    const now = new Date();
    const ymd = now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0');
    const rand = Math.floor(Math.random() * 9000 + 1000);
    return `${prefix}-${ymd}-${rand}`;
}
function toPositiveInt(value, field) {
    const n = Number(value);
    if (!Number.isInteger(n) || n <= 0) {
        throw new common_1.BadRequestException(`${field} phai la so nguyen duong`);
    }
    return n;
}
function toNonNegativeInt(value, field) {
    const n = Number(value);
    if (!Number.isInteger(n) || n < 0) {
        throw new common_1.BadRequestException(`${field} phai la so nguyen khong am`);
    }
    return n;
}
function parseOptionalDate(value, field) {
    if (!value)
        return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        throw new common_1.BadRequestException(`${field} khong hop le`);
    }
    return date;
}
let WarehousesService = class WarehousesService {
    whRepo;
    wsRepo;
    transferRepo;
    transferItemRepo;
    adjRepo;
    adjItemRepo;
    productRepo;
    txRepo;
    dataSource;
    auditLogs;
    constructor(whRepo, wsRepo, transferRepo, transferItemRepo, adjRepo, adjItemRepo, productRepo, txRepo, dataSource, auditLogs) {
        this.whRepo = whRepo;
        this.wsRepo = wsRepo;
        this.transferRepo = transferRepo;
        this.transferItemRepo = transferItemRepo;
        this.adjRepo = adjRepo;
        this.adjItemRepo = adjItemRepo;
        this.productRepo = productRepo;
        this.txRepo = txRepo;
        this.dataSource = dataSource;
        this.auditLogs = auditLogs;
    }
    findAll() {
        return this.whRepo.find({ order: { isDefault: 'DESC', name: 'ASC' } });
    }
    async findOne(id) {
        const wh = await this.whRepo.findOne({ where: { warehouseId: id } });
        if (!wh)
            throw new common_1.NotFoundException('Không tìm thấy kho hàng');
        return wh;
    }
    async create(dto, performer) {
        const name = dto.name?.trim();
        if (!name)
            throw new common_1.BadRequestException('Ten kho la bat buoc');
        const wh = this.whRepo.create({
            warehouseId: (0, uuid_1.v4)(),
            name,
            code: dto.code?.trim() || null,
            address: dto.address?.trim() || null,
            managerName: dto.managerName?.trim() || null,
            phone: dto.phone?.trim() || null,
            isActive: true,
            isDefault: false,
        });
        const saved = await this.whRepo.save(wh);
        void this.auditLogs.log({
            entityType: 'WAREHOUSE',
            entityId: saved.warehouseId,
            action: 'CREATE',
            changedBy: performer?.username,
            ipAddress: performer?.ip,
            afterData: { name: saved.name, code: saved.code },
        });
        return saved;
    }
    async update(id, dto, performer) {
        const wh = await this.findOne(id);
        const before = { name: wh.name, code: wh.code, isActive: wh.isActive };
        if (dto.name !== undefined) {
            const name = dto.name?.trim();
            if (!name)
                throw new common_1.BadRequestException('Ten kho la bat buoc');
            wh.name = name;
        }
        if (dto.code !== undefined)
            wh.code = dto.code?.trim() || null;
        if (dto.address !== undefined)
            wh.address = dto.address?.trim() || null;
        if (dto.managerName !== undefined)
            wh.managerName = dto.managerName?.trim() || null;
        if (dto.phone !== undefined)
            wh.phone = dto.phone?.trim() || null;
        if (dto.isActive !== undefined)
            wh.isActive = Boolean(dto.isActive);
        const saved = await this.whRepo.save(wh);
        void this.auditLogs.log({
            entityType: 'WAREHOUSE',
            entityId: id,
            action: 'UPDATE',
            changedBy: performer?.username,
            ipAddress: performer?.ip,
            beforeData: before,
            afterData: { name: saved.name, code: saved.code, isActive: saved.isActive },
        });
        return saved;
    }
    async setDefault(id) {
        await this.dataSource.transaction(async (em) => {
            const warehouse = await em.findOne(warehouse_entity_1.WarehouseEntity, {
                where: { warehouseId: id },
                lock: { mode: 'pessimistic_write' },
            });
            if (!warehouse)
                throw new common_1.NotFoundException('KhÃ´ng tÃ¬m tháº¥y kho hÃ ng');
            await em
                .createQueryBuilder()
                .update(warehouse_entity_1.WarehouseEntity)
                .set({ isDefault: false })
                .where('is_default = :isDefault', { isDefault: true })
                .execute();
            warehouse.isDefault = true;
            await em.save(warehouse_entity_1.WarehouseEntity, warehouse);
        });
        return this.findOne(id);
    }
    async getStock(warehouseId) {
        await this.findOne(warehouseId);
        return this.wsRepo
            .createQueryBuilder('ws')
            .where('ws.warehouseId = :warehouseId', { warehouseId })
            .leftJoinAndMapOne('ws.product', product_entity_1.ProductEntity, 'p', 'p.productId = ws.productId')
            .orderBy('ws.quantity', 'DESC')
            .getMany();
    }
    async findAllTransfers(page = 1, limit = 20, status) {
        const qb = this.transferRepo.createQueryBuilder('t').orderBy('t.createdAt', 'DESC');
        if (status && status !== 'all')
            qb.andWhere('t.status = :status', { status });
        const total = await qb.getCount();
        const items = await qb.skip((page - 1) * limit).take(limit).getMany();
        return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    async findOneTransfer(id) {
        const t = await this.transferRepo.findOne({ where: { transferId: id }, relations: ['items'] });
        if (!t)
            throw new common_1.NotFoundException('Không tìm thấy phiếu chuyển kho');
        return t;
    }
    async createTransfer(dto, userId) {
        if (!dto.fromWarehouseId || !dto.toWarehouseId) {
            throw new common_1.BadRequestException('Phai chon kho nguon va kho dich');
        }
        if (dto.fromWarehouseId === dto.toWarehouseId) {
            throw new common_1.BadRequestException('Kho nguồn và kho đích không được giống nhau');
        }
        if (!Array.isArray(dto.items) || dto.items.length === 0) {
            throw new common_1.BadRequestException('Phieu chuyen kho phai co it nhat mot dong hang');
        }
        const fromWarehouse = await this.whRepo.findOne({ where: { warehouseId: dto.fromWarehouseId } });
        const toWarehouse = await this.whRepo.findOne({ where: { warehouseId: dto.toWarehouseId } });
        if (!fromWarehouse?.isActive)
            throw new common_1.BadRequestException('Kho nguon khong kha dung');
        if (!toWarehouse?.isActive)
            throw new common_1.BadRequestException('Kho dich khong kha dung');
        const seenProducts = new Set();
        const lines = [];
        for (const item of dto.items) {
            if (!item.productId)
                throw new common_1.BadRequestException('Dong hang thieu san pham');
            if (seenProducts.has(item.productId)) {
                throw new common_1.BadRequestException('Khong duoc lap san pham trong cung mot phieu chuyen');
            }
            seenProducts.add(item.productId);
            const product = await this.productRepo.findOne({ where: { productId: item.productId } });
            if (!product)
                throw new common_1.BadRequestException(`San pham ${item.productId} khong ton tai`);
            lines.push({
                productId: item.productId,
                qtyRequested: toPositiveInt(item.qtyRequested, 'qtyRequested'),
                notes: item.notes?.trim() || null,
            });
        }
        const transfer = this.transferRepo.create({
            transferId: (0, uuid_1.v4)(),
            transferCode: genCode('TR'),
            fromWarehouseId: dto.fromWarehouseId,
            toWarehouseId: dto.toWarehouseId,
            status: stock_transfer_entity_1.StockTransferStatus.DRAFT,
            transferDate: parseOptionalDate(dto.transferDate, 'transferDate'),
            notes: dto.notes?.trim() || null,
            createdBy: userId ?? null,
        });
        transfer.items = lines.map((i) => this.transferItemRepo.create({
            transferId: transfer.transferId,
            productId: i.productId,
            qtyRequested: i.qtyRequested,
            qtyReceived: 0,
            notes: i.notes,
        }));
        return this.transferRepo.save(transfer);
    }
    async shipTransfer(id, userId, performer) {
        const t = await this.findOneTransfer(id);
        if (t.status !== stock_transfer_entity_1.StockTransferStatus.DRAFT) {
            throw new common_1.BadRequestException('Phiếu chuyển kho đã được xử lý');
        }
        await this.dataSource.transaction(async (em) => {
            const lockedTransfer = await em.findOne(stock_transfer_entity_1.StockTransferEntity, {
                where: { transferId: id },
                relations: ['items'],
                lock: { mode: 'pessimistic_write' },
            });
            if (!lockedTransfer)
                throw new common_1.NotFoundException('Khong tim thay phieu chuyen kho');
            if (lockedTransfer.status !== stock_transfer_entity_1.StockTransferStatus.DRAFT) {
                throw new common_1.BadRequestException('Phieu chuyen kho da duoc xu ly');
            }
            for (const item of lockedTransfer.items) {
                const fromStock = await em.findOne(warehouse_stock_entity_1.WarehouseStockEntity, {
                    where: { warehouseId: lockedTransfer.fromWarehouseId, productId: item.productId },
                    lock: { mode: 'pessimistic_write' },
                });
                if (!fromStock || fromStock.quantity < item.qtyRequested) {
                    throw new common_1.BadRequestException(`Kho nguồn không đủ hàng cho sản phẩm ${item.productId}`);
                }
                fromStock.quantity -= item.qtyRequested;
                await em.save(warehouse_stock_entity_1.WarehouseStockEntity, fromStock);
                await em.save(inventory_transaction_entity_1.InventoryTransactionEntity, em.create(inventory_transaction_entity_1.InventoryTransactionEntity, {
                    productId: item.productId,
                    performedBy: userId ?? null,
                    transactionType: inventory_transaction_entity_1.InventoryTransactionType.EXPORT,
                    quantityChange: -item.qtyRequested,
                    referenceType: 'TR',
                    referenceId: lockedTransfer.transferId,
                    note: `Xuất kho chuyển theo phiếu ${t.transferCode}`,
                    relatedOrderId: null,
                }));
            }
            await em.update(stock_transfer_entity_1.StockTransferEntity, { transferId: id }, { status: stock_transfer_entity_1.StockTransferStatus.SHIPPED });
        });
        void this.auditLogs.log({
            entityType: 'STOCK_TRANSFER',
            entityId: id,
            action: 'SHIP',
            changedBy: performer?.username,
            ipAddress: performer?.ip,
            afterData: { transferCode: t.transferCode, status: 'SHIPPED' },
        });
        return this.findOneTransfer(id);
    }
    async receiveTransfer(id, receivedItems, userId, performer) {
        if (!Array.isArray(receivedItems) || receivedItems.length === 0) {
            throw new common_1.BadRequestException('Danh sach hang nhan khong duoc rong');
        }
        const t = await this.findOneTransfer(id);
        if (t.status !== stock_transfer_entity_1.StockTransferStatus.SHIPPED) {
            throw new common_1.BadRequestException('Phiếu chưa ở trạng thái đang vận chuyển');
        }
        await this.dataSource.transaction(async (em) => {
            const lockedTransfer = await em.findOne(stock_transfer_entity_1.StockTransferEntity, {
                where: { transferId: id },
                relations: ['items'],
                lock: { mode: 'pessimistic_write' },
            });
            if (!lockedTransfer)
                throw new common_1.NotFoundException('Khong tim thay phieu chuyen kho');
            if (lockedTransfer.status !== stock_transfer_entity_1.StockTransferStatus.SHIPPED) {
                throw new common_1.BadRequestException('Phieu chua o trang thai da xuat kho');
            }
            Object.assign(t, lockedTransfer);
            t.items = lockedTransfer.items;
            const transferItems = new Map(t.items.map((item) => [item.productId, item]));
            const seenReceived = new Set();
            for (const recv of receivedItems) {
                const item = transferItems.get(recv.productId);
                if (!item)
                    throw new common_1.BadRequestException(`San pham ${recv.productId} khong thuoc phieu chuyen`);
                if (seenReceived.has(recv.productId)) {
                    throw new common_1.BadRequestException('Khong duoc lap san pham khi nhan hang');
                }
                seenReceived.add(recv.productId);
                const qtyReceived = toNonNegativeInt(recv.qtyReceived, 'qtyReceived');
                if (qtyReceived > item.qtyRequested) {
                    throw new common_1.BadRequestException(`So luong nhan cua ${recv.productId} vuot so luong yeu cau`);
                }
            }
            for (const item of t.items) {
                if (!seenReceived.has(item.productId)) {
                    throw new common_1.BadRequestException(`Thieu so luong nhan cho san pham ${item.productId}`);
                }
            }
            for (const recv of receivedItems) {
                const qtyReceived = toNonNegativeInt(recv.qtyReceived, 'qtyReceived');
                let toStock = await em.findOne(warehouse_stock_entity_1.WarehouseStockEntity, {
                    where: { warehouseId: t.toWarehouseId, productId: recv.productId },
                    lock: { mode: 'pessimistic_write' },
                });
                if (!toStock) {
                    toStock = em.create(warehouse_stock_entity_1.WarehouseStockEntity, {
                        warehouseId: t.toWarehouseId,
                        productId: recv.productId,
                        quantity: 0,
                    });
                }
                toStock.quantity += qtyReceived;
                await em.save(warehouse_stock_entity_1.WarehouseStockEntity, toStock);
                await em
                    .createQueryBuilder()
                    .update(stock_transfer_item_entity_1.StockTransferItemEntity)
                    .set({ qtyReceived })
                    .where('transfer_id = :tid AND product_id = :pid', { tid: id, pid: recv.productId })
                    .execute();
                await em.save(inventory_transaction_entity_1.InventoryTransactionEntity, em.create(inventory_transaction_entity_1.InventoryTransactionEntity, {
                    productId: recv.productId,
                    performedBy: userId ?? null,
                    transactionType: inventory_transaction_entity_1.InventoryTransactionType.IMPORT,
                    quantityChange: qtyReceived,
                    referenceType: 'TR',
                    referenceId: t.transferId,
                    note: `Nhập kho nhận từ phiếu chuyển ${t.transferCode}`,
                    relatedOrderId: null,
                }));
            }
            await em.update(stock_transfer_entity_1.StockTransferEntity, { transferId: id }, {
                status: stock_transfer_entity_1.StockTransferStatus.RECEIVED,
                receivedDate: new Date(),
            });
        });
        void this.auditLogs.log({
            entityType: 'STOCK_TRANSFER',
            entityId: id,
            action: 'RECEIVE',
            changedBy: performer?.username,
            ipAddress: performer?.ip,
            afterData: { transferCode: t.transferCode, status: 'RECEIVED' },
        });
        return this.findOneTransfer(id);
    }
    async findAllAdjustments(page = 1, limit = 20, status) {
        const qb = this.adjRepo.createQueryBuilder('a').orderBy('a.createdAt', 'DESC');
        if (status && status !== 'all')
            qb.andWhere('a.status = :status', { status });
        const total = await qb.getCount();
        const items = await qb.skip((page - 1) * limit).take(limit).getMany();
        return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    async findOneAdjustment(id) {
        const a = await this.adjRepo.findOne({ where: { adjustmentId: id }, relations: ['items'] });
        if (!a)
            throw new common_1.NotFoundException('Không tìm thấy phiếu điều chỉnh kho');
        return a;
    }
    async createAdjustment(dto, userId) {
        if (!Object.values(stock_adjustment_entity_1.AdjustmentReason).includes(dto.reason)) {
            throw new common_1.BadRequestException('Ly do dieu chinh khong hop le');
        }
        if (!Array.isArray(dto.items) || dto.items.length === 0) {
            throw new common_1.BadRequestException('Phieu dieu chinh phai co it nhat mot dong hang');
        }
        const warehouseId = dto.warehouseId?.trim() || null;
        if (warehouseId) {
            const warehouse = await this.whRepo.findOne({ where: { warehouseId } });
            if (!warehouse?.isActive)
                throw new common_1.BadRequestException('Kho dieu chinh khong kha dung');
        }
        const seenProducts = new Set();
        const lines = [];
        for (const item of dto.items) {
            if (!item.productId)
                throw new common_1.BadRequestException('Dong hang thieu san pham');
            if (seenProducts.has(item.productId)) {
                throw new common_1.BadRequestException('Khong duoc lap san pham trong cung mot phieu dieu chinh');
            }
            seenProducts.add(item.productId);
            const product = await this.productRepo.findOne({ where: { productId: item.productId } });
            if (!product)
                throw new common_1.BadRequestException(`San pham ${item.productId} khong ton tai`);
            const stock = warehouseId
                ? await this.wsRepo.findOne({ where: { warehouseId, productId: item.productId } })
                : null;
            const qtyBefore = warehouseId ? stock?.quantity ?? 0 : product.quantityAvailable;
            const qtyAfter = toNonNegativeInt(item.qtyAfter, 'qtyAfter');
            lines.push({
                productId: item.productId,
                qtyBefore,
                qtyAfter,
                qtyDiff: qtyAfter - qtyBefore,
                notes: item.notes?.trim() || null,
            });
        }
        const adj = this.adjRepo.create({
            adjustmentId: (0, uuid_1.v4)(),
            adjustmentCode: genCode('ADJ'),
            warehouseId,
            reason: dto.reason,
            status: stock_adjustment_entity_1.AdjustmentStatus.DRAFT,
            adjustmentDate: parseOptionalDate(dto.adjustmentDate, 'adjustmentDate'),
            notes: dto.notes?.trim() || null,
            createdBy: userId ?? null,
        });
        adj.items = lines.map((i) => this.adjItemRepo.create({
            adjustmentId: adj.adjustmentId,
            productId: i.productId,
            qtyBefore: i.qtyBefore,
            qtyAfter: i.qtyAfter,
            qtyDiff: i.qtyDiff,
            notes: i.notes,
        }));
        return this.adjRepo.save(adj);
    }
    async approveAdjustment(id, userId, performer) {
        const adj = await this.findOneAdjustment(id);
        if (adj.status !== stock_adjustment_entity_1.AdjustmentStatus.DRAFT) {
            throw new common_1.BadRequestException('Phiếu điều chỉnh đã được xử lý');
        }
        await this.dataSource.transaction(async (em) => {
            const warehouseId = adj.warehouseId ??
                (await em.findOne(warehouse_entity_1.WarehouseEntity, { where: { isDefault: true } }))
                    ?.warehouseId ??
                null;
            const adjustsSpecificWarehouse = Boolean(adj.warehouseId);
            for (const item of adj.items) {
                const product = await em.findOne(product_entity_1.ProductEntity, {
                    where: { productId: item.productId },
                    lock: { mode: 'pessimistic_write' },
                });
                if (!product)
                    continue;
                let stockBefore = product.quantityAvailable;
                let qtyDiff = item.qtyAfter - stockBefore;
                let stock = null;
                if (adjustsSpecificWarehouse && warehouseId) {
                    stock = await em.findOne(warehouse_stock_entity_1.WarehouseStockEntity, {
                        where: { warehouseId, productId: item.productId },
                        lock: { mode: 'pessimistic_write' },
                    });
                    stockBefore = stock?.quantity ?? 0;
                    qtyDiff = item.qtyAfter - stockBefore;
                }
                const productQtyBefore = product.quantityAvailable;
                const productQtyAfter = adjustsSpecificWarehouse ? product.quantityAvailable + qtyDiff : item.qtyAfter;
                if (productQtyAfter < 0) {
                    throw new common_1.BadRequestException(`Ton kho tong cua san pham ${item.productId} bi am`);
                }
                product.quantityAvailable = productQtyAfter;
                await em.save(product_entity_1.ProductEntity, product);
                item.qtyBefore = stockBefore;
                item.qtyDiff = qtyDiff;
                await em.save(stock_adjustment_item_entity_1.StockAdjustmentItemEntity, item);
                if (!adjustsSpecificWarehouse && warehouseId) {
                    stock = await em.findOne(warehouse_stock_entity_1.WarehouseStockEntity, {
                        where: { warehouseId, productId: item.productId },
                        lock: { mode: 'pessimistic_write' },
                    });
                }
                if (qtyDiff !== 0) {
                    const txType = qtyDiff > 0
                        ? inventory_transaction_entity_1.InventoryTransactionType.ADJUSTMENT
                        : inventory_transaction_entity_1.InventoryTransactionType.DAMAGE;
                    await em.save(inventory_transaction_entity_1.InventoryTransactionEntity, em.create(inventory_transaction_entity_1.InventoryTransactionEntity, {
                        productId: item.productId,
                        performedBy: userId ?? null,
                        transactionType: txType,
                        quantityChange: qtyDiff,
                        quantityBefore: productQtyBefore,
                        quantityAfter: product.quantityAvailable,
                        referenceType: 'ADJ',
                        referenceId: adj.adjustmentId,
                        note: `Điều chỉnh kho theo phiếu ${adj.adjustmentCode} — lý do: ${adj.reason}`,
                        relatedOrderId: null,
                    }));
                    if (warehouseId) {
                        if (stock) {
                            stock.quantity = adjustsSpecificWarehouse ? item.qtyAfter : Math.max(0, stock.quantity + qtyDiff);
                            await em.save(warehouse_stock_entity_1.WarehouseStockEntity, stock);
                        }
                        else if (adjustsSpecificWarehouse || qtyDiff > 0) {
                            await em.save(warehouse_stock_entity_1.WarehouseStockEntity, em.create(warehouse_stock_entity_1.WarehouseStockEntity, {
                                warehouseId,
                                productId: item.productId,
                                quantity: adjustsSpecificWarehouse ? item.qtyAfter : qtyDiff,
                            }));
                        }
                    }
                }
            }
            await em.update(stock_adjustment_entity_1.StockAdjustmentEntity, { adjustmentId: id }, {
                status: stock_adjustment_entity_1.AdjustmentStatus.APPROVED,
                approvedBy: userId ?? null,
                approvedAt: new Date(),
            });
        });
        void this.auditLogs.log({
            entityType: 'STOCK_ADJUSTMENT',
            entityId: id,
            action: 'APPROVE',
            changedBy: performer?.username,
            ipAddress: performer?.ip,
            afterData: { adjustmentCode: adj.adjustmentCode, reason: adj.reason },
        });
        return this.findOneAdjustment(id);
    }
    async cancelAdjustment(id) {
        const adj = await this.findOneAdjustment(id);
        if (adj.status === stock_adjustment_entity_1.AdjustmentStatus.APPROVED) {
            throw new common_1.BadRequestException('Không thể hủy phiếu đã duyệt');
        }
        await this.adjRepo.update({ adjustmentId: id }, { status: stock_adjustment_entity_1.AdjustmentStatus.CANCELLED });
        return this.findOneAdjustment(id);
    }
};
exports.WarehousesService = WarehousesService;
exports.WarehousesService = WarehousesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(warehouse_entity_1.WarehouseEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(warehouse_stock_entity_1.WarehouseStockEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(stock_transfer_entity_1.StockTransferEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(stock_transfer_item_entity_1.StockTransferItemEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(stock_adjustment_entity_1.StockAdjustmentEntity)),
    __param(5, (0, typeorm_1.InjectRepository)(stock_adjustment_item_entity_1.StockAdjustmentItemEntity)),
    __param(6, (0, typeorm_1.InjectRepository)(product_entity_1.ProductEntity)),
    __param(7, (0, typeorm_1.InjectRepository)(inventory_transaction_entity_1.InventoryTransactionEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        audit_logs_service_1.AuditLogsService])
], WarehousesService);
//# sourceMappingURL=warehouses.service.js.map