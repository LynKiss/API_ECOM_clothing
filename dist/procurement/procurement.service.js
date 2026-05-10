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
var ProcurementService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcurementService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const common_2 = require("@nestjs/common");
const uuid_1 = require("uuid");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
const simple_cache_service_1 = require("../common/simple-cache.service");
const transaction_util_1 = require("../common/transaction.util");
const order_entity_1 = require("../orders/entities/order.entity");
const order_item_entity_1 = require("../orders/entities/order-item.entity");
const order_status_history_entity_1 = require("../orders/entities/order-status-history.entity");
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
function genCode(prefix) {
    const now = new Date();
    const ymd = now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0');
    const rand = Math.floor(Math.random() * 9000 + 1000);
    return `${prefix}-${ymd}-${rand}`;
}
function calcLandedCost(params) {
    const { qtyReceived, qtyDefective, qtyReturned, hasRefund, refundAmount, unitPrice, allocatedExtraCost, } = params;
    const qtyGood = qtyReceived - qtyReturned;
    if (qtyGood <= 0)
        return 0;
    let goodsTotal;
    if (hasRefund) {
        goodsTotal = qtyReceived * unitPrice - refundAmount;
    }
    else {
        goodsTotal = qtyReceived * unitPrice;
    }
    return (goodsTotal + allocatedExtraCost) / qtyGood;
}
let ProcurementService = ProcurementService_1 = class ProcurementService {
    poRepo;
    poItemRepo;
    grRepo;
    grItemRepo;
    srRepo;
    srItemRepo;
    costHistRepo;
    productRepo;
    productVariantRepo;
    txRepo;
    dataSource;
    auditLogs;
    cache;
    constructor(poRepo, poItemRepo, grRepo, grItemRepo, srRepo, srItemRepo, costHistRepo, productRepo, productVariantRepo, txRepo, dataSource, auditLogs, cache) {
        this.poRepo = poRepo;
        this.poItemRepo = poItemRepo;
        this.grRepo = grRepo;
        this.grItemRepo = grItemRepo;
        this.srRepo = srRepo;
        this.srItemRepo = srItemRepo;
        this.costHistRepo = costHistRepo;
        this.productRepo = productRepo;
        this.productVariantRepo = productVariantRepo;
        this.txRepo = txRepo;
        this.dataSource = dataSource;
        this.auditLogs = auditLogs;
        this.cache = cache;
    }
    procurementLogger = new common_2.Logger(ProcurementService_1.name);
    supplierReturnTotal(items = []) {
        const total = items.reduce((sum, item) => sum + (item.hasRefund ? Number(item.refundAmount ?? 0) : 0), 0);
        return total.toFixed(2);
    }
    async attachSupplierReturnTotals(returns) {
        const ids = returns.map((sr) => sr.srId);
        if (ids.length === 0)
            return returns.map((sr) => Object.assign(sr, { totalRefund: '0.00' }));
        const items = await this.srItemRepo.find({ where: { srId: (0, typeorm_2.In)(ids) } });
        const totals = new Map();
        for (const item of items) {
            if (!item.hasRefund)
                continue;
            totals.set(item.srId, (totals.get(item.srId) ?? 0) + Number(item.refundAmount ?? 0));
        }
        return returns.map((sr) => Object.assign(sr, { totalRefund: (totals.get(sr.srId) ?? 0).toFixed(2) }));
    }
    async ensureProductAndVariant(productId, variantId) {
        const product = await this.productRepo.findOneBy({ productId });
        if (!product) {
            throw new common_1.NotFoundException(`Không tìm thấy sản phẩm ${productId}`);
        }
        if (!variantId)
            return;
        const variant = await this.productVariantRepo.findOneBy({
            productId,
            variantId,
        });
        if (!variant) {
            throw new common_1.BadRequestException(`Biến thể ${variantId} không thuộc sản phẩm ${productId}`);
        }
    }
    async findVariantForUpdate(em, productId, variantId) {
        if (!variantId)
            return null;
        const variant = await em.findOne(product_variant_entity_1.ProductVariantEntity, {
            where: { productId, variantId },
            lock: { mode: 'pessimistic_write' },
        });
        if (!variant) {
            throw new common_1.BadRequestException(`Biến thể ${variantId} không thuộc sản phẩm ${productId}`);
        }
        return variant;
    }
    async syncDefaultWarehouseStock(em, warehouseId, productId, qtyDelta, variantId) {
        if (qtyDelta === 0)
            return;
        const stockQuery = em
            .createQueryBuilder(warehouse_stock_entity_1.WarehouseStockEntity, 'stock')
            .where('stock.warehouse_id = :warehouseId', { warehouseId })
            .andWhere('stock.product_id = :productId', { productId });
        if (variantId) {
            stockQuery.andWhere('stock.variant_id = :variantId', { variantId });
        }
        else {
            stockQuery.andWhere('stock.variant_id IS NULL');
        }
        const stock = await stockQuery.getOne();
        if (stock) {
            stock.quantity = Math.max(0, stock.quantity + qtyDelta);
            await em.save(warehouse_stock_entity_1.WarehouseStockEntity, stock);
            return;
        }
        if (qtyDelta > 0) {
            await em.save(warehouse_stock_entity_1.WarehouseStockEntity, em.create(warehouse_stock_entity_1.WarehouseStockEntity, {
                warehouseId,
                productId,
                variantId: variantId ?? null,
                quantity: qtyDelta,
            }));
        }
    }
    async autoFulfillBackorders(productIds) {
        if (!productIds.length)
            return;
        try {
            const enabled = (process.env.BACKORDER_AUTO_FULFILL ?? '').toLowerCase() === 'true';
            const orderIdsRaw = await this.dataSource
                .createQueryBuilder()
                .select('DISTINCT o.order_id', 'orderId')
                .addSelect('o.created_at', 'createdAt')
                .from('orders', 'o')
                .innerJoin('order_items', 'oi', 'oi.order_id = o.order_id')
                .where('o.order_status = :st', { st: 'backordered' })
                .andWhere('oi.product_id IN (:...pids)', { pids: productIds })
                .orderBy('o.created_at', 'ASC')
                .getRawMany();
            if (!orderIdsRaw.length)
                return;
            void this.auditLogs.log({
                entityType: 'BACKORDER',
                entityId: productIds.join(','),
                action: 'STOCK_REPLENISHED',
                afterData: {
                    backorderedOrders: orderIdsRaw.length,
                    autoFulfillEnabled: enabled,
                },
            });
            if (!enabled)
                return;
            let fulfilledCount = 0;
            for (const { orderId } of orderIdsRaw) {
                try {
                    const ok = await this.tryFulfillOneBackorder(orderId);
                    if (ok)
                        fulfilledCount++;
                }
                catch (err) {
                    this.procurementLogger.warn(`[autoFulfillBackorders] Fail ${orderId}: ${err instanceof Error ? err.message : err}`);
                }
            }
            if (fulfilledCount > 0) {
                this.procurementLogger.log(`[autoFulfillBackorders] Fulfilled ${fulfilledCount}/${orderIdsRaw.length} backorders`);
            }
        }
        catch (err) {
            this.procurementLogger.error(`[autoFulfillBackorders] Top-level error: ${err instanceof Error ? err.message : err}`);
        }
    }
    async tryFulfillOneBackorder(orderId) {
        return (0, transaction_util_1.withDeadlockRetry)(() => this.dataSource.transaction(async (em) => {
            const order = await em.findOne(order_entity_1.OrderEntity, {
                where: { orderId },
                lock: { mode: 'pessimistic_write' },
            });
            if (!order || order.orderStatus !== order_entity_1.OrderStatus.BACKORDERED) {
                return false;
            }
            const items = await em.find(order_item_entity_1.OrderItemEntity, {
                where: { orderId: order.orderId },
            });
            const productMap = new Map();
            const variantMap = new Map();
            for (const item of items) {
                const product = await em.findOne(product_entity_1.ProductEntity, {
                    where: { productId: item.productId },
                    lock: { mode: 'pessimistic_write' },
                });
                if (!product || item.quantity > product.quantityAvailable) {
                    return false;
                }
                const variant = await this.findVariantForUpdate(em, item.productId, item.variantId);
                if (variant && item.quantity > variant.stockQuantity) {
                    return false;
                }
                productMap.set(item.productId, product);
                if (variant)
                    variantMap.set(variant.variantId, variant);
            }
            for (const item of items) {
                const product = productMap.get(item.productId);
                const variant = item.variantId ? variantMap.get(item.variantId) : null;
                const qtyBefore = variant?.stockQuantity ?? product.quantityAvailable;
                if (variant) {
                    variant.stockQuantity -= item.quantity;
                    await em.save(product_variant_entity_1.ProductVariantEntity, variant);
                }
                product.quantityAvailable -= item.quantity;
                product.quantityReserved =
                    (product.quantityReserved ?? 0) + item.quantity;
                await em.save(product_entity_1.ProductEntity, product);
                await em.save(inventory_transaction_entity_1.InventoryTransactionEntity, em.create(inventory_transaction_entity_1.InventoryTransactionEntity, {
                    productId: item.productId,
                    variantId: variant?.variantId ?? null,
                    performedBy: null,
                    transactionType: inventory_transaction_entity_1.InventoryTransactionType.EXPORT,
                    quantityChange: -item.quantity,
                    quantityBefore: qtyBefore,
                    quantityAfter: variant?.stockQuantity ?? product.quantityAvailable,
                    referenceType: 'ORDER',
                    referenceId: order.orderId,
                    unitCostAtTime: product.avgCost ?? null,
                    note: 'Auto-fulfill backorder by GR confirmation',
                    relatedOrderId: order.orderId,
                }));
            }
            order.orderStatus = order_entity_1.OrderStatus.PENDING;
            await em.save(order_entity_1.OrderEntity, order);
            await em.save(order_status_history_entity_1.OrderStatusHistoryEntity, em.create(order_status_history_entity_1.OrderStatusHistoryEntity, {
                orderId: order.orderId,
                oldStatus: order_entity_1.OrderStatus.BACKORDERED,
                newStatus: order_entity_1.OrderStatus.PENDING,
                changedBy: null,
                note: 'Auto-fulfilled by stock replenishment',
            }));
            return true;
        }));
    }
    async findAllPos(query) {
        const { search, status, supplierId, from, to, page = 1, limit = 20 } = query;
        const qb = this.poRepo
            .createQueryBuilder('po')
            .orderBy('po.createdAt', 'DESC');
        if (search?.trim()) {
            qb.andWhere('po.poCode LIKE :kw', { kw: `%${search.trim()}%` });
        }
        if (status && status !== 'all')
            qb.andWhere('po.status = :status', { status });
        if (supplierId)
            qb.andWhere('po.supplierId = :supplierId', { supplierId });
        if (from)
            qb.andWhere('po.orderDate >= :from', { from });
        if (to)
            qb.andWhere('po.orderDate <= :to', { to });
        const total = await qb.getCount();
        const items = await qb.skip((page - 1) * limit).take(limit).getMany();
        return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    async findOnePo(id) {
        const po = await this.poRepo.findOne({
            where: { poId: id },
            relations: ['items'],
        });
        if (!po)
            throw new common_1.NotFoundException('Không tìm thấy phiếu đặt hàng');
        return po;
    }
    async createPo(dto, performer) {
        for (const item of dto.items) {
            await this.ensureProductAndVariant(item.productId, item.variantId);
        }
        const po = this.poRepo.create({
            poId: (0, uuid_1.v4)(),
            poCode: genCode('PO'),
            supplierId: dto.supplierId,
            status: purchase_order_entity_1.PurchaseOrderStatus.DRAFT,
            orderDate: dto.orderDate ? new Date(dto.orderDate) : null,
            expectedDate: dto.expectedDate ? new Date(dto.expectedDate) : null,
            shippingCost: String(dto.shippingCost ?? 0),
            otherCost: String(dto.otherCost ?? 0),
            notes: dto.notes ?? null,
            createdBy: performer?.userId ?? null,
        });
        let totalAmount = 0;
        const items = dto.items.map((i) => {
            const lineTotal = i.qtyOrdered * i.unitPrice;
            totalAmount += lineTotal;
            return this.poItemRepo.create({
                poId: po.poId,
                productId: i.productId,
                variantId: i.variantId ?? null,
                unit: i.unit ?? 'cái',
                unitPerBase: i.unitPerBase ?? 1,
                qtyOrdered: i.qtyOrdered,
                qtyReceived: 0,
                unitPrice: String(i.unitPrice),
                notes: i.notes ?? null,
            });
        });
        po.totalAmount = String(totalAmount);
        po.items = items;
        const saved = await this.poRepo.save(po);
        void this.auditLogs.log({
            entityType: 'PO',
            entityId: saved.poId,
            action: 'CREATE',
            changedBy: performer?.username,
            ipAddress: performer?.ip,
            afterData: { poCode: saved.poCode, supplierId: saved.supplierId, totalAmount: saved.totalAmount },
        });
        return saved;
    }
    async updatePoStatus(id, status, performer) {
        const po = await this.findOnePo(id);
        if (po.status === purchase_order_entity_1.PurchaseOrderStatus.CANCELLED) {
            throw new common_1.BadRequestException('Phiếu đã hủy không thể thay đổi trạng thái');
        }
        const before = { status: po.status };
        po.status = status;
        const saved = await this.poRepo.save(po);
        void this.auditLogs.log({
            entityType: 'PO',
            entityId: id,
            action: status === purchase_order_entity_1.PurchaseOrderStatus.CANCELLED ? 'CANCEL' : 'UPDATE',
            changedBy: performer?.username,
            ipAddress: performer?.ip,
            beforeData: before,
            afterData: { status },
        });
        return saved;
    }
    async findAllGrs(query) {
        const { search, status, supplierId, from, to, page = 1, limit = 20 } = query;
        const qb = this.grRepo.createQueryBuilder('gr').orderBy('gr.createdAt', 'DESC');
        if (search?.trim()) {
            qb.andWhere('gr.grCode LIKE :kw', { kw: `%${search.trim()}%` });
        }
        if (status && status !== 'all')
            qb.andWhere('gr.status = :status', { status });
        if (supplierId)
            qb.andWhere('gr.supplierId = :supplierId', { supplierId });
        if (from)
            qb.andWhere('gr.receiptDate >= :from', { from });
        if (to)
            qb.andWhere('gr.receiptDate <= :to', { to });
        const total = await qb.getCount();
        const items = await qb.skip((page - 1) * limit).take(limit).getMany();
        return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    async findOneGr(id) {
        const gr = await this.grRepo.findOne({ where: { grId: id }, relations: ['items'] });
        if (!gr)
            throw new common_1.NotFoundException('Không tìm thấy phiếu nhận hàng');
        return gr;
    }
    async createGr(dto, performer) {
        for (const item of dto.items) {
            await this.ensureProductAndVariant(item.productId, item.variantId);
        }
        if (dto.poId) {
            const linkedPo = await this.poRepo.findOne({ where: { poId: dto.poId } });
            if (!linkedPo) {
                throw new common_1.BadRequestException(`Không tìm thấy PO ${dto.poId}`);
            }
            if (linkedPo.supplierId !== dto.supplierId) {
                throw new common_1.BadRequestException('Nhà cung cấp phiếu nhận phải khớp với nhà cung cấp của PO liên kết');
            }
            if (linkedPo.status === purchase_order_entity_1.PurchaseOrderStatus.CANCELLED) {
                throw new common_1.BadRequestException('Không thể tạo phiếu nhận cho PO đã hủy');
            }
            if (linkedPo.status === purchase_order_entity_1.PurchaseOrderStatus.RECEIVED) {
                throw new common_1.BadRequestException('PO này đã nhận đủ hàng');
            }
        }
        const shippingCost = dto.shippingCost ?? 0;
        const otherCost = dto.otherCost ?? 0;
        const totalExtraCost = shippingCost + otherCost;
        const totalQtyReceived = dto.items.reduce((sum, i) => sum + (i.qtyReceived - (i.qtyReturned ?? 0)), 0);
        const gr = this.grRepo.create({
            grId: (0, uuid_1.v4)(),
            grCode: genCode('GR'),
            poId: dto.poId ?? null,
            supplierId: dto.supplierId,
            receiptDate: new Date(dto.receiptDate),
            shippingCost: String(shippingCost),
            otherCost: String(otherCost),
            status: goods_receipt_entity_1.GoodsReceiptStatus.DRAFT,
            notes: dto.notes ?? null,
            createdBy: performer?.userId ?? null,
        });
        const items = dto.items.map((i) => {
            const qtyGood = i.qtyReceived - (i.qtyReturned ?? 0);
            const allocatedExtraCost = totalQtyReceived > 0 ? (qtyGood / totalQtyReceived) * totalExtraCost : 0;
            const landedCost = calcLandedCost({
                qtyReceived: i.qtyReceived,
                qtyDefective: i.qtyDefective ?? 0,
                qtyReturned: i.qtyReturned ?? 0,
                hasRefund: i.hasRefund !== false,
                refundAmount: i.refundAmount ?? 0,
                unitPrice: i.unitPrice,
                allocatedExtraCost,
            });
            return this.grItemRepo.create({
                grId: gr.grId,
                productId: i.productId,
                variantId: i.variantId ?? null,
                unit: i.unit ?? 'cái',
                unitPerBase: i.unitPerBase ?? 1,
                qtyOrdered: i.qtyOrdered ?? 0,
                qtyReceived: i.qtyReceived,
                qtyDefective: i.qtyDefective ?? 0,
                qtyReturned: i.qtyReturned ?? 0,
                refundAmount: String(i.refundAmount ?? 0),
                hasRefund: i.hasRefund !== false,
                unitPrice: String(i.unitPrice),
                landedCost: String(Math.round(landedCost)),
                notes: i.notes ?? null,
            });
        });
        gr.items = items;
        const saved = await this.grRepo.save(gr);
        void this.auditLogs.log({
            entityType: 'GR',
            entityId: saved.grId,
            action: 'CREATE',
            changedBy: performer?.username,
            ipAddress: performer?.ip,
            afterData: { grCode: saved.grCode, supplierId: saved.supplierId, poId: saved.poId },
        });
        return saved;
    }
    async confirmGr(id, performer) {
        const gr = await this.findOneGr(id);
        if (gr.status !== goods_receipt_entity_1.GoodsReceiptStatus.DRAFT) {
            throw new common_1.BadRequestException('Phiếu nhận hàng đã được xử lý');
        }
        await (0, transaction_util_1.withDeadlockRetry)(() => this.dataSource.transaction(async (em) => {
            const defaultWarehouse = await em.findOne(warehouse_entity_1.WarehouseEntity, { where: { isDefault: true } });
            for (const item of gr.items) {
                const qtyGood = item.qtyReceived - item.qtyReturned;
                if (qtyGood <= 0)
                    continue;
                const product = await em.findOne(product_entity_1.ProductEntity, {
                    where: { productId: item.productId },
                    lock: { mode: 'pessimistic_write' },
                });
                if (!product)
                    continue;
                const productQtyBefore = product.quantityAvailable;
                const variant = await this.findVariantForUpdate(em, item.productId, item.variantId);
                const qtyBefore = variant?.stockQuantity ?? productQtyBefore;
                product.quantityAvailable += qtyGood;
                if (variant) {
                    variant.stockQuantity += qtyGood;
                    await em.save(product_variant_entity_1.ProductVariantEntity, variant);
                }
                const qtyAfter = variant?.stockQuantity ?? product.quantityAvailable;
                const currentQty = productQtyBefore;
                const currentAvg = Number(product.avgCost ?? 0);
                const incomingCost = Number(item.landedCost);
                const incomingQty = qtyGood;
                const newAvg = currentQty + incomingQty <= 0
                    ? incomingCost
                    : (currentQty * currentAvg + incomingQty * incomingCost) /
                        (currentQty + incomingQty);
                product.avgCost = newAvg.toFixed(4);
                product.costPrice = item.landedCost;
                await em.save(product_entity_1.ProductEntity, product);
                const hist = em.create(product_cost_history_entity_1.ProductCostHistoryEntity, {
                    productId: item.productId,
                    grId: gr.grId,
                    costPerUnit: item.landedCost,
                    qtyAtReceipt: qtyGood,
                    effectiveDate: new Date(),
                    notes: `Nhập từ ${gr.grCode}`,
                });
                await em.save(product_cost_history_entity_1.ProductCostHistoryEntity, hist);
                const tx = em.create(inventory_transaction_entity_1.InventoryTransactionEntity, {
                    productId: item.productId,
                    variantId: variant?.variantId ?? null,
                    performedBy: performer?.userId ?? null,
                    transactionType: inventory_transaction_entity_1.InventoryTransactionType.IMPORT,
                    quantityChange: qtyGood,
                    quantityBefore: qtyBefore,
                    quantityAfter: qtyAfter,
                    referenceType: 'GR',
                    referenceId: gr.grId,
                    unitCostAtTime: item.landedCost,
                    note: `Nhập kho từ phiếu ${gr.grCode}`,
                    relatedOrderId: null,
                });
                await em.save(inventory_transaction_entity_1.InventoryTransactionEntity, tx);
                if (defaultWarehouse) {
                    await this.syncDefaultWarehouseStock(em, defaultWarehouse.warehouseId, item.productId, qtyGood, variant?.variantId ?? null);
                }
                if (gr.poId) {
                    const updateQb = em
                        .createQueryBuilder()
                        .update(purchase_order_item_entity_1.PurchaseOrderItemEntity)
                        .set({ qtyReceived: () => `qty_received + ${qtyGood}` })
                        .where('po_id = :poId AND product_id = :productId', {
                        poId: gr.poId,
                        productId: item.productId,
                    });
                    if (variant) {
                        updateQb.andWhere('variant_id = :variantId', {
                            variantId: variant.variantId,
                        });
                    }
                    else {
                        updateQb.andWhere('variant_id IS NULL');
                    }
                    await updateQb.execute();
                }
            }
            await em.update(goods_receipt_entity_1.GoodsReceiptEntity, { grId: id }, { status: goods_receipt_entity_1.GoodsReceiptStatus.POSTED });
            if (gr.poId) {
                const poItems = await em.find(purchase_order_item_entity_1.PurchaseOrderItemEntity, { where: { poId: gr.poId } });
                const allReceived = poItems.every((i) => i.qtyReceived >= i.qtyOrdered);
                const anyReceived = poItems.some((i) => i.qtyReceived > 0);
                const newPoStatus = allReceived
                    ? purchase_order_entity_1.PurchaseOrderStatus.RECEIVED
                    : anyReceived
                        ? purchase_order_entity_1.PurchaseOrderStatus.PARTIAL
                        : purchase_order_entity_1.PurchaseOrderStatus.ORDERED;
                await em.update(purchase_order_entity_1.PurchaseOrderEntity, { poId: gr.poId }, { status: newPoStatus });
            }
        }));
        await this.autoFulfillBackorders(gr.items.map((it) => it.productId));
        this.cache.invalidatePrefix('reports:');
        this.cache.invalidatePrefix('products:');
        void this.auditLogs.log({
            entityType: 'GR',
            entityId: id,
            action: 'CONFIRM',
            changedBy: performer?.username,
            ipAddress: performer?.ip,
            afterData: { grCode: gr.grCode, status: goods_receipt_entity_1.GoodsReceiptStatus.POSTED },
        });
        return this.findOneGr(id);
    }
    async cancelGr(id, performer) {
        const gr = await this.findOneGr(id);
        if (gr.status === goods_receipt_entity_1.GoodsReceiptStatus.POSTED) {
            throw new common_1.BadRequestException('Không thể hủy phiếu đã xác nhận. Hãy tạo phiếu trả hàng.');
        }
        await this.grRepo.update({ grId: id }, { status: goods_receipt_entity_1.GoodsReceiptStatus.CANCELLED });
        void this.auditLogs.log({
            entityType: 'GR',
            entityId: id,
            action: 'CANCEL',
            changedBy: performer?.username,
            ipAddress: performer?.ip,
            beforeData: { status: gr.status },
            afterData: { status: goods_receipt_entity_1.GoodsReceiptStatus.CANCELLED },
        });
        return this.findOneGr(id);
    }
    async findAllSrs(query) {
        const { search, status, supplierId, page = 1, limit = 20 } = query;
        const qb = this.srRepo.createQueryBuilder('sr').orderBy('sr.createdAt', 'DESC');
        if (search?.trim()) {
            qb.andWhere('sr.srCode LIKE :kw', { kw: `%${search.trim()}%` });
        }
        if (status && status !== 'all')
            qb.andWhere('sr.status = :status', { status });
        if (supplierId)
            qb.andWhere('sr.supplierId = :supplierId', { supplierId });
        const total = await qb.getCount();
        const items = await this.attachSupplierReturnTotals(await qb.skip((page - 1) * limit).take(limit).getMany());
        return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    async findOneSr(id) {
        const sr = await this.srRepo.findOne({ where: { srId: id }, relations: ['items'] });
        if (!sr)
            throw new common_1.NotFoundException('Không tìm thấy phiếu trả hàng NCC');
        return Object.assign(sr, { totalRefund: this.supplierReturnTotal(sr.items) });
    }
    async createSr(dto, performer) {
        for (const item of dto.items) {
            await this.ensureProductAndVariant(item.productId, item.variantId);
        }
        const totalRefund = dto.items.reduce((sum, i) => sum + (i.hasRefund !== false ? (i.refundAmount ?? i.qtyReturned * i.unitPrice) : 0), 0);
        const sr = this.srRepo.create({
            srId: (0, uuid_1.v4)(),
            srCode: genCode('SR'),
            grId: dto.grId ?? null,
            supplierId: dto.supplierId,
            returnDate: new Date(dto.returnDate),
            status: supplier_return_entity_1.SupplierReturnStatus.DRAFT,
            notes: dto.notes ?? null,
            createdBy: performer?.userId ?? null,
        });
        const items = dto.items.map((i) => this.srItemRepo.create({
            srId: sr.srId,
            productId: i.productId,
            variantId: i.variantId ?? null,
            qtyReturned: i.qtyReturned,
            unitPrice: String(i.unitPrice),
            hasRefund: i.hasRefund !== false,
            refundAmount: String(i.hasRefund !== false
                ? (i.refundAmount ?? i.qtyReturned * i.unitPrice)
                : 0),
            reason: i.reason ?? null,
        }));
        sr.items = items;
        const saved = await this.srRepo.save(sr);
        void this.auditLogs.log({
            entityType: 'SR',
            entityId: saved.srId,
            action: 'CREATE',
            changedBy: performer?.username,
            ipAddress: performer?.ip,
            afterData: { srCode: saved.srCode, supplierId: saved.supplierId, totalRefund },
        });
        return Object.assign(saved, { totalRefund: totalRefund.toFixed(2) });
    }
    async confirmSr(id, performer) {
        const sr = await this.findOneSr(id);
        if (sr.status !== supplier_return_entity_1.SupplierReturnStatus.DRAFT) {
            throw new common_1.BadRequestException('Phiếu trả hàng đã được xử lý');
        }
        await this.dataSource.transaction(async (em) => {
            const defaultWarehouse = await em.findOne(warehouse_entity_1.WarehouseEntity, { where: { isDefault: true } });
            for (const item of sr.items) {
                const product = await em.findOne(product_entity_1.ProductEntity, {
                    where: { productId: item.productId },
                    lock: { mode: 'pessimistic_write' },
                });
                if (!product)
                    continue;
                const variant = await this.findVariantForUpdate(em, item.productId, item.variantId);
                const qtyBefore = variant?.stockQuantity ?? product.quantityAvailable;
                if (item.qtyReturned > qtyBefore || item.qtyReturned > product.quantityAvailable) {
                    throw new common_1.BadRequestException(`Số lượng trả NCC vượt tồn khả dụng của sản phẩm ${item.productId}`);
                }
                if (variant) {
                    variant.stockQuantity -= item.qtyReturned;
                    await em.save(product_variant_entity_1.ProductVariantEntity, variant);
                }
                product.quantityAvailable -= item.qtyReturned;
                const qtyAfter = variant?.stockQuantity ?? product.quantityAvailable;
                await em.save(product_entity_1.ProductEntity, product);
                const tx = em.create(inventory_transaction_entity_1.InventoryTransactionEntity, {
                    productId: item.productId,
                    variantId: variant?.variantId ?? null,
                    performedBy: performer?.userId ?? null,
                    transactionType: inventory_transaction_entity_1.InventoryTransactionType.RETURN_OUT,
                    quantityChange: -item.qtyReturned,
                    quantityBefore: qtyBefore,
                    quantityAfter: qtyAfter,
                    referenceType: 'SR',
                    referenceId: sr.srId,
                    note: `Trả hàng NCC từ phiếu ${sr.srCode} — ${item.reason ?? ''}`,
                    relatedOrderId: null,
                });
                await em.save(inventory_transaction_entity_1.InventoryTransactionEntity, tx);
                if (defaultWarehouse) {
                    await this.syncDefaultWarehouseStock(em, defaultWarehouse.warehouseId, item.productId, -item.qtyReturned, variant?.variantId ?? null);
                }
            }
            await em.update(supplier_return_entity_1.SupplierReturnEntity, { srId: id }, { status: supplier_return_entity_1.SupplierReturnStatus.POSTED });
        });
        void this.auditLogs.log({
            entityType: 'SR',
            entityId: id,
            action: 'CONFIRM',
            changedBy: performer?.username,
            ipAddress: performer?.ip,
            afterData: { srCode: sr.srCode, status: supplier_return_entity_1.SupplierReturnStatus.POSTED },
        });
        return this.findOneSr(id);
    }
    async getCostHistory(productId) {
        return this.costHistRepo.find({
            where: { productId },
            order: { effectiveDate: 'DESC' },
            take: 50,
        });
    }
    previewGrCost(dto) {
        const shippingCost = dto.shippingCost ?? 0;
        const otherCost = dto.otherCost ?? 0;
        const totalExtraCost = shippingCost + otherCost;
        const totalQtyReceived = dto.items.reduce((sum, i) => sum + (i.qtyReceived - (i.qtyReturned ?? 0)), 0);
        return dto.items.map((i) => {
            const qtyGood = i.qtyReceived - (i.qtyReturned ?? 0);
            const allocatedExtraCost = totalQtyReceived > 0 ? (qtyGood / totalQtyReceived) * totalExtraCost : 0;
            const landedCost = calcLandedCost({
                qtyReceived: i.qtyReceived,
                qtyDefective: i.qtyDefective ?? 0,
                qtyReturned: i.qtyReturned ?? 0,
                hasRefund: i.hasRefund !== false,
                refundAmount: i.refundAmount ?? 0,
                unitPrice: i.unitPrice,
                allocatedExtraCost,
            });
            return {
                productId: i.productId,
                variantId: i.variantId ?? null,
                qtyReceived: i.qtyReceived,
                qtyReturned: i.qtyReturned ?? 0,
                qtyGood,
                unitPrice: i.unitPrice,
                allocatedExtraCost: Math.round(allocatedExtraCost),
                landedCost: Math.round(landedCost),
                totalLandedCost: Math.round(landedCost * qtyGood),
            };
        });
    }
};
exports.ProcurementService = ProcurementService;
exports.ProcurementService = ProcurementService = ProcurementService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(purchase_order_entity_1.PurchaseOrderEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(purchase_order_item_entity_1.PurchaseOrderItemEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(goods_receipt_entity_1.GoodsReceiptEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(goods_receipt_item_entity_1.GoodsReceiptItemEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(supplier_return_entity_1.SupplierReturnEntity)),
    __param(5, (0, typeorm_1.InjectRepository)(supplier_return_item_entity_1.SupplierReturnItemEntity)),
    __param(6, (0, typeorm_1.InjectRepository)(product_cost_history_entity_1.ProductCostHistoryEntity)),
    __param(7, (0, typeorm_1.InjectRepository)(product_entity_1.ProductEntity)),
    __param(8, (0, typeorm_1.InjectRepository)(product_variant_entity_1.ProductVariantEntity)),
    __param(9, (0, typeorm_1.InjectRepository)(inventory_transaction_entity_1.InventoryTransactionEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        audit_logs_service_1.AuditLogsService,
        simple_cache_service_1.SimpleCacheService])
], ProcurementService);
//# sourceMappingURL=procurement.service.js.map