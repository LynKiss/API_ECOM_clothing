import { AdjustmentReason } from './entities/stock-adjustment.entity';
import { WarehousesService } from './warehouses.service';
export declare class WarehousesController {
    private readonly service;
    constructor(service: WarehousesService);
    findAll(): Promise<import("./entities/warehouse.entity").WarehouseEntity[]>;
    findOne(id: string): Promise<import("./entities/warehouse.entity").WarehouseEntity>;
    getStock(id: string): Promise<import("./entities/warehouse-stock.entity").WarehouseStockEntity[]>;
    create(dto: {
        name: string;
        code?: string;
        address?: string;
        managerName?: string;
        phone?: string;
    }, req: any): Promise<import("./entities/warehouse.entity").WarehouseEntity>;
    update(id: string, dto: any, req: any): Promise<import("./entities/warehouse.entity").WarehouseEntity>;
    setDefault(id: string): Promise<import("./entities/warehouse.entity").WarehouseEntity>;
    findAllTransfers(page?: string, limit?: string, status?: string): Promise<{
        items: import("./entities/stock-transfer.entity").StockTransferEntity[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOneTransfer(id: string): Promise<import("./entities/stock-transfer.entity").StockTransferEntity>;
    createTransfer(dto: any, req: any): Promise<import("./entities/stock-transfer.entity").StockTransferEntity>;
    shipTransfer(id: string, req: any): Promise<import("./entities/stock-transfer.entity").StockTransferEntity>;
    receiveTransfer(id: string, items: Array<{
        productId: string;
        qtyReceived: number;
    }>, req: any): Promise<import("./entities/stock-transfer.entity").StockTransferEntity>;
    findAllAdjustments(page?: string, limit?: string, status?: string): Promise<{
        items: import("./entities/stock-adjustment.entity").StockAdjustmentEntity[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOneAdjustment(id: string): Promise<import("./entities/stock-adjustment.entity").StockAdjustmentEntity>;
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
    }, req: any): Promise<import("./entities/stock-adjustment.entity").StockAdjustmentEntity>;
    approveAdjustment(id: string, req: any): Promise<import("./entities/stock-adjustment.entity").StockAdjustmentEntity>;
    cancelAdjustment(id: string): Promise<import("./entities/stock-adjustment.entity").StockAdjustmentEntity>;
}
