import { Repository } from 'typeorm';
import { CategoryEntity } from '../categories/entities/category.entity';
import { CommentEntity } from '../comments/entities/comment.entity';
import { SimpleCacheService } from '../common/simple-cache.service';
import { CouponUsageEntity } from '../discounts/entities/coupon-usage.entity';
import { DiscountEntity } from '../discounts/entities/discount.entity';
import { OrderItemEntity } from '../orders/entities/order-item.entity';
import { OrderEntity, OrderStatus, PaymentStatus } from '../orders/entities/order.entity';
import { PurchaseOrderEntity } from '../procurement/entities/purchase-order.entity';
import { InventoryTransactionEntity } from '../products/entities/inventory-transaction.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { RiceDiagnosisHistoryEntity } from '../rice-diagnosis/entities/rice-diagnosis-history.entity';
import { UserEntity } from '../users/entities/user.entity';
import { QueryCouponUsageDto } from './dto/query-coupon-usage.dto';
import { QueryInventoryLedgerDto, QueryProfitabilityDto, QueryAgingDebtDto, RecordPoPaymentDto } from './dto/query-inventory-ledger.dto';
import { QuerySalesSummaryDto } from './dto/query-sales-summary.dto';
export declare class ReportsService {
    private readonly ordersRepository;
    private readonly orderItemsRepository;
    private readonly productsRepository;
    private readonly usersRepository;
    private readonly inventoryTransactionsRepository;
    private readonly discountsRepository;
    private readonly couponUsageRepository;
    private readonly categoriesRepository;
    private readonly commentsRepository;
    private readonly riceDiagnosisHistoryRepository;
    private readonly poRepository;
    private readonly cache;
    constructor(ordersRepository: Repository<OrderEntity>, orderItemsRepository: Repository<OrderItemEntity>, productsRepository: Repository<ProductEntity>, usersRepository: Repository<UserEntity>, inventoryTransactionsRepository: Repository<InventoryTransactionEntity>, discountsRepository: Repository<DiscountEntity>, couponUsageRepository: Repository<CouponUsageEntity>, categoriesRepository: Repository<CategoryEntity>, commentsRepository: Repository<CommentEntity>, riceDiagnosisHistoryRepository: Repository<RiceDiagnosisHistoryEntity>, poRepository: Repository<PurchaseOrderEntity>, cache: SimpleCacheService);
    getDashboard(): Promise<{
        refreshedAt: string;
        filters: {
            salesFrom: string;
            salesTo: string;
        };
        totals: {
            users: number;
            customers: number;
            activeCustomers: number;
            products: number;
            categories: number;
            orders: number;
            pendingOrders: number;
            cancelledOrders: number;
            deliveredOrders: number;
            paidOrders: number;
            revenue: string;
            todayOrders: number;
            todayRevenue: string;
            yesterdayRevenue: string;
            revenueChangePct: number;
            last7Revenue: string;
            last30Revenue: string;
            averageOrderValue: string;
            lowStockProducts: number;
            outOfStockProducts: number;
            expiredSoonProducts: number;
            activeDiscounts: number;
            couponUsageCount: number;
            availableUnits: number;
            reservedUnits: number;
            inventoryValue: string;
            potentialRevenue: string;
            visibleReviews: number;
            averageRating: string;
            totalDiagnoses: number;
        };
        topProducts: any[];
        inventorySummary: any[];
        salesByDay: any[];
        salesByMonth: any[];
        salesByHour: any[];
        orderStatusSummary: any[];
        paymentSummary: any[];
        paymentMethodSummary: any[];
        categoryRevenue: any[];
        inventoryByCategory: any[];
        stockHealth: any[];
        lowStockProductList: any[];
        stockRiskProducts: any[];
        topCustomers: any[];
        customerSegments: {
            segment: string;
            count: number;
            revenue: string;
        }[];
        newCustomersByDay: any[];
        couponEffectiveness: any[];
        reviewSummary: any[];
        diagnosesByDisease: any[];
        recentOrders: {
            id: string;
            orderId: string;
            fullName: string;
            totalPayment: string;
            status: OrderStatus;
            paymentStatus: PaymentStatus;
            createdAt: Date;
        }[];
    }>;
    getSalesSummary(query: QuerySalesSummaryDto): Promise<{
        filters: {
            from: string | null;
            to: string | null;
        };
        summary: {
            orders: number;
            revenue: string;
            discountAmount: string;
            deliveryRevenue: string;
        };
        orderStatusSummary: any[];
        paymentSummary: any[];
        salesByDay: any[];
        topCustomers: any[];
    }>;
    getCouponUsage(query: QueryCouponUsageDto): Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        summary: any[];
        items: any[];
    }>;
    getInventoryValuation(): Promise<{
        asOf: Date;
        summary: {
            totalProducts: number;
            totalQty: number;
            totalValue: number;
            potentialRevenue: number;
            potentialProfit: number;
        };
        items: {
            productId: string;
            productName: string;
            qtyAvailable: number;
            qtyReserved: number;
            totalQty: number;
            avgCost: number;
            lastCost: number;
            retailPrice: number;
            totalValue: number;
            potentialRevenue: number;
            potentialProfit: number;
        }[];
    }>;
    private computeInventoryValuation;
    getInventoryLedger(query: QueryInventoryLedgerDto): Promise<{
        items: {
            productName: string;
            transactionId: string;
            productId: string;
            variantId: string | null;
            performedBy: string | null;
            transactionType: import("../products/entities/inventory-transaction.entity").InventoryTransactionType;
            quantityChange: number;
            quantityBefore: number | null;
            quantityAfter: number | null;
            unitCostAtTime: string | null;
            referenceType: string | null;
            referenceId: string | null;
            note: string | null;
            relatedOrderId: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getProfitability(query: QueryProfitabilityDto): Promise<{
        items: {
            productId: string;
            productName: string;
            soldQty: number;
            revenue: number;
            cogs: number;
            grossProfit: number;
            marginPct: number;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    } | {
        items: {
            revenue: number;
            soldQty: number;
            period: string;
        }[];
        meta?: undefined;
    }>;
    getAgingDebt(query: QueryAgingDebtDto): Promise<{
        summary: {
            asOf: string;
            totalPos: number;
            totalOutstanding: number;
            buckets: {
                current: {
                    count: number;
                    total: number;
                };
                days1_7: {
                    count: number;
                    total: number;
                };
                days8_30: {
                    count: number;
                    total: number;
                };
                days31_60: {
                    count: number;
                    total: number;
                };
                days61_90: {
                    count: number;
                    total: number;
                };
                over90: {
                    count: number;
                    total: number;
                };
            };
        };
        items: PurchaseOrderEntity[];
    }>;
    recordPoPayment(dto: RecordPoPaymentDto, userId?: string): Promise<PurchaseOrderEntity | null>;
    private buildDateRangeWhere;
    private buildDateRangeSql;
}
