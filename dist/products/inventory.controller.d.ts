import type { IUser } from '../users/users.interface';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto';
import { ImportInventoryDto } from './dto/import-inventory.dto';
import { QueryInventoryTransactionsDto } from './dto/query-inventory-transactions.dto';
import { RecordDamageDto, RecordReturnDto } from './dto/record-damage-return.dto';
import { ProductsService } from './products.service';
export declare class InventoryController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    getInventoryTransactions(query: QueryInventoryTransactionsDto): Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        items: any[];
    }>;
    importInventory(currentUser: IUser, dto: ImportInventoryDto): Promise<{
        productId: string;
        variantId: string | null;
        quantityAvailable: number;
        targetQuantity: number;
        transactionId: string;
    }>;
    adjustInventory(currentUser: IUser, dto: AdjustInventoryDto): Promise<{
        productId: string;
        variantId: string | null;
        previousQuantity: number;
        currentQuantity: number;
        quantityAvailable: number;
        quantityChange: number;
        transactionId: string;
    }>;
    recordDamage(currentUser: IUser, dto: RecordDamageDto): Promise<{
        productId: string;
        variantId: string | null;
        quantityAvailable: number;
        targetQuantity: number;
        transactionId: string;
    }>;
    recordReturn(currentUser: IUser, dto: RecordReturnDto): Promise<{
        productId: string;
        variantId: string | null;
        quantityAvailable: number;
        targetQuantity: number;
        transactionId: string;
    }>;
    getInventorySummary(): Promise<any[]>;
    getLowStockProducts(threshold?: string): Promise<any[]>;
}
