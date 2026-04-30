import { DataSource, Repository } from 'typeorm';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { InventoryTransactionEntity } from '../products/entities/inventory-transaction.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { AdjustmentReason, StockAdjustmentEntity } from './entities/stock-adjustment.entity';
import { StockAdjustmentItemEntity } from './entities/stock-adjustment-item.entity';
import { StockTransferEntity } from './entities/stock-transfer.entity';
import { StockTransferItemEntity } from './entities/stock-transfer-item.entity';
import { WarehouseEntity } from './entities/warehouse.entity';
import { WarehouseStockEntity } from './entities/warehouse-stock.entity';
export declare class WarehousesService {
    private readonly whRepo;
    private readonly wsRepo;
    private readonly transferRepo;
    private readonly transferItemRepo;
    private readonly adjRepo;
    private readonly adjItemRepo;
    private readonly productRepo;
    private readonly txRepo;
    private readonly dataSource;
    private readonly auditLogs;
    constructor(whRepo: Repository<WarehouseEntity>, wsRepo: Repository<WarehouseStockEntity>, transferRepo: Repository<StockTransferEntity>, transferItemRepo: Repository<StockTransferItemEntity>, adjRepo: Repository<StockAdjustmentEntity>, adjItemRepo: Repository<StockAdjustmentItemEntity>, productRepo: Repository<ProductEntity>, txRepo: Repository<InventoryTransactionEntity>, dataSource: DataSource, auditLogs: AuditLogsService);
    findAll(): Promise<WarehouseEntity[]>;
    findOne(id: string): Promise<WarehouseEntity>;
    create(dto: {
        name: string;
        code?: string;
        address?: string;
        managerName?: string;
        phone?: string;
    }, performer?: {
        userId: string;
        username: string;
        ip?: string;
    }): Promise<WarehouseEntity>;
    update(id: string, dto: Partial<{
        name: string;
        code: string;
        address: string;
        managerName: string;
        phone: string;
        isActive: boolean;
    }>, performer?: {
        userId: string;
        username: string;
        ip?: string;
    }): Promise<WarehouseEntity>;
    setDefault(id: string): Promise<WarehouseEntity>;
    getStock(warehouseId: string): Promise<WarehouseStockEntity[]>;
    findAllTransfers(page?: number, limit?: number, status?: string): Promise<{
        items: StockTransferEntity[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOneTransfer(id: string): Promise<StockTransferEntity>;
    createTransfer(dto: {
        fromWarehouseId: string;
        toWarehouseId: string;
        transferDate?: string;
        notes?: string;
        items: Array<{
            productId: string;
            qtyRequested: number;
            notes?: string;
        }>;
    }, userId?: string): Promise<StockTransferEntity>;
    shipTransfer(id: string, userId?: string, performer?: {
        userId: string;
        username: string;
        ip?: string;
    }): Promise<StockTransferEntity>;
    receiveTransfer(id: string, receivedItems: Array<{
        productId: string;
        qtyReceived: number;
    }>, userId?: string, performer?: {
        userId: string;
        username: string;
        ip?: string;
    }): Promise<StockTransferEntity>;
    findAllAdjustments(page?: number, limit?: number, status?: string): Promise<{
        items: StockAdjustmentEntity[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOneAdjustment(id: string): Promise<StockAdjustmentEntity>;
    createAdjustment(dto: {
        warehouseId?: string;
        reason: AdjustmentReason;
        adjustmentDate?: string;
        notes?: string;
        items: Array<{
            productId: string;
            qtyBefore: number;
            qtyAfter: number;
            notes?: string;
        }>;
    }, userId?: string): Promise<StockAdjustmentEntity>;
    approveAdjustment(id: string, userId?: string, performer?: {
        userId: string;
        username: string;
        ip?: string;
    }): Promise<StockAdjustmentEntity>;
    cancelAdjustment(id: string): Promise<StockAdjustmentEntity>;
}
