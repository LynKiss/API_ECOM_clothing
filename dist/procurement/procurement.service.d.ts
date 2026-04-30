import { DataSource, Repository } from 'typeorm';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { SimpleCacheService } from '../common/simple-cache.service';
import { InventoryTransactionEntity } from '../products/entities/inventory-transaction.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { CreateGrDto } from './dto/create-gr.dto';
import { CreatePoDto } from './dto/create-po.dto';
import { CreateSrDto } from './dto/create-sr.dto';
import { QueryProcurementDto } from './dto/query-procurement.dto';
import { GoodsReceiptItemEntity } from './entities/goods-receipt-item.entity';
import { GoodsReceiptEntity } from './entities/goods-receipt.entity';
import { ProductCostHistoryEntity } from './entities/product-cost-history.entity';
import { PurchaseOrderItemEntity } from './entities/purchase-order-item.entity';
import { PurchaseOrderEntity, PurchaseOrderStatus } from './entities/purchase-order.entity';
import { SupplierReturnItemEntity } from './entities/supplier-return-item.entity';
import { SupplierReturnEntity } from './entities/supplier-return.entity';
export declare class ProcurementService {
    private readonly poRepo;
    private readonly poItemRepo;
    private readonly grRepo;
    private readonly grItemRepo;
    private readonly srRepo;
    private readonly srItemRepo;
    private readonly costHistRepo;
    private readonly productRepo;
    private readonly txRepo;
    private readonly dataSource;
    private readonly auditLogs;
    private readonly cache;
    constructor(poRepo: Repository<PurchaseOrderEntity>, poItemRepo: Repository<PurchaseOrderItemEntity>, grRepo: Repository<GoodsReceiptEntity>, grItemRepo: Repository<GoodsReceiptItemEntity>, srRepo: Repository<SupplierReturnEntity>, srItemRepo: Repository<SupplierReturnItemEntity>, costHistRepo: Repository<ProductCostHistoryEntity>, productRepo: Repository<ProductEntity>, txRepo: Repository<InventoryTransactionEntity>, dataSource: DataSource, auditLogs: AuditLogsService, cache: SimpleCacheService);
    private readonly procurementLogger;
    private autoFulfillBackorders;
    private tryFulfillOneBackorder;
    findAllPos(query: QueryProcurementDto): Promise<{
        items: PurchaseOrderEntity[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOnePo(id: string): Promise<PurchaseOrderEntity>;
    createPo(dto: CreatePoDto, performer?: {
        userId: string;
        username: string;
        ip?: string;
    }): Promise<PurchaseOrderEntity>;
    updatePoStatus(id: string, status: PurchaseOrderStatus, performer?: {
        userId: string;
        username: string;
        ip?: string;
    }): Promise<PurchaseOrderEntity>;
    findAllGrs(query: QueryProcurementDto): Promise<{
        items: GoodsReceiptEntity[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOneGr(id: string): Promise<GoodsReceiptEntity>;
    createGr(dto: CreateGrDto, performer?: {
        userId: string;
        username: string;
        ip?: string;
    }): Promise<GoodsReceiptEntity>;
    confirmGr(id: string, performer?: {
        userId: string;
        username: string;
        ip?: string;
    }): Promise<GoodsReceiptEntity>;
    cancelGr(id: string, performer?: {
        userId: string;
        username: string;
        ip?: string;
    }): Promise<GoodsReceiptEntity>;
    findAllSrs(query: QueryProcurementDto): Promise<{
        items: SupplierReturnEntity[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOneSr(id: string): Promise<SupplierReturnEntity>;
    createSr(dto: CreateSrDto, performer?: {
        userId: string;
        username: string;
        ip?: string;
    }): Promise<SupplierReturnEntity>;
    confirmSr(id: string, performer?: {
        userId: string;
        username: string;
        ip?: string;
    }): Promise<SupplierReturnEntity>;
    getCostHistory(productId: string): Promise<ProductCostHistoryEntity[]>;
    previewGrCost(dto: CreateGrDto): {
        productId: string;
        qtyReceived: number;
        qtyReturned: number;
        qtyGood: number;
        unitPrice: number;
        allocatedExtraCost: number;
        landedCost: number;
        totalLandedCost: number;
    }[];
}
