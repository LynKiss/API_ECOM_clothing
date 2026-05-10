import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { InventoryTransactionEntity, InventoryTransactionType } from '../products/entities/inventory-transaction.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { AdjustmentReason, AdjustmentStatus, StockAdjustmentEntity } from './entities/stock-adjustment.entity';
import { StockAdjustmentItemEntity } from './entities/stock-adjustment-item.entity';
import { StockTransferEntity, StockTransferStatus } from './entities/stock-transfer.entity';
import { StockTransferItemEntity } from './entities/stock-transfer-item.entity';
import { WarehouseEntity } from './entities/warehouse.entity';
import { WarehouseStockEntity } from './entities/warehouse-stock.entity';

function genCode(prefix: string): string {
  const now = new Date();
  const ymd =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `${prefix}-${ymd}-${rand}`;
}

function toPositiveInt(value: unknown, field: string): number {
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) {
    throw new BadRequestException(`${field} phai la so nguyen duong`);
  }
  return n;
}

function toNonNegativeInt(value: unknown, field: string): number {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) {
    throw new BadRequestException(`${field} phai la so nguyen khong am`);
  }
  return n;
}

function parseOptionalDate(value: string | undefined, field: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new BadRequestException(`${field} khong hop le`);
  }
  return date;
}

@Injectable()
export class WarehousesService {
  constructor(
    @InjectRepository(WarehouseEntity)
    private readonly whRepo: Repository<WarehouseEntity>,

    @InjectRepository(WarehouseStockEntity)
    private readonly wsRepo: Repository<WarehouseStockEntity>,

    @InjectRepository(StockTransferEntity)
    private readonly transferRepo: Repository<StockTransferEntity>,

    @InjectRepository(StockTransferItemEntity)
    private readonly transferItemRepo: Repository<StockTransferItemEntity>,

    @InjectRepository(StockAdjustmentEntity)
    private readonly adjRepo: Repository<StockAdjustmentEntity>,

    @InjectRepository(StockAdjustmentItemEntity)
    private readonly adjItemRepo: Repository<StockAdjustmentItemEntity>,

    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,

    @InjectRepository(InventoryTransactionEntity)
    private readonly txRepo: Repository<InventoryTransactionEntity>,

    private readonly dataSource: DataSource,
    private readonly auditLogs: AuditLogsService,
  ) {}

  // ─── Warehouses ───────────────────────────────────────────────────────────

  findAll() {
    return this.whRepo.find({ order: { isDefault: 'DESC', name: 'ASC' } });
  }

  async findOne(id: string) {
    const wh = await this.whRepo.findOne({ where: { warehouseId: id } });
    if (!wh) throw new NotFoundException('Không tìm thấy kho hàng');
    return wh;
  }

