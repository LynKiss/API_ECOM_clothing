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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("../categories/entities/category.entity");
const comment_entity_1 = require("../comments/entities/comment.entity");
const simple_cache_service_1 = require("../common/simple-cache.service");
const coupon_usage_entity_1 = require("../discounts/entities/coupon-usage.entity");
const discount_entity_1 = require("../discounts/entities/discount.entity");
const order_item_entity_1 = require("../orders/entities/order-item.entity");
const order_refund_entity_1 = require("../orders/entities/order-refund.entity");
const order_entity_1 = require("../orders/entities/order.entity");
const purchase_order_entity_1 = require("../procurement/entities/purchase-order.entity");
const inventory_transaction_entity_1 = require("../products/entities/inventory-transaction.entity");
const product_entity_1 = require("../products/entities/product.entity");
const rice_diagnosis_history_entity_1 = require("../rice-diagnosis/entities/rice-diagnosis-history.entity");
const user_entity_1 = require("../users/entities/user.entity");
let ReportsService = class ReportsService {
    ordersRepository;
    orderItemsRepository;
    orderRefundsRepository;
    productsRepository;
    usersRepository;
    inventoryTransactionsRepository;
    discountsRepository;
    couponUsageRepository;
    categoriesRepository;
    commentsRepository;
    riceDiagnosisHistoryRepository;
    poRepository;
    cache;
    constructor(ordersRepository, orderItemsRepository, orderRefundsRepository, productsRepository, usersRepository, inventoryTransactionsRepository, discountsRepository, couponUsageRepository, categoriesRepository, commentsRepository, riceDiagnosisHistoryRepository, poRepository, cache) {
        this.ordersRepository = ordersRepository;
        this.orderItemsRepository = orderItemsRepository;
        this.orderRefundsRepository = orderRefundsRepository;
        this.productsRepository = productsRepository;
        this.usersRepository = usersRepository;
        this.inventoryTransactionsRepository = inventoryTransactionsRepository;
        this.discountsRepository = discountsRepository;
        this.couponUsageRepository = couponUsageRepository;
        this.categoriesRepository = categoriesRepository;
        this.commentsRepository = commentsRepository;
        this.riceDiagnosisHistoryRepository = riceDiagnosisHistoryRepository;
        this.poRepository = poRepository;
        this.cache = cache;
    }
    async getDashboard() {
        const revenueStatuses = [
            order_entity_1.OrderStatus.DELIVERED,
            order_entity_1.OrderStatus.PARTIAL_DELIVERED,
        ];
        const now = new Date();
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);
        const yesterdayStart = new Date(todayStart);
        yesterdayStart.setDate(yesterdayStart.getDate() - 1);
        const last7DaysStart = new Date(todayStart);
        last7DaysStart.setDate(last7DaysStart.getDate() - 6);
        const last30DaysStart = new Date(todayStart);
        last30DaysStart.setDate(last30DaysStart.getDate() - 29);
        const next30Days = new Date(todayStart);
        next30Days.setDate(next30Days.getDate() + 30);
        const revenueQuery = (from, to) => {
            const qb = this.ordersRepository
                .createQueryBuilder('order')
                .select('COALESCE(SUM(order.total_payment), 0)', 'revenue')
                .where('order.order_status IN (:...statuses)', {
                statuses: revenueStatuses,
            });
            if (from) {
                qb.andWhere('order.created_at >= :from', { from });
            }
            if (to) {
                qb.andWhere('order.created_at < :to', { to });
            }
            return qb.getRawOne();
        };
        const refundQuery = (from, to) => {
            const qb = this.orderRefundsRepository
                .createQueryBuilder('refund')
                .select('COALESCE(SUM(refund.amount), 0)', 'amount')
                .where('refund.refund_status = :status', {
                status: order_refund_entity_1.OrderRefundStatus.COMPLETED,
            });
            if (from)
                qb.andWhere('refund.updated_at >= :from', { from });
            if (to)
                qb.andWhere('refund.updated_at < :to', { to });
            return qb.getRawOne();
        };
        const [totalUsers, totalCustomers, activeCustomers, totalProducts, totalCategories, totalOrders, pendingOrders, cancelledOrders, deliveredOrders, paidOrders, revenueRow, refundRow, todayOrders, todayRevenueRow, todayRefundRow, yesterdayRevenueRow, yesterdayRefundRow, last7RevenueRow, last7RefundRow, last30RevenueRow, last30RefundRow, lowStockProducts, outOfStockProducts, expiredSoonProducts, activeDiscounts, couponUsageCount, inventoryValueRow, visibleReviews, avgReviewRow, totalDiagnoses,] = await Promise.all([
            this.usersRepository.count(),
            this.usersRepository.count({ where: { role: user_entity_1.UserRole.CUSTOMER } }),
            this.usersRepository.count({
                where: { role: user_entity_1.UserRole.CUSTOMER, isActive: true },
            }),
            this.productsRepository.count(),
            this.categoriesRepository.count(),
            this.ordersRepository.count(),
            this.ordersRepository.count({
                where: { orderStatus: order_entity_1.OrderStatus.PENDING },
            }),
            this.ordersRepository.count({
                where: { orderStatus: order_entity_1.OrderStatus.CANCELLED },
            }),
            this.ordersRepository.count({
                where: { orderStatus: order_entity_1.OrderStatus.DELIVERED },
            }),
            this.ordersRepository.count({
                where: { paymentStatus: order_entity_1.PaymentStatus.PAID },
            }),
            revenueQuery(),
            refundQuery(),
            this.ordersRepository
                .createQueryBuilder('order')
                .where('order.created_at >= :todayStart', { todayStart })
                .getCount(),
            revenueQuery(todayStart),
            refundQuery(todayStart),
            revenueQuery(yesterdayStart, todayStart),
            refundQuery(yesterdayStart, todayStart),
            revenueQuery(last7DaysStart),
            refundQuery(last7DaysStart),
            revenueQuery(last30DaysStart),
            refundQuery(last30DaysStart),
            this.productsRepository.count({
                where: { quantityAvailable: (0, typeorm_2.LessThanOrEqual)(10) },
            }),
            this.productsRepository.count({
                where: { quantityAvailable: (0, typeorm_2.LessThanOrEqual)(0) },
            }),
            this.productsRepository
                .createQueryBuilder('product')
                .where('product.expired_at IS NOT NULL')
                .andWhere('product.expired_at <= :next30Days', { next30Days })
                .getCount(),
            this.discountsRepository.count({
                where: { isActive: true },
            }),
            this.couponUsageRepository.count(),
            this.productsRepository
                .createQueryBuilder('product')
                .select('COALESCE(SUM(product.quantity_available), 0)', 'availableUnits')
                .addSelect('COALESCE(SUM(product.quantity_reserved), 0)', 'reservedUnits')
                .addSelect('COALESCE(SUM(product.quantity_available * COALESCE(product.avg_cost, 0)), 0)', 'inventoryValue')
                .addSelect('COALESCE(SUM(product.quantity_available * product.product_price), 0)', 'potentialRevenue')
                .getRawOne(),
            this.commentsRepository.count({
                where: { status: comment_entity_1.ProductCommentStatus.VISIBLE },
            }),
            this.commentsRepository
                .createQueryBuilder('comment')
                .select('COALESCE(AVG(comment.rating), 0)', 'averageRating')
                .where('comment.status = :status', {
                status: comment_entity_1.ProductCommentStatus.VISIBLE,
            })
                .andWhere('comment.rating IS NOT NULL')
                .getRawOne(),
            this.riceDiagnosisHistoryRepository.count(),
        ]);
        const topProducts = await this.orderItemsRepository
            .createQueryBuilder('item')
            .innerJoin(order_entity_1.OrderEntity, 'order', 'order.order_id = item.order_id')
            .select('item.product_id', 'productId')
            .addSelect('item.product_name', 'productName')
            .addSelect('SUM(item.quantity)', 'soldQuantity')
            .addSelect('SUM(item.line_total)', 'revenue')
            .where('order.order_status IN (:...statuses)', {
            statuses: revenueStatuses,
        })
            .groupBy('item.product_id')
            .addGroupBy('item.product_name')
            .orderBy('SUM(item.quantity)', 'DESC')
            .limit(10)
            .getRawMany();
        const inventorySummary = await this.inventoryTransactionsRepository
            .createQueryBuilder('transaction')
            .select('transaction.transaction_type', 'transactionType')
            .addSelect('COUNT(*)', 'count')
            .groupBy('transaction.transaction_type')
            .getRawMany();
        const salesByDay = await this.ordersRepository
            .createQueryBuilder('order')
            .select('DATE(order.created_at)', 'date')
            .addSelect('COUNT(*)', 'orders')
            .addSelect('COALESCE(SUM(order.total_payment), 0)', 'revenue')
            .where('order.order_status IN (:...statuses)', {
            statuses: revenueStatuses,
        })
            .andWhere('order.created_at >= :from', { from: last30DaysStart })
            .groupBy('DATE(order.created_at)')
            .orderBy('DATE(order.created_at)', 'ASC')
            .getRawMany();
        const salesByMonth = await this.ordersRepository
            .createQueryBuilder('order')
            .select("DATE_FORMAT(order.created_at, '%Y-%m')", 'period')
            .addSelect('COUNT(*)', 'orders')
            .addSelect('COALESCE(SUM(order.total_payment), 0)', 'revenue')
            .where('order.order_status IN (:...statuses)', {
            statuses: revenueStatuses,
        })
            .andWhere('order.created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)')
            .groupBy('period')
            .orderBy('period', 'ASC')
            .getRawMany();
        const salesByHour = await this.ordersRepository
            .createQueryBuilder('order')
            .select('HOUR(order.created_at)', 'hour')
            .addSelect('COUNT(*)', 'orders')
            .addSelect('COALESCE(SUM(order.total_payment), 0)', 'revenue')
            .where('order.order_status IN (:...statuses)', {
            statuses: revenueStatuses,
        })
            .andWhere('order.created_at >= :from', { from: last30DaysStart })
            .groupBy('hour')
            .orderBy('hour', 'ASC')
            .getRawMany();
        const orderStatusSummary = await this.ordersRepository
            .createQueryBuilder('order')
            .select('order.order_status', 'status')
            .addSelect('COUNT(*)', 'count')
            .addSelect('COALESCE(SUM(order.total_payment), 0)', 'revenue')
            .groupBy('order.order_status')
            .orderBy('COUNT(*)', 'DESC')
            .getRawMany();
        const paymentSummary = await this.ordersRepository
            .createQueryBuilder('order')
            .select('order.payment_status', 'paymentStatus')
            .addSelect('COUNT(*)', 'count')
            .addSelect('COALESCE(SUM(order.total_payment), 0)', 'revenue')
            .groupBy('order.payment_status')
            .orderBy('COUNT(*)', 'DESC')
            .getRawMany();
        const paymentMethodSummary = await this.ordersRepository
            .createQueryBuilder('order')
            .select('order.payment_method', 'paymentMethod')
            .addSelect('COUNT(*)', 'count')
            .addSelect('COALESCE(SUM(order.total_payment), 0)', 'revenue')
            .groupBy('order.payment_method')
            .orderBy('COUNT(*)', 'DESC')
            .getRawMany();
        const categoryRevenue = await this.orderItemsRepository
            .createQueryBuilder('item')
            .innerJoin(order_entity_1.OrderEntity, 'order', 'order.order_id = item.order_id')
            .innerJoin(product_entity_1.ProductEntity, 'product', 'product.product_id = item.product_id')
            .leftJoin(category_entity_1.CategoryEntity, 'category', 'category.category_id = product.category_id')
            .select("COALESCE(category.category_name, 'Chua phan loai')", 'categoryName')
            .addSelect('COUNT(DISTINCT order.order_id)', 'orders')
            .addSelect('SUM(item.quantity)', 'soldQuantity')
            .addSelect('COALESCE(SUM(item.line_total), 0)', 'revenue')
            .where('order.order_status IN (:...statuses)', {
            statuses: revenueStatuses,
        })
            .groupBy('category.category_id')
            .addGroupBy('category.category_name')
            .orderBy('SUM(item.line_total)', 'DESC')
            .limit(8)
            .getRawMany();
        const inventoryByCategory = await this.productsRepository
            .createQueryBuilder('product')
            .leftJoin(category_entity_1.CategoryEntity, 'category', 'category.category_id = product.category_id')
            .select("COALESCE(category.category_name, 'Chua phan loai')", 'categoryName')
            .addSelect('COUNT(*)', 'products')
            .addSelect('COALESCE(SUM(product.quantity_available), 0)', 'availableUnits')
            .addSelect('COALESCE(SUM(product.quantity_reserved), 0)', 'reservedUnits')
            .addSelect('COALESCE(SUM(product.quantity_available * COALESCE(product.avg_cost, 0)), 0)', 'inventoryValue')
            .groupBy('category.category_id')
            .addGroupBy('category.category_name')
            .orderBy('SUM(product.quantity_available)', 'DESC')
            .limit(8)
            .getRawMany();
        const stockHealth = await this.productsRepository
            .createQueryBuilder('product')
            .select(`CASE
          WHEN product.quantity_available <= 0 THEN 'out'
          WHEN product.quantity_available <= 10 THEN 'low'
          WHEN product.quantity_available <= 50 THEN 'medium'
          ELSE 'healthy'
        END`, 'level')
            .addSelect('COUNT(*)', 'count')
            .addSelect('COALESCE(SUM(product.quantity_available), 0)', 'quantity')
            .groupBy('level')
            .orderBy('COUNT(*)', 'DESC')
            .getRawMany();
        const lowStockProductList = await this.productsRepository
            .createQueryBuilder('product')
            .select('product.product_id', 'productId')
            .addSelect('product.product_name', 'productName')
            .addSelect('product.quantity_available', 'quantityAvailable')
            .addSelect('product.quantity_reserved', 'quantityReserved')
            .addSelect('product.product_price', 'productPrice')
            .where('product.quantity_available <= :threshold', { threshold: 10 })
            .orderBy('product.quantity_available', 'ASC')
            .limit(10)
            .getRawMany();
        const stockRiskProducts = await this.orderItemsRepository
            .createQueryBuilder('item')
            .innerJoin(order_entity_1.OrderEntity, 'order', 'order.order_id = item.order_id')
            .innerJoin(product_entity_1.ProductEntity, 'product', 'product.product_id = item.product_id')
            .select('item.product_id', 'productId')
            .addSelect('item.product_name', 'productName')
            .addSelect('product.quantity_available', 'quantityAvailable')
            .addSelect('SUM(item.quantity)', 'soldLast30')
            .addSelect('ROUND(product.quantity_available / NULLIF(SUM(item.quantity) / 30, 0), 1)', 'daysOfCover')
            .where('order.order_status IN (:...statuses)', {
            statuses: revenueStatuses,
        })
            .andWhere('order.created_at >= :from', { from: last30DaysStart })
            .groupBy('item.product_id')
            .addGroupBy('item.product_name')
            .addGroupBy('product.quantity_available')
            .having('SUM(item.quantity) > 0')
            .orderBy('daysOfCover', 'ASC')
            .limit(8)
            .getRawMany();
        const topCustomers = await this.ordersRepository
            .createQueryBuilder('order')
            .select('order.user_id', 'userId')
            .addSelect('order.full_name', 'fullName')
            .addSelect('order.phone', 'phone')
            .addSelect('COUNT(*)', 'orders')
            .addSelect('COALESCE(SUM(order.total_payment), 0)', 'revenue')
            .where('order.order_status IN (:...statuses)', {
            statuses: revenueStatuses,
        })
            .groupBy('order.user_id')
            .addGroupBy('order.full_name')
            .addGroupBy('order.phone')
            .orderBy('COALESCE(SUM(order.total_payment), 0)', 'DESC')
            .limit(10)
            .getRawMany();
        const customerSpendRows = await this.ordersRepository
            .createQueryBuilder('order')
            .select('order.user_id', 'userId')
            .addSelect('COUNT(*)', 'orders')
            .addSelect('COALESCE(SUM(order.total_payment), 0)', 'revenue')
            .where('order.order_status IN (:...statuses)', {
            statuses: revenueStatuses,
        })
            .groupBy('order.user_id')
            .getRawMany();
        const customerSegments = [
            {
                segment: 'Chua mua',
                count: Math.max(totalCustomers - customerSpendRows.length, 0),
                revenue: '0',
            },
            {
                segment: 'Mua 1 lan',
                count: customerSpendRows.filter((row) => Number(row.orders) === 1).length,
                revenue: customerSpendRows
                    .filter((row) => Number(row.orders) === 1)
                    .reduce((sum, row) => sum + Number(row.revenue), 0)
                    .toFixed(2),
            },
            {
                segment: 'Lap lai',
                count: customerSpendRows.filter((row) => {
                    const orders = Number(row.orders);
                    return orders >= 2 && orders <= 4;
                }).length,
                revenue: customerSpendRows
                    .filter((row) => {
                    const orders = Number(row.orders);
                    return orders >= 2 && orders <= 4;
                })
                    .reduce((sum, row) => sum + Number(row.revenue), 0)
                    .toFixed(2),
            },
            {
                segment: 'Than thiet',
                count: customerSpendRows.filter((row) => Number(row.orders) >= 5).length,
                revenue: customerSpendRows
                    .filter((row) => Number(row.orders) >= 5)
                    .reduce((sum, row) => sum + Number(row.revenue), 0)
                    .toFixed(2),
            },
        ];
        const newCustomersByDay = await this.usersRepository
            .createQueryBuilder('user')
            .select('DATE(user.created_at)', 'date')
            .addSelect('COUNT(*)', 'customers')
            .where('user.role = :role', { role: user_entity_1.UserRole.CUSTOMER })
            .andWhere('user.created_at >= :from', { from: last30DaysStart })
            .groupBy('DATE(user.created_at)')
            .orderBy('DATE(user.created_at)', 'ASC')
            .getRawMany();
        const couponEffectiveness = await this.discountsRepository
            .createQueryBuilder('discount')
            .leftJoin(coupon_usage_entity_1.CouponUsageEntity, 'usage', 'usage.discount_id = discount.discount_id')
            .leftJoin(order_entity_1.OrderEntity, 'order', 'order.order_id = usage.order_id')
            .select('discount.discount_id', 'discountId')
            .addSelect('discount.discount_code', 'discountCode')
            .addSelect('discount.discount_name', 'discountName')
            .addSelect('discount.discount_type', 'discountType')
            .addSelect('discount.discount_value', 'discountValue')
            .addSelect('COUNT(usage.usage_id)', 'timesUsed')
            .addSelect('COALESCE(SUM(order.discount_amount), 0)', 'discountGiven')
            .addSelect('COALESCE(SUM(order.total_payment), 0)', 'orderRevenue')
            .groupBy('discount.discount_id')
            .addGroupBy('discount.discount_code')
            .addGroupBy('discount.discount_name')
            .addGroupBy('discount.discount_type')
            .addGroupBy('discount.discount_value')
            .orderBy('COUNT(usage.usage_id)', 'DESC')
            .limit(8)
            .getRawMany();
        const reviewSummary = await this.commentsRepository
            .createQueryBuilder('comment')
            .select('comment.rating', 'rating')
            .addSelect('COUNT(*)', 'count')
            .where('comment.status = :status', {
            status: comment_entity_1.ProductCommentStatus.VISIBLE,
        })
            .andWhere('comment.rating IS NOT NULL')
            .groupBy('comment.rating')
            .orderBy('comment.rating', 'ASC')
            .getRawMany();
        const diagnosesByDisease = await this.riceDiagnosisHistoryRepository
            .createQueryBuilder('diagnosis')
            .select("COALESCE(diagnosis.predicted_disease_key, diagnosis.predicted_label, 'unknown')", 'disease')
            .addSelect('COUNT(*)', 'count')
            .addSelect('COALESCE(AVG(diagnosis.confidence), 0)', 'avgConfidence')
            .groupBy('disease')
            .orderBy('COUNT(*)', 'DESC')
            .limit(8)
            .getRawMany();
        const recentOrders = await this.ordersRepository.find({
            order: { createdAt: 'DESC' },
            take: 8,
        });
        const totalRevenue = Math.max(0, Number(revenueRow?.revenue ?? 0) - Number(refundRow?.amount ?? 0));
        const todayRevenue = Math.max(0, Number(todayRevenueRow?.revenue ?? 0) - Number(todayRefundRow?.amount ?? 0));
        const yesterdayRevenue = Math.max(0, Number(yesterdayRevenueRow?.revenue ?? 0) -
            Number(yesterdayRefundRow?.amount ?? 0));
        const last7Revenue = Math.max(0, Number(last7RevenueRow?.revenue ?? 0) - Number(last7RefundRow?.amount ?? 0));
        const last30Revenue = Math.max(0, Number(last30RevenueRow?.revenue ?? 0) -
            Number(last30RefundRow?.amount ?? 0));
        return {
            refreshedAt: now.toISOString(),
            filters: {
                salesFrom: last30DaysStart.toISOString(),
                salesTo: now.toISOString(),
            },
            totals: {
                users: totalUsers,
                customers: totalCustomers,
                activeCustomers,
                products: totalProducts,
                categories: totalCategories,
                orders: totalOrders,
                pendingOrders,
                cancelledOrders,
                deliveredOrders,
                paidOrders,
                revenue: totalRevenue.toFixed(2),
                todayOrders,
                todayRevenue: todayRevenue.toFixed(2),
                yesterdayRevenue: yesterdayRevenue.toFixed(2),
                revenueChangePct: yesterdayRevenue > 0
                    ? Number((((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100).toFixed(2))
                    : todayRevenue > 0
                        ? 100
                        : 0,
                last7Revenue: last7Revenue.toFixed(2),
                last30Revenue: last30Revenue.toFixed(2),
                averageOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00',
                lowStockProducts,
                outOfStockProducts,
                expiredSoonProducts,
                activeDiscounts,
                couponUsageCount,
                availableUnits: Number(inventoryValueRow?.availableUnits ?? 0),
                reservedUnits: Number(inventoryValueRow?.reservedUnits ?? 0),
                inventoryValue: Number(inventoryValueRow?.inventoryValue ?? 0).toFixed(2),
                potentialRevenue: Number(inventoryValueRow?.potentialRevenue ?? 0).toFixed(2),
                visibleReviews,
                averageRating: Number(avgReviewRow?.averageRating ?? 0).toFixed(2),
                totalDiagnoses,
            },
            meta: {
                revenuePolicy: 'Doanh thu tài chính chỉ tính đơn đã giao/đã giao một phần và trừ refund completed.',
                refundPolicy: 'Chỉ order_refunds.refund_status = completed mới trừ doanh thu.',
            },
            topProducts,
            inventorySummary,
            salesByDay,
            salesByMonth,
            salesByHour,
            orderStatusSummary,
            paymentSummary,
            paymentMethodSummary,
            categoryRevenue,
            inventoryByCategory,
            stockHealth,
            lowStockProductList,
            stockRiskProducts,
            topCustomers,
            customerSegments,
            newCustomersByDay,
            couponEffectiveness,
            reviewSummary,
            diagnosesByDisease,
            recentOrders: recentOrders.map((order) => ({
                id: order.orderId,
                orderId: order.orderId,
                fullName: order.fullName,
                totalPayment: order.totalPayment,
                status: order.orderStatus,
                paymentStatus: order.paymentStatus,
                createdAt: order.createdAt,
            })),
        };
    }
    async getSalesSummary(query) {
        const where = this.buildDateRangeWhere(query);
        const [orders, orderStatusSummary, paymentSummary, salesByDay, topCustomers,] = await Promise.all([
            this.ordersRepository.find({
                where,
                order: { createdAt: 'DESC' },
            }),
            this.ordersRepository
                .createQueryBuilder('order')
                .select('order.order_status', 'status')
                .addSelect('COUNT(*)', 'count')
                .where(this.buildDateRangeSql('order.created_at', query))
                .groupBy('order.order_status')
                .getRawMany(),
            this.ordersRepository
                .createQueryBuilder('order')
                .select('order.payment_status', 'paymentStatus')
                .addSelect('COUNT(*)', 'count')
                .where(this.buildDateRangeSql('order.created_at', query))
                .groupBy('order.payment_status')
                .getRawMany(),
            this.ordersRepository
                .createQueryBuilder('order')
                .select('DATE(order.created_at)', 'date')
                .addSelect('COUNT(*)', 'orders')
                .addSelect('COALESCE(SUM(order.total_payment), 0)', 'revenue')
                .where(this.buildDateRangeSql('order.created_at', query))
                .groupBy('DATE(order.created_at)')
                .orderBy('DATE(order.created_at)', 'ASC')
                .getRawMany(),
            this.ordersRepository
                .createQueryBuilder('order')
                .select('order.user_id', 'userId')
                .addSelect('order.full_name', 'fullName')
                .addSelect('order.phone', 'phone')
                .addSelect('COUNT(*)', 'orders')
                .addSelect('COALESCE(SUM(order.total_payment), 0)', 'revenue')
                .where(this.buildDateRangeSql('order.created_at', query))
                .groupBy('order.user_id')
                .addGroupBy('order.full_name')
                .addGroupBy('order.phone')
                .orderBy('COALESCE(SUM(order.total_payment), 0)', 'DESC')
                .limit(10)
                .getRawMany(),
        ]);
        const totalRevenue = orders
            .filter((order) => [
            order_entity_1.OrderStatus.CONFIRMED,
            order_entity_1.OrderStatus.PROCESSING,
            order_entity_1.OrderStatus.SHIPPING,
            order_entity_1.OrderStatus.DELIVERED,
        ].includes(order.orderStatus))
            .reduce((sum, order) => sum + Number(order.totalPayment), 0);
        const totalDiscount = orders.reduce((sum, order) => sum + Number(order.discountAmount), 0);
        const totalDeliveryRevenue = orders.reduce((sum, order) => sum + Number(order.deliveryCost), 0);
        return {
            filters: {
                from: query.from ?? null,
                to: query.to ?? null,
            },
            summary: {
                orders: orders.length,
                revenue: totalRevenue.toFixed(2),
                discountAmount: totalDiscount.toFixed(2),
                deliveryRevenue: totalDeliveryRevenue.toFixed(2),
            },
            orderStatusSummary,
            paymentSummary,
            salesByDay,
            topCustomers,
        };
    }
    async getCouponUsage(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const queryBuilder = this.couponUsageRepository
            .createQueryBuilder('usage')
            .leftJoin(discount_entity_1.DiscountEntity, 'discount', 'discount.discount_id = usage.discount_id')
            .leftJoin(user_entity_1.UserEntity, 'user', 'user.user_id = usage.user_id')
            .select([
            'usage.couponUsageId AS id',
            'usage.discountId AS discountId',
            'usage.userId AS userId',
            'usage.orderId AS orderId',
            'usage.createdAt AS createdAt',
            'discount.discount_code AS discountCode',
            'discount.discount_name AS discountName',
            'user.username AS username',
            'user.email AS email',
        ]);
        if (query.discountId) {
            queryBuilder.andWhere('usage.discount_id = :discountId', {
                discountId: query.discountId,
            });
        }
        if (query.userId) {
            queryBuilder.andWhere('usage.user_id = :userId', {
                userId: query.userId,
            });
        }
        if (query.from) {
            queryBuilder.andWhere('usage.created_at >= :from', { from: query.from });
        }
        if (query.to) {
            queryBuilder.andWhere('usage.created_at <= :to', { to: query.to });
        }
        queryBuilder
            .orderBy('usage.created_at', 'DESC')
            .offset((page - 1) * limit)
            .limit(limit);
        const [items, total, summary] = await Promise.all([
            queryBuilder.getRawMany(),
            queryBuilder.getCount(),
            this.couponUsageRepository
                .createQueryBuilder('usage')
                .select('usage.discount_id', 'discountId')
                .addSelect('COUNT(*)', 'timesUsed')
                .groupBy('usage.discount_id')
                .orderBy('COUNT(*)', 'DESC')
                .getRawMany(),
        ]);
        return {
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            summary,
            items,
        };
    }
    async getInventoryValuation() {
        return this.cache.getOrCompute('reports:inventory-valuation', 120, () => this.computeInventoryValuation());
    }
    async computeInventoryValuation() {
        const products = await this.productsRepository
            .createQueryBuilder('p')
            .select([
            'p.product_id AS productId',
            'p.product_name AS productName',
            'p.quantity_available AS qtyAvailable',
            'p.quantity_reserved AS qtyReserved',
            'p.avg_cost AS avgCost',
            'p.cost_price AS lastCost',
            'p.product_price AS retailPrice',
        ])
            .where('p.quantity_available > 0 OR p.quantity_reserved > 0')
            .orderBy('p.quantity_available', 'DESC')
            .getRawMany();
        const items = products.map((p) => {
            const qtyAvail = Number(p.qtyAvailable) || 0;
            const qtyResv = Number(p.qtyReserved) || 0;
            const avgCost = Number(p.avgCost) || 0;
            const retail = Number(p.retailPrice) || 0;
            const totalQty = qtyAvail + qtyResv;
            const totalValue = totalQty * avgCost;
            const potentialRevenue = totalQty * retail;
            const potentialProfit = potentialRevenue - totalValue;
            return {
                productId: p.productId,
                productName: p.productName,
                qtyAvailable: qtyAvail,
                qtyReserved: qtyResv,
                totalQty,
                avgCost,
                lastCost: Number(p.lastCost ?? 0),
                retailPrice: retail,
                totalValue,
                potentialRevenue,
                potentialProfit,
            };
        });
        const summary = items.reduce((acc, it) => ({
            totalProducts: acc.totalProducts + 1,
            totalQty: acc.totalQty + it.totalQty,
            totalValue: acc.totalValue + it.totalValue,
            potentialRevenue: acc.potentialRevenue + it.potentialRevenue,
            potentialProfit: acc.potentialProfit + it.potentialProfit,
        }), {
            totalProducts: 0,
            totalQty: 0,
            totalValue: 0,
            potentialRevenue: 0,
            potentialProfit: 0,
        });
        return {
            asOf: new Date(),
            summary,
            items,
        };
    }
    async getInventoryLedger(query) {
        const { page = 1, limit = 30 } = query;
        const qb = this.inventoryTransactionsRepository
            .createQueryBuilder('tx')
            .orderBy('tx.createdAt', 'DESC');
        if (query.productId)
            qb.andWhere('tx.productId = :pid', { pid: query.productId });
        if (query.transactionType)
            qb.andWhere('tx.transactionType = :tt', { tt: query.transactionType });
        if (query.from)
            qb.andWhere('tx.createdAt >= :from', { from: query.from });
        if (query.to)
            qb.andWhere('tx.createdAt <= :to', { to: query.to });
        const total = await qb.getCount();
        const txs = await qb.skip((page - 1) * limit).take(limit).getMany();
        const productIds = [...new Set(txs.map((t) => t.productId))];
        let productMap = {};
        if (productIds.length > 0) {
            const products = await this.productsRepository.findBy({ productId: (0, typeorm_2.In)(productIds) });
            productMap = Object.fromEntries(products.map((p) => [p.productId, p.productName]));
        }
        const items = txs.map((tx) => ({
            ...tx,
            productName: productMap[tx.productId] ?? tx.productId,
        }));
        return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    async getProfitability(query) {
        const { groupBy = 'product' } = query;
        const completedStatuses = [
            order_entity_1.OrderStatus.DELIVERED,
            order_entity_1.OrderStatus.PARTIAL_DELIVERED,
        ];
        const qb = this.orderItemsRepository
            .createQueryBuilder('item')
            .innerJoin(order_entity_1.OrderEntity, 'o', 'o.order_id = item.order_id')
            .where('o.order_status IN (:...statuses)', { statuses: completedStatuses });
        if (query.from)
            qb.andWhere('o.created_at >= :from', { from: query.from });
        if (query.to)
            qb.andWhere('o.created_at <= :to', { to: query.to });
        if (groupBy === 'product') {
            const { page = 1, limit = 30 } = query;
            qb
                .select('item.product_id', 'productId')
                .addSelect('item.product_name', 'productName')
                .addSelect('SUM(item.quantity)', 'soldQty')
                .addSelect('SUM(item.line_total)', 'revenue')
                .groupBy('item.product_id')
                .addGroupBy('item.product_name')
                .orderBy('SUM(item.line_total)', 'DESC');
            const total = await qb.getCount();
            const rows = await qb.offset((page - 1) * limit).limit(limit).getRawMany();
            const productIds = rows.map((r) => r.productId);
            const products = productIds.length
                ? await this.productsRepository.findByIds(productIds)
                : [];
            const txCogsRows = productIds.length
                ? await this.inventoryTransactionsRepository
                    .createQueryBuilder('tx')
                    .select('tx.product_id', 'productId')
                    .addSelect('SUM(ABS(tx.quantity_change) * COALESCE(tx.unit_cost_at_time, 0))', 'totalCogs')
                    .addSelect('SUM(CASE WHEN tx.unit_cost_at_time IS NOT NULL THEN ABS(tx.quantity_change) ELSE 0 END)', 'qtyWithCost')
                    .where('tx.transaction_type = :type', { type: 'export' })
                    .andWhere('tx.product_id IN (:...pids)', { pids: productIds })
                    .andWhere('tx.related_order_id IS NOT NULL')
                    .groupBy('tx.product_id')
                    .getRawMany()
                : [];
            const cogsMap = Object.fromEntries(txCogsRows.map((r) => [
                r.productId,
                {
                    totalCogs: Number(r.totalCogs ?? 0),
                    qtyWithCost: Number(r.qtyWithCost ?? 0),
                },
            ]));
            const fallbackCostMap = Object.fromEntries(products.map((p) => [
                p.productId,
                Number(p.avgCost ?? 0) || Number(p.costPrice ?? 0),
            ]));
            const items = rows.map((r) => {
                const revenue = Number(r.revenue);
                const soldQty = Number(r.soldQty);
                const txData = cogsMap[r.productId];
                const fallbackCost = fallbackCostMap[r.productId] ?? 0;
                let cogs;
                if (txData && txData.qtyWithCost > 0) {
                    const qtyMissingCost = Math.max(0, soldQty - txData.qtyWithCost);
                    cogs = txData.totalCogs + qtyMissingCost * fallbackCost;
                }
                else {
                    cogs = soldQty * fallbackCost;
                }
                const grossProfit = revenue - cogs;
                const marginPct = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
                return {
                    productId: r.productId,
                    productName: r.productName,
                    soldQty,
                    revenue,
                    cogs,
                    grossProfit,
                    marginPct: Math.round(marginPct * 100) / 100,
                };
            });
            const unallocatedRefundRow = await this.orderRefundsRepository
                .createQueryBuilder('refund')
                .select('COALESCE(SUM(refund.amount), 0)', 'amount')
                .where('refund.refund_status = :status', {
                status: order_refund_entity_1.OrderRefundStatus.COMPLETED,
            })
                .andWhere('refund.return_id IS NULL')
                .getRawOne();
            return {
                items,
                meta: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                    revenuePolicy: 'Chỉ tính đơn đã giao/đã giao một phần; refund completed được ghi nhận qua ledger.',
                    refundPolicy: 'Refund có returnId dùng để đối chiếu dòng hàng; refund không gắn dòng được báo ở unallocatedRefund.',
                    cogsPolicy: 'COGS ưu tiên inventory transaction EXPORT, fallback avgCost/costPrice khi thiếu unit cost.',
                    unallocatedRefund: Number(unallocatedRefundRow?.amount ?? 0),
                },
            };
        }
        const dateFormat = groupBy === 'month' ? '%Y-%m' : '%Y-%m-%d';
        qb
            .select(`DATE_FORMAT(o.created_at, '${dateFormat}')`, 'period')
            .addSelect('SUM(item.line_total)', 'revenue')
            .addSelect('SUM(item.quantity)', 'soldQty')
            .groupBy('period')
            .orderBy('period', 'ASC');
        const rows = await qb.getRawMany();
        return {
            items: rows.map((r) => ({
                ...r,
                revenue: Number(r.revenue),
                soldQty: Number(r.soldQty),
            })),
            meta: {
                revenuePolicy: 'Chỉ tính đơn đã giao/đã giao một phần.',
                refundPolicy: 'Refund completed được quản lý trong order_refunds.',
            },
        };
    }
    async getAgingDebt(query) {
        const asOf = query.asOf ? new Date(query.asOf) : new Date();
        const qb = this.poRepository
            .createQueryBuilder('po')
            .where('po.payment_status != :paid', { paid: 'paid' })
            .andWhere('po.status NOT IN (:...excl)', {
            excl: [purchase_order_entity_1.PurchaseOrderStatus.DRAFT, purchase_order_entity_1.PurchaseOrderStatus.CANCELLED],
        })
            .orderBy('po.orderDate', 'ASC');
        if (query.supplierId)
            qb.andWhere('po.supplierId = :sid', { sid: query.supplierId });
        const pos = await qb.getMany();
        const buckets = {
            current: [],
            days1_7: [],
            days8_30: [],
            days31_60: [],
            days61_90: [],
            over90: [],
        };
        for (const po of pos) {
            const refDate = po.orderDate ? new Date(po.orderDate) : new Date(po.createdAt);
            const diffDays = Math.floor((asOf.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));
            const outstanding = Number(po.totalAmount) - Number(po.paidAmount);
            const enriched = { ...po, diffDays, outstanding };
            if (diffDays <= 0)
                buckets.current.push(enriched);
            else if (diffDays <= 7)
                buckets.days1_7.push(enriched);
            else if (diffDays <= 30)
                buckets.days8_30.push(enriched);
            else if (diffDays <= 60)
                buckets.days31_60.push(enriched);
            else if (diffDays <= 90)
                buckets.days61_90.push(enriched);
            else
                buckets.over90.push(enriched);
        }
        const sumOutstanding = (arr) => arr.reduce((s, po) => s + Number(po.outstanding ?? Number(po.totalAmount) - Number(po.paidAmount)), 0);
        const summary = {
            asOf: asOf.toISOString().split('T')[0],
            totalPos: pos.length,
            totalOutstanding: sumOutstanding(pos),
            buckets: {
                current: { count: buckets.current.length, total: sumOutstanding(buckets.current) },
                days1_7: { count: buckets.days1_7.length, total: sumOutstanding(buckets.days1_7) },
                days8_30: { count: buckets.days8_30.length, total: sumOutstanding(buckets.days8_30) },
                days31_60: { count: buckets.days31_60.length, total: sumOutstanding(buckets.days31_60) },
                days61_90: { count: buckets.days61_90.length, total: sumOutstanding(buckets.days61_90) },
                over90: { count: buckets.over90.length, total: sumOutstanding(buckets.over90) },
            },
        };
        return { summary, items: pos };
    }
    async recordPoPayment(dto, userId) {
        const po = await this.poRepository.findOne({ where: { poId: dto.poId } });
        if (!po)
            throw new common_1.NotFoundException('Không tìm thấy đơn đặt hàng');
        const newPaid = Number(po.paidAmount) + Number(dto.amount);
        const total = Number(po.totalAmount);
        const paymentStatus = newPaid >= total ? 'paid' : newPaid > 0 ? 'partial' : 'unpaid';
        await this.poRepository.update({ poId: dto.poId }, {
            paidAmount: String(newPaid),
            paidDate: new Date(),
            paymentStatus: paymentStatus,
            paymentNotes: dto.notes ?? null,
        });
        return this.poRepository.findOne({ where: { poId: dto.poId } });
    }
    buildDateRangeWhere(query) {
        if (query.from && query.to) {
            return {
                createdAt: (0, typeorm_2.Between)(new Date(query.from), new Date(query.to)),
            };
        }
        if (query.from) {
            return {
                createdAt: (0, typeorm_2.MoreThanOrEqual)(new Date(query.from)),
            };
        }
        if (query.to) {
            return {
                createdAt: (0, typeorm_2.LessThanOrEqual)(new Date(query.to)),
            };
        }
        return {};
    }
    buildDateRangeSql(column, query) {
        if (query.from && query.to) {
            return `${column} BETWEEN '${query.from}' AND '${query.to}'`;
        }
        if (query.from) {
            return `${column} >= '${query.from}'`;
        }
        if (query.to) {
            return `${column} <= '${query.to}'`;
        }
        return '1=1';
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.OrderEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItemEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(order_refund_entity_1.OrderRefundEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(product_entity_1.ProductEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(5, (0, typeorm_1.InjectRepository)(inventory_transaction_entity_1.InventoryTransactionEntity)),
    __param(6, (0, typeorm_1.InjectRepository)(discount_entity_1.DiscountEntity)),
    __param(7, (0, typeorm_1.InjectRepository)(coupon_usage_entity_1.CouponUsageEntity)),
    __param(8, (0, typeorm_1.InjectRepository)(category_entity_1.CategoryEntity)),
    __param(9, (0, typeorm_1.InjectRepository)(comment_entity_1.CommentEntity)),
    __param(10, (0, typeorm_1.InjectRepository)(rice_diagnosis_history_entity_1.RiceDiagnosisHistoryEntity)),
    __param(11, (0, typeorm_1.InjectRepository)(purchase_order_entity_1.PurchaseOrderEntity)),
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
        typeorm_2.Repository,
        typeorm_2.Repository,
        simple_cache_service_1.SimpleCacheService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map