import type { Response } from 'express';
import { QueryCouponUsageDto } from './dto/query-coupon-usage.dto';
import { QueryAgingDebtDto, QueryInventoryLedgerDto, QueryProfitabilityDto, RecordPoPaymentDto } from './dto/query-inventory-ledger.dto';
import { QuerySalesSummaryDto } from './dto/query-sales-summary.dto';
import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
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
        meta: {
            revenuePolicy: string;
            refundPolicy: string;
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
            status: import("../orders/entities/order.entity").OrderStatus;
            paymentStatus: import("../orders/entities/order.entity").PaymentStatus;
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
            revenuePolicy: string;
            refundPolicy: string;
            cogsPolicy: string;
            unallocatedRefund: number;
        };
    } | {
        items: {
            revenue: number;
            soldQty: number;
            period: string;
        }[];
        meta: {
            revenuePolicy: string;
            refundPolicy: string;
            page?: undefined;
            limit?: undefined;
            total?: undefined;
            totalPages?: undefined;
            cogsPolicy?: undefined;
            unallocatedRefund?: undefined;
        };
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
        items: import("../procurement/entities/purchase-order.entity").PurchaseOrderEntity[];
    }>;
    recordPoPayment(dto: RecordPoPaymentDto, user: {
        userId?: string;
    }): Promise<import("../procurement/entities/purchase-order.entity").PurchaseOrderEntity | null>;
    exportInventoryValuation(res: Response): Promise<void>;
    exportInventoryLedger(query: QueryInventoryLedgerDto, res: Response): Promise<void>;
    exportProfitability(query: QueryProfitabilityDto, res: Response): Promise<void>;
}