  async create(
    dto: { name: string; code?: string; address?: string; managerName?: string; phone?: string },
    performer?: { userId: string; username: string; ip?: string },
  ) {
    const name = dto.name?.trim();
    if (!name) throw new BadRequestException('Ten kho la bat buoc');

    const wh = this.whRepo.create({
      warehouseId: uuidv4(),
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

  async update(
    id: string,
    dto: Partial<{ name: string; code: string; address: string; managerName: string; phone: string; isActive: boolean }>,
    performer?: { userId: string; username: string; ip?: string },
  ) {
    const wh = await this.findOne(id);
    const before = { name: wh.name, code: wh.code, isActive: wh.isActive };
    if (dto.name !== undefined) {
      const name = dto.name?.trim();
      if (!name) throw new BadRequestException('Ten kho la bat buoc');
      wh.name = name;
    }
    if (dto.code !== undefined) wh.code = dto.code?.trim() || null;
    if (dto.address !== undefined) wh.address = dto.address?.trim() || null;
    if (dto.managerName !== undefined) wh.managerName = dto.managerName?.trim() || null;
    if (dto.phone !== undefined) wh.phone = dto.phone?.trim() || null;
    if (dto.isActive !== undefined) wh.isActive = Boolean(dto.isActive);
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

  async setDefault(id: string) {
    await this.dataSource.transaction(async (em) => {
      const warehouse = await em.findOne(WarehouseEntity, {
        where: { warehouseId: id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!warehouse) throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y kho hÃ ng');

      await em
        .createQueryBuilder()
        .update(WarehouseEntity)
        .set({ isDefault: false })
        .where('is_default = :isDefault', { isDefault: true })
        .execute();

      warehouse.isDefault = true;
      await em.save(WarehouseEntity, warehouse);
    });
    return this.findOne(id);
  }

  async getStock(warehouseId: string) {
    await this.findOne(warehouseId);
    return this.wsRepo
      .createQueryBuilder('ws')
      .where('ws.warehouseId = :warehouseId', { warehouseId })
      .leftJoinAndMapOne('ws.product', ProductEntity, 'p', 'p.productId = ws.productId')
      .orderBy('ws.quantity', 'DESC')
      .getMany();
  }

  // ─── Stock Transfers ──────────────────────────────────────────────────────

  async findAllTransfers(page = 1, limit = 20, status?: string) {
    const qb = this.transferRepo.createQueryBuilder('t').orderBy('t.createdAt', 'DESC');
    if (status && status !== 'all') qb.andWhere('t.status = :status', { status });
    const total = await qb.getCount();
    const items = await qb.skip((page - 1) * limit).take(limit).getMany();
    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOneTransfer(id: string) {
    const t = await this.transferRepo.findOne({ where: { transferId: id }, relations: ['items'] });
    if (!t) throw new NotFoundException('Không tìm thấy phiếu chuyển kho');
    return t;
  }

  async createTransfer(dto: {
    fromWarehouseId: string;
    toWarehouseId: string;
    transferDate?: string;
    notes?: string;
    items: Array<{ productId: string; qtyRequested: number; notes?: string }>;
  }, userId?: string) {
    if (!dto.fromWarehouseId || !dto.toWarehouseId) {
      throw new BadRequestException('Phai chon kho nguon va kho dich');
    }
    if (dto.fromWarehouseId === dto.toWarehouseId) {
      throw new BadRequestException('Kho nguồn và kho đích không được giống nhau');
    }

    if (!Array.isArray(dto.items) || dto.items.length === 0) {
      throw new BadRequestException('Phieu chuyen kho phai co it nhat mot dong hang');
    }

    const fromWarehouse = await this.whRepo.findOne({ where: { warehouseId: dto.fromWarehouseId } });
    const toWarehouse = await this.whRepo.findOne({ where: { warehouseId: dto.toWarehouseId } });
    if (!fromWarehouse?.isActive) throw new BadRequestException('Kho nguon khong kha dung');
    if (!toWarehouse?.isActive) throw new BadRequestException('Kho dich khong kha dung');

    const seenProducts = new Set<string>();
    const lines: Array<{ productId: string; qtyRequested: number; notes: string | null }> = [];
    for (const item of dto.items) {
      if (!item.productId) throw new BadRequestException('Dong hang thieu san pham');
      if (seenProducts.has(item.productId)) {
        throw new BadRequestException('Khong duoc lap san pham trong cung mot phieu chuyen');
      }
      seenProducts.add(item.productId);
      const product = await this.productRepo.findOne({ where: { productId: item.productId } });
      if (!product) throw new BadRequestException(`San pham ${item.productId} khong ton tai`);
      lines.push({
        productId: item.productId,
        qtyRequested: toPositiveInt(item.qtyRequested, 'qtyRequested'),
        notes: item.notes?.trim() || null,
      });
    }

    const transfer = this.transferRepo.create({
      transferId: uuidv4(),
      transferCode: genCode('TR'),
      fromWarehouseId: dto.fromWarehouseId,
      toWarehouseId: dto.toWarehouseId,
      status: StockTransferStatus.DRAFT,
      transferDate: parseOptionalDate(dto.transferDate, 'transferDate'),
      notes: dto.notes?.trim() || null,
      createdBy: userId ?? null,
    });

    transfer.items = lines.map((i) =>
      this.transferItemRepo.create({
        transferId: transfer.transferId,
        productId: i.productId,
        qtyRequested: i.qtyRequested,
        qtyReceived: 0,
        notes: i.notes,
      }),
    );

    return this.transferRepo.save(transfer);
  }

  async shipTransfer(
    id: string,
    userId?: string,
    performer?: { userId: string; username: string; ip?: string },
  ) {
    const t = await this.findOneTransfer(id);
    if (t.status !== StockTransferStatus.DRAFT) {
      throw new BadRequestException('Phiếu chuyển kho đã được xử lý');
    }

    await this.dataSource.transaction(async (em) => {
      const lockedTransfer = await em.findOne(StockTransferEntity, {
        where: { transferId: id },
        relations: ['items'],
        lock: { mode: 'pessimistic_write' },
      });
      if (!lockedTransfer) throw new NotFoundException('Khong tim thay phieu chuyen kho');
      if (lockedTransfer.status !== StockTransferStatus.DRAFT) {
        throw new BadRequestException('Phieu chuyen kho da duoc xu ly');
      }

      for (const item of lockedTransfer.items) {
        // Trừ kho nguồn
        const fromStock = await em.findOne(WarehouseStockEntity, {
          where: { warehouseId: lockedTransfer.fromWarehouseId, productId: item.productId },
          lock: { mode: 'pessimistic_write' },
        });
        if (!fromStock || fromStock.quantity < item.qtyRequested) {
          throw new BadRequestException(`Kho nguồn không đủ hàng cho sản phẩm ${item.productId}`);
        }
        fromStock.quantity -= item.qtyRequested;
        await em.save(WarehouseStockEntity, fromStock);

        // Tạo tx xuất
        await em.save(InventoryTransactionEntity, em.create(InventoryTransactionEntity, {
          productId: item.productId,
          performedBy: userId ?? null,
          transactionType: InventoryTransactionType.EXPORT,
          quantityChange: -item.qtyRequested,
          referenceType: 'TR',
          referenceId: lockedTransfer.transferId,
          note: `Xuất kho chuyển theo phiếu ${t.transferCode}`,
          relatedOrderId: null,
        }));
      }

      await em.update(StockTransferEntity, { transferId: id }, { status: StockTransferStatus.SHIPPED });
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

  async receiveTransfer(
    id: string,
    receivedItems: Array<{ productId: string; qtyReceived: number }>,
    userId?: string,
    performer?: { userId: string; username: string; ip?: string },
  ) {
    if (!Array.isArray(receivedItems) || receivedItems.length === 0) {
      throw new BadRequestException('Danh sach hang nhan khong duoc rong');
    }
    const t = await this.findOneTransfer(id);
    if (t.status !== StockTransferStatus.SHIPPED) {
      throw new BadRequestException('Phiếu chưa ở trạng thái đang vận chuyển');
    }

    await this.dataSource.transaction(async (em) => {
      const lockedTransfer = await em.findOne(StockTransferEntity, {
        where: { transferId: id },
        relations: ['items'],
        lock: { mode: 'pessimistic_write' },
      });
      if (!lockedTransfer) throw new NotFoundException('Khong tim thay phieu chuyen kho');
      if (lockedTransfer.status !== StockTransferStatus.SHIPPED) {
        throw new BadRequestException('Phieu chua o trang thai da xuat kho');
      }
      Object.assign(t, lockedTransfer);
      t.items = lockedTransfer.items;

      const transferItems = new Map(t.items.map((item) => [item.productId, item]));
      const seenReceived = new Set<string>();
      for (const recv of receivedItems) {
        const item = transferItems.get(recv.productId);
        if (!item) throw new BadRequestException(`San pham ${recv.productId} khong thuoc phieu chuyen`);
        if (seenReceived.has(recv.productId)) {
          throw new BadRequestException('Khong duoc lap san pham khi nhan hang');
        }
        seenReceived.add(recv.productId);
        const qtyReceived = toNonNegativeInt(recv.qtyReceived, 'qtyReceived');
        if (qtyReceived > item.qtyRequested) {
          throw new BadRequestException(`So luong nhan cua ${recv.productId} vuot so luong yeu cau`);
        }
      }
      for (const item of t.items) {
        if (!seenReceived.has(item.productId)) {
          throw new BadRequestException(`Thieu so luong nhan cho san pham ${item.productId}`);
        }
      }

      for (const recv of receivedItems) {
        const qtyReceived = toNonNegativeInt(recv.qtyReceived, 'qtyReceived');
        // Cộng kho đích
        let toStock = await em.findOne(WarehouseStockEntity, {
          where: { warehouseId: t.toWarehouseId, productId: recv.productId },
          lock: { mode: 'pessimistic_write' },
        });
        if (!toStock) {
          toStock = em.create(WarehouseStockEntity, {
            warehouseId: t.toWarehouseId,
            productId: recv.productId,
            quantity: 0,
          });
        }
        toStock.quantity += qtyReceived;
        await em.save(WarehouseStockEntity, toStock);

        // Cập nhật qty_received trên item
        await em
          .createQueryBuilder()
          .update(StockTransferItemEntity)
          .set({ qtyReceived })
          .where('transfer_id = :tid AND product_id = :pid', { tid: id, pid: recv.productId })
          .execute();

        // Tạo tx nhập
        await em.save(InventoryTransactionEntity, em.create(InventoryTransactionEntity, {
          productId: recv.productId,
          performedBy: userId ?? null,
          transactionType: InventoryTransactionType.IMPORT,
          quantityChange: qtyReceived,
          referenceType: 'TR',
          referenceId: t.transferId,
          note: `Nhập kho nhận từ phiếu chuyển ${t.transferCode}`,
          relatedOrderId: null,
        }));
      }

      await em.update(StockTransferEntity, { transferId: id }, {
        status: StockTransferStatus.RECEIVED,
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

  // ─── Stock Adjustments ────────────────────────────────────────────────────

  async findAllAdjustments(page = 1, limit = 20, status?: string) {
    const qb = this.adjRepo.createQueryBuilder('a').orderBy('a.createdAt', 'DESC');
    if (status && status !== 'all') qb.andWhere('a.status = :status', { status });
    const total = await qb.getCount();
    const items = await qb.skip((page - 1) * limit).take(limit).getMany();
    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOneAdjustment(id: string) {
    const a = await this.adjRepo.findOne({ where: { adjustmentId: id }, relations: ['items'] });
    if (!a) throw new NotFoundException('Không tìm thấy phiếu điều chỉnh kho');
    return a;
  }

  async createAdjustment(dto: {
    warehouseId?: string;
    reason: AdjustmentReason;
    adjustmentDate?: string;
    notes?: string;
    items: Array<{ productId: string; qtyBefore: number; qtyAfter: number; notes?: string }>;
  }, userId?: string) {
    if (!Object.values(AdjustmentReason).includes(dto.reason)) {
      throw new BadRequestException('Ly do dieu chinh khong hop le');
    }
    if (!Array.isArray(dto.items) || dto.items.length === 0) {
      throw new BadRequestException('Phieu dieu chinh phai co it nhat mot dong hang');
    }
    const warehouseId = dto.warehouseId?.trim() || null;
    if (warehouseId) {
      const warehouse = await this.whRepo.findOne({ where: { warehouseId } });
      if (!warehouse?.isActive) throw new BadRequestException('Kho dieu chinh khong kha dung');
    }

    const seenProducts = new Set<string>();
    const lines: Array<{
      productId: string;
      qtyBefore: number;
      qtyAfter: number;
      qtyDiff: number;
      notes: string | null;
    }> = [];
    for (const item of dto.items) {
      if (!item.productId) throw new BadRequestException('Dong hang thieu san pham');
      if (seenProducts.has(item.productId)) {
        throw new BadRequestException('Khong duoc lap san pham trong cung mot phieu dieu chinh');
      }
      seenProducts.add(item.productId);
      const product = await this.productRepo.findOne({ where: { productId: item.productId } });
      if (!product) throw new BadRequestException(`San pham ${item.productId} khong ton tai`);
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
      adjustmentId: uuidv4(),
      adjustmentCode: genCode('ADJ'),
      warehouseId,
      reason: dto.reason,
      status: AdjustmentStatus.DRAFT,
      adjustmentDate: parseOptionalDate(dto.adjustmentDate, 'adjustmentDate'),
      notes: dto.notes?.trim() || null,
      createdBy: userId ?? null,
    });

    adj.items = lines.map((i) =>
      this.adjItemRepo.create({
        adjustmentId: adj.adjustmentId,
        productId: i.productId,
        qtyBefore: i.qtyBefore,
        qtyAfter: i.qtyAfter,
        qtyDiff: i.qtyDiff,
        notes: i.notes,
      }),
    );

    return this.adjRepo.save(adj);
  }

  async approveAdjustment(
    id: string,
    userId?: string,
    performer?: { userId: string; username: string; ip?: string },
  ) {
    const adj = await this.findOneAdjustment(id);
    if (adj.status !== AdjustmentStatus.DRAFT) {
      throw new BadRequestException('Phiếu điều chỉnh đã được xử lý');
    }

    await this.dataSource.transaction(async (em) => {
      // Xác định kho áp dụng: dùng kho được chỉ định hoặc kho mặc định
      const warehouseId =
        adj.warehouseId ??
        (await em.findOne(WarehouseEntity, { where: { isDefault: true } }))
          ?.warehouseId ??
        null;
      const adjustsSpecificWarehouse = Boolean(adj.warehouseId);

      for (const item of adj.items) {
        const product = await em.findOne(ProductEntity, {
          where: { productId: item.productId },
          lock: { mode: 'pessimistic_write' },
        });
        if (!product) continue;

        let stockBefore = product.quantityAvailable;
        let qtyDiff = item.qtyAfter - stockBefore;
        let stock: WarehouseStockEntity | null = null;

        if (adjustsSpecificWarehouse && warehouseId) {
          stock = await em.findOne(WarehouseStockEntity, {
            where: { warehouseId, productId: item.productId },
            lock: { mode: 'pessimistic_write' },
          });
          stockBefore = stock?.quantity ?? 0;
          qtyDiff = item.qtyAfter - stockBefore;
        }

        const productQtyBefore = product.quantityAvailable;
        const productQtyAfter = adjustsSpecificWarehouse ? product.quantityAvailable + qtyDiff : item.qtyAfter;
        if (productQtyAfter < 0) {
          throw new BadRequestException(`Ton kho tong cua san pham ${item.productId} bi am`);
        }
        product.quantityAvailable = productQtyAfter;
        await em.save(ProductEntity, product);

        item.qtyBefore = stockBefore;
        item.qtyDiff = qtyDiff;
        await em.save(StockAdjustmentItemEntity, item);

        if (!adjustsSpecificWarehouse && warehouseId) {
          stock = await em.findOne(WarehouseStockEntity, {
            where: { warehouseId, productId: item.productId },
            lock: { mode: 'pessimistic_write' },
          });
        }

        if (qtyDiff !== 0) {
          const txType =
            qtyDiff > 0
              ? InventoryTransactionType.ADJUSTMENT
              : InventoryTransactionType.DAMAGE;

          await em.save(
            InventoryTransactionEntity,
            em.create(InventoryTransactionEntity, {
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
            }),
          );

          // Đồng bộ warehouse_stock
          if (warehouseId) {
            if (stock) {
              stock.quantity = adjustsSpecificWarehouse ? item.qtyAfter : Math.max(0, stock.quantity + qtyDiff);
              await em.save(WarehouseStockEntity, stock);
            } else if (adjustsSpecificWarehouse || qtyDiff > 0) {
              await em.save(
                WarehouseStockEntity,
                em.create(WarehouseStockEntity, {
                  warehouseId,
                  productId: item.productId,
                  quantity: adjustsSpecificWarehouse ? item.qtyAfter : qtyDiff,
                }),
              );
            }
          }
        }
      }

      await em.update(
        StockAdjustmentEntity,
        { adjustmentId: id },
        {
          status: AdjustmentStatus.APPROVED,
          approvedBy: userId ?? null,
          approvedAt: new Date(),
        },
      );
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

  async cancelAdjustment(id: string) {
    const adj = await this.findOneAdjustment(id);
    if (adj.status === AdjustmentStatus.APPROVED) {
      throw new BadRequestException('Không thể hủy phiếu đã duyệt');
    }
    await this.adjRepo.update({ adjustmentId: id }, { status: AdjustmentStatus.CANCELLED });
    return this.findOneAdjustment(id);
  }
}
