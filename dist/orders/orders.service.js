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
var OrdersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const node_crypto_1 = require("node:crypto");
const node_crypto_2 = require("node:crypto");
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const warehouse_entity_1 = require("../warehouses/entities/warehouse.entity");
const warehouse_stock_entity_1 = require("../warehouses/entities/warehouse-stock.entity");
const cart_item_entity_1 = require("../carts/entities/cart-item.entity");
const shopping_cart_entity_1 = require("../carts/entities/shopping-cart.entity");
const discount_category_entity_1 = require("../discounts/entities/discount-category.entity");
const discount_entity_1 = require("../discounts/entities/discount.entity");
const coupon_usage_entity_1 = require("../discounts/entities/coupon-usage.entity");
const discount_product_entity_1 = require("../discounts/entities/discount-product.entity");
const inventory_transaction_entity_1 = require("../products/entities/inventory-transaction.entity");
const color_entity_1 = require("../products/entities/color.entity");
const product_entity_1 = require("../products/entities/product.entity");
const product_variant_entity_1 = require("../products/entities/product-variant.entity");
const size_entity_1 = require("../products/entities/size.entity");
const notifications_service_1 = require("../notifications/notifications.service");
const orders_admin_publisher_1 = require("./orders-admin.publisher");
const settings_service_1 = require("../settings/settings.service");
const user_entity_1 = require("../users/entities/user.entity");
const transaction_util_1 = require("../common/transaction.util");
const payment_signature_util_1 = require("../common/payment-signature.util");
const delivery_method_entity_1 = require("./entities/delivery-method.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const order_tracking_entity_1 = require("./entities/order-tracking.entity");
const order_entity_1 = require("./entities/order.entity");
const order_refund_entity_1 = require("./entities/order-refund.entity");
const order_status_history_entity_1 = require("./entities/order-status-history.entity");
const payment_transaction_entity_1 = require("./entities/payment-transaction.entity");
const return_entity_1 = require("./entities/return.entity");
const shipping_address_entity_1 = require("./entities/shipping-address.entity");
const membership_service_1 = require("../membership/membership.service");
const customer_credit_limit_entity_1 = require("../credit-limits/entities/customer-credit-limit.entity");
const RETURN_WINDOW_DAYS = 7;
const RETURN_WINDOW_MS = RETURN_WINDOW_DAYS * 24 * 60 * 60 * 1000;
let OrdersService = OrdersService_1 = class OrdersService {
    deliveryMethodsRepository;
    shippingAddressesRepository;
    ordersRepository;
    orderTrackingRepository;
    orderItemsRepository;
    orderStatusHistoryRepository;
    orderRefundsRepository;
    cartsRepository;
    cartItemsRepository;
    productsRepository;
    productVariantsRepository;
    colorsRepository;
    sizesRepository;
    inventoryTransactionsRepository;
    usersRepository;
    discountsRepository;
    discountCategoriesRepository;
    discountProductsRepository;
    couponUsageRepository;
    returnsRepository;
    paymentTransactionsRepository;
    creditLimitRepository;
    notificationsService;
    ordersAdminPublisher;
    settingsService;
    membershipService;
    logger = new common_1.Logger(OrdersService_1.name);
    liveTrackingFreshnessMs = 2 * 60 * 1000;
    stalePaymentTtlMs = 30 * 60 * 1000;
    constructor(deliveryMethodsRepository, shippingAddressesRepository, ordersRepository, orderTrackingRepository, orderItemsRepository, orderStatusHistoryRepository, orderRefundsRepository, cartsRepository, cartItemsRepository, productsRepository, productVariantsRepository, colorsRepository, sizesRepository, inventoryTransactionsRepository, usersRepository, discountsRepository, discountCategoriesRepository, discountProductsRepository, couponUsageRepository, returnsRepository, paymentTransactionsRepository, creditLimitRepository, notificationsService, ordersAdminPublisher, settingsService, membershipService) {
        this.deliveryMethodsRepository = deliveryMethodsRepository;
        this.shippingAddressesRepository = shippingAddressesRepository;
        this.ordersRepository = ordersRepository;
        this.orderTrackingRepository = orderTrackingRepository;
        this.orderItemsRepository = orderItemsRepository;
        this.orderStatusHistoryRepository = orderStatusHistoryRepository;
        this.orderRefundsRepository = orderRefundsRepository;
        this.cartsRepository = cartsRepository;
        this.cartItemsRepository = cartItemsRepository;
        this.productsRepository = productsRepository;
        this.productVariantsRepository = productVariantsRepository;
        this.colorsRepository = colorsRepository;
        this.sizesRepository = sizesRepository;
        this.inventoryTransactionsRepository = inventoryTransactionsRepository;
        this.usersRepository = usersRepository;
        this.discountsRepository = discountsRepository;
        this.discountCategoriesRepository = discountCategoriesRepository;
        this.discountProductsRepository = discountProductsRepository;
        this.couponUsageRepository = couponUsageRepository;
        this.returnsRepository = returnsRepository;
        this.paymentTransactionsRepository = paymentTransactionsRepository;
        this.creditLimitRepository = creditLimitRepository;
        this.notificationsService = notificationsService;
        this.ordersAdminPublisher = ordersAdminPublisher;
        this.settingsService = settingsService;
        this.membershipService = membershipService;
    }
    async syncDefaultWarehouseStock(em, productId, qtyDelta) {
        if (qtyDelta === 0)
            return;
        const warehouse = await em.findOne(warehouse_entity_1.WarehouseEntity, {
            where: { isDefault: true },
        });
        if (!warehouse)
            return;
        const stock = await em.findOne(warehouse_stock_entity_1.WarehouseStockEntity, {
            where: { warehouseId: warehouse.warehouseId, productId },
        });
        if (stock) {
            stock.quantity = Math.max(0, stock.quantity + qtyDelta);
            await em.save(warehouse_stock_entity_1.WarehouseStockEntity, stock);
        }
        else if (qtyDelta > 0) {
            await em.save(warehouse_stock_entity_1.WarehouseStockEntity, em.create(warehouse_stock_entity_1.WarehouseStockEntity, {
                warehouseId: warehouse.warehouseId,
                productId,
                quantity: qtyDelta,
            }));
        }
    }
    async ensureUserExists(userId) {
        const user = await this.usersRepository.findOneBy({ userId });
        if (!user) {
            throw new common_1.UnauthorizedException('NgÆ°á»i dÃ¹ng khÃ´ng tá»“n táº¡i');
        }
        return user;
    }
    async findOwnedOrder(userId, orderId) {
        const order = await this.ordersRepository.findOneBy({ orderId, userId });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async findAnyOrder(orderId) {
        const order = await this.ordersRepository.findOneBy({ orderId });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    hasManageOrdersPermission(currentUser) {
        return currentUser.permissions.some((permission) => permission.key === 'manage_orders');
    }
    async createGuestUserRecord(entityManager, userId, orderId) {
        const compactOrderId = orderId.replace(/-/g, '');
        await entityManager.query(`INSERT INTO users
        (user_id, username, email, role, password_hash, provider, provider_id, is_active)
       VALUES (?, ?, ?, 'customer', NULL, 'guest', ?, 1)`, [
            userId,
            `guest_${compactOrderId.slice(0, 24)}`,
            `guest_${compactOrderId}@guest.local`,
            orderId,
        ]);
    }
    async isGuestUserId(userId) {
        if (userId.startsWith('guest-')) {
            return true;
        }
        const rows = (await this.ordersRepository.manager.query('SELECT provider FROM users WHERE user_id = ? LIMIT 1', [userId]));
        return rows[0]?.provider === 'guest';
    }
    async findAccessibleOrder(currentUser, orderId) {
        return this.hasManageOrdersPermission(currentUser)
            ? this.findAnyOrder(orderId)
            : this.findOwnedOrder(currentUser._id, orderId);
    }
    async findOrCreateOrderTracking(orderId) {
        const existing = await this.orderTrackingRepository.findOneBy({ orderId });
        if (existing) {
            return existing;
        }
        const created = this.orderTrackingRepository.create({
            orderId,
            mode: order_tracking_entity_1.OrderTrackingMode.AUTO_FALLBACK,
            manualLatitude: null,
            manualLongitude: null,
            manualNote: null,
            manualUpdatedAt: null,
            manualUpdatedBy: null,
            gpsLatitude: null,
            gpsLongitude: null,
            gpsHeading: null,
            gpsSpeedKph: null,
            gpsProvider: null,
            gpsUpdatedAt: null,
        });
        return this.orderTrackingRepository.save(created);
    }
    toNullableNumber(value) {
        if (value === null || value === undefined || value === '') {
            return null;
        }
        const next = Number(value);
        return Number.isFinite(next) ? next : null;
    }
    mapTrackingPoint(input) {
        const latitude = this.toNullableNumber(input.latitude);
        const longitude = this.toNullableNumber(input.longitude);
        if (latitude === null || longitude === null) {
            return null;
        }
        return {
            latitude,
            longitude,
            updatedAt: input.updatedAt,
            note: input.note ?? null,
            updatedBy: input.updatedBy ?? null,
            heading: this.toNullableNumber(input.heading),
            speedKph: this.toNullableNumber(input.speedKph),
            provider: input.provider ?? null,
        };
    }
    mapOrderTracking(tracking) {
        const manualLocation = this.mapTrackingPoint({
            latitude: tracking.manualLatitude,
            longitude: tracking.manualLongitude,
            updatedAt: tracking.manualUpdatedAt,
            note: tracking.manualNote,
            updatedBy: tracking.manualUpdatedBy,
        });
        const gpsLocation = this.mapTrackingPoint({
            latitude: tracking.gpsLatitude,
            longitude: tracking.gpsLongitude,
            updatedAt: tracking.gpsUpdatedAt,
            heading: tracking.gpsHeading,
            speedKph: tracking.gpsSpeedKph,
            provider: tracking.gpsProvider,
        });
        const gpsSignalFresh = Boolean(gpsLocation &&
            tracking.gpsUpdatedAt &&
            Date.now() - tracking.gpsUpdatedAt.getTime() <=
                this.liveTrackingFreshnessMs);
        let activeSource = 'none';
        let activeLocation = null;
        if (tracking.mode === order_tracking_entity_1.OrderTrackingMode.DEMO) {
            activeSource = manualLocation ? 'manual' : 'none';
            activeLocation = manualLocation;
        }
        else if (tracking.mode === order_tracking_entity_1.OrderTrackingMode.LIVE) {
            activeSource = gpsLocation ? 'gps' : 'none';
            activeLocation = gpsLocation;
        }
        else if (gpsSignalFresh && gpsLocation) {
            activeSource = 'gps';
            activeLocation = gpsLocation;
        }
        else if (manualLocation) {
            activeSource = 'manual';
            activeLocation = manualLocation;
        }
        else if (gpsLocation) {
            activeSource = 'gps';
            activeLocation = gpsLocation;
        }
        return {
            orderId: tracking.orderId,
            mode: tracking.mode,
            gpsSignalFresh,
            activeSource,
            activeLocation,
            manualLocation,
            gpsLocation,
            updatedAt: tracking.updatedAt,
        };
    }
    isOnlinePaymentMethod(method) {
        return [
            order_entity_1.PaymentMethod.MOMO,
            order_entity_1.PaymentMethod.VNPAY,
            order_entity_1.PaymentMethod.ZALOPAY,
        ].includes(method);
    }
    async ensurePaymentMethodEnabled(method) {
        if (method === order_entity_1.PaymentMethod.PAYPAL) {
            throw new common_1.BadRequestException('Payment method is not supported');
        }
        if (method === order_entity_1.PaymentMethod.CREDIT) {
            return;
        }
        const isActive = await this.settingsService.isPaymentMethodActive(method);
        if (!isActive) {
            throw new common_1.BadRequestException('Payment method is currently disabled');
        }
    }
    validateReturnStatusTransition(currentStatus, nextStatus) {
        const allowedTransitions = {
            [return_entity_1.ReturnStatus.REQUESTED]: [return_entity_1.ReturnStatus.APPROVED, return_entity_1.ReturnStatus.REJECTED],
            [return_entity_1.ReturnStatus.APPROVED]: [return_entity_1.ReturnStatus.RECEIVED, return_entity_1.ReturnStatus.REJECTED],
            [return_entity_1.ReturnStatus.REJECTED]: [],
            [return_entity_1.ReturnStatus.RECEIVED]: [return_entity_1.ReturnStatus.INSPECTED],
            [return_entity_1.ReturnStatus.INSPECTED]: [return_entity_1.ReturnStatus.REFUNDED],
            [return_entity_1.ReturnStatus.REFUNDED]: [],
        };
        return allowedTransitions[currentStatus].includes(nextStatus);
    }
    getReturnStatusLabel(status) {
        const labels = {
            requested: 'Đã gửi yêu cầu',
            approved: 'Đã duyệt',
            received: 'Đã nhận hàng trả về',
            inspected: 'Đã kiểm tra hàng',
            refunded: 'Đã hoàn tiền',
            rejected: 'Từ chối',
        };
        return labels[String(status).toLowerCase()] ?? status;
    }
    getReturnReasonLabel(reason) {
        const normalized = String(reason ?? '').toLowerCase();
        const labels = {
            wrong_item: 'Nhận sai sản phẩm',
            damaged: 'Sản phẩm lỗi hoặc hư hỏng',
            defective: 'Sản phẩm lỗi hoặc hư hỏng',
            not_as_described: 'Không đúng mô tả',
            changed_mind: 'Không còn nhu cầu',
            other: 'Lý do khác',
        };
        return labels[normalized] ?? reason ?? 'Lý do khác';
    }
    getReturnInspectionStatusLabel(status) {
        const labels = {
            pending: 'Chờ kiểm tra',
            usable: 'Hàng đạt, nhập lại kho',
            damaged: 'Hàng hỏng',
            return_to_supplier: 'Trả nhà cung cấp',
        };
        return status ? labels[String(status).toLowerCase()] ?? status : null;
    }
    async getOrderReturnWindow(order) {
        const returnableStatuses = new Set([
            order_entity_1.OrderStatus.DELIVERED,
            order_entity_1.OrderStatus.PARTIAL_DELIVERED,
        ]);
        if (!returnableStatuses.has(order.orderStatus)) {
            return {
                returnWindowDays: RETURN_WINDOW_DAYS,
                deliveredAt: null,
                returnDeadline: null,
                canCreateReturn: false,
                returnBlockedReason: 'RETURN_NOT_DELIVERED_YET',
            };
        }
        const deliveredHistory = await this.orderStatusHistoryRepository.findOne({
            where: [
                { orderId: order.orderId, newStatus: order_entity_1.OrderStatus.DELIVERED },
                { orderId: order.orderId, newStatus: order_entity_1.OrderStatus.PARTIAL_DELIVERED },
            ],
            order: { createdAt: 'ASC', historyId: 'ASC' },
        });
        const deliveredAt = deliveredHistory?.createdAt ?? order.updatedAt;
        const returnDeadline = new Date(deliveredAt.getTime() + RETURN_WINDOW_MS);
        const canCreateReturn = Date.now() <= returnDeadline.getTime();
        return {
            returnWindowDays: RETURN_WINDOW_DAYS,
            deliveredAt,
            returnDeadline,
            canCreateReturn,
            returnBlockedReason: canCreateReturn ? null : 'RETURN_WINDOW_EXPIRED',
        };
    }
    async getReturnedQuantityForItem(orderItemId, excludeReturnId) {
        const qb = this.returnsRepository
            .createQueryBuilder('r')
            .select('COALESCE(SUM(r.return_quantity), 0)', 'quantity')
            .where('r.order_item_id = :orderItemId', { orderItemId })
            .andWhere('r.return_status != :rejected', {
            rejected: return_entity_1.ReturnStatus.REJECTED,
        });
        if (excludeReturnId) {
            qb.andWhere('r.return_id != :excludeReturnId', { excludeReturnId });
        }
        const row = await qb.getRawOne();
        return Number(row?.quantity ?? 0);
    }
    getDeliveredQuantityForReturn(orderItem) {
        return orderItem.quantityDelivered > 0
            ? orderItem.quantityDelivered
            : orderItem.quantity;
    }
    calculateLineRefundAmount(orderItem, quantity) {
        const unitNet = Number(orderItem.lineTotal) / Math.max(1, orderItem.quantity);
        return Math.max(0, unitNet * quantity);
    }
    async getOrderItemImageMap(items) {
        const productIds = [...new Set(items.map((item) => item.productId).filter(Boolean))];
        const variantIds = [
            ...new Set(items.map((item) => item.variantId).filter((id) => Boolean(id))),
        ];
        const [productRows, variantRows] = await Promise.all([
            productIds.length
                ? this.productsRepository.manager
                    .createQueryBuilder()
                    .select('pi.product_id', 'productId')
                    .addSelect('pi.image_url', 'imageUrl')
                    .from('product_images', 'pi')
                    .where('pi.product_id IN (:...productIds)', { productIds })
                    .orderBy('pi.is_primary', 'DESC')
                    .addOrderBy('pi.sort_order', 'ASC')
                    .addOrderBy('pi.product_image_id', 'ASC')
                    .getRawMany()
                : Promise.resolve([]),
            variantIds.length
                ? this.productsRepository.manager
                    .createQueryBuilder()
                    .select('vi.variant_id', 'variantId')
                    .addSelect('vi.image_url', 'imageUrl')
                    .from('variant_images', 'vi')
                    .where('vi.variant_id IN (:...variantIds)', { variantIds })
                    .orderBy('vi.sort_order', 'ASC')
                    .addOrderBy('vi.variant_image_id', 'ASC')
                    .getRawMany()
                : Promise.resolve([]),
        ]);
        const productImageMap = new Map();
        for (const row of productRows) {
            if (!productImageMap.has(row.productId))
                productImageMap.set(row.productId, row.imageUrl);
        }
        const variantImageMap = new Map();
        for (const row of variantRows) {
            if (!variantImageMap.has(row.variantId))
                variantImageMap.set(row.variantId, row.imageUrl);
        }
        return new Map(items.map((item) => [
            item.orderItemId,
            (item.variantId ? variantImageMap.get(item.variantId) : null) ??
                productImageMap.get(item.productId) ??
                null,
        ]));
    }
    async getCompletedRefundAmount(orderId) {
        const row = await this.orderRefundsRepository
            .createQueryBuilder('refund')
            .select('COALESCE(SUM(refund.amount), 0)', 'amount')
            .where('refund.order_id = :orderId', { orderId })
            .andWhere('refund.refund_status = :status', {
            status: order_refund_entity_1.OrderRefundStatus.COMPLETED,
        })
            .getRawOne();
        return Number(row?.amount ?? 0);
    }
    async refreshOrderPaymentAfterRefund(order) {
        const completedRefunds = await this.getCompletedRefundAmount(order.orderId);
        const totalPayment = Number(order.totalPayment);
        if (completedRefunds >= totalPayment && totalPayment > 0) {
            order.paymentStatus = order_entity_1.PaymentStatus.REFUNDED;
            await this.ordersRepository.save(order);
        }
    }
    buildAddressSnapshot(address) {
        return [
            address.addressLine,
            address.ward,
            address.district,
            address.province,
        ]
            .filter((value) => value && value.trim().length > 0)
            .join(', ');
    }
    async getVariantSnapshots(variantIds) {
        const uniqueVariantIds = [...new Set(variantIds.filter(Boolean))];
        if (uniqueVariantIds.length === 0) {
            return new Map();
        }
        const variants = await this.productVariantsRepository.find({
            where: { variantId: (0, typeorm_2.In)(uniqueVariantIds) },
        });
        const colorIds = [...new Set(variants.map((variant) => variant.colorId).filter((id) => Boolean(id)))];
        const sizeIds = [...new Set(variants.map((variant) => variant.sizeId).filter((id) => Boolean(id)))];
        const [colors, sizes] = await Promise.all([
            colorIds.length ? this.colorsRepository.find({ where: { colorId: (0, typeorm_2.In)(colorIds) } }) : Promise.resolve([]),
            sizeIds.length ? this.sizesRepository.find({ where: { sizeId: (0, typeorm_2.In)(sizeIds) } }) : Promise.resolve([]),
        ]);
        const colorById = new Map(colors.map((color) => [color.colorId, color.colorName]));
        const sizeById = new Map(sizes.map((size) => [size.sizeId, size.sizeName]));
        return new Map(variants.map((variant) => [
            variant.variantId,
            {
                variant,
                colorName: variant.colorId ? colorById.get(variant.colorId) ?? null : null,
                sizeName: variant.sizeId ? sizeById.get(variant.sizeId) ?? null : null,
            },
        ]));
    }
    calculateDeliveryCost(deliveryMethod, subtotalAmount) {
        const minOrderAmount = Number(deliveryMethod.minOrderAmount);
        if (subtotalAmount >= minOrderAmount) {
            return 0;
        }
        return Number(deliveryMethod.basePrice);
    }
    calculateDiscountAmount(discount, subtotalAmount) {
        const rawDiscount = discount.discountType === discount_entity_1.DiscountType.PERCENT
            ? (subtotalAmount * Number(discount.discountValue)) / 100
            : Number(discount.discountValue);
        const maxDiscountAmount = discount.maxDiscountAmount
            ? Number(discount.maxDiscountAmount)
            : null;
        const finalDiscount = maxDiscountAmount !== null
            ? Math.min(rawDiscount, maxDiscountAmount)
            : rawDiscount;
        return Math.max(0, Math.min(finalDiscount, subtotalAmount));
    }
    async validateDiscountForCheckout(userId, discountCode, subtotalAmount, cartItems, productsById) {
        if (!discountCode) {
            return null;
        }
        const discount = await this.discountsRepository.findOneBy({
            discountCode: discountCode.trim(),
        });
        if (!discount || !discount.isActive) {
            throw new common_1.NotFoundException('Discount code not found');
        }
        const now = new Date();
        if (discount.startAt > now || discount.expireDate < now) {
            throw new common_1.BadRequestException('Discount code is expired or not active');
        }
        if (discount.userId && discount.userId !== userId) {
            throw new common_1.BadRequestException('Discount code is not available for this user');
        }
        let eligibleSubtotal = subtotalAmount;
        if (discount.appliesTo === discount_entity_1.DiscountApplyTarget.CATEGORY) {
            const categoryMappings = await this.discountCategoriesRepository.find({
                where: { discountId: discount.discountId },
            });
            const categoryIds = new Set(categoryMappings.map((item) => item.categoryId));
            eligibleSubtotal = cartItems.reduce((sum, item) => {
                const product = productsById.get(item.productId);
                if (!product || !categoryIds.has(product.categoryId)) {
                    return sum;
                }
                return sum + Number(item.priceAtAdded) * item.quantity;
            }, 0);
        }
        if (discount.appliesTo === discount_entity_1.DiscountApplyTarget.PRODUCT) {
            const productMappings = await this.discountProductsRepository.find({
                where: { discountId: discount.discountId },
            });
            const productIds = new Set(productMappings.map((item) => item.productId));
            eligibleSubtotal = cartItems.reduce((sum, item) => {
                if (!productIds.has(item.productId)) {
                    return sum;
                }
                return sum + Number(item.priceAtAdded) * item.quantity;
            }, 0);
        }
        if (eligibleSubtotal <= 0) {
            throw new common_1.BadRequestException('Discount code does not apply to cart items');
        }
        if (eligibleSubtotal < Number(discount.minOrderValue)) {
            throw new common_1.BadRequestException('Order does not meet discount minimum value');
        }
        if (discount.usageLimit !== null &&
            discount.usedCount >= discount.usageLimit) {
            throw new common_1.BadRequestException('Discount code usage limit reached');
        }
        const existingUsage = await this.couponUsageRepository.findOneBy({
            discountId: discount.discountId,
            userId,
        });
        if (existingUsage) {
            throw new common_1.BadRequestException('You have already used this discount code');
        }
        return {
            discount,
            eligibleSubtotal,
        };
    }
    async buildOrderDetail(order) {
        const [items, history, returns] = await Promise.all([
            this.orderItemsRepository.find({
                where: { orderId: order.orderId },
                order: { createdAt: 'ASC', orderItemId: 'ASC' },
            }),
            this.orderStatusHistoryRepository.find({
                where: { orderId: order.orderId },
                order: { createdAt: 'ASC', historyId: 'ASC' },
            }),
            this.returnsRepository.find({
                where: { orderId: order.orderId },
                order: { createdAt: 'ASC', returnId: 'ASC' },
            }),
        ]);
        const changedByIds = [
            ...new Set(history.map((e) => e.changedBy).filter(Boolean)),
        ];
        const usersMap = new Map();
        if (changedByIds.length > 0) {
            const users = await this.usersRepository.find({
                where: { userId: (0, typeorm_2.In)(changedByIds) },
                select: ['userId', 'username'],
            });
            for (const u of users)
                usersMap.set(u.userId, u.username);
        }
        const returnWindow = await this.getOrderReturnWindow(order);
        const itemImageMap = await this.getOrderItemImageMap(items);
        return {
            id: order.orderId,
            status: order.orderStatus,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            shippingAddressId: order.shippingAddressId,
            deliveryId: order.deliveryId,
            subtotalAmount: order.subtotalAmount,
            discountAmount: order.discountAmount,
            deliveryCost: order.deliveryCost,
            totalPayment: order.totalPayment,
            totalQuantity: order.totalQuantity,
            note: order.note,
            fullName: order.fullName,
            phone: order.phone,
            address: order.address,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            returnWindowDays: returnWindow.returnWindowDays,
            returnDeadline: returnWindow.returnDeadline,
            canCreateReturn: returnWindow.canCreateReturn,
            returnBlockedReason: returnWindow.returnBlockedReason,
            items: items.map((item) => {
                const itemReturns = returns.filter((r) => r.orderItemId === item.orderItemId &&
                    r.returnStatus !== return_entity_1.ReturnStatus.REJECTED);
                const returnedQuantity = itemReturns.reduce((sum, r) => sum + Number(r.returnQuantity ?? 0), 0);
                const deliveredQuantity = this.getDeliveredQuantityForReturn(item);
                return {
                    id: item.orderItemId,
                    productId: item.productId,
                    variantId: item.variantId,
                    sku: item.sku,
                    colorName: item.colorName,
                    sizeName: item.sizeName,
                    imageUrl: itemImageMap.get(item.orderItemId) ?? null,
                    productName: item.productName,
                    quantity: item.quantity,
                    quantityDelivered: item.quantityDelivered,
                    deliveredQuantity,
                    returnableQuantity: Math.max(0, deliveredQuantity - returnedQuantity),
                    returnedQuantity,
                    returnWindowDays: returnWindow.returnWindowDays,
                    returnDeadline: returnWindow.returnDeadline,
                    canCreateReturn: returnWindow.canCreateReturn &&
                        deliveredQuantity - returnedQuantity > 0,
                    returnBlockedReason: deliveredQuantity - returnedQuantity > 0
                        ? returnWindow.returnBlockedReason
                        : 'NO_RETURNABLE_QUANTITY',
                    unitPrice: item.unitPrice,
                    lineTotal: item.lineTotal,
                };
            }),
            returns: returns.map((item) => ({
                id: item.returnId,
                orderItemId: item.orderItemId,
                returnQuantity: item.returnQuantity,
                reason: item.reason,
                description: item.description,
                status: item.returnStatus,
                statusLabel: this.getReturnStatusLabel(item.returnStatus),
                inspectionStatus: item.inspectionStatus,
                refundAmount: item.refundAmount,
                maxRefundableAmount: item.maxRefundableAmount,
                returnDeadline: returnWindow.returnDeadline,
                returnWindowDays: returnWindow.returnWindowDays,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
            })),
            history: history.map((entry) => ({
                id: entry.historyId,
                oldStatus: entry.oldStatus,
                newStatus: entry.newStatus,
                changedBy: entry.changedBy
                    ? (usersMap.get(entry.changedBy) ?? 'admin')
                    : null,
                note: entry.note,
                createdAt: entry.createdAt,
            })),
        };
    }
    async getOrderStats() {
        const rows = await this.ordersRepository
            .createQueryBuilder('o')
            .select('o.orderStatus', 'status')
            .addSelect('COUNT(*)', 'count')
            .groupBy('o.orderStatus')
            .getRawMany();
        return Object.fromEntries(rows.map((r) => [r.status, Number(r.count)]));
    }
    toOrderSummary(order) {
        return {
            id: order.orderId,
            userId: order.userId,
            status: order.orderStatus,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            totalPayment: order.totalPayment,
            totalQuantity: order.totalQuantity,
            fullName: order.fullName,
            phone: order.phone,
            address: order.address,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        };
    }
    async notifyAdminsAboutNewOrder(order) {
        await this.notificationsService.sendAdminOrderCreatedNotification({
            orderId: order.orderId,
            fullName: order.fullName,
            phone: order.phone,
            totalPayment: order.totalPayment,
        });
        this.ordersAdminPublisher.emitNewOrder(order);
    }
    isValidAdminStatusTransition(currentStatus, nextStatus) {
        const allowedTransitions = {
            [order_entity_1.OrderStatus.BACKORDERED]: [order_entity_1.OrderStatus.PENDING, order_entity_1.OrderStatus.CANCELLED],
            [order_entity_1.OrderStatus.PENDING]: [order_entity_1.OrderStatus.CONFIRMED, order_entity_1.OrderStatus.CANCELLED],
            [order_entity_1.OrderStatus.CONFIRMED]: [order_entity_1.OrderStatus.PROCESSING, order_entity_1.OrderStatus.CANCELLED],
            [order_entity_1.OrderStatus.PROCESSING]: [order_entity_1.OrderStatus.SHIPPING, order_entity_1.OrderStatus.DELIVERED, order_entity_1.OrderStatus.CANCELLED],
            [order_entity_1.OrderStatus.SHIPPING]: [
                order_entity_1.OrderStatus.DELIVERED,
                order_entity_1.OrderStatus.RETURNED,
            ],
            [order_entity_1.OrderStatus.PARTIAL_DELIVERED]: [order_entity_1.OrderStatus.RETURNED],
            [order_entity_1.OrderStatus.DELIVERED]: [order_entity_1.OrderStatus.RETURNED],
            [order_entity_1.OrderStatus.CANCELLED]: [],
            [order_entity_1.OrderStatus.RETURNED]: [],
        };
        return allowedTransitions[currentStatus].includes(nextStatus);
    }
    async restockOrderItems(orderId, productRepository, orderItemsRepository, entityManager, options) {
        const items = await orderItemsRepository.find({
            where: { orderId },
        });
        const variantRepository = entityManager?.getRepository(product_variant_entity_1.ProductVariantEntity);
        for (const item of items) {
            const product = await productRepository.findOne({
                where: { productId: item.productId },
                lock: entityManager ? { mode: 'pessimistic_write' } : undefined,
            });
            if (product) {
                product.quantityAvailable += item.quantity;
                product.quantityReserved = Math.max(0, (product.quantityReserved ?? 0) - item.quantity);
                await productRepository.save(product);
                if (variantRepository && item.variantId) {
                    const variant = await variantRepository.findOne({
                        where: { variantId: item.variantId },
                        lock: { mode: 'pessimistic_write' },
                    });
                    if (variant) {
                        variant.stockQuantity += item.quantity;
                        await variantRepository.save(variant);
                    }
                }
                if (entityManager) {
                    await this.syncDefaultWarehouseStock(entityManager, item.productId, item.quantity);
                    await entityManager.save(inventory_transaction_entity_1.InventoryTransactionEntity, entityManager.create(inventory_transaction_entity_1.InventoryTransactionEntity, {
                        productId: item.productId,
                        performedBy: options?.performedBy ?? null,
                        transactionType: inventory_transaction_entity_1.InventoryTransactionType.RETURN_IN,
                        quantityChange: item.quantity,
                        quantityBefore: product.quantityAvailable - item.quantity,
                        quantityAfter: product.quantityAvailable,
                        referenceType: 'ORDER',
                        referenceId: orderId,
                        unitCostAtTime: product.avgCost ?? null,
                        note: options?.note ?? 'Restock by order cancellation',
                        relatedOrderId: orderId,
                    }));
                }
            }
        }
    }
    async reconcileOrderPayment(currentUser, orderId) {
        await this.ensureUserExists(currentUser._id);
        const order = await this.findAccessibleOrder(currentUser, orderId);
        if (order.paymentStatus === order_entity_1.PaymentStatus.PAID) {
            return {
                orderId: order.orderId,
                paymentStatus: order.paymentStatus,
                message: 'Payment already marked as paid',
            };
        }
        if (order.paymentMethod !== order_entity_1.PaymentMethod.MOMO) {
            return {
                orderId: order.orderId,
                paymentStatus: order.paymentStatus,
                message: 'Automatic reconciliation is only available for MoMo',
            };
        }
        const transaction = await this.paymentTransactionsRepository.findOne({
            where: {
                orderId: order.orderId,
                provider: order_entity_1.PaymentMethod.MOMO,
            },
            order: { createdAt: 'DESC' },
        });
        if (!transaction) {
            throw new common_1.NotFoundException('Payment transaction not found');
        }
        const queryResult = await this.queryMomoPayment(transaction.transactionRef);
        const resultCode = Number(queryResult.resultCode);
        const resultMessage = typeof queryResult.message === 'string'
            ? queryResult.message
            : 'MoMo reconciliation completed';
        transaction.gatewayCode = String(queryResult.resultCode ?? '');
        transaction.gatewayMessage = resultMessage;
        transaction.rawPayload = {
            ...(transaction.rawPayload ?? {}),
            momoQuery: queryResult,
        };
        if (resultCode === 0) {
            transaction.transactionStatus = payment_transaction_entity_1.PaymentTransactionStatus.SUCCESS;
            transaction.paymentStatus = order_entity_1.PaymentStatus.PAID;
            order.paymentStatus = order_entity_1.PaymentStatus.PAID;
            await this.paymentTransactionsRepository.save(transaction);
            await this.ordersRepository.save(order);
            await this.notificationsService.sendPaymentNotification(order.userId, order.orderId, order_entity_1.PaymentStatus.PAID, order_entity_1.PaymentMethod.MOMO);
            return {
                orderId: order.orderId,
                paymentStatus: order_entity_1.PaymentStatus.PAID,
                transactionStatus: payment_transaction_entity_1.PaymentTransactionStatus.SUCCESS,
                message: resultMessage,
            };
        }
        await this.paymentTransactionsRepository.save(transaction);
        return {
            orderId: order.orderId,
            paymentStatus: order.paymentStatus,
            transactionStatus: transaction.transactionStatus,
            gatewayCode: transaction.gatewayCode,
            message: resultMessage,
        };
    }
    async queryMomoPayment(transactionRef) {
        const { partnerCode, accessKey, secretKey } = await this.settingsService.getMomoConfig();
        if (!partnerCode || !accessKey || !secretKey) {
            throw new common_1.BadRequestException('MoMo config is missing');
        }
        const orderId = transactionRef;
        const requestId = transactionRef;
        const rawSignature = [
            `accessKey=${accessKey}`,
            `orderId=${orderId}`,
            `partnerCode=${partnerCode}`,
            `requestId=${requestId}`,
        ].join('&');
        const signature = (0, node_crypto_2.createHmac)('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');
        const isSandbox = partnerCode === 'MOMO' || process.env.MOMO_SANDBOX === 'true';
        const endpoint = isSandbox
            ? 'https://test-payment.momo.vn/v2/gateway/api/query'
            : 'https://payment.momo.vn/v2/gateway/api/query';
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                partnerCode,
                requestId,
                orderId,
                lang: 'vi',
                signature,
            }),
        });
        const data = (await response.json());
        if (!response.ok) {
            throw new common_1.BadRequestException(typeof data.message === 'string'
                ? data.message
                : 'MoMo reconciliation failed');
        }
        return data;
    }
    async releaseReservedOnDelivered(orderId, productRepository, orderItemsRepository) {
        const items = await orderItemsRepository.find({ where: { orderId } });
        for (const item of items) {
            const product = await productRepository.findOne({
                where: { productId: item.productId },
                lock: { mode: 'pessimistic_write' },
            });
            if (product) {
                product.quantityReserved = Math.max(0, (product.quantityReserved ?? 0) - item.quantity);
                await productRepository.save(product);
            }
        }
    }
    async revertDiscountUsage(order, discountRepository, couponUsageRepository) {
        if (!order.discountId) {
            return;
        }
        const discount = await discountRepository.findOneBy({
            discountId: order.discountId,
        });
        if (discount) {
            discount.usedCount = Math.max(0, discount.usedCount - 1);
            await discountRepository.save(discount);
        }
        await couponUsageRepository.delete({ orderId: order.orderId });
    }
    async createGuestOrder(dto, idempotencyKey) {
        await this.ensurePaymentMethodEnabled(dto.paymentMethod);
        if (idempotencyKey) {
            const existing = await this.ordersRepository.findOne({
                where: { idempotencyKey },
            });
            if (existing) {
                return this.buildOrderDetail(await this.findAnyOrder(existing.orderId));
            }
        }
        const deliveryMethod = await this.deliveryMethodsRepository.findOneBy({
            deliveryId: dto.deliveryId,
        });
        if (!deliveryMethod || !deliveryMethod.isActive) {
            throw new common_1.NotFoundException('PhÆ°Æ¡ng thá»©c giao hÃ ng khÃ´ng kháº£ dá»¥ng');
        }
        const productIds = [...new Set(dto.items.map((it) => it.productId))];
        const products = await this.productsRepository.findBy(productIds.map((productId) => ({ productId })));
        const productsById = new Map(products.map((product) => [product.productId, product]));
        const guestVariantIds = [...new Set(dto.items.map((it) => it.variantId).filter((id) => Boolean(id)))];
        const guestVariantsById = await this.getVariantSnapshots(guestVariantIds);
        let subtotalAmount = 0;
        let totalQuantity = 0;
        let isBackorder = false;
        for (const item of dto.items) {
            const product = productsById.get(item.productId);
            if (!product || !product.isShow) {
                throw new common_1.BadRequestException('Sáº£n pháº©m khÃ´ng kháº£ dá»¥ng');
            }
            if (item.quantity > product.quantityAvailable) {
                if (!dto.allowBackorder) {
                    throw new common_1.BadRequestException(`Sáº£n pháº©m ${product.productName} khÃ´ng Ä‘á»§ tá»“n kho`);
                }
                isBackorder = true;
            }
            const price = Number(product.productPriceSale ?? 0) > 0
                ? Number(product.productPriceSale)
                : Number(product.productPrice);
            subtotalAmount += price * item.quantity;
            totalQuantity += item.quantity;
        }
        const deliveryCost = this.calculateDeliveryCost(deliveryMethod, subtotalAmount);
        const totalPayment = subtotalAmount + deliveryCost;
        const orderId = (0, node_crypto_1.randomUUID)();
        const guestUserId = (0, node_crypto_1.randomUUID)();
        const addressSnapshot = [
            dto.shipping.addressLine,
            dto.shipping.ward,
            dto.shipping.district,
            dto.shipping.province,
        ]
            .filter(Boolean)
            .join(', ');
        await (0, transaction_util_1.withDeadlockRetry)(() => this.ordersRepository.manager.transaction(async (entityManager) => {
            const trxOrders = entityManager.getRepository(order_entity_1.OrderEntity);
            const trxItems = entityManager.getRepository(order_item_entity_1.OrderItemEntity);
            const trxHistory = entityManager.getRepository(order_status_history_entity_1.OrderStatusHistoryEntity);
            const trxProducts = entityManager.getRepository(product_entity_1.ProductEntity);
            const trxVariants = entityManager.getRepository(product_variant_entity_1.ProductVariantEntity);
            const trxInvTx = entityManager.getRepository(inventory_transaction_entity_1.InventoryTransactionEntity);
            if (idempotencyKey) {
                const dup = await trxOrders.findOne({ where: { idempotencyKey } });
                if (dup)
                    return;
            }
            await this.createGuestUserRecord(entityManager, guestUserId, orderId);
            const order = trxOrders.create({
                orderId,
                userId: guestUserId,
                shippingAddressId: null,
                deliveryId: deliveryMethod.deliveryId,
                discountId: null,
                orderStatus: isBackorder ? order_entity_1.OrderStatus.BACKORDERED : order_entity_1.OrderStatus.PENDING,
                paymentMethod: dto.paymentMethod,
                paymentStatus: order_entity_1.PaymentStatus.UNPAID,
                subtotalAmount: subtotalAmount.toFixed(2),
                discountAmount: '0.00',
                deliveryCost: deliveryCost.toFixed(2),
                totalPayment: totalPayment.toFixed(2),
                totalQuantity,
                note: (dto.note ? `${dto.note}\n` : '') +
                    `[GUEST] ${dto.shipping.email ?? ''}`.trim(),
                fullName: dto.shipping.recipientName,
                phone: dto.shipping.phone,
                address: addressSnapshot,
                idempotencyKey: idempotencyKey ?? null,
            });
            await trxOrders.save(order);
            for (const item of dto.items) {
                const product = await trxProducts.findOne({
                    where: { productId: item.productId },
                    lock: { mode: 'pessimistic_write' },
                });
                if (!product) {
                    throw new common_1.BadRequestException('Sáº£n pháº©m khÃ´ng tá»“n táº¡i');
                }
                const variantSnapshot = item.variantId ? guestVariantsById.get(item.variantId) : null;
                const variant = item.variantId
                    ? await trxVariants.findOne({
                        where: { variantId: item.variantId, productId: item.productId },
                        lock: { mode: 'pessimistic_write' },
                    })
                    : null;
                if (item.variantId && (!variant || !variant.isActive)) {
                    throw new common_1.BadRequestException('Bien the san pham khong kha dung');
                }
                const availableQuantity = variant?.stockQuantity ?? product.quantityAvailable;
                const isLineBackorder = item.quantity > availableQuantity;
                if (isLineBackorder && !dto.allowBackorder) {
                    throw new common_1.BadRequestException(`Sáº£n pháº©m ${product.productName} khÃ´ng Ä‘á»§ tá»“n kho`);
                }
                const unitPrice = variant
                    ? variant.salePrice ?? variant.price ?? product.productPriceSale ?? product.productPrice
                    : Number(product.productPriceSale ?? 0) > 0
                        ? product.productPriceSale
                        : product.productPrice;
                const lineTotal = Number(unitPrice) * item.quantity;
                const orderItem = trxItems.create({
                    orderId,
                    productId: item.productId,
                    variantId: variant?.variantId ?? null,
                    productName: product.productName,
                    sku: variant?.sku ?? null,
                    colorName: variantSnapshot?.colorName ?? null,
                    sizeName: variantSnapshot?.sizeName ?? null,
                    quantity: item.quantity,
                    unitPrice,
                    lineTotal: lineTotal.toFixed(2),
                });
                await trxItems.save(orderItem);
                if (isLineBackorder)
                    continue;
                const qtyBefore = variant?.stockQuantity ?? product.quantityAvailable;
                if (variant) {
                    variant.stockQuantity -= item.quantity;
                    await trxVariants.save(variant);
                }
                product.quantityAvailable -= item.quantity;
                product.quantityReserved =
                    (product.quantityReserved ?? 0) + item.quantity;
                await trxProducts.save(product);
                await trxInvTx.save(trxInvTx.create({
                    productId: item.productId,
                    performedBy: null,
                    transactionType: inventory_transaction_entity_1.InventoryTransactionType.EXPORT,
                    quantityChange: -item.quantity,
                    quantityBefore: qtyBefore,
                    quantityAfter: variant?.stockQuantity ?? product.quantityAvailable,
                    variantId: variant?.variantId ?? null,
                    referenceType: 'ORDER',
                    referenceId: orderId,
                    unitCostAtTime: product.avgCost ?? null,
                    note: 'Guest order checkout',
                    relatedOrderId: orderId,
                }));
                await this.syncDefaultWarehouseStock(entityManager, item.productId, -item.quantity);
            }
            await trxHistory.save(trxHistory.create({
                orderId,
                oldStatus: null,
                newStatus: isBackorder ? order_entity_1.OrderStatus.BACKORDERED : order_entity_1.OrderStatus.PENDING,
                changedBy: null,
                note: 'Đơn hàng khách đã được tạo',
            }));
        }));
        const created = await this.findAnyOrder(orderId);
        await this.notifyAdminsAboutNewOrder(created);
        return this.buildOrderDetail(created);
    }
    async findGuestOrder(orderId, phone) {
        if (!phone || !orderId) {
            throw new common_1.BadRequestException('Cáº§n cung cáº¥p orderId vÃ  phone');
        }
        const order = await this.ordersRepository.findOne({
            where: { orderId },
        });
        if (!order)
            throw new common_1.NotFoundException('KhÃ´ng tÃ¬m tháº¥y Ä‘Æ¡n hÃ ng');
        if (!(await this.isGuestUserId(order.userId))) {
            throw new common_1.UnauthorizedException('ÄÆ¡n nÃ y thuá»™c tÃ i khoáº£n Ä‘Äƒng kÃ½, hÃ£y Ä‘Äƒng nháº­p Ä‘á»ƒ xem');
        }
        if (order.phone.replace(/\s+/g, '') !== phone.replace(/\s+/g, '')) {
            throw new common_1.UnauthorizedException('Sá»‘ Ä‘iá»‡n thoáº¡i khÃ´ng khá»›p');
        }
        return this.buildOrderDetail(order);
    }
    async createOrder(userId, createOrderDto, idempotencyKey) {
        const currentUser = await this.ensureUserExists(userId);
        await this.ensurePaymentMethodEnabled(createOrderDto.paymentMethod);
        if (idempotencyKey) {
            const existing = await this.ordersRepository.findOne({
                where: { idempotencyKey, userId },
            });
            if (existing) {
                return this.buildOrderDetail(await this.findOwnedOrder(userId, existing.orderId));
            }
        }
        const cart = await this.cartsRepository.findOneBy({ userId });
        if (!cart) {
            throw new common_1.BadRequestException('Cart is empty');
        }
        const [cartItems, shippingAddress, deliveryMethod] = await Promise.all([
            this.cartItemsRepository.find({
                where: { cartId: cart.cartId },
                order: { createdAt: 'ASC', cartItemId: 'ASC' },
            }),
            this.shippingAddressesRepository.findOneBy({
                shippingAddressId: createOrderDto.shippingAddressId,
                userId,
            }),
            this.deliveryMethodsRepository.findOneBy({
                deliveryId: createOrderDto.deliveryId,
            }),
        ]);
        if (cartItems.length === 0) {
            throw new common_1.BadRequestException('Cart is empty');
        }
        if (!shippingAddress) {
            throw new common_1.NotFoundException('Shipping address not found');
        }
        if (!deliveryMethod || !deliveryMethod.isActive) {
            throw new common_1.NotFoundException('Delivery method not found');
        }
        const productIds = [...new Set(cartItems.map((item) => item.productId))];
        const products = await this.productsRepository.findBy(productIds.map((productId) => ({ productId })));
        const productsById = new Map(products.map((product) => [product.productId, product]));
        const cartVariantIds = [...new Set(cartItems.map((item) => item.variantId).filter((id) => Boolean(id)))];
        const cartVariantsById = await this.getVariantSnapshots(cartVariantIds);
        let subtotalAmount = 0;
        let totalQuantity = 0;
        let isBackorder = false;
        for (const cartItem of cartItems) {
            const product = productsById.get(cartItem.productId);
            if (!product || !product.isShow) {
                throw new common_1.BadRequestException('One or more products are unavailable');
            }
            const variantSnapshot = cartItem.variantId ? cartVariantsById.get(cartItem.variantId) : null;
            if (cartItem.variantId && (!variantSnapshot || variantSnapshot.variant.productId !== cartItem.productId || !variantSnapshot.variant.isActive)) {
                throw new common_1.BadRequestException('Bien the san pham khong kha dung');
            }
            const availableQuantity = variantSnapshot?.variant.stockQuantity ?? product.quantityAvailable;
            if (cartItem.quantity > availableQuantity) {
                if (!createOrderDto.allowBackorder) {
                    throw new common_1.BadRequestException(`Sáº£n pháº©m ${product.productName} khÃ´ng Ä‘á»§ tá»“n kho`);
                }
                isBackorder = true;
            }
            subtotalAmount += Number(cartItem.priceAtAdded) * cartItem.quantity;
            totalQuantity += cartItem.quantity;
        }
        const discountContext = await this.validateDiscountForCheckout(userId, createOrderDto.discountCode, subtotalAmount, cartItems, productsById);
        const discount = discountContext?.discount ?? null;
        const discountAmount = discountContext
            ? this.calculateDiscountAmount(discountContext.discount, discountContext.eligibleSubtotal)
            : 0;
        const deliveryCost = this.calculateDeliveryCost(deliveryMethod, subtotalAmount);
        const totalPayment = subtotalAmount - discountAmount + deliveryCost;
        let creditLimit = null;
        if (createOrderDto.paymentMethod === order_entity_1.PaymentMethod.CREDIT) {
            if (!currentUser.isWholesale) {
                throw new common_1.BadRequestException('PhÆ°Æ¡ng thá»©c "Mua ná»£" chá»‰ dÃ nh cho khÃ¡ch sá»‰ Ä‘Æ°á»£c cáº¥p háº¡n má»©c tÃ­n dá»¥ng');
            }
            creditLimit = await this.creditLimitRepository.findOne({ where: { userId, isActive: true } });
            if (!creditLimit) {
                throw new common_1.BadRequestException('Báº¡n chÆ°a Ä‘Æ°á»£c cáº¥p háº¡n má»©c tÃ­n dá»¥ng. Vui lÃ²ng liÃªn há»‡ shop Ä‘á»ƒ Ä‘Æ°á»£c há»— trá»£');
            }
            const available = Number(creditLimit.creditLimit) - Number(creditLimit.currentDebt ?? 0);
            if (totalPayment > available) {
                throw new common_1.BadRequestException(`VÆ°á»£t háº¡n má»©c tÃ­n dá»¥ng. Háº¡n má»©c cÃ²n láº¡i: ${Math.max(0, available).toLocaleString('vi-VN')}â‚«`);
            }
        }
        const addressSnapshot = this.buildAddressSnapshot(shippingAddress);
        const orderId = (0, node_crypto_1.randomUUID)();
        await (0, transaction_util_1.withDeadlockRetry)(() => this.ordersRepository.manager.transaction(async (entityManager) => {
            const transactionalOrdersRepository = entityManager.getRepository(order_entity_1.OrderEntity);
            const transactionalOrderItemsRepository = entityManager.getRepository(order_item_entity_1.OrderItemEntity);
            const transactionalHistoryRepository = entityManager.getRepository(order_status_history_entity_1.OrderStatusHistoryEntity);
            const transactionalProductsRepository = entityManager.getRepository(product_entity_1.ProductEntity);
            const transactionalVariantsRepository = entityManager.getRepository(product_variant_entity_1.ProductVariantEntity);
            const transactionalCartItemsRepository = entityManager.getRepository(cart_item_entity_1.CartItemEntity);
            const transactionalInventoryTransactionsRepository = entityManager.getRepository(inventory_transaction_entity_1.InventoryTransactionEntity);
            const transactionalDiscountsRepository = entityManager.getRepository(discount_entity_1.DiscountEntity);
            const transactionalCouponUsageRepository = entityManager.getRepository(coupon_usage_entity_1.CouponUsageEntity);
            if (idempotencyKey) {
                const dup = await transactionalOrdersRepository.findOne({
                    where: { idempotencyKey, userId },
                });
                if (dup) {
                    return;
                }
            }
            const order = transactionalOrdersRepository.create({
                orderId,
                userId,
                shippingAddressId: shippingAddress.shippingAddressId,
                deliveryId: deliveryMethod.deliveryId,
                discountId: discount?.discountId ?? null,
                orderStatus: isBackorder
                    ? order_entity_1.OrderStatus.BACKORDERED
                    : order_entity_1.OrderStatus.PENDING,
                paymentMethod: createOrderDto.paymentMethod,
                paymentStatus: order_entity_1.PaymentStatus.UNPAID,
                subtotalAmount: subtotalAmount.toFixed(2),
                discountAmount: discountAmount.toFixed(2),
                deliveryCost: deliveryCost.toFixed(2),
                totalPayment: totalPayment.toFixed(2),
                totalQuantity,
                note: createOrderDto.note ?? null,
                fullName: shippingAddress.recipientName,
                phone: shippingAddress.phone,
                address: addressSnapshot,
                idempotencyKey: idempotencyKey ?? null,
            });
            await transactionalOrdersRepository.save(order);
            for (const cartItem of cartItems) {
                const product = await transactionalProductsRepository.findOne({
                    where: { productId: cartItem.productId },
                    lock: { mode: 'pessimistic_write' },
                });
                if (!product || !product.isShow) {
                    throw new common_1.BadRequestException('One or more products are unavailable');
                }
                const variantSnapshot = cartItem.variantId ? cartVariantsById.get(cartItem.variantId) : null;
                const variant = cartItem.variantId
                    ? await transactionalVariantsRepository.findOne({
                        where: { variantId: cartItem.variantId, productId: cartItem.productId },
                        lock: { mode: 'pessimistic_write' },
                    })
                    : null;
                if (cartItem.variantId && (!variant || !variant.isActive)) {
                    throw new common_1.BadRequestException('Bien the san pham khong kha dung');
                }
                const availableQuantity = variant?.stockQuantity ?? product.quantityAvailable;
                const isLineBackorder = cartItem.quantity > availableQuantity;
                if (isLineBackorder && !createOrderDto.allowBackorder) {
                    throw new common_1.BadRequestException(`Sáº£n pháº©m ${product.productName} khÃ´ng Ä‘á»§ tá»“n kho`);
                }
                const lineTotal = Number(cartItem.priceAtAdded) * cartItem.quantity;
                const orderItem = transactionalOrderItemsRepository.create({
                    orderId,
                    productId: cartItem.productId,
                    variantId: variant?.variantId ?? null,
                    productName: product.productName,
                    sku: variant?.sku ?? null,
                    colorName: variantSnapshot?.colorName ?? null,
                    sizeName: variantSnapshot?.sizeName ?? null,
                    quantity: cartItem.quantity,
                    unitPrice: cartItem.priceAtAdded,
                    lineTotal: lineTotal.toFixed(2),
                });
                await transactionalOrderItemsRepository.save(orderItem);
                if (isLineBackorder) {
                    continue;
                }
                const qtyBefore = variant?.stockQuantity ?? product.quantityAvailable;
                if (variant) {
                    variant.stockQuantity -= cartItem.quantity;
                    await transactionalVariantsRepository.save(variant);
                }
                product.quantityAvailable -= cartItem.quantity;
                product.quantityReserved =
                    (product.quantityReserved ?? 0) + cartItem.quantity;
                await transactionalProductsRepository.save(product);
                const inventoryTransaction = transactionalInventoryTransactionsRepository.create({
                    productId: product.productId,
                    performedBy: userId,
                    transactionType: inventory_transaction_entity_1.InventoryTransactionType.EXPORT,
                    quantityChange: -cartItem.quantity,
                    quantityBefore: qtyBefore,
                    quantityAfter: variant?.stockQuantity ?? product.quantityAvailable,
                    variantId: variant?.variantId ?? null,
                    referenceType: 'ORDER',
                    referenceId: orderId,
                    unitCostAtTime: product.avgCost ?? null,
                    note: 'Export by order checkout',
                    relatedOrderId: orderId,
                });
                await transactionalInventoryTransactionsRepository.save(inventoryTransaction);
                await this.syncDefaultWarehouseStock(entityManager, product.productId, -cartItem.quantity);
            }
            if (discount) {
                discount.usedCount += 1;
                await transactionalDiscountsRepository.save(discount);
                const couponUsage = transactionalCouponUsageRepository.create({
                    discountId: discount.discountId,
                    userId,
                    orderId,
                });
                await transactionalCouponUsageRepository.save(couponUsage);
            }
            const history = transactionalHistoryRepository.create({
                orderId,
                oldStatus: null,
                newStatus: isBackorder
                    ? order_entity_1.OrderStatus.BACKORDERED
                    : order_entity_1.OrderStatus.PENDING,
                changedBy: userId,
                note: isBackorder
                    ? 'Đơn hàng đặt trước - chờ nhập kho'
                    : 'Đơn hàng đã được tạo',
            });
            await transactionalHistoryRepository.save(history);
            await transactionalCartItemsRepository.delete({ cartId: cart.cartId });
        }));
        if (createOrderDto.paymentMethod === order_entity_1.PaymentMethod.CREDIT && creditLimit) {
            await this.creditLimitRepository.update({ userId }, { currentDebt: () => `current_debt + ${totalPayment}` });
        }
        const createdOrder = await this.findOwnedOrder(userId, orderId);
        await this.notificationsService.sendOrderCreatedNotification(userId, orderId);
        await this.notifyAdminsAboutNewOrder(createdOrder);
        return this.buildOrderDetail(createdOrder);
    }
    async findAllOrders(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const queryBuilder = this.ordersRepository.createQueryBuilder('order');
        if (query.status) {
            queryBuilder.andWhere('order.order_status = :status', {
                status: query.status,
            });
        }
        if (query.search) {
            queryBuilder.andWhere('(order.order_id LIKE :search OR order.user_id LIKE :search OR order.full_name LIKE :search OR order.phone LIKE :search)', { search: `%${query.search}%` });
        }
        queryBuilder
            .orderBy('order.created_at', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        const [orders, total] = await queryBuilder.getManyAndCount();
        return {
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            items: orders.map((order) => this.toOrderSummary(order)),
        };
    }
    async findOrderDetail(currentUser, orderId) {
        await this.ensureUserExists(currentUser._id);
        const order = await this.findAccessibleOrder(currentUser, orderId);
        return this.buildOrderDetail(order);
    }
    async findOrderTracking(currentUser, orderId) {
        await this.ensureUserExists(currentUser._id);
        const order = await this.findAccessibleOrder(currentUser, orderId);
        const tracking = await this.findOrCreateOrderTracking(order.orderId);
        return this.mapOrderTracking(tracking);
    }
    async updateOrderTrackingMode(currentUser, orderId, updateOrderTrackingModeDto) {
        await this.ensureUserExists(currentUser._id);
        const order = await this.findAnyOrder(orderId);
        const tracking = await this.findOrCreateOrderTracking(order.orderId);
        tracking.mode = updateOrderTrackingModeDto.mode;
        const saved = await this.orderTrackingRepository.save(tracking);
        return this.mapOrderTracking(saved);
    }
    async updateManualOrderTracking(currentUser, orderId, updateOrderTrackingManualDto) {
        await this.ensureUserExists(currentUser._id);
        const order = await this.findAnyOrder(orderId);
        const tracking = await this.findOrCreateOrderTracking(order.orderId);
        tracking.manualLatitude = updateOrderTrackingManualDto.latitude.toFixed(7);
        tracking.manualLongitude = updateOrderTrackingManualDto.longitude.toFixed(7);
        tracking.manualNote = updateOrderTrackingManualDto.note?.trim() || null;
        tracking.manualUpdatedBy = currentUser._id;
        tracking.manualUpdatedAt = new Date();
        const saved = await this.orderTrackingRepository.save(tracking);
        return this.mapOrderTracking(saved);
    }
    async updateLiveOrderTracking(currentUser, orderId, updateOrderTrackingLiveDto) {
        await this.ensureUserExists(currentUser._id);
        const order = await this.findAnyOrder(orderId);
        const tracking = await this.findOrCreateOrderTracking(order.orderId);
        tracking.gpsLatitude = updateOrderTrackingLiveDto.latitude.toFixed(7);
        tracking.gpsLongitude = updateOrderTrackingLiveDto.longitude.toFixed(7);
        tracking.gpsHeading =
            updateOrderTrackingLiveDto.heading !== undefined
                ? updateOrderTrackingLiveDto.heading.toFixed(2)
                : null;
        tracking.gpsSpeedKph =
            updateOrderTrackingLiveDto.speedKph !== undefined
                ? updateOrderTrackingLiveDto.speedKph.toFixed(2)
                : null;
        tracking.gpsProvider = updateOrderTrackingLiveDto.provider?.trim() || null;
        tracking.gpsUpdatedAt = new Date();
        const saved = await this.orderTrackingRepository.save(tracking);
        return this.mapOrderTracking(saved);
    }
    async cancelOrder(userId, orderId) {
        await this.ensureUserExists(userId);
        const order = await this.findOwnedOrder(userId, orderId);
        const previousStatus = order.orderStatus;
        if (![order_entity_1.OrderStatus.PENDING, order_entity_1.OrderStatus.CONFIRMED].includes(order.orderStatus)) {
            throw new common_1.BadRequestException('Order cannot be cancelled');
        }
        if (order.paymentStatus === order_entity_1.PaymentStatus.PAID) {
            throw new common_1.BadRequestException('PAID_ORDER_CANCEL_REQUIRES_REFUND');
        }
        await this.ordersRepository.manager.transaction(async (entityManager) => {
            const transactionalOrdersRepository = entityManager.getRepository(order_entity_1.OrderEntity);
            const transactionalOrderItemsRepository = entityManager.getRepository(order_item_entity_1.OrderItemEntity);
            const transactionalProductsRepository = entityManager.getRepository(product_entity_1.ProductEntity);
            const transactionalHistoryRepository = entityManager.getRepository(order_status_history_entity_1.OrderStatusHistoryEntity);
            const transactionalDiscountsRepository = entityManager.getRepository(discount_entity_1.DiscountEntity);
            const transactionalCouponUsageRepository = entityManager.getRepository(coupon_usage_entity_1.CouponUsageEntity);
            await this.restockOrderItems(order.orderId, transactionalProductsRepository, transactionalOrderItemsRepository, entityManager, { performedBy: userId, note: 'Restock by customer cancellation' });
            await this.revertDiscountUsage(order, transactionalDiscountsRepository, transactionalCouponUsageRepository);
            order.orderStatus = order_entity_1.OrderStatus.CANCELLED;
            await transactionalOrdersRepository.save(order);
            const history = transactionalHistoryRepository.create({
                orderId: order.orderId,
                oldStatus: previousStatus,
                newStatus: order_entity_1.OrderStatus.CANCELLED,
                changedBy: userId,
                note: 'Khách hàng đã hủy đơn',
            });
            await transactionalHistoryRepository.save(history);
        });
        if (order.paymentMethod === order_entity_1.PaymentMethod.CREDIT) {
            await this.creditLimitRepository.update({ userId }, { currentDebt: () => `GREATEST(0, current_debt - ${Number(order.totalPayment)})` });
        }
        const cancelledOrder = await this.findOwnedOrder(userId, orderId);
        await this.notificationsService.sendOrderStatusNotification(userId, orderId, order_entity_1.OrderStatus.CANCELLED);
        return this.buildOrderDetail(cancelledOrder);
    }
    async updateOrderStatus(currentUser, orderId, updateOrderStatusDto) {
        await this.ensureUserExists(currentUser._id);
        const order = await this.findAnyOrder(orderId);
        const previousStatus = order.orderStatus;
        const previousPaymentStatus = order.paymentStatus;
        const nextStatus = updateOrderStatusDto.status;
        if (previousStatus === nextStatus) {
            return this.buildOrderDetail(order);
        }
        if ([
            order_entity_1.OrderStatus.DELIVERED,
            order_entity_1.OrderStatus.PARTIAL_DELIVERED,
            order_entity_1.OrderStatus.RETURNED,
        ].includes(previousStatus) &&
            nextStatus !== order_entity_1.OrderStatus.RETURNED) {
            throw new common_1.BadRequestException('Finalized order cannot change status');
        }
        if (previousStatus === order_entity_1.OrderStatus.CANCELLED) {
            throw new common_1.BadRequestException('Cancelled order cannot change status');
        }
        if (!this.isValidAdminStatusTransition(previousStatus, nextStatus)) {
            throw new common_1.BadRequestException('Invalid order status transition');
        }
        await this.ordersRepository.manager.transaction(async (entityManager) => {
            const transactionalOrdersRepository = entityManager.getRepository(order_entity_1.OrderEntity);
            const transactionalOrderItemsRepository = entityManager.getRepository(order_item_entity_1.OrderItemEntity);
            const transactionalProductsRepository = entityManager.getRepository(product_entity_1.ProductEntity);
            const transactionalHistoryRepository = entityManager.getRepository(order_status_history_entity_1.OrderStatusHistoryEntity);
            const transactionalInventoryTransactionsRepository = entityManager.getRepository(inventory_transaction_entity_1.InventoryTransactionEntity);
            const transactionalDiscountsRepository = entityManager.getRepository(discount_entity_1.DiscountEntity);
            const transactionalCouponUsageRepository = entityManager.getRepository(coupon_usage_entity_1.CouponUsageEntity);
            if (previousStatus === order_entity_1.OrderStatus.BACKORDERED &&
                nextStatus === order_entity_1.OrderStatus.PENDING) {
                const items = await transactionalOrderItemsRepository.find({
                    where: { orderId: order.orderId },
                });
                for (const item of items) {
                    const product = await transactionalProductsRepository.findOne({
                        where: { productId: item.productId },
                        lock: { mode: 'pessimistic_write' },
                    });
                    if (!product) {
                        throw new common_1.BadRequestException(`Sáº£n pháº©m trong Ä‘Æ¡n khÃ´ng cÃ²n tá»“n táº¡i`);
                    }
                    if (item.quantity > product.quantityAvailable) {
                        throw new common_1.BadRequestException(`Sáº£n pháº©m ${product.productName} váº«n chÆ°a Ä‘á»§ tá»“n kho Ä‘á»ƒ fulfill`);
                    }
                    const qtyBefore = product.quantityAvailable;
                    product.quantityAvailable -= item.quantity;
                    product.quantityReserved =
                        (product.quantityReserved ?? 0) + item.quantity;
                    await transactionalProductsRepository.save(product);
                    const tx = transactionalInventoryTransactionsRepository.create({
                        productId: item.productId,
                        performedBy: currentUser._id,
                        transactionType: inventory_transaction_entity_1.InventoryTransactionType.EXPORT,
                        quantityChange: -item.quantity,
                        quantityBefore: qtyBefore,
                        quantityAfter: product.quantityAvailable,
                        referenceType: 'ORDER',
                        referenceId: order.orderId,
                        unitCostAtTime: product.avgCost ?? null,
                        note: 'Export by backorder fulfillment',
                        relatedOrderId: order.orderId,
                    });
                    await transactionalInventoryTransactionsRepository.save(tx);
                    await this.syncDefaultWarehouseStock(entityManager, item.productId, -item.quantity);
                }
            }
            if (nextStatus === order_entity_1.OrderStatus.CANCELLED ||
                nextStatus === order_entity_1.OrderStatus.RETURNED) {
                const isBackorderCancel = previousStatus === order_entity_1.OrderStatus.BACKORDERED &&
                    nextStatus === order_entity_1.OrderStatus.CANCELLED;
                if (isBackorderCancel) {
                    await this.revertDiscountUsage(order, transactionalDiscountsRepository, transactionalCouponUsageRepository);
                    order.orderStatus = nextStatus;
                    await transactionalOrdersRepository.save(order);
                    const history = transactionalHistoryRepository.create({
                        orderId: order.orderId,
                        oldStatus: previousStatus,
                        newStatus: nextStatus,
                        changedBy: currentUser._id,
                        note: updateOrderStatusDto.note ?? 'Đã hủy đơn chờ hàng',
                    });
                    await transactionalHistoryRepository.save(history);
                    return;
                }
                const items = await transactionalOrderItemsRepository.find({
                    where: { orderId: order.orderId },
                });
                if (nextStatus === order_entity_1.OrderStatus.CANCELLED) {
                    if (order.paymentStatus === order_entity_1.PaymentStatus.PAID) {
                        throw new common_1.BadRequestException('PAID_ORDER_CANCEL_REQUIRES_REFUND');
                    }
                    await this.restockOrderItems(order.orderId, transactionalProductsRepository, transactionalOrderItemsRepository, entityManager, {
                        performedBy: currentUser._id,
                        note: updateOrderStatusDto.note ?? 'Restock by admin cancellation',
                    });
                    await this.revertDiscountUsage(order, transactionalDiscountsRepository, transactionalCouponUsageRepository);
                }
                else if (nextStatus === order_entity_1.OrderStatus.RETURNED) {
                    for (const item of items) {
                        const product = await transactionalProductsRepository.findOne({
                            where: { productId: item.productId },
                            lock: { mode: 'pessimistic_write' },
                        });
                        if (!product)
                            continue;
                        const returnRecord = entityManager
                            .getRepository(return_entity_1.ReturnEntity)
                            .create({
                            orderId: order.orderId,
                            orderItemId: item.orderItemId,
                            userId: order.userId,
                            reason: updateOrderStatusDto.note ?? 'Returned by admin',
                            description: null,
                            returnQuantity: this.getDeliveredQuantityForReturn(item),
                            maxRefundableAmount: item.lineTotal,
                            refundedQuantity: 0,
                            returnStatus: return_entity_1.ReturnStatus.RECEIVED,
                            inspectionStatus: return_entity_1.ReturnInspectionStatus.PENDING,
                            refundAmount: null,
                        });
                        await entityManager
                            .getRepository(return_entity_1.ReturnEntity)
                            .save(returnRecord);
                    }
                }
            }
            if (nextStatus === order_entity_1.OrderStatus.DELIVERED) {
                await this.releaseReservedOnDelivered(order.orderId, transactionalProductsRepository, transactionalOrderItemsRepository);
            }
            order.orderStatus = nextStatus;
            if (nextStatus === order_entity_1.OrderStatus.DELIVERED &&
                order.paymentMethod === order_entity_1.PaymentMethod.COD) {
                order.paymentStatus = order_entity_1.PaymentStatus.PAID;
            }
            if (nextStatus === order_entity_1.OrderStatus.CANCELLED) {
                order.paymentStatus =
                    order.paymentStatus === order_entity_1.PaymentStatus.PAID
                        ? order_entity_1.PaymentStatus.REFUNDED
                        : order_entity_1.PaymentStatus.FAILED;
            }
            if (nextStatus === order_entity_1.OrderStatus.RETURNED) {
                order.paymentStatus =
                    order.paymentStatus === order_entity_1.PaymentStatus.PAID
                        ? order_entity_1.PaymentStatus.REFUNDED
                        : order_entity_1.PaymentStatus.FAILED;
            }
            await transactionalOrdersRepository.save(order);
            const history = transactionalHistoryRepository.create({
                orderId: order.orderId,
                oldStatus: previousStatus,
                newStatus: nextStatus,
                changedBy: currentUser._id,
                note: updateOrderStatusDto.note ?? 'Cập nhật trạng thái bởi admin',
            });
            await transactionalHistoryRepository.save(history);
        });
        if (nextStatus === order_entity_1.OrderStatus.CANCELLED &&
            order.paymentMethod === order_entity_1.PaymentMethod.CREDIT &&
            previousPaymentStatus === order_entity_1.PaymentStatus.UNPAID) {
            await this.creditLimitRepository.update({ userId: order.userId }, { currentDebt: () => `GREATEST(0, current_debt - ${Number(order.totalPayment)})` });
        }
        const updatedOrder = await this.findAnyOrder(orderId);
        await this.notificationsService.sendOrderStatusNotification(updatedOrder.userId, orderId, nextStatus);
        if (nextStatus === order_entity_1.OrderStatus.DELIVERED &&
            updatedOrder.userId &&
            !(await this.isGuestUserId(updatedOrder.userId))) {
            void this.membershipService.recalculateAndReward(updatedOrder.userId);
        }
        return this.buildOrderDetail(updatedOrder);
    }
    async initiatePayment(currentUser, orderId, initiatePaymentDto) {
        const order = currentUser
            ? await this.findAccessibleOrder(currentUser, orderId)
            : await this.findAnyOrder(orderId);
        if (currentUser) {
            await this.ensureUserExists(currentUser._id);
        }
        else {
            const normalizePhone = (value) => value.replace(/\s+/g, '');
            if (!(await this.isGuestUserId(order.userId))) {
                throw new common_1.UnauthorizedException('Order is not a guest order');
            }
            if (!initiatePaymentDto.phone ||
                normalizePhone(order.phone) !== normalizePhone(initiatePaymentDto.phone)) {
                throw new common_1.UnauthorizedException('Phone number does not match order');
            }
        }
        if (!this.isOnlinePaymentMethod(order.paymentMethod)) {
            throw new common_1.BadRequestException('Order does not require online payment');
        }
        if (order.paymentStatus === order_entity_1.PaymentStatus.PAID) {
            throw new common_1.BadRequestException('Order has already been paid');
        }
        const transactionRef = `${orderId}-${Date.now()}`;
        const paymentTransaction = this.paymentTransactionsRepository.create({
            orderId,
            userId: order.userId,
            provider: order.paymentMethod,
            transactionRef,
            transactionStatus: payment_transaction_entity_1.PaymentTransactionStatus.PENDING,
            paymentStatus: order_entity_1.PaymentStatus.UNPAID,
            amount: order.totalPayment,
            gatewayCode: null,
            gatewayMessage: null,
            rawPayload: {
                returnUrl: initiatePaymentDto.returnUrl ?? null,
            },
        });
        await this.paymentTransactionsRepository.save(paymentTransaction);
        let paymentUrl = `https://payment-gateway.local?provider=${order.paymentMethod}&transactionRef=${transactionRef}&orderId=${orderId}`;
        if (order.paymentMethod === order_entity_1.PaymentMethod.MOMO) {
            const momoUrl = await this.buildMomoPaymentUrl(orderId, transactionRef, Math.round(Number(order.totalPayment)), initiatePaymentDto.returnUrl ?? `${process.env.FRONTEND_URL ?? 'http://localhost:5173'}/client/payment`).catch((err) => {
                console.error('[MoMo] buildMomoPaymentUrl error:', err);
                return null;
            });
            if (momoUrl) {
                paymentUrl = momoUrl;
            }
            else {
                console.warn('[MoMo] KhÃ´ng láº¥y Ä‘Æ°á»£c paymentUrl â€” kiá»ƒm tra credentials vÃ  BACKEND_URL trong .env');
            }
        }
        return {
            orderId,
            provider: order.paymentMethod,
            transactionRef,
            paymentUrl,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        };
    }
    async buildMomoPaymentUrl(internalOrderId, requestId, amount, redirectUrl) {
        const { partnerCode, accessKey, secretKey } = await this.settingsService.getMomoConfig();
        if (!partnerCode || !accessKey || !secretKey)
            return null;
        const momoOrderId = requestId;
        const ipnUrl = `${process.env.BACKEND_URL ?? 'http://localhost:8000'}/api/v1/payments/momo/ipn`;
        const orderInfo = `Thanh toan don hang ${internalOrderId}`;
        const requestType = 'payWithMethod';
        const extraData = '';
        const lang = 'vi';
        const rawSignature = [
            `accessKey=${accessKey}`,
            `amount=${amount}`,
            `extraData=${extraData}`,
            `ipnUrl=${ipnUrl}`,
            `orderId=${momoOrderId}`,
            `orderInfo=${orderInfo}`,
            `partnerCode=${partnerCode}`,
            `redirectUrl=${redirectUrl}`,
            `requestId=${requestId}`,
            `requestType=${requestType}`,
        ].join('&');
        const signature = (0, node_crypto_2.createHmac)('sha256', secretKey).update(rawSignature).digest('hex');
        const body = {
            partnerCode,
            accessKey,
            requestId,
            amount,
            orderId: momoOrderId,
            orderInfo,
            redirectUrl,
            ipnUrl,
            requestType,
            extraData,
            lang,
            signature,
        };
        const isSandbox = partnerCode === 'MOMO' || process.env.MOMO_SANDBOX === 'true';
        const endpoint = isSandbox
            ? 'https://test-payment.momo.vn/v2/gateway/api/create'
            : 'https://payment.momo.vn/v2/gateway/api/create';
        console.log(`[MoMo] Calling ${isSandbox ? 'SANDBOX' : 'PRODUCTION'} endpoint`);
        console.log('[MoMo] orderId:', momoOrderId, '| amount:', amount, '| ipnUrl:', ipnUrl);
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data = (await response.json());
        console.log('[MoMo] Response:', JSON.stringify(data));
        if (data.resultCode === 0 && data.payUrl)
            return data.payUrl;
        console.error(`[MoMo] resultCode=${data.resultCode ?? 'N/A'} message=${data.message ?? 'N/A'}`);
        return null;
    }
    async handleMomoIpn(body) {
        const { accessKey, secretKey } = await this.settingsService.getMomoConfig();
        if (!secretKey || !accessKey)
            return { message: 'ignored' };
        if (!(0, payment_signature_util_1.verifyMomoSignature)(body, accessKey, secretKey)) {
            throw new common_1.UnauthorizedException('Invalid MoMo signature');
        }
        const { orderId: momoOrderId, requestId, amount, resultCode, transId, message: gwMessage, } = body;
        const txRef = momoOrderId ?? requestId;
        if (!txRef)
            return { message: 'missing orderId' };
        const transaction = await this.paymentTransactionsRepository
            .findOne({ where: { transactionRef: txRef } })
            .catch(() => null);
        const internalOrderId = transaction?.orderId;
        if (!internalOrderId)
            return { message: 'transaction not found' };
        const order = await this.ordersRepository
            .findOneBy({ orderId: internalOrderId })
            .catch(() => null);
        if (!order)
            return { message: 'order not found' };
        if (transaction &&
            transaction.transactionStatus === payment_transaction_entity_1.PaymentTransactionStatus.SUCCESS &&
            transaction.gatewayCode === String(resultCode ?? '')) {
            return { message: 'already processed', transId };
        }
        if (amount !== undefined && amount !== null) {
            const expectedAmount = Number(order.totalPayment);
            const reportedAmount = Number(amount);
            if (Number.isFinite(expectedAmount) &&
                Number.isFinite(reportedAmount) &&
                Math.abs(expectedAmount - reportedAmount) > 0.01) {
                if (transaction) {
                    transaction.transactionStatus = payment_transaction_entity_1.PaymentTransactionStatus.FAILED;
                    transaction.gatewayCode = 'AMOUNT_MISMATCH';
                    transaction.gatewayMessage = `Expected ${expectedAmount}, got ${reportedAmount}`;
                    transaction.rawPayload = body;
                    await this.paymentTransactionsRepository.save(transaction);
                }
                throw new common_1.BadRequestException('Payment amount mismatch');
            }
        }
        const resultCodeValue = Number(resultCode);
        const success = resultCodeValue === 0;
        const paymentStatus = success ? order_entity_1.PaymentStatus.PAID : order_entity_1.PaymentStatus.FAILED;
        if (transaction) {
            transaction.transactionStatus = success
                ? payment_transaction_entity_1.PaymentTransactionStatus.SUCCESS
                : payment_transaction_entity_1.PaymentTransactionStatus.FAILED;
            transaction.paymentStatus = paymentStatus;
            transaction.gatewayCode = String(resultCode ?? '');
            transaction.gatewayMessage = gwMessage ?? null;
            transaction.rawPayload = body;
            await this.paymentTransactionsRepository.save(transaction);
        }
        else {
            const newTx = this.paymentTransactionsRepository.create({
                orderId: internalOrderId,
                userId: order.userId,
                provider: order_entity_1.PaymentMethod.MOMO,
                transactionRef: txRef,
                transactionStatus: success
                    ? payment_transaction_entity_1.PaymentTransactionStatus.SUCCESS
                    : payment_transaction_entity_1.PaymentTransactionStatus.FAILED,
                paymentStatus,
                amount: String(amount ?? order.totalPayment),
                gatewayCode: String(resultCode ?? ''),
                gatewayMessage: gwMessage ?? null,
                rawPayload: body,
            });
            await this.paymentTransactionsRepository.save(newTx);
        }
        order.paymentStatus = paymentStatus;
        await this.ordersRepository.save(order);
        await this.notificationsService.sendPaymentNotification(order.userId, internalOrderId, paymentStatus, order_entity_1.PaymentMethod.MOMO);
        return { message: 'ok', transId };
    }
    async handlePaymentCallback(provider, paymentCallbackDto) {
        const normalizedProvider = provider.toLowerCase();
        const order = await this.findAnyOrder(paymentCallbackDto.orderId);
        if (order.paymentMethod !== normalizedProvider) {
            throw new common_1.BadRequestException('Payment provider does not match order');
        }
        const existingTx = await this.paymentTransactionsRepository.findOne({
            where: { transactionRef: paymentCallbackDto.transactionRef },
        });
        if (existingTx &&
            existingTx.transactionStatus === payment_transaction_entity_1.PaymentTransactionStatus.SUCCESS &&
            paymentCallbackDto.success) {
            return {
                orderId: order.orderId,
                provider: normalizedProvider,
                transactionRef: paymentCallbackDto.transactionRef,
                paymentStatus: existingTx.paymentStatus,
                message: 'already processed',
            };
        }
        if (paymentCallbackDto.success) {
            const expectedAmount = Number(order.totalPayment);
            const reportedAmount = Number(paymentCallbackDto.amount);
            if (Number.isFinite(expectedAmount) &&
                Number.isFinite(reportedAmount) &&
                Math.abs(expectedAmount - reportedAmount) > 0.01) {
                throw new common_1.BadRequestException(`Payment amount mismatch: expected ${expectedAmount}, got ${reportedAmount}`);
            }
        }
        const paymentStatus = paymentCallbackDto.success
            ? order_entity_1.PaymentStatus.PAID
            : order_entity_1.PaymentStatus.FAILED;
        if (existingTx) {
            existingTx.transactionStatus = paymentCallbackDto.success
                ? payment_transaction_entity_1.PaymentTransactionStatus.SUCCESS
                : payment_transaction_entity_1.PaymentTransactionStatus.FAILED;
            existingTx.paymentStatus = paymentStatus;
            existingTx.gatewayCode = paymentCallbackDto.gatewayCode ?? null;
            existingTx.gatewayMessage = paymentCallbackDto.gatewayMessage ?? null;
            existingTx.rawPayload = paymentCallbackDto.rawPayload ?? null;
            await this.paymentTransactionsRepository.save(existingTx);
        }
        else {
            const transaction = this.paymentTransactionsRepository.create({
                orderId: order.orderId,
                userId: order.userId,
                provider: normalizedProvider,
                transactionRef: paymentCallbackDto.transactionRef,
                transactionStatus: paymentCallbackDto.success
                    ? payment_transaction_entity_1.PaymentTransactionStatus.SUCCESS
                    : payment_transaction_entity_1.PaymentTransactionStatus.FAILED,
                paymentStatus,
                amount: paymentCallbackDto.amount,
                gatewayCode: paymentCallbackDto.gatewayCode ?? null,
                gatewayMessage: paymentCallbackDto.gatewayMessage ?? null,
                rawPayload: paymentCallbackDto.rawPayload ?? null,
            });
            await this.paymentTransactionsRepository.save(transaction);
        }
        order.paymentStatus = paymentStatus;
        await this.ordersRepository.save(order);
        await this.notificationsService.sendPaymentNotification(order.userId, order.orderId, paymentStatus, normalizedProvider);
        return {
            orderId: order.orderId,
            provider: normalizedProvider,
            transactionRef: paymentCallbackDto.transactionRef,
            paymentStatus,
        };
    }
    async reconcileStalePayments() {
        try {
            const cutoff = new Date(Date.now() - this.stalePaymentTtlMs);
            const stale = await this.ordersRepository.find({
                where: {
                    orderStatus: order_entity_1.OrderStatus.PENDING,
                    paymentStatus: order_entity_1.PaymentStatus.UNPAID,
                    paymentMethod: (0, typeorm_2.In)([
                        order_entity_1.PaymentMethod.MOMO,
                        order_entity_1.PaymentMethod.VNPAY,
                        order_entity_1.PaymentMethod.ZALOPAY,
                        order_entity_1.PaymentMethod.BANK_TRANSFER,
                        order_entity_1.PaymentMethod.PAYPAL,
                    ]),
                    createdAt: (0, typeorm_2.LessThan)(cutoff),
                },
                take: 100,
            });
            if (stale.length === 0)
                return;
            this.logger.log(`[reconcileStalePayments] Found ${stale.length} stale unpaid orders`);
            for (const order of stale) {
                try {
                    const succeeded = await this.paymentTransactionsRepository.findOne({
                        where: {
                            orderId: order.orderId,
                            transactionStatus: payment_transaction_entity_1.PaymentTransactionStatus.SUCCESS,
                        },
                    });
                    if (succeeded) {
                        order.paymentStatus = order_entity_1.PaymentStatus.PAID;
                        await this.ordersRepository.save(order);
                        continue;
                    }
                    await this.ordersRepository.manager.transaction(async (em) => {
                        const items = await em.find(order_item_entity_1.OrderItemEntity, {
                            where: { orderId: order.orderId },
                        });
                        for (const item of items) {
                            const product = await em.findOne(product_entity_1.ProductEntity, {
                                where: { productId: item.productId },
                                lock: { mode: 'pessimistic_write' },
                            });
                            if (product) {
                                product.quantityAvailable += item.quantity;
                                product.quantityReserved = Math.max(0, (product.quantityReserved ?? 0) - item.quantity);
                                await em.save(product_entity_1.ProductEntity, product);
                            }
                            await em.save(inventory_transaction_entity_1.InventoryTransactionEntity, em.create(inventory_transaction_entity_1.InventoryTransactionEntity, {
                                productId: item.productId,
                                performedBy: null,
                                transactionType: inventory_transaction_entity_1.InventoryTransactionType.RETURN_IN,
                                quantityChange: item.quantity,
                                referenceType: 'ORDER',
                                referenceId: order.orderId,
                                note: 'Auto-cancel by reconciliation (unpaid > 30min)',
                                relatedOrderId: order.orderId,
                            }));
                        }
                        order.orderStatus = order_entity_1.OrderStatus.CANCELLED;
                        order.paymentStatus = order_entity_1.PaymentStatus.FAILED;
                        await em.save(order_entity_1.OrderEntity, order);
                        await em.save(order_status_history_entity_1.OrderStatusHistoryEntity, em.create(order_status_history_entity_1.OrderStatusHistoryEntity, {
                            orderId: order.orderId,
                            oldStatus: order_entity_1.OrderStatus.PENDING,
                            newStatus: order_entity_1.OrderStatus.CANCELLED,
                            changedBy: null,
                            note: 'Auto-cancelled by reconciliation cron (unpaid > 30 min)',
                        }));
                    });
                    this.logger.log(`[reconcileStalePayments] Cancelled order ${order.orderId}`);
                }
                catch (err) {
                    this.logger.error(`[reconcileStalePayments] Failed for order ${order.orderId}`, err instanceof Error ? err.stack : String(err));
                }
            }
        }
        catch (err) {
            this.logger.error('[reconcileStalePayments] Top-level error', err instanceof Error ? err.stack : String(err));
        }
    }
    async findPaymentTransactions(currentUser, orderId) {
        await this.ensureUserExists(currentUser._id);
        const order = this.hasManageOrdersPermission(currentUser)
            ? await this.findAnyOrder(orderId)
            : await this.findOwnedOrder(currentUser._id, orderId);
        const items = await this.paymentTransactionsRepository.find({
            where: { orderId: order.orderId },
            order: { createdAt: 'DESC' },
        });
        return items.map((item) => ({
            id: item.paymentTransactionId,
            orderId: item.orderId,
            provider: item.provider,
            transactionRef: item.transactionRef,
            transactionStatus: item.transactionStatus,
            paymentStatus: item.paymentStatus,
            amount: item.amount,
            gatewayCode: item.gatewayCode,
            gatewayMessage: item.gatewayMessage,
            rawPayload: item.rawPayload,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        }));
    }
    async findAllPaymentTransactions(params) {
        const { page, limit, provider, status } = params;
        const skip = (page - 1) * limit;
        const query = this.paymentTransactionsRepository.createQueryBuilder('pt');
        if (provider)
            query.andWhere('pt.provider = :provider', { provider });
        if (status)
            query.andWhere('pt.transactionStatus = :status', { status });
        query.orderBy('pt.createdAt', 'DESC').skip(skip).take(limit);
        const [items, total] = await query.getManyAndCount();
        const userIds = [...new Set(items.map((i) => i.userId))];
        const users = userIds.length > 0
            ? await this.usersRepository.createQueryBuilder('u').select(['u.userId', 'u.username', 'u.email']).whereInIds(userIds).getMany()
            : [];
        const userMap = new Map(users.map((u) => [u.userId, u]));
        return {
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
            items: items.map((i) => ({
                id: i.paymentTransactionId,
                orderId: i.orderId,
                provider: i.provider,
                transactionRef: i.transactionRef,
                transactionStatus: i.transactionStatus,
                paymentStatus: i.paymentStatus,
                amount: i.amount,
                gatewayCode: i.gatewayCode,
                gatewayMessage: i.gatewayMessage,
                createdAt: i.createdAt,
                user: userMap.get(i.userId) ? {
                    username: userMap.get(i.userId).username,
                    email: userMap.get(i.userId).email,
                } : null,
            })),
        };
    }
    async findAllRefunds(params) {
        const { page, limit, status, reason, orderId } = params;
        const skip = (page - 1) * limit;
        const query = this.orderRefundsRepository.createQueryBuilder('refund');
        if (status) {
            query.andWhere('refund.refundStatus = :status', { status });
        }
        if (reason) {
            query.andWhere('refund.reason = :reason', { reason });
        }
        if (orderId) {
            query.andWhere('refund.orderId = :orderId', { orderId });
        }
        query.orderBy('refund.createdAt', 'DESC').skip(skip).take(limit);
        const [items, total] = await query.getManyAndCount();
        const orderIds = [...new Set(items.map((item) => item.orderId))];
        const orders = orderIds.length
            ? await this.ordersRepository.find({ where: { orderId: (0, typeorm_2.In)(orderIds) } })
            : [];
        const orderMap = new Map(orders.map((order) => [order.orderId, order]));
        return {
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
            items: items.map((item) => {
                const order = orderMap.get(item.orderId);
                return {
                    refundId: item.refundId,
                    orderId: item.orderId,
                    returnId: item.returnId,
                    reason: item.reason,
                    refundStatus: item.refundStatus,
                    amount: item.amount,
                    paymentProvider: item.paymentProvider,
                    manualReference: item.manualReference,
                    note: item.note,
                    createdBy: item.createdBy,
                    updatedBy: item.updatedBy,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                    order: order
                        ? {
                            status: order.orderStatus,
                            paymentStatus: order.paymentStatus,
                            totalPayment: order.totalPayment,
                            fullName: order.fullName,
                            phone: order.phone,
                        }
                        : null,
                };
            }),
        };
    }
    async createCancelPaidOrderRefund(currentUser, dto) {
        await this.ensureUserExists(currentUser._id);
        const order = await this.findAnyOrder(dto.orderId);
        if (![order_entity_1.OrderStatus.PENDING, order_entity_1.OrderStatus.CONFIRMED].includes(order.orderStatus)) {
            throw new common_1.BadRequestException('ORDER_NOT_ELIGIBLE_FOR_CANCEL_REFUND');
        }
        if (order.paymentStatus !== order_entity_1.PaymentStatus.PAID) {
            throw new common_1.BadRequestException('ORDER_PAYMENT_NOT_PAID');
        }
        const duplicate = await this.orderRefundsRepository.findOne({
            where: {
                orderId: order.orderId,
                reason: order_refund_entity_1.OrderRefundReason.CANCEL_PAID_ORDER,
                refundStatus: (0, typeorm_2.In)([order_refund_entity_1.OrderRefundStatus.PENDING, order_refund_entity_1.OrderRefundStatus.APPROVED]),
            },
        });
        if (duplicate) {
            throw new common_1.BadRequestException('OPEN_CANCEL_REFUND_ALREADY_EXISTS');
        }
        const completedRefunds = await this.getCompletedRefundAmount(order.orderId);
        const refundable = Math.max(0, Number(order.totalPayment) - completedRefunds);
        const amount = dto.amount ?? refundable;
        if (!Number.isFinite(amount) || amount <= 0 || amount > refundable) {
            throw new common_1.BadRequestException('REFUND_AMOUNT_EXCEEDS_AVAILABLE');
        }
        return this.orderRefundsRepository.save(this.orderRefundsRepository.create({
            orderId: order.orderId,
            returnId: null,
            reason: order_refund_entity_1.OrderRefundReason.CANCEL_PAID_ORDER,
            refundStatus: order_refund_entity_1.OrderRefundStatus.PENDING,
            amount: amount.toFixed(2),
            paymentProvider: order.paymentMethod,
            manualReference: null,
            note: dto.note ?? 'Pending paid order cancellation refund',
            createdBy: currentUser._id,
            updatedBy: currentUser._id,
        }));
    }
    async updateRefundStatus(currentUser, refundId, dto) {
        await this.ensureUserExists(currentUser._id);
        const refund = await this.orderRefundsRepository.findOneBy({ refundId });
        if (!refund) {
            throw new common_1.NotFoundException('Refund not found');
        }
        if (refund.refundStatus === order_refund_entity_1.OrderRefundStatus.COMPLETED) {
            throw new common_1.BadRequestException('Refund already completed');
        }
        if (dto.status === order_refund_entity_1.OrderRefundStatus.COMPLETED &&
            !(dto.manualReference?.trim() || dto.note?.trim() || refund.manualReference)) {
            throw new common_1.BadRequestException('REFUND_COMPLETION_REFERENCE_REQUIRED');
        }
        refund.refundStatus = dto.status;
        refund.manualReference =
            dto.manualReference?.trim() || refund.manualReference || null;
        refund.note = dto.note?.trim() || refund.note;
        refund.updatedBy = currentUser._id;
        await this.ordersRepository.manager.transaction(async (em) => {
            await em.save(order_refund_entity_1.OrderRefundEntity, refund);
            if (dto.status !== order_refund_entity_1.OrderRefundStatus.COMPLETED) {
                return;
            }
            const order = await em.findOne(order_entity_1.OrderEntity, {
                where: { orderId: refund.orderId },
                lock: { mode: 'pessimistic_write' },
            });
            if (!order) {
                throw new common_1.NotFoundException('Order not found');
            }
            if (refund.reason === order_refund_entity_1.OrderRefundReason.CANCEL_PAID_ORDER) {
                if (order.orderStatus === order_entity_1.OrderStatus.CANCELLED) {
                    return;
                }
                if (![order_entity_1.OrderStatus.PENDING, order_entity_1.OrderStatus.CONFIRMED].includes(order.orderStatus)) {
                    throw new common_1.BadRequestException('ORDER_NOT_ELIGIBLE_FOR_CANCEL_REFUND');
                }
                await this.restockOrderItems(order.orderId, em.getRepository(product_entity_1.ProductEntity), em.getRepository(order_item_entity_1.OrderItemEntity), em, {
                    performedBy: currentUser._id,
                    note: 'Restock after paid order refund completion',
                });
                await this.revertDiscountUsage(order, em.getRepository(discount_entity_1.DiscountEntity), em.getRepository(coupon_usage_entity_1.CouponUsageEntity));
                order.orderStatus = order_entity_1.OrderStatus.CANCELLED;
                order.paymentStatus = order_entity_1.PaymentStatus.REFUNDED;
                await em.save(order_entity_1.OrderEntity, order);
                await em.save(order_status_history_entity_1.OrderStatusHistoryEntity, em.create(order_status_history_entity_1.OrderStatusHistoryEntity, {
                    orderId: order.orderId,
                    oldStatus: order_entity_1.OrderStatus.PENDING,
                    newStatus: order_entity_1.OrderStatus.CANCELLED,
                    changedBy: currentUser._id,
                    note: 'Cancel paid order after manual refund completion',
                }));
            }
            if (refund.reason === order_refund_entity_1.OrderRefundReason.RETURN && refund.returnId) {
                const returnRequest = await em.findOne(return_entity_1.ReturnEntity, {
                    where: { returnId: refund.returnId },
                });
                if (returnRequest) {
                    returnRequest.refundAmount = refund.amount;
                    returnRequest.refundedQuantity = returnRequest.returnQuantity;
                    returnRequest.returnStatus = return_entity_1.ReturnStatus.REFUNDED;
                    await em.save(return_entity_1.ReturnEntity, returnRequest);
                }
                if (Number(refund.amount) >= Number(order.totalPayment)) {
                    order.paymentStatus = order_entity_1.PaymentStatus.REFUNDED;
                    await em.save(order_entity_1.OrderEntity, order);
                }
            }
        });
        return this.orderRefundsRepository.findOneBy({ refundId });
    }
    async createReturn(userId, createReturnDto) {
        await this.ensureUserExists(userId);
        const order = await this.findOwnedOrder(userId, createReturnDto.orderId);
        if (![order_entity_1.OrderStatus.DELIVERED, order_entity_1.OrderStatus.PARTIAL_DELIVERED].includes(order.orderStatus)) {
            throw new common_1.BadRequestException('RETURN_NOT_DELIVERED_YET');
        }
        const returnWindow = await this.getOrderReturnWindow(order);
        if (!returnWindow.canCreateReturn) {
            throw new common_1.BadRequestException(returnWindow.returnBlockedReason);
        }
        const orderItem = await this.orderItemsRepository.findOneBy({
            orderItemId: createReturnDto.orderItemId,
            orderId: order.orderId,
        });
        if (!orderItem) {
            throw new common_1.NotFoundException('Order item not found');
        }
        const deliveredQuantity = this.getDeliveredQuantityForReturn(orderItem);
        if (deliveredQuantity <= 0) {
            throw new common_1.BadRequestException('Item has not been delivered');
        }
        const alreadyReturned = await this.getReturnedQuantityForItem(createReturnDto.orderItemId);
        const remainingReturnable = Math.max(0, deliveredQuantity - alreadyReturned);
        if (createReturnDto.returnQuantity > remainingReturnable) {
            throw new common_1.BadRequestException(`RETURN_QUANTITY_EXCEEDS_AVAILABLE:${remainingReturnable}`);
        }
        const maxRefundableAmount = this.calculateLineRefundAmount(orderItem, createReturnDto.returnQuantity);
        const created = this.returnsRepository.create({
            orderId: order.orderId,
            orderItemId: createReturnDto.orderItemId,
            returnQuantity: createReturnDto.returnQuantity,
            userId,
            reason: createReturnDto.reason,
            description: createReturnDto.description ?? null,
            returnStatus: return_entity_1.ReturnStatus.REQUESTED,
            refundAmount: null,
            maxRefundableAmount: maxRefundableAmount.toFixed(2),
            refundedQuantity: 0,
        });
        const saved = await this.returnsRepository.save(created);
        await this.notificationsService.sendReturnStatusNotification({
            userId,
            orderId: order.orderId,
            returnId: saved.returnId,
            status: saved.returnStatus,
        });
        return {
            ...saved,
            statusLabel: this.getReturnStatusLabel(saved.returnStatus),
            returnWindowDays: returnWindow.returnWindowDays,
            returnDeadline: returnWindow.returnDeadline,
            canCreateReturn: returnWindow.canCreateReturn,
            returnBlockedReason: returnWindow.returnBlockedReason,
        };
    }
    async findMyReturns(userId, query = {}) {
        await this.ensureUserExists(userId);
        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
        const normalizedSearch = query.search?.trim().toLowerCase();
        const items = await this.returnsRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
        const orderItemIds = [...new Set(items.map((item) => item.orderItemId))];
        const orderIds = [...new Set(items.map((item) => item.orderId))];
        const [orderItems, orders] = await Promise.all([
            orderItemIds.length
                ? this.orderItemsRepository.find({
                    where: { orderItemId: (0, typeorm_2.In)(orderItemIds) },
                })
                : Promise.resolve([]),
            orderIds.length
                ? this.ordersRepository.find({ where: { orderId: (0, typeorm_2.In)(orderIds) } })
                : Promise.resolve([]),
        ]);
        const orderItemMap = new Map(orderItems.map((item) => [item.orderItemId, item]));
        const orderMap = new Map(orders.map((order) => [order.orderId, order]));
        const itemImageMap = await this.getOrderItemImageMap(orderItems);
        const enriched = await Promise.all(items.map(async (item) => {
            const order = orderMap.get(item.orderId);
            const returnWindow = order
                ? await this.getOrderReturnWindow(order)
                : {
                    returnWindowDays: RETURN_WINDOW_DAYS,
                    returnDeadline: null,
                    canCreateReturn: false,
                    returnBlockedReason: 'ORDER_NOT_FOUND',
                };
            const orderItem = orderItemMap.get(item.orderItemId);
            return {
                id: item.returnId,
                returnId: item.returnId,
                orderId: item.orderId,
                orderItemId: item.orderItemId,
                productId: orderItem?.productId ?? null,
                productName: orderItem?.productName ?? null,
                sku: orderItem?.sku ?? null,
                colorName: orderItem?.colorName ?? null,
                sizeName: orderItem?.sizeName ?? null,
                imageUrl: itemImageMap.get(item.orderItemId) ?? null,
                returnQuantity: item.returnQuantity,
                reason: item.reason,
                reasonLabel: this.getReturnReasonLabel(item.reason),
                description: item.description,
                status: item.returnStatus,
                statusLabel: this.getReturnStatusLabel(item.returnStatus),
                inspectionStatus: item.inspectionStatus,
                inspectionStatusLabel: this.getReturnInspectionStatusLabel(item.inspectionStatus),
                refundAmount: item.refundAmount,
                maxRefundableAmount: item.maxRefundableAmount,
                refundedQuantity: item.refundedQuantity,
                returnWindowDays: returnWindow.returnWindowDays,
                returnDeadline: returnWindow.returnDeadline,
                canCreateReturn: returnWindow.canCreateReturn,
                returnBlockedReason: returnWindow.returnBlockedReason,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
            };
        }));
        const fromTime = query.from ? new Date(query.from).getTime() : null;
        const toTime = query.to ? new Date(query.to).getTime() : null;
        const filtered = enriched.filter((item) => {
            if (query.status && query.status !== 'all' && item.status !== query.status)
                return false;
            const createdTime = new Date(item.createdAt).getTime();
            if (fromTime && createdTime < fromTime)
                return false;
            if (toTime && createdTime > toTime + 24 * 60 * 60 * 1000 - 1)
                return false;
            if (normalizedSearch) {
                const haystack = [
                    item.returnId,
                    item.id,
                    item.orderId,
                    item.productName,
                    item.sku,
                    item.colorName,
                    item.sizeName,
                    item.reason,
                    item.reasonLabel,
                    item.description,
                    item.statusLabel,
                ].filter(Boolean).join(' ').toLowerCase();
                if (!haystack.includes(normalizedSearch))
                    return false;
            }
            return true;
        });
        const total = filtered.length;
        return {
            items: filtered.slice((page - 1) * limit, page * limit),
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async findAllReturns() {
        const items = await this.returnsRepository.find({
            order: { createdAt: 'DESC' },
        });
        const orderItemIds = [...new Set(items.map((i) => i.orderItemId))];
        const orderItems = orderItemIds.length
            ? await this.orderItemsRepository.find({
                where: { orderItemId: (0, typeorm_2.In)(orderItemIds) },
            })
            : [];
        const orderItemMap = new Map(orderItems.map((i) => [i.orderItemId, i]));
        const itemImageMap = await this.getOrderItemImageMap(orderItems);
        return items.map((item) => ({
            returnId: item.returnId,
            id: item.returnId,
            orderId: item.orderId,
            userId: item.userId,
            orderItemId: item.orderItemId,
            productName: orderItemMap.get(item.orderItemId)?.productName ?? null,
            imageUrl: itemImageMap.get(item.orderItemId) ?? null,
            sku: orderItemMap.get(item.orderItemId)?.sku ?? null,
            colorName: orderItemMap.get(item.orderItemId)?.colorName ?? null,
            sizeName: orderItemMap.get(item.orderItemId)?.sizeName ?? null,
            orderedQuantity: orderItemMap.get(item.orderItemId)?.quantity ?? null,
            deliveredQuantity: orderItemMap.get(item.orderItemId)
                ? this.getDeliveredQuantityForReturn(orderItemMap.get(item.orderItemId))
                : null,
            returnQuantity: item.returnQuantity,
            reason: item.reason,
            description: item.description,
            returnStatus: item.returnStatus,
            status: item.returnStatus,
            inspectionStatus: item.inspectionStatus,
            inspectionNote: item.inspectionNote,
            inspectedBy: item.inspectedBy,
            inspectedAt: item.inspectedAt,
            refundAmount: item.refundAmount,
            maxRefundableAmount: item.maxRefundableAmount,
            refundedQuantity: item.refundedQuantity,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        }));
    }
    async updateReturnStatus(currentUser, returnId, updateReturnStatusDto) {
        await this.ensureUserExists(currentUser._id);
        const returnRequest = await this.returnsRepository.findOneBy({ returnId });
        if (!returnRequest) {
            throw new common_1.NotFoundException('Return request not found');
        }
        if (returnRequest.returnStatus !== updateReturnStatusDto.status &&
            !this.validateReturnStatusTransition(returnRequest.returnStatus, updateReturnStatusDto.status)) {
            throw new common_1.BadRequestException('Invalid return status transition');
        }
        const orderItem = await this.orderItemsRepository.findOneBy({
            orderItemId: returnRequest.orderItemId,
        });
        if (!orderItem) {
            throw new common_1.NotFoundException('Order item not found');
        }
        if (updateReturnStatusDto.status === return_entity_1.ReturnStatus.RECEIVED) {
            returnRequest.inspectionStatus = return_entity_1.ReturnInspectionStatus.PENDING;
        }
        returnRequest.returnStatus = updateReturnStatusDto.status;
        if (updateReturnStatusDto.status === return_entity_1.ReturnStatus.REFUNDED) {
            if (returnRequest.inspectionStatus === return_entity_1.ReturnInspectionStatus.PENDING) {
                throw new common_1.BadRequestException('RETURN_INSPECTION_REQUIRED');
            }
            const requestedRefund = Number(updateReturnStatusDto.refundAmount ?? returnRequest.maxRefundableAmount);
            const maxRefund = Number(returnRequest.maxRefundableAmount);
            if (!Number.isFinite(requestedRefund) || requestedRefund <= 0) {
                throw new common_1.BadRequestException('INVALID_REFUND_AMOUNT');
            }
            if (requestedRefund > maxRefund) {
                throw new common_1.BadRequestException('REFUND_AMOUNT_EXCEEDS_MAX');
            }
            returnRequest.refundAmount =
                updateReturnStatusDto.refundAmount ?? returnRequest.maxRefundableAmount;
            returnRequest.refundedQuantity = returnRequest.returnQuantity;
            const order = await this.findAnyOrder(returnRequest.orderId);
            const existingRefund = await this.orderRefundsRepository.findOne({
                where: {
                    returnId: returnRequest.returnId,
                    reason: order_refund_entity_1.OrderRefundReason.RETURN,
                },
            });
            if (existingRefund) {
                existingRefund.amount = requestedRefund.toFixed(2);
                existingRefund.refundStatus = order_refund_entity_1.OrderRefundStatus.COMPLETED;
                existingRefund.manualReference =
                    updateReturnStatusDto.note ?? existingRefund.manualReference;
                existingRefund.note = updateReturnStatusDto.note ?? existingRefund.note;
                existingRefund.updatedBy = currentUser._id;
                await this.orderRefundsRepository.save(existingRefund);
            }
            else {
                await this.orderRefundsRepository.save(this.orderRefundsRepository.create({
                    orderId: returnRequest.orderId,
                    returnId: returnRequest.returnId,
                    reason: order_refund_entity_1.OrderRefundReason.RETURN,
                    refundStatus: order_refund_entity_1.OrderRefundStatus.COMPLETED,
                    amount: requestedRefund.toFixed(2),
                    paymentProvider: order.paymentMethod,
                    manualReference: updateReturnStatusDto.note ?? null,
                    note: updateReturnStatusDto.note ?? 'Return refund completed',
                    createdBy: currentUser._id,
                    updatedBy: currentUser._id,
                }));
            }
            const orderItems = await this.orderItemsRepository.find({
                where: { orderId: order.orderId },
            });
            const allDeliveredQty = orderItems.reduce((sum, item) => sum + this.getDeliveredQuantityForReturn(item), 0);
            const returnedQtyRows = await this.returnsRepository
                .createQueryBuilder('r')
                .select('COALESCE(SUM(r.return_quantity), 0)', 'quantity')
                .where('r.order_id = :orderId', { orderId: order.orderId })
                .andWhere('r.return_status = :status', {
                status: return_entity_1.ReturnStatus.REFUNDED,
            })
                .getRawOne();
            const refundedQty = Number(returnedQtyRows?.quantity ?? 0) + returnRequest.returnQuantity;
            if (allDeliveredQty > 0 && refundedQty >= allDeliveredQty) {
                order.orderStatus = order_entity_1.OrderStatus.RETURNED;
            }
            await this.refreshOrderPaymentAfterRefund(order);
            await this.ordersRepository.save(order);
        }
        const savedReturn = await this.returnsRepository.save(returnRequest);
        await this.notificationsService.sendReturnStatusNotification({
            userId: savedReturn.userId,
            orderId: savedReturn.orderId,
            returnId: savedReturn.returnId,
            status: savedReturn.returnStatus,
        });
        return savedReturn;
    }
    async partialDeliverOrder(currentUser, orderId, items, note) {
        await this.ensureUserExists(currentUser._id);
        const order = await this.findAnyOrder(orderId);
        if (order.orderStatus !== order_entity_1.OrderStatus.SHIPPING) {
            throw new common_1.BadRequestException('Partial delivery chá»‰ thá»±c hiá»‡n khi Ä‘Æ¡n Ä‘ang SHIPPING');
        }
        const orderItems = await this.orderItemsRepository.find({
            where: { orderId: order.orderId },
        });
        const itemMap = new Map(orderItems.map((it) => [it.orderItemId, it]));
        for (const dto of items) {
            const oi = itemMap.get(dto.orderItemId);
            if (!oi) {
                throw new common_1.BadRequestException(`Order item ${dto.orderItemId} khÃ´ng thuá»™c Ä‘Æ¡n nÃ y`);
            }
            if (dto.deliveredQty > oi.quantity) {
                throw new common_1.BadRequestException(`Sá»‘ lÆ°á»£ng giao (${dto.deliveredQty}) khÃ´ng thá»ƒ vÆ°á»£t sá»‘ Ä‘áº·t (${oi.quantity}) cá»§a ${oi.productName}`);
            }
            if (dto.deliveredQty < 0) {
                throw new common_1.BadRequestException('deliveredQty khÃ´ng Ä‘Æ°á»£c Ã¢m');
            }
        }
        let totalDeliveredQty = 0;
        let totalOrderedQty = 0;
        let newSubtotal = 0;
        await (0, transaction_util_1.withDeadlockRetry)(() => this.ordersRepository.manager.transaction(async (em) => {
            for (const dto of items) {
                const oi = itemMap.get(dto.orderItemId);
                const undeliveredQty = oi.quantity - dto.deliveredQty;
                totalDeliveredQty += dto.deliveredQty;
                totalOrderedQty += oi.quantity;
                newSubtotal += dto.deliveredQty * Number(oi.unitPrice);
                oi.quantityDelivered = dto.deliveredQty;
                await em.save(order_item_entity_1.OrderItemEntity, oi);
                if (oi.quantity > 0) {
                    const product = await em.findOne(product_entity_1.ProductEntity, {
                        where: { productId: oi.productId },
                        lock: { mode: 'pessimistic_write' },
                    });
                    if (!product)
                        continue;
                    const releaseReserved = oi.quantity;
                    product.quantityReserved = Math.max(0, (product.quantityReserved ?? 0) - releaseReserved);
                    if (undeliveredQty > 0) {
                        const qtyBefore = product.quantityAvailable;
                        product.quantityAvailable += undeliveredQty;
                        await em.save(product_entity_1.ProductEntity, product);
                        await em.save(inventory_transaction_entity_1.InventoryTransactionEntity, em.create(inventory_transaction_entity_1.InventoryTransactionEntity, {
                            productId: product.productId,
                            performedBy: currentUser._id,
                            transactionType: inventory_transaction_entity_1.InventoryTransactionType.RETURN_IN,
                            quantityChange: undeliveredQty,
                            quantityBefore: qtyBefore,
                            quantityAfter: product.quantityAvailable,
                            referenceType: 'ORDER',
                            referenceId: order.orderId,
                            unitCostAtTime: product.avgCost ?? null,
                            note: `Partial delivery: ${dto.deliveredQty}/${oi.quantity} delivered, ${undeliveredQty} restocked`,
                            relatedOrderId: order.orderId,
                        }));
                        await this.syncDefaultWarehouseStock(em, product.productId, undeliveredQty);
                    }
                    else {
                        await em.save(product_entity_1.ProductEntity, product);
                    }
                }
            }
            const isFullyDelivered = totalDeliveredQty === totalOrderedQty;
            order.orderStatus = isFullyDelivered
                ? order_entity_1.OrderStatus.DELIVERED
                : order_entity_1.OrderStatus.PARTIAL_DELIVERED;
            order.totalQuantity = totalDeliveredQty;
            const newTotalPayment = newSubtotal -
                Number(order.discountAmount) +
                Number(order.deliveryCost);
            order.subtotalAmount = newSubtotal.toFixed(2);
            order.totalPayment = Math.max(0, newTotalPayment).toFixed(2);
            if (isFullyDelivered &&
                order.paymentMethod === order_entity_1.PaymentMethod.COD) {
                order.paymentStatus = order_entity_1.PaymentStatus.PAID;
            }
            await em.save(order_entity_1.OrderEntity, order);
            await em.save(order_status_history_entity_1.OrderStatusHistoryEntity, em.create(order_status_history_entity_1.OrderStatusHistoryEntity, {
                orderId: order.orderId,
                oldStatus: order_entity_1.OrderStatus.SHIPPING,
                newStatus: order.orderStatus,
                changedBy: currentUser._id,
                note: note ??
                    `Partial delivery: ${totalDeliveredQty}/${totalOrderedQty}`,
            }));
        }));
        await this.notificationsService.sendOrderStatusNotification(order.userId, order.orderId, order.orderStatus);
        return this.buildOrderDetail(await this.findAnyOrder(order.orderId));
    }
    async inspectReturn(currentUser, returnId, decision, note) {
        await this.ensureUserExists(currentUser._id);
        if (decision === return_entity_1.ReturnInspectionStatus.PENDING) {
            throw new common_1.BadRequestException('Decision khÃ´ng thá»ƒ lÃ  PENDING');
        }
        const returnRequest = await this.returnsRepository.findOneBy({ returnId });
        if (!returnRequest) {
            throw new common_1.NotFoundException('Return request not found');
        }
        if (returnRequest.returnStatus !== return_entity_1.ReturnStatus.RECEIVED) {
            throw new common_1.BadRequestException('Chá»‰ cÃ³ thá»ƒ inspect return Ä‘Ã£ RECEIVED');
        }
        if (returnRequest.inspectionStatus !== return_entity_1.ReturnInspectionStatus.PENDING) {
            throw new common_1.BadRequestException(`Return nÃ y Ä‘Ã£ Ä‘Æ°á»£c inspect (${returnRequest.inspectionStatus})`);
        }
        const orderItem = await this.orderItemsRepository.findOneBy({
            orderItemId: returnRequest.orderItemId,
        });
        if (!orderItem)
            throw new common_1.NotFoundException('Order item not found');
        await this.ordersRepository.manager.transaction(async (em) => {
            const product = await em.findOne(product_entity_1.ProductEntity, {
                where: { productId: orderItem.productId },
                lock: { mode: 'pessimistic_write' },
            });
            if (decision === return_entity_1.ReturnInspectionStatus.USABLE && product) {
                const returnQty = returnRequest.returnQuantity;
                const qtyBefore = product.quantityAvailable;
                product.quantityAvailable += returnQty;
                await em.save(product_entity_1.ProductEntity, product);
                if (orderItem.variantId) {
                    const variant = await em.findOne(product_variant_entity_1.ProductVariantEntity, {
                        where: { variantId: orderItem.variantId },
                        lock: { mode: 'pessimistic_write' },
                    });
                    if (variant) {
                        variant.stockQuantity += returnQty;
                        await em.save(product_variant_entity_1.ProductVariantEntity, variant);
                    }
                }
                await em.save(inventory_transaction_entity_1.InventoryTransactionEntity, em.create(inventory_transaction_entity_1.InventoryTransactionEntity, {
                    productId: product.productId,
                    performedBy: currentUser._id,
                    transactionType: inventory_transaction_entity_1.InventoryTransactionType.RETURN_IN,
                    quantityChange: returnQty,
                    quantityBefore: qtyBefore,
                    quantityAfter: product.quantityAvailable,
                    referenceType: 'RETURN',
                    referenceId: String(returnRequest.returnId),
                    unitCostAtTime: product.avgCost ?? null,
                    note: note ?? 'Return inspection: USABLE â€” restocked',
                    relatedOrderId: returnRequest.orderId,
                }));
                await this.syncDefaultWarehouseStock(em, product.productId, returnQty);
            }
            else if (decision === return_entity_1.ReturnInspectionStatus.DAMAGED && product) {
                await em.save(inventory_transaction_entity_1.InventoryTransactionEntity, em.create(inventory_transaction_entity_1.InventoryTransactionEntity, {
                    productId: product.productId,
                    performedBy: currentUser._id,
                    transactionType: inventory_transaction_entity_1.InventoryTransactionType.DAMAGE,
                    quantityChange: 0,
                    quantityBefore: product.quantityAvailable,
                    quantityAfter: product.quantityAvailable,
                    referenceType: 'RETURN',
                    referenceId: String(returnRequest.returnId),
                    unitCostAtTime: product.avgCost ?? null,
                    note: note ?? `Return inspection: DAMAGED â€” written off ${orderItem.quantity} unit(s)`,
                    relatedOrderId: returnRequest.orderId,
                }));
            }
            returnRequest.inspectionStatus = decision;
            returnRequest.inspectionNote = note ?? null;
            returnRequest.inspectedBy = currentUser._id;
            returnRequest.inspectedAt = new Date();
            returnRequest.returnStatus = return_entity_1.ReturnStatus.INSPECTED;
            await em.save(return_entity_1.ReturnEntity, returnRequest);
        });
        return this.returnsRepository.findOneBy({ returnId });
    }
    async confirmPayment(currentUser, orderId) {
        await this.ensureUserExists(currentUser._id);
        const order = await this.findAnyOrder(orderId);
        if (order.paymentStatus === order_entity_1.PaymentStatus.PAID) {
            throw new common_1.BadRequestException('ÄÆ¡n hÃ ng Ä‘Ã£ Ä‘Æ°á»£c thanh toÃ¡n');
        }
        if (order.paymentMethod === order_entity_1.PaymentMethod.COD) {
            throw new common_1.BadRequestException('COD tá»± Ä‘á»™ng ghi nháº­n khi giao â€” khÃ´ng cáº§n xÃ¡c nháº­n thá»§ cÃ´ng');
        }
        if (order.paymentMethod === order_entity_1.PaymentMethod.CREDIT) {
            throw new common_1.BadRequestException('ÄÆ¡n hÃ ng mua ná»£ â€” cÃ´ng ná»£ Ä‘Æ°á»£c quáº£n lÃ½ riÃªng qua háº¡n má»©c tÃ­n dá»¥ng');
        }
        order.paymentStatus = order_entity_1.PaymentStatus.PAID;
        await this.ordersRepository.save(order);
        const tx = this.paymentTransactionsRepository.create({
            orderId: order.orderId,
            userId: order.userId,
            provider: order.paymentMethod,
            transactionRef: `manual-${Date.now()}`,
            transactionStatus: payment_transaction_entity_1.PaymentTransactionStatus.SUCCESS,
            paymentStatus: order_entity_1.PaymentStatus.PAID,
            amount: order.totalPayment,
            gatewayCode: 'MANUAL',
            gatewayMessage: `XÃ¡c nháº­n thá»§ cÃ´ng bá»Ÿi admin ${currentUser._id}`,
            rawPayload: { confirmedBy: currentUser._id, confirmedAt: new Date().toISOString() },
        });
        await this.paymentTransactionsRepository.save(tx);
        await this.notificationsService.sendPaymentNotification(order.userId, orderId, order_entity_1.PaymentStatus.PAID, order.paymentMethod);
        return this.buildOrderDetail(await this.findAnyOrder(orderId));
    }
    async confirmReceivedByCustomer(currentUser, orderId) {
        await this.ensureUserExists(currentUser._id);
        const order = await this.findOrderDetail(currentUser, orderId);
        if (order.status !== order_entity_1.OrderStatus.SHIPPING) {
            throw new common_1.BadRequestException('Chá»‰ cÃ³ thá»ƒ xÃ¡c nháº­n nháº­n hÃ ng khi Ä‘Æ¡n Ä‘ang Ä‘Æ°á»£c giao');
        }
        await this.ordersRepository.manager.transaction(async (em) => {
            const transactionalProductsRepo = em.getRepository(product_entity_1.ProductEntity);
            const transactionalOrderItemsRepo = em.getRepository(order_item_entity_1.OrderItemEntity);
            await this.releaseReservedOnDelivered(orderId, transactionalProductsRepo, transactionalOrderItemsRepo);
            const dbOrder = await em.getRepository(order_entity_1.OrderEntity).findOneBy({ orderId });
            if (!dbOrder)
                return;
            dbOrder.orderStatus = order_entity_1.OrderStatus.DELIVERED;
            if (dbOrder.paymentMethod === order_entity_1.PaymentMethod.COD) {
                dbOrder.paymentStatus = order_entity_1.PaymentStatus.PAID;
            }
            await em.save(order_entity_1.OrderEntity, dbOrder);
            await em.save(order_status_history_entity_1.OrderStatusHistoryEntity, em.create(order_status_history_entity_1.OrderStatusHistoryEntity, {
                orderId,
                oldStatus: order_entity_1.OrderStatus.SHIPPING,
                newStatus: order_entity_1.OrderStatus.DELIVERED,
                changedBy: currentUser._id,
                note: 'Khách hàng xác nhận đã nhận hàng',
            }));
        });
        const updated = await this.findAnyOrder(orderId);
        await this.notificationsService.sendOrderStatusNotification(updated.userId, orderId, order_entity_1.OrderStatus.DELIVERED);
        if (updated.userId) {
            void this.membershipService.recalculateAndReward(updated.userId);
        }
        return this.buildOrderDetail(updated);
    }
};
exports.OrdersService = OrdersService;
__decorate([
    (0, schedule_1.Cron)('*/15 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersService.prototype, "reconcileStalePayments", null);
exports.OrdersService = OrdersService = OrdersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(delivery_method_entity_1.DeliveryMethodEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(shipping_address_entity_1.ShippingAddressEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(order_entity_1.OrderEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(order_tracking_entity_1.OrderTrackingEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItemEntity)),
    __param(5, (0, typeorm_1.InjectRepository)(order_status_history_entity_1.OrderStatusHistoryEntity)),
    __param(6, (0, typeorm_1.InjectRepository)(order_refund_entity_1.OrderRefundEntity)),
    __param(7, (0, typeorm_1.InjectRepository)(shopping_cart_entity_1.ShoppingCartEntity)),
    __param(8, (0, typeorm_1.InjectRepository)(cart_item_entity_1.CartItemEntity)),
    __param(9, (0, typeorm_1.InjectRepository)(product_entity_1.ProductEntity)),
    __param(10, (0, typeorm_1.InjectRepository)(product_variant_entity_1.ProductVariantEntity)),
    __param(11, (0, typeorm_1.InjectRepository)(color_entity_1.ColorEntity)),
    __param(12, (0, typeorm_1.InjectRepository)(size_entity_1.SizeEntity)),
    __param(13, (0, typeorm_1.InjectRepository)(inventory_transaction_entity_1.InventoryTransactionEntity)),
    __param(14, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(15, (0, typeorm_1.InjectRepository)(discount_entity_1.DiscountEntity)),
    __param(16, (0, typeorm_1.InjectRepository)(discount_category_entity_1.DiscountCategoryEntity)),
    __param(17, (0, typeorm_1.InjectRepository)(discount_product_entity_1.DiscountProductEntity)),
    __param(18, (0, typeorm_1.InjectRepository)(coupon_usage_entity_1.CouponUsageEntity)),
    __param(19, (0, typeorm_1.InjectRepository)(return_entity_1.ReturnEntity)),
    __param(20, (0, typeorm_1.InjectRepository)(payment_transaction_entity_1.PaymentTransactionEntity)),
    __param(21, (0, typeorm_1.InjectRepository)(customer_credit_limit_entity_1.CustomerCreditLimitEntity)),
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
        notifications_service_1.NotificationsService,
        orders_admin_publisher_1.OrdersAdminPublisher,
        settings_service_1.SettingsService,
        membership_service_1.MembershipService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map