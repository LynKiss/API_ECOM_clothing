import { Repository } from 'typeorm';
import { DiscountEntity } from '../discounts/entities/discount.entity';
import { NewsEntity } from '../news/entities/news.entity';
import { OrderEntity } from '../orders/entities/order.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { SupplierEntity } from '../suppliers/entities/supplier.entity';
import { UserEntity } from '../users/entities/user.entity';
import type { IUser } from '../users/users.interface';
import { WarehouseEntity } from '../warehouses/entities/warehouse.entity';
import { AdminSearchQueryDto } from './dto/admin-search-query.dto';
type SearchItemType = 'command' | 'product' | 'order' | 'customer' | 'supplier' | 'news' | 'discount' | 'warehouse';
type SearchItem = {
    id: string;
    type: SearchItemType;
    title: string;
    subtitle: string;
    badge: string;
    path: string;
};
export declare class AdminSearchService {
    private readonly productsRepository;
    private readonly ordersRepository;
    private readonly usersRepository;
    private readonly suppliersRepository;
    private readonly newsRepository;
    private readonly discountsRepository;
    private readonly warehousesRepository;
    constructor(productsRepository: Repository<ProductEntity>, ordersRepository: Repository<OrderEntity>, usersRepository: Repository<UserEntity>, suppliersRepository: Repository<SupplierEntity>, newsRepository: Repository<NewsEntity>, discountsRepository: Repository<DiscountEntity>, warehousesRepository: Repository<WarehouseEntity>);
    search(user: IUser, query: AdminSearchQueryDto): Promise<{
        query: string;
        total: number;
        groups: {
            key: string;
            label: string;
            items: SearchItem[];
        }[];
    }>;
    private searchProducts;
    private searchOrders;
    private searchCustomers;
    private searchSuppliers;
    private searchNews;
    private searchDiscounts;
    private searchWarehouses;
    private searchCommands;
    private commands;
    private command;
    private hasAny;
    private normalize;
}
export {};
