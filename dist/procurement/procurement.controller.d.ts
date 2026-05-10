import { CreateGrDto } from './dto/create-gr.dto';
import { CreatePoDto } from './dto/create-po.dto';
import { CreateSrDto } from './dto/create-sr.dto';
import { QueryProcurementDto } from './dto/query-procurement.dto';
import { PurchaseOrderStatus } from './entities/purchase-order.entity';
import { ProcurementService } from './procurement.service';
export declare class ProcurementController {
    private readonly service;
    constructor(service: ProcurementService);
    findAllPos(query: QueryProcurementDto): Promise<{
        items: import("./entities/purchase-order.entity").PurchaseOrderEntity[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOnePo(id: string): Promise<import("./entities/purchase-order.entity").PurchaseOrderEntity>;
    createPo(dto: CreatePoDto, req: any): Promise<import("./entities/purchase-order.entity").PurchaseOrderEntity>;
    updatePoStatus(id: string, status: PurchaseOrderStatus, req: any): Promise<import("./entities/purchase-order.entity").PurchaseOrderEntity>;
    findAllGrs(query: QueryProcurementDto): Promise<{
        items: import("./entities/goods-receipt.entity").GoodsReceiptEntity[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOneGr(id: string): Promise<import("./entities/goods-receipt.entity").GoodsReceiptEntity>;
    createGr(dto: CreateGrDto, req: any): Promise<import("./entities/goods-receipt.entity").GoodsReceiptEntity>;
    previewCost(dto: CreateGrDto): {
        productId: string;
        variantId: string | null;
        qtyReceived: number;
        qtyReturned: number;
        qtyGood: number;
        unitPrice: number;
        allocatedExtraCost: number;
        landedCost: number;
        totalLandedCost: number;
    }[];
    confirmGr(id: string, req: any): Promise<import("./entities/goods-receipt.entity").GoodsReceiptEntity>;
    cancelGr(id: string, req: any): Promise<import("./entities/goods-receipt.entity").GoodsReceiptEntity>;
    findAllSrs(query: QueryProcurementDto): Promise<{
        items: (import("./entities/supplier-return.entity").SupplierReturnEntity & {
            totalRefund: string;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOneSr(id: string): Promise<import("./entities/supplier-return.entity").SupplierReturnEntity & {
        totalRefund: string;
    }>;
    createSr(dto: CreateSrDto, req: any): Promise<import("./entities/supplier-return.entity").SupplierReturnEntity & {
        totalRefund: string;
    }>;
    confirmSr(id: string, req: any): Promise<import("./entities/supplier-return.entity").SupplierReturnEntity & {
        totalRefund: string;
    }>;
    getCostHistory(productId: string): Promise<import("./entities/product-cost-history.entity").ProductCostHistoryEntity[]>;
}
