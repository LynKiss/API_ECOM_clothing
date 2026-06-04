import { randomUUID } from 'node:crypto';
import { createHmac } from 'node:crypto';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, LessThan, Repository } from 'typeorm';
import { WarehouseEntity } from '../warehouses/entities/warehouse.entity';
import { WarehouseStockEntity } from '../warehouses/entities/warehouse-stock.entity';
import { CartItemEntity } from '../carts/entities/cart-item.entity';
import { ShoppingCartEntity } from '../carts/entities/shopping-cart.entity';
import { DiscountCategoryEntity } from '../discounts/entities/discount-category.entity';
import {
  DiscountApplyTarget,
  DiscountEntity,
  DiscountType,
} from '../discounts/entities/discount.entity';
import { CouponUsageEntity } from '../discounts/entities/coupon-usage.entity';
import { DiscountProductEntity } from '../discounts/entities/discount-product.entity';
import {
  InventoryTransactionEntity,
  InventoryTransactionType,
} from '../products/entities/inventory-transaction.entity';
import { ColorEntity } from '../products/entities/color.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { ProductVariantEntity } from '../products/entities/product-variant.entity';
import { SizeEntity } from '../products/entities/size.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { OrdersAdminPublisher } from './orders-admin.publisher';
import { SettingsService } from '../settings/settings.service';
import type { IUser } from '../users/users.interface';
import { UserEntity } from '../users/entities/user.entity';
import { withDeadlockRetry } from '../common/transaction.util';
import { verifyMomoSignature } from '../common/payment-signature.util';
import { CreateCancelPaidRefundDto } from './dto/create-cancel-paid-refund.dto';
import { CreateReturnDto } from './dto/create-return.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { PaymentCallbackDto } from './dto/payment-callback.dto';
import { QueryOrdersDto } from './dto/query-orders.dto';
import { UpdateOrderTrackingLiveDto } from './dto/update-order-tracking-live.dto';
import { UpdateOrderTrackingManualDto } from './dto/update-order-tracking-manual.dto';
import { UpdateOrderTrackingModeDto } from './dto/update-order-tracking-mode.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdateRefundStatusDto } from './dto/update-refund-status.dto';
import { UpdateReturnStatusDto } from './dto/update-return-status.dto';
import { DeliveryMethodEntity } from './entities/delivery-method.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import {
  OrderTrackingEntity,
  OrderTrackingMode,
} from './entities/order-tracking.entity';
import {
  OrderEntity,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from './entities/order.entity';
import {
  OrderRefundEntity,
  OrderRefundReason,
  OrderRefundStatus,
} from './entities/order-refund.entity';
import { OrderStatusHistoryEntity } from './entities/order-status-history.entity';
import {
  PaymentTransactionEntity,
  PaymentTransactionStatus,
} from './entities/payment-transaction.entity';
import {
  ReturnEntity,
  ReturnInspectionStatus,
  ReturnStatus,
} from './entities/return.entity';
import { ShippingAddressEntity } from './entities/shipping-address.entity';
import { MembershipService } from '../membership/membership.service';
import { CustomerCreditLimitEntity } from '../credit-limits/entities/customer-credit-limit.entity';

const RETURN_WINDOW_DAYS = 7;
const RETURN_WINDOW_MS = RETURN_WINDOW_DAYS * 24 * 60 * 60 * 1000;

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  private readonly liveTrackingFreshnessMs = 2 * 60 * 1000;
  private readonly stalePaymentTtlMs = 30 * 60 * 1000; // 30 phÃºt

  constructor(
    @InjectRepository(DeliveryMethodEntity)
    private readonly deliveryMethodsRepository: Repository<DeliveryMethodEntity>,
    @InjectRepository(ShippingAddressEntity)
    private readonly shippingAddressesRepository: Repository<ShippingAddressEntity>,
    @InjectRepository(OrderEntity)
    private readonly ordersRepository: Repository<OrderEntity>,
    @InjectRepository(OrderTrackingEntity)
    private readonly orderTrackingRepository: Repository<OrderTrackingEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemsRepository: Repository<OrderItemEntity>,
    @InjectRepository(OrderStatusHistoryEntity)
    private readonly orderStatusHistoryRepository: Repository<OrderStatusHistoryEntity>,
    @InjectRepository(OrderRefundEntity)
    private readonly orderRefundsRepository: Repository<OrderRefundEntity>,
    @InjectRepository(ShoppingCartEntity)
    private readonly cartsRepository: Repository<ShoppingCartEntity>,
    @InjectRepository(CartItemEntity)
    private readonly cartItemsRepository: Repository<CartItemEntity>,
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
    @InjectRepository(ProductVariantEntity)
    private readonly productVariantsRepository: Repository<ProductVariantEntity>,
    @InjectRepository(ColorEntity)
    private readonly colorsRepository: Repository<ColorEntity>,
    @InjectRepository(SizeEntity)
    private readonly sizesRepository: Repository<SizeEntity>,
    @InjectRepository(InventoryTransactionEntity)
    private readonly inventoryTransactionsRepository: Repository<InventoryTransactionEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(DiscountEntity)
    private readonly discountsRepository: Repository<DiscountEntity>,
    @InjectRepository(DiscountCategoryEntity)
    private readonly discountCategoriesRepository: Repository<DiscountCategoryEntity>,
    @InjectRepository(DiscountProductEntity)
    private readonly discountProductsRepository: Repository<DiscountProductEntity>,
    @InjectRepository(CouponUsageEntity)
    private readonly couponUsageRepository: Repository<CouponUsageEntity>,
    @InjectRepository(ReturnEntity)
    private readonly returnsRepository: Repository<ReturnEntity>,
    @InjectRepository(PaymentTransactionEntity)
    private readonly paymentTransactionsRepository: Repository<PaymentTransactionEntity>,
    @InjectRepository(CustomerCreditLimitEntity)
    private readonly creditLimitRepository: Repository<CustomerCreditLimitEntity>,
    private readonly notificationsService: NotificationsService,
    private readonly ordersAdminPublisher: OrdersAdminPublisher,
    private readonly settingsService: SettingsService,
    private readonly membershipService: MembershipService,
  ) {}

  private async syncDefaultWarehouseStock(
    em: EntityManager,
    productId: string,
    qtyDelta: number,
  ): Promise<void> {
    if (qtyDelta === 0) return;
    const warehouse = await em.findOne(WarehouseEntity, {
      where: { isDefault: true },
    });
    if (!warehouse) return;
    const stock = await em.findOne(WarehouseStockEntity, {
      where: { warehouseId: warehouse.warehouseId, productId },
    });
    if (stock) {
      stock.quantity = Math.max(0, stock.quantity + qtyDelta);
      await em.save(WarehouseStockEntity, stock);
    } else if (qtyDelta > 0) {
      await em.save(
        WarehouseStockEntity,
        em.create(WarehouseStockEntity, {
          warehouseId: warehouse.warehouseId,
          productId,
          quantity: qtyDelta,
        }),
      );
    }
  }

  private async ensureUserExists(userId: string) {
    const user = await this.usersRepository.findOneBy({ userId });
    if (!user) {
      throw new UnauthorizedException('NgÆ°á»i dÃ¹ng khÃ´ng tá»“n táº¡i');
    }

    return user;
  }

  private async findOwnedOrder(userId: string, orderId: string) {
    const order = await this.ordersRepository.findOneBy({ orderId, userId });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  private async findAnyOrder(orderId: string) {
    const order = await this.ordersRepository.findOneBy({ orderId });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  private hasManageOrdersPermission(currentUser: IUser) {
    return currentUser.permissions.some(
      (permission) => permission.key === 'manage_orders',
    );
  }

  private async createGuestUserRecord(
    entityManager: EntityManager,
    userId: string,
    orderId: string,
  ) {
    const compactOrderId = orderId.replace(/-/g, '');
    await entityManager.query(
      `INSERT INTO users
        (user_id, username, email, role, password_hash, provider, provider_id, is_active)
       VALUES (?, ?, ?, 'customer', NULL, 'guest', ?, 1)`,
      [
        userId,
        `guest_${compactOrderId.slice(0, 24)}`,
        `guest_${compactOrderId}@guest.local`,
        orderId,
      ],
    );
  }

  private async isGuestUserId(userId: string) {
    if (userId.startsWith('guest-')) {
      return true;
    }

    const rows = (await this.ordersRepository.manager.query(
      'SELECT provider FROM users WHERE user_id = ? LIMIT 1',
      [userId],
    )) as Array<{ provider?: string | null }>;

    return rows[0]?.provider === 'guest';
  }

  private async findAccessibleOrder(currentUser: IUser, orderId: string) {
    return this.hasManageOrdersPermission(currentUser)
      ? this.findAnyOrder(orderId)
      : this.findOwnedOrder(currentUser._id, orderId);
  }

  private async findOrCreateOrderTracking(orderId: string) {
    const existing = await this.orderTrackingRepository.findOneBy({ orderId });
    if (existing) {
      return existing;
    }

    const created = this.orderTrackingRepository.create({
      orderId,
      mode: OrderTrackingMode.AUTO_FALLBACK,
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

  private toNullableNumber(value: string | number | null | undefined) {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const next = Number(value);
    return Number.isFinite(next) ? next : null;
  }

  private mapTrackingPoint(input: {
    latitude: string | null;
    longitude: string | null;
    updatedAt: Date | null;
    note?: string | null;
    updatedBy?: string | null;
    heading?: string | null;
    speedKph?: string | null;
    provider?: string | null;
  }) {
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

  private mapOrderTracking(tracking: OrderTrackingEntity) {
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

    const gpsSignalFresh = Boolean(
      gpsLocation &&
        tracking.gpsUpdatedAt &&
        Date.now() - tracking.gpsUpdatedAt.getTime() <=
          this.liveTrackingFreshnessMs,
    );

    let activeSource: 'manual' | 'gps' | 'none' = 'none';
    let activeLocation: ReturnType<OrdersService['mapTrackingPoint']> = null;

    if (tracking.mode === OrderTrackingMode.DEMO) {
      activeSource = manualLocation ? 'manual' : 'none';
      activeLocation = manualLocation;
    } else if (tracking.mode === OrderTrackingMode.LIVE) {
      activeSource = gpsLocation ? 'gps' : 'none';
      activeLocation = gpsLocation;
    } else if (gpsSignalFresh && gpsLocation) {
      activeSource = 'gps';
      activeLocation = gpsLocation;
    } else if (manualLocation) {
      activeSource = 'manual';
      activeLocation = manualLocation;
    } else if (gpsLocation) {
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

  private isOnlinePaymentMethod(method: PaymentMethod) {
    return [
      PaymentMethod.MOMO,
      PaymentMethod.VNPAY,
      PaymentMethod.ZALOPAY,
    ].includes(method);
  }

  private async ensurePaymentMethodEnabled(method: PaymentMethod) {
    if (method === PaymentMethod.PAYPAL) {
      throw new BadRequestException('Payment method is not supported');
    }
    // CREDIT lÃ  phÆ°Æ¡ng thá»©c ná»™i bá»™ (mua ná»£), khÃ´ng qua payment gateway
    // Validation Ä‘Æ°á»£c xá»­ lÃ½ riÃªng trong createOrder
    if (method === PaymentMethod.CREDIT) {
      return;
    }

    const isActive = await this.settingsService.isPaymentMethodActive(method);
    if (!isActive) {
      throw new BadRequestException('Payment method is currently disabled');
    }
  }

  private validateReturnStatusTransition(
    currentStatus: ReturnStatus,
    nextStatus: ReturnStatus,
  ) {
    const allowedTransitions: Record<ReturnStatus, ReturnStatus[]> = {
      [ReturnStatus.REQUESTED]: [ReturnStatus.APPROVED, ReturnStatus.REJECTED],
      [ReturnStatus.APPROVED]: [ReturnStatus.RECEIVED, ReturnStatus.REJECTED],
      [ReturnStatus.REJECTED]: [],
      // RECEIVED â†’ INSPECTED (sau khi admin gá»i inspect endpoint)
      [ReturnStatus.RECEIVED]: [ReturnStatus.INSPECTED],
      [ReturnStatus.INSPECTED]: [ReturnStatus.REFUNDED],
      [ReturnStatus.REFUNDED]: [],
    };

    return allowedTransitions[currentStatus].includes(nextStatus);
  }

  private getReturnStatusLabel(status: string) {
    const labels: Record<string, string> = {
      requested: 'Đã gửi yêu cầu',
      approved: 'Đã duyệt',
      received: 'Đã nhận hàng trả về',
      inspected: 'Đã kiểm tra hàng',
      refunded: 'Đã hoàn tiền',
      rejected: 'Từ chối',
    };
    return labels[String(status).toLowerCase()] ?? status;
  }

  private getReturnReasonLabel(reason?: string | null) {
    const normalized = String(reason ?? '').toLowerCase();
    const labels: Record<string, string> = {
      wrong_item: 'Nhận sai sản phẩm',
      damaged: 'Sản phẩm lỗi hoặc hư hỏng',
      defective: 'Sản phẩm lỗi hoặc hư hỏng',
      not_as_described: 'Không đúng mô tả',
      changed_mind: 'Không còn nhu cầu',
      other: 'Lý do khác',
    };
    return labels[normalized] ?? reason ?? 'Lý do khác';
  }

  private getReturnInspectionStatusLabel(status?: string | null) {
    const labels: Record<string, string> = {
      pending: 'Chờ kiểm tra',
      usable: 'Hàng đạt, nhập lại kho',
      damaged: 'Hàng hỏng',
      return_to_supplier: 'Trả nhà cung cấp',
    };
    return status ? labels[String(status).toLowerCase()] ?? status : null;
  }
  private async getOrderReturnWindow(order: OrderEntity) {
    const returnableStatuses = new Set<string>([
      OrderStatus.DELIVERED,
      OrderStatus.PARTIAL_DELIVERED,
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
        { orderId: order.orderId, newStatus: OrderStatus.DELIVERED },
        { orderId: order.orderId, newStatus: OrderStatus.PARTIAL_DELIVERED },
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

  private async getReturnedQuantityForItem(
    orderItemId: string,
    excludeReturnId?: string,
  ) {
    const qb = this.returnsRepository
      .createQueryBuilder('r')
      .select('COALESCE(SUM(r.return_quantity), 0)', 'quantity')
      .where('r.order_item_id = :orderItemId', { orderItemId })
      .andWhere('r.return_status != :rejected', {
        rejected: ReturnStatus.REJECTED,
      });

    if (excludeReturnId) {
      qb.andWhere('r.return_id != :excludeReturnId', { excludeReturnId });
    }

    const row = await qb.getRawOne<{ quantity: string }>();
    return Number(row?.quantity ?? 0);
  }

  private getDeliveredQuantityForReturn(orderItem: OrderItemEntity) {
    return orderItem.quantityDelivered > 0
      ? orderItem.quantityDelivered
      : orderItem.quantity;
  }

  private calculateLineRefundAmount(orderItem: OrderItemEntity, quantity: number) {
    const unitNet = Number(orderItem.lineTotal) / Math.max(1, orderItem.quantity);
    return Math.max(0, unitNet * quantity);
  }

  private async getOrderItemImageMap(items: OrderItemEntity[]) {
    const productIds = [...new Set(items.map((item) => item.productId).filter(Boolean))];
    const variantIds = [
      ...new Set(items.map((item) => item.variantId).filter((id): id is string => Boolean(id))),
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
            .getRawMany<{ productId: string; imageUrl: string }>()
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
            .getRawMany<{ variantId: string; imageUrl: string }>()
        : Promise.resolve([]),
    ]);

    const productImageMap = new Map<string, string>();
    for (const row of productRows) {
      if (!productImageMap.has(row.productId)) productImageMap.set(row.productId, row.imageUrl);
    }

    const variantImageMap = new Map<string, string>();
    for (const row of variantRows) {
      if (!variantImageMap.has(row.variantId)) variantImageMap.set(row.variantId, row.imageUrl);
    }

    return new Map(
      items.map((item) => [
        item.orderItemId,
        (item.variantId ? variantImageMap.get(item.variantId) : null) ??
          productImageMap.get(item.productId) ??
          null,
      ]),
    );
  }

  private async getCompletedRefundAmount(orderId: string) {
    const row = await this.orderRefundsRepository
      .createQueryBuilder('refund')
      .select('COALESCE(SUM(refund.amount), 0)', 'amount')
      .where('refund.order_id = :orderId', { orderId })
      .andWhere('refund.refund_status = :status', {
        status: OrderRefundStatus.COMPLETED,
      })
      .getRawOne<{ amount: string }>();
    return Number(row?.amount ?? 0);
  }

  private async refreshOrderPaymentAfterRefund(order: OrderEntity) {
    const completedRefunds = await this.getCompletedRefundAmount(order.orderId);
    const totalPayment = Number(order.totalPayment);
    if (completedRefunds >= totalPayment && totalPayment > 0) {
      order.paymentStatus = PaymentStatus.REFUNDED;
      await this.ordersRepository.save(order);
    }
  }

  private buildAddressSnapshot(address: ShippingAddressEntity) {
    return [
      address.addressLine,
      address.ward,
      address.district,
      address.province,
    ]
      .filter((value) => value && value.trim().length > 0)
      .join(', ');
  }

  private async getVariantSnapshots(variantIds: string[]) {
    const uniqueVariantIds = [...new Set(variantIds.filter(Boolean))];
    if (uniqueVariantIds.length === 0) {
      return new Map<string, { variant: ProductVariantEntity; colorName: string | null; sizeName: string | null }>();
    }
    const variants = await this.productVariantsRepository.find({
      where: { variantId: In(uniqueVariantIds) },
    });
    const colorIds = [...new Set(variants.map((variant) => variant.colorId).filter((id): id is string => Boolean(id)))];
    const sizeIds = [...new Set(variants.map((variant) => variant.sizeId).filter((id): id is string => Boolean(id)))];
    const [colors, sizes] = await Promise.all([
      colorIds.length ? this.colorsRepository.find({ where: { colorId: In(colorIds) } }) : Promise.resolve([]),
      sizeIds.length ? this.sizesRepository.find({ where: { sizeId: In(sizeIds) } }) : Promise.resolve([]),
    ]);
    const colorById = new Map(colors.map((color) => [color.colorId, color.colorName]));
    const sizeById = new Map(sizes.map((size) => [size.sizeId, size.sizeName]));
    return new Map(
      variants.map((variant) => [
        variant.variantId,
        {
          variant,
          colorName: variant.colorId ? colorById.get(variant.colorId) ?? null : null,
          sizeName: variant.sizeId ? sizeById.get(variant.sizeId) ?? null : null,
        },
      ]),
    );
  }

  private calculateDeliveryCost(
    deliveryMethod: DeliveryMethodEntity,
    subtotalAmount: number,
  ) {
    const minOrderAmount = Number(deliveryMethod.minOrderAmount);
    if (subtotalAmount >= minOrderAmount) {
      return 0;
    }

    return Number(deliveryMethod.basePrice);
  }

  private calculateDiscountAmount(
    discount: DiscountEntity,
    subtotalAmount: number,
  ) {
    const rawDiscount =
      discount.discountType === DiscountType.PERCENT
        ? (subtotalAmount * Number(discount.discountValue)) / 100
        : Number(discount.discountValue);

    const maxDiscountAmount = discount.maxDiscountAmount
      ? Number(discount.maxDiscountAmount)
      : null;

    const finalDiscount =
      maxDiscountAmount !== null
        ? Math.min(rawDiscount, maxDiscountAmount)
        : rawDiscount;

    return Math.max(0, Math.min(finalDiscount, subtotalAmount));
  }

  private async validateDiscountForCheckout(
    userId: string,
    discountCode: string | undefined,
    subtotalAmount: number,
    cartItems: CartItemEntity[],
    productsById: Map<string, ProductEntity>,
  ) {
    if (!discountCode) {
      return null;
    }

    const discount = await this.discountsRepository.findOneBy({
      discountCode: discountCode.trim(),
    });

    if (!discount || !discount.isActive) {
      throw new NotFoundException('Discount code not found');
    }

    const now = new Date();
    if (discount.startAt > now || discount.expireDate < now) {
      throw new BadRequestException('Discount code is expired or not active');
    }

    if (discount.userId && discount.userId !== userId) {
      throw new BadRequestException(
        'Discount code is not available for this user',
      );
    }

    let eligibleSubtotal = subtotalAmount;

    if (discount.appliesTo === DiscountApplyTarget.CATEGORY) {
      const categoryMappings = await this.discountCategoriesRepository.find({
        where: { discountId: discount.discountId },
      });
      const categoryIds = new Set(
        categoryMappings.map((item) => item.categoryId),
      );
      eligibleSubtotal = cartItems.reduce((sum, item) => {
        const product = productsById.get(item.productId);
        if (!product || !categoryIds.has(product.categoryId)) {
          return sum;
        }

        return sum + Number(item.priceAtAdded) * item.quantity;
      }, 0);
    }

    if (discount.appliesTo === DiscountApplyTarget.PRODUCT) {
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
      throw new BadRequestException(
        'Discount code does not apply to cart items',
      );
    }

    if (eligibleSubtotal < Number(discount.minOrderValue)) {
      throw new BadRequestException(
        'Order does not meet discount minimum value',
      );
    }

    if (
      discount.usageLimit !== null &&
      discount.usedCount >= discount.usageLimit
    ) {
      throw new BadRequestException('Discount code usage limit reached');
    }

    const existingUsage = await this.couponUsageRepository.findOneBy({
      discountId: discount.discountId,
      userId,
    });

    if (existingUsage) {
      throw new BadRequestException('You have already used this discount code');
    }

    return {
      discount,
      eligibleSubtotal,
    };
  }

  private async buildOrderDetail(order: OrderEntity) {
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
    ] as string[];
    const usersMap = new Map<string, string>();
    if (changedByIds.length > 0) {
      const users = await this.usersRepository.find({
        where: { userId: In(changedByIds) },
        select: ['userId', 'username'],
      });
      for (const u of users) usersMap.set(u.userId, u.username);
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
        const itemReturns = returns.filter(
          (r) =>
            r.orderItemId === item.orderItemId &&
            r.returnStatus !== ReturnStatus.REJECTED,
        );
        const returnedQuantity = itemReturns.reduce(
          (sum, r) => sum + Number(r.returnQuantity ?? 0),
          0,
        );
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
          canCreateReturn:
            returnWindow.canCreateReturn &&
            deliveredQuantity - returnedQuantity > 0,
          returnBlockedReason:
            deliveredQuantity - returnedQuantity > 0
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

  async getOrderStats(): Promise<Record<string, number>> {
    const rows = await this.ordersRepository
      .createQueryBuilder('o')
      .select('o.orderStatus', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('o.orderStatus')
      .getRawMany<{ status: string; count: string }>();
    return Object.fromEntries(rows.map((r) => [r.status, Number(r.count)]));
  }

  private toOrderSummary(order: OrderEntity) {
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

  private async notifyAdminsAboutNewOrder(order: OrderEntity) {
    await this.notificationsService.sendAdminOrderCreatedNotification({
      orderId: order.orderId,
      fullName: order.fullName,
      phone: order.phone,
      totalPayment: order.totalPayment,
    });
    this.ordersAdminPublisher.emitNewOrder(order);
  }

  private isValidAdminStatusTransition(
    currentStatus: OrderStatus,
    nextStatus: OrderStatus,
  ) {
    const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.BACKORDERED]: [OrderStatus.PENDING, OrderStatus.CANCELLED],
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPING, OrderStatus.DELIVERED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPING]: [
        OrderStatus.DELIVERED,
        OrderStatus.RETURNED,
      ],
      [OrderStatus.PARTIAL_DELIVERED]: [OrderStatus.RETURNED],
      [OrderStatus.DELIVERED]: [OrderStatus.RETURNED],
      [OrderStatus.CANCELLED]: [],
      [OrderStatus.RETURNED]: [],
    };

    return allowedTransitions[currentStatus].includes(nextStatus);
  }

  private async restockOrderItems(
    orderId: string,
    productRepository: Repository<ProductEntity>,
    orderItemsRepository: Repository<OrderItemEntity>,
    entityManager?: EntityManager,
    options?: {
      performedBy?: string | null;
      note?: string;
    },
  ) {
    const items = await orderItemsRepository.find({
      where: { orderId },
    });
    const variantRepository = entityManager?.getRepository(ProductVariantEntity);

    for (const item of items) {
      // Lock pessimistic khi restock â€” trÃ¡nh race condition khi cancel song song
      const product = await productRepository.findOne({
        where: { productId: item.productId },
        lock: entityManager ? { mode: 'pessimistic_write' } : undefined,
      });

      if (product) {
        product.quantityAvailable += item.quantity;
        product.quantityReserved = Math.max(
          0,
          (product.quantityReserved ?? 0) - item.quantity,
        );
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
          await this.syncDefaultWarehouseStock(
            entityManager,
            item.productId,
            item.quantity,
          );
          await entityManager.save(
            InventoryTransactionEntity,
            entityManager.create(InventoryTransactionEntity, {
              productId: item.productId,
              performedBy: options?.performedBy ?? null,
              transactionType: InventoryTransactionType.RETURN_IN,
              quantityChange: item.quantity,
              quantityBefore: product.quantityAvailable - item.quantity,
              quantityAfter: product.quantityAvailable,
              referenceType: 'ORDER',
              referenceId: orderId,
              unitCostAtTime: product.avgCost ?? null,
              note: options?.note ?? 'Restock by order cancellation',
              relatedOrderId: orderId,
            }),
          );
        }
      }
    }
  }

  async reconcileOrderPayment(currentUser: IUser, orderId: string) {
    await this.ensureUserExists(currentUser._id);
    const order = await this.findAccessibleOrder(currentUser, orderId);

    if (order.paymentStatus === PaymentStatus.PAID) {
      return {
        orderId: order.orderId,
        paymentStatus: order.paymentStatus,
        message: 'Payment already marked as paid',
      };
    }

    if (order.paymentMethod !== PaymentMethod.MOMO) {
      return {
        orderId: order.orderId,
        paymentStatus: order.paymentStatus,
        message: 'Automatic reconciliation is only available for MoMo',
      };
    }

    const transaction = await this.paymentTransactionsRepository.findOne({
      where: {
        orderId: order.orderId,
        provider: PaymentMethod.MOMO,
      },
      order: { createdAt: 'DESC' },
    });

    if (!transaction) {
      throw new NotFoundException('Payment transaction not found');
    }

    const queryResult = await this.queryMomoPayment(transaction.transactionRef);
    const resultCode = Number(queryResult.resultCode);
    const resultMessage =
      typeof queryResult.message === 'string'
        ? queryResult.message
        : 'MoMo reconciliation completed';

    transaction.gatewayCode = String(queryResult.resultCode ?? '');
    transaction.gatewayMessage = resultMessage;
    transaction.rawPayload = {
      ...(transaction.rawPayload ?? {}),
      momoQuery: queryResult,
    };

    if (resultCode === 0) {
      transaction.transactionStatus = PaymentTransactionStatus.SUCCESS;
      transaction.paymentStatus = PaymentStatus.PAID;
      order.paymentStatus = PaymentStatus.PAID;
      await this.paymentTransactionsRepository.save(transaction);
      await this.ordersRepository.save(order);
      await this.notificationsService.sendPaymentNotification(
        order.userId,
        order.orderId,
        PaymentStatus.PAID,
        PaymentMethod.MOMO,
      );

      return {
        orderId: order.orderId,
        paymentStatus: PaymentStatus.PAID,
        transactionStatus: PaymentTransactionStatus.SUCCESS,
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

  private async queryMomoPayment(transactionRef: string) {
    const { partnerCode, accessKey, secretKey } =
      await this.settingsService.getMomoConfig();

    if (!partnerCode || !accessKey || !secretKey) {
      throw new BadRequestException('MoMo config is missing');
    }

    const orderId = transactionRef;
    const requestId = transactionRef;
    const rawSignature = [
      `accessKey=${accessKey}`,
      `orderId=${orderId}`,
      `partnerCode=${partnerCode}`,
      `requestId=${requestId}`,
    ].join('&');
    const signature = createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    const isSandbox =
      partnerCode === 'MOMO' || process.env.MOMO_SANDBOX === 'true';
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

    const data = (await response.json()) as Record<string, unknown>;
    if (!response.ok) {
      throw new BadRequestException(
        typeof data.message === 'string'
          ? data.message
          : 'MoMo reconciliation failed',
      );
    }
    return data;
  }

  /**
   * Khi Ä‘Æ¡n DELIVERED â€” khÃ´ng restock, chá»‰ giáº£i phÃ³ng quantityReserved
   * (hÃ ng Ä‘Ã£ thá»±c sá»± rá»i kho, khÃ´ng tráº£ vá» stock).
   */
  private async releaseReservedOnDelivered(
    orderId: string,
    productRepository: Repository<ProductEntity>,
    orderItemsRepository: Repository<OrderItemEntity>,
  ) {
    const items = await orderItemsRepository.find({ where: { orderId } });
    for (const item of items) {
      const product = await productRepository.findOne({
        where: { productId: item.productId },
        lock: { mode: 'pessimistic_write' },
      });
      if (product) {
        product.quantityReserved = Math.max(
          0,
          (product.quantityReserved ?? 0) - item.quantity,
        );
        await productRepository.save(product);
      }
    }
  }

  private async revertDiscountUsage(
    order: OrderEntity,
    discountRepository: Repository<DiscountEntity>,
    couponUsageRepository: Repository<CouponUsageEntity>,
  ) {
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

  /**
   * Äáº·t hÃ ng cho khÃ¡ch vÃ£ng lai (khÃ´ng cáº§n Ä‘Äƒng kÃ½ tÃ i khoáº£n).
   *
   * KhÃ¡c createOrder thÆ°á»ng:
   * 1. KhÃ´ng cáº§n userId â€” guest cung cáº¥p thÃ´ng tin shipping trá»±c tiáº¿p
   * 2. Táº¡o userId táº¡m dáº¡ng `guest-<uuid>` chá»‰ Ä‘á»ƒ thoáº£ mÃ£n FK constraint
   * 3. KhÃ´ng láº¥y giÃ¡ tá»« cart (vÃ¬ khÃ´ng cÃ³ cart) â€” láº¥y giÃ¡ hiá»‡n táº¡i tá»« products
   * 4. KhÃ´ng support discount code (Ä‘Æ¡n giáº£n hÆ¡n) â€” cÃ³ thá»ƒ bá»• sung sau
   * 5. Váº«n dÃ¹ng pessimistic lock + idempotency + reservation pattern
   */
  async createGuestOrder(dto: import('./dto/create-guest-order.dto').CreateGuestOrderDto, idempotencyKey?: string) {
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
      throw new NotFoundException('PhÆ°Æ¡ng thá»©c giao hÃ ng khÃ´ng kháº£ dá»¥ng');
    }

    const productIds = [...new Set(dto.items.map((it) => it.productId))];
    const products = await this.productsRepository.findBy(
      productIds.map((productId) => ({ productId })),
    );
    const productsById = new Map(
      products.map((product) => [product.productId, product]),
    );
    const guestVariantIds = [...new Set(dto.items.map((it) => it.variantId).filter((id): id is string => Boolean(id)))];
    const guestVariantsById = await this.getVariantSnapshots(guestVariantIds);

    let subtotalAmount = 0;
    let totalQuantity = 0;
    let isBackorder = false;

    for (const item of dto.items) {
      const product = productsById.get(item.productId);
      if (!product || !product.isShow) {
        throw new BadRequestException('Sáº£n pháº©m khÃ´ng kháº£ dá»¥ng');
      }
      if (item.quantity > product.quantityAvailable) {
        if (!dto.allowBackorder) {
          throw new BadRequestException(
            `Sáº£n pháº©m ${product.productName} khÃ´ng Ä‘á»§ tá»“n kho`,
          );
        }
        isBackorder = true;
      }
      const price =
        Number(product.productPriceSale ?? 0) > 0
          ? Number(product.productPriceSale)
          : Number(product.productPrice);
      subtotalAmount += price * item.quantity;
      totalQuantity += item.quantity;
    }

    const deliveryCost = this.calculateDeliveryCost(deliveryMethod, subtotalAmount);
    const totalPayment = subtotalAmount + deliveryCost;
    const orderId = randomUUID();
    const guestUserId = randomUUID();
    const addressSnapshot = [
      dto.shipping.addressLine,
      dto.shipping.ward,
      dto.shipping.district,
      dto.shipping.province,
    ]
      .filter(Boolean)
      .join(', ');

    await withDeadlockRetry(() =>
      this.ordersRepository.manager.transaction(async (entityManager) => {
        const trxOrders = entityManager.getRepository(OrderEntity);
        const trxItems = entityManager.getRepository(OrderItemEntity);
        const trxHistory = entityManager.getRepository(OrderStatusHistoryEntity);
        const trxProducts = entityManager.getRepository(ProductEntity);
        const trxVariants = entityManager.getRepository(ProductVariantEntity);
        const trxInvTx = entityManager.getRepository(InventoryTransactionEntity);

        if (idempotencyKey) {
          const dup = await trxOrders.findOne({ where: { idempotencyKey } });
          if (dup) return;
        }

        await this.createGuestUserRecord(entityManager, guestUserId, orderId);

        const order = trxOrders.create({
          orderId,
          userId: guestUserId,
          shippingAddressId: null,
          deliveryId: deliveryMethod.deliveryId,
          discountId: null,
          orderStatus: isBackorder ? OrderStatus.BACKORDERED : OrderStatus.PENDING,
          paymentMethod: dto.paymentMethod,
          paymentStatus: PaymentStatus.UNPAID,
          subtotalAmount: subtotalAmount.toFixed(2),
          discountAmount: '0.00',
          deliveryCost: deliveryCost.toFixed(2),
          totalPayment: totalPayment.toFixed(2),
          totalQuantity,
          note:
            (dto.note ? `${dto.note}\n` : '') +
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
            throw new BadRequestException('Sáº£n pháº©m khÃ´ng tá»“n táº¡i');
          }
          const variantSnapshot = item.variantId ? guestVariantsById.get(item.variantId) : null;
          const variant = item.variantId
            ? await trxVariants.findOne({
                where: { variantId: item.variantId, productId: item.productId },
                lock: { mode: 'pessimistic_write' },
              })
            : null;
          if (item.variantId && (!variant || !variant.isActive)) {
            throw new BadRequestException('Bien the san pham khong kha dung');
          }
          const availableQuantity = variant?.stockQuantity ?? product.quantityAvailable;
          const isLineBackorder = item.quantity > availableQuantity;
          if (isLineBackorder && !dto.allowBackorder) {
            throw new BadRequestException(
              `Sáº£n pháº©m ${product.productName} khÃ´ng Ä‘á»§ tá»“n kho`,
            );
          }

          const unitPrice = variant
            ? variant.salePrice ?? variant.price ?? product.productPriceSale ?? product.productPrice
            : Number(product.productPriceSale ?? 0) > 0
              ? product.productPriceSale!
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

          if (isLineBackorder) continue;

          const qtyBefore = variant?.stockQuantity ?? product.quantityAvailable;
          if (variant) {
            variant.stockQuantity -= item.quantity;
            await trxVariants.save(variant);
          }
          product.quantityAvailable -= item.quantity;
          product.quantityReserved =
            (product.quantityReserved ?? 0) + item.quantity;
          await trxProducts.save(product);

          await trxInvTx.save(
            trxInvTx.create({
              productId: item.productId,
              performedBy: null,
              transactionType: InventoryTransactionType.EXPORT,
              quantityChange: -item.quantity,
              quantityBefore: qtyBefore,
              quantityAfter: variant?.stockQuantity ?? product.quantityAvailable,
              variantId: variant?.variantId ?? null,
              referenceType: 'ORDER',
              referenceId: orderId,
              unitCostAtTime: product.avgCost ?? null,
              note: 'Guest order checkout',
              relatedOrderId: orderId,
            }),
          );
          await this.syncDefaultWarehouseStock(
            entityManager,
            item.productId,
            -item.quantity,
          );
        }

        await trxHistory.save(
          trxHistory.create({
            orderId,
            oldStatus: null,
            newStatus: isBackorder ? OrderStatus.BACKORDERED : OrderStatus.PENDING,
            changedBy: null,
            note: 'Đơn hàng khách đã được tạo',
          }),
        );
      }),
    );

    const created = await this.findAnyOrder(orderId);
    await this.notifyAdminsAboutNewOrder(created);
    return this.buildOrderDetail(created);
  }

  /**
   * Tra cá»©u Ä‘Æ¡n guest báº±ng orderId + phone (verify nháº¹ â€” anyone biáº¿t cáº£ 2 sáº½ xem Ä‘Æ°á»£c).
   */
  async findGuestOrder(orderId: string, phone: string) {
    if (!phone || !orderId) {
      throw new BadRequestException('Cáº§n cung cáº¥p orderId vÃ  phone');
    }
    const order = await this.ordersRepository.findOne({
      where: { orderId },
    });
    if (!order) throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y Ä‘Æ¡n hÃ ng');
    if (!(await this.isGuestUserId(order.userId))) {
      throw new UnauthorizedException('ÄÆ¡n nÃ y thuá»™c tÃ i khoáº£n Ä‘Äƒng kÃ½, hÃ£y Ä‘Äƒng nháº­p Ä‘á»ƒ xem');
    }
    if (order.phone.replace(/\s+/g, '') !== phone.replace(/\s+/g, '')) {
      throw new UnauthorizedException('Sá»‘ Ä‘iá»‡n thoáº¡i khÃ´ng khá»›p');
    }
    return this.buildOrderDetail(order);
  }

  async createOrder(
    userId: string,
    createOrderDto: CreateOrderDto,
    idempotencyKey?: string,
  ) {
    const currentUser = await this.ensureUserExists(userId);
    await this.ensurePaymentMethodEnabled(createOrderDto.paymentMethod);

    if (idempotencyKey) {
      const existing = await this.ordersRepository.findOne({
        where: { idempotencyKey, userId },
      });
      if (existing) {
        return this.buildOrderDetail(
          await this.findOwnedOrder(userId, existing.orderId),
        );
      }
    }

    const cart = await this.cartsRepository.findOneBy({ userId });
    if (!cart) {
      throw new BadRequestException('Cart is empty');
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
      throw new BadRequestException('Cart is empty');
    }

    if (!shippingAddress) {
      throw new NotFoundException('Shipping address not found');
    }

    if (!deliveryMethod || !deliveryMethod.isActive) {
      throw new NotFoundException('Delivery method not found');
    }

    const productIds = [...new Set(cartItems.map((item) => item.productId))];
    const products = await this.productsRepository.findBy(
      productIds.map((productId) => ({ productId })),
    );
    const productsById = new Map(
      products.map((product) => [product.productId, product]),
    );
    const cartVariantIds = [...new Set(cartItems.map((item) => item.variantId).filter((id): id is string => Boolean(id)))];
    const cartVariantsById = await this.getVariantSnapshots(cartVariantIds);

    let subtotalAmount = 0;
    let totalQuantity = 0;
    let isBackorder = false;

    for (const cartItem of cartItems) {
      const product = productsById.get(cartItem.productId);
      if (!product || !product.isShow) {
        throw new BadRequestException('One or more products are unavailable');
      }
      const variantSnapshot = cartItem.variantId ? cartVariantsById.get(cartItem.variantId) : null;
      if (cartItem.variantId && (!variantSnapshot || variantSnapshot.variant.productId !== cartItem.productId || !variantSnapshot.variant.isActive)) {
        throw new BadRequestException('Bien the san pham khong kha dung');
      }
      const availableQuantity = variantSnapshot?.variant.stockQuantity ?? product.quantityAvailable;
      if (cartItem.quantity > availableQuantity) {
        if (!createOrderDto.allowBackorder) {
          throw new BadRequestException(
            `Sáº£n pháº©m ${product.productName} khÃ´ng Ä‘á»§ tá»“n kho`,
          );
        }
        isBackorder = true;
      }
      subtotalAmount += Number(cartItem.priceAtAdded) * cartItem.quantity;
      totalQuantity += cartItem.quantity;
    }

    const discountContext = await this.validateDiscountForCheckout(
      userId,
      createOrderDto.discountCode,
      subtotalAmount,
      cartItems,
      productsById,
    );
    const discount = discountContext?.discount ?? null;
    const discountAmount = discountContext
      ? this.calculateDiscountAmount(
          discountContext.discount,
          discountContext.eligibleSubtotal,
        )
      : 0;
    const deliveryCost = this.calculateDeliveryCost(
      deliveryMethod,
      subtotalAmount,
    );
    const totalPayment = subtotalAmount - discountAmount + deliveryCost;

    // Kiá»ƒm tra vÃ  xá»­ lÃ½ háº¡n má»©c tÃ­n dá»¥ng cho Ä‘Æ¡n mua ná»£
    let creditLimit: import('../credit-limits/entities/customer-credit-limit.entity').CustomerCreditLimitEntity | null = null;
    if (createOrderDto.paymentMethod === PaymentMethod.CREDIT) {
      if (!currentUser.isWholesale) {
        throw new BadRequestException('PhÆ°Æ¡ng thá»©c "Mua ná»£" chá»‰ dÃ nh cho khÃ¡ch sá»‰ Ä‘Æ°á»£c cáº¥p háº¡n má»©c tÃ­n dá»¥ng');
      }
      creditLimit = await this.creditLimitRepository.findOne({ where: { userId, isActive: true as unknown as boolean } });
      if (!creditLimit) {
        throw new BadRequestException('Báº¡n chÆ°a Ä‘Æ°á»£c cáº¥p háº¡n má»©c tÃ­n dá»¥ng. Vui lÃ²ng liÃªn há»‡ shop Ä‘á»ƒ Ä‘Æ°á»£c há»— trá»£');
      }
      const available = Number(creditLimit.creditLimit) - Number(creditLimit.currentDebt ?? 0);
      if (totalPayment > available) {
        throw new BadRequestException(
          `VÆ°á»£t háº¡n má»©c tÃ­n dá»¥ng. Háº¡n má»©c cÃ²n láº¡i: ${Math.max(0, available).toLocaleString('vi-VN')}â‚«`,
        );
      }
    }

    const addressSnapshot = this.buildAddressSnapshot(shippingAddress);
    const orderId = randomUUID();

    // Stock deduction inside a transaction with pessimistic_write lock per product
    // â†’ trÃ¡nh oversell khi nhiá»u request Ä‘á»“ng thá»i cÃ¹ng mua sáº£n pháº©m cuá»‘i cÃ¹ng.
    // â†’ tá»± retry tá»‘i Ä‘a 3 láº§n khi gáº·p deadlock MySQL.
    await withDeadlockRetry(() =>
      this.ordersRepository.manager.transaction(async (entityManager) => {
        const transactionalOrdersRepository =
          entityManager.getRepository(OrderEntity);
        const transactionalOrderItemsRepository =
          entityManager.getRepository(OrderItemEntity);
        const transactionalHistoryRepository = entityManager.getRepository(
          OrderStatusHistoryEntity,
        );
        const transactionalProductsRepository =
          entityManager.getRepository(ProductEntity);
        const transactionalVariantsRepository =
          entityManager.getRepository(ProductVariantEntity);
        const transactionalCartItemsRepository =
          entityManager.getRepository(CartItemEntity);
        const transactionalInventoryTransactionsRepository =
          entityManager.getRepository(InventoryTransactionEntity);
        const transactionalDiscountsRepository =
          entityManager.getRepository(DiscountEntity);
        const transactionalCouponUsageRepository =
          entityManager.getRepository(CouponUsageEntity);

        // Idempotency double-check inside transaction (race window protection)
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
            ? OrderStatus.BACKORDERED
            : OrderStatus.PENDING,
          paymentMethod: createOrderDto.paymentMethod,
          paymentStatus: PaymentStatus.UNPAID,
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
          // Lock row pessimistic â€” block cÃ¡c request khÃ¡c Ä‘á»c cÃ¹ng product trong khi check + trá»« stock
          const product = await transactionalProductsRepository.findOne({
            where: { productId: cartItem.productId },
            lock: { mode: 'pessimistic_write' },
          });
          if (!product || !product.isShow) {
            throw new BadRequestException(
              'One or more products are unavailable',
            );
          }
          const variantSnapshot = cartItem.variantId ? cartVariantsById.get(cartItem.variantId) : null;
          const variant = cartItem.variantId
            ? await transactionalVariantsRepository.findOne({
                where: { variantId: cartItem.variantId, productId: cartItem.productId },
                lock: { mode: 'pessimistic_write' },
              })
            : null;
          if (cartItem.variantId && (!variant || !variant.isActive)) {
            throw new BadRequestException('Bien the san pham khong kha dung');
          }
          const availableQuantity = variant?.stockQuantity ?? product.quantityAvailable;
          const isLineBackorder =
            cartItem.quantity > availableQuantity;
          if (isLineBackorder && !createOrderDto.allowBackorder) {
            throw new BadRequestException(
              `Sáº£n pháº©m ${product.productName} khÃ´ng Ä‘á»§ tá»“n kho`,
            );
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

          // Backorder line: KHÃ”NG trá»« stock, KHÃ”NG ghi inventory transaction
          // (sáº½ xá»­ lÃ½ sau khi nháº­p hÃ ng vá» vÃ  admin fulfill)
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

          const inventoryTransaction =
            transactionalInventoryTransactionsRepository.create({
              productId: product.productId,
              performedBy: userId,
              transactionType: InventoryTransactionType.EXPORT,
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
          await transactionalInventoryTransactionsRepository.save(
            inventoryTransaction,
          );

          await this.syncDefaultWarehouseStock(
            entityManager,
            product.productId,
            -cartItem.quantity,
          );
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
            ? OrderStatus.BACKORDERED
            : OrderStatus.PENDING,
          changedBy: userId,
          note: isBackorder
            ? 'Đơn hàng đặt trước - chờ nhập kho'
            : 'Đơn hàng đã được tạo',
        });
        await transactionalHistoryRepository.save(history);

        await transactionalCartItemsRepository.delete({ cartId: cart.cartId });
      }),
    );

    // Ghi nháº­n cÃ´ng ná»£ cho Ä‘Æ¡n mua ná»£
    if (createOrderDto.paymentMethod === PaymentMethod.CREDIT && creditLimit) {
      await this.creditLimitRepository.update(
        { userId },
        { currentDebt: () => `current_debt + ${totalPayment}` },
      );
    }

    const createdOrder = await this.findOwnedOrder(userId, orderId);
    await this.notificationsService.sendOrderCreatedNotification(
      userId,
      orderId,
    );
    await this.notifyAdminsAboutNewOrder(createdOrder);
    return this.buildOrderDetail(createdOrder);
  }

  async findAllOrders(query: QueryOrdersDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const queryBuilder = this.ordersRepository.createQueryBuilder('order');

    if (query.status) {
      queryBuilder.andWhere('order.order_status = :status', {
        status: query.status,
      });
    }

    if (query.search) {
      queryBuilder.andWhere(
        '(order.order_id LIKE :search OR order.user_id LIKE :search OR order.full_name LIKE :search OR order.phone LIKE :search)',
        { search: `%${query.search}%` },
      );
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

  async findOrderDetail(currentUser: IUser, orderId: string) {
    await this.ensureUserExists(currentUser._id);
    const order = await this.findAccessibleOrder(currentUser, orderId);

    return this.buildOrderDetail(order);
  }

  async findOrderTracking(currentUser: IUser, orderId: string) {
    await this.ensureUserExists(currentUser._id);
    const order = await this.findAccessibleOrder(currentUser, orderId);
    const tracking = await this.findOrCreateOrderTracking(order.orderId);

    return this.mapOrderTracking(tracking);
  }

  async updateOrderTrackingMode(
    currentUser: IUser,
    orderId: string,
    updateOrderTrackingModeDto: UpdateOrderTrackingModeDto,
  ) {
    await this.ensureUserExists(currentUser._id);
    const order = await this.findAnyOrder(orderId);
    const tracking = await this.findOrCreateOrderTracking(order.orderId);

    tracking.mode = updateOrderTrackingModeDto.mode;
    const saved = await this.orderTrackingRepository.save(tracking);
    return this.mapOrderTracking(saved);
  }

  async updateManualOrderTracking(
    currentUser: IUser,
    orderId: string,
    updateOrderTrackingManualDto: UpdateOrderTrackingManualDto,
  ) {
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

  async updateLiveOrderTracking(
    currentUser: IUser,
    orderId: string,
    updateOrderTrackingLiveDto: UpdateOrderTrackingLiveDto,
  ) {
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

  async cancelOrder(userId: string, orderId: string) {
    await this.ensureUserExists(userId);
    const order = await this.findOwnedOrder(userId, orderId);
    const previousStatus = order.orderStatus;

    if (
      ![OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(order.orderStatus)
    ) {
      throw new BadRequestException('Order cannot be cancelled');
    }

    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('PAID_ORDER_CANCEL_REQUIRES_REFUND');
    }

    await this.ordersRepository.manager.transaction(async (entityManager) => {
      const transactionalOrdersRepository =
        entityManager.getRepository(OrderEntity);
      const transactionalOrderItemsRepository =
        entityManager.getRepository(OrderItemEntity);
      const transactionalProductsRepository =
        entityManager.getRepository(ProductEntity);
      const transactionalHistoryRepository = entityManager.getRepository(
        OrderStatusHistoryEntity,
      );
      const transactionalDiscountsRepository =
        entityManager.getRepository(DiscountEntity);
      const transactionalCouponUsageRepository =
        entityManager.getRepository(CouponUsageEntity);

      await this.restockOrderItems(
        order.orderId,
        transactionalProductsRepository,
        transactionalOrderItemsRepository,
        entityManager,
        { performedBy: userId, note: 'Restock by customer cancellation' },
      );

      await this.revertDiscountUsage(
        order,
        transactionalDiscountsRepository,
        transactionalCouponUsageRepository,
      );

      order.orderStatus = OrderStatus.CANCELLED;
      await transactionalOrdersRepository.save(order);

      const history = transactionalHistoryRepository.create({
        orderId: order.orderId,
        oldStatus: previousStatus,
        newStatus: OrderStatus.CANCELLED,
        changedBy: userId,
        note: 'Khách hàng đã hủy đơn',
      });
      await transactionalHistoryRepository.save(history);
    });

    // HoÃ n láº¡i cÃ´ng ná»£ khi há»§y Ä‘Æ¡n mua ná»£
    if (order.paymentMethod === PaymentMethod.CREDIT) {
      await this.creditLimitRepository.update(
        { userId },
        { currentDebt: () => `GREATEST(0, current_debt - ${Number(order.totalPayment)})` },
      );
    }

    const cancelledOrder = await this.findOwnedOrder(userId, orderId);
    await this.notificationsService.sendOrderStatusNotification(
      userId,
      orderId,
      OrderStatus.CANCELLED,
    );
    return this.buildOrderDetail(cancelledOrder);
  }

  async updateOrderStatus(
    currentUser: IUser,
    orderId: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    await this.ensureUserExists(currentUser._id);
    const order = await this.findAnyOrder(orderId);
    const previousStatus = order.orderStatus;
    const previousPaymentStatus = order.paymentStatus;
    const nextStatus = updateOrderStatusDto.status;

    if (previousStatus === nextStatus) {
      return this.buildOrderDetail(order);
    }

    if (
      [
        OrderStatus.DELIVERED,
        OrderStatus.PARTIAL_DELIVERED,
        OrderStatus.RETURNED,
      ].includes(previousStatus) &&
      nextStatus !== OrderStatus.RETURNED
    ) {
      throw new BadRequestException('Finalized order cannot change status');
    }

    if (previousStatus === OrderStatus.CANCELLED) {
      throw new BadRequestException('Cancelled order cannot change status');
    }

    if (!this.isValidAdminStatusTransition(previousStatus, nextStatus)) {
      throw new BadRequestException('Invalid order status transition');
    }

    await this.ordersRepository.manager.transaction(async (entityManager) => {
      const transactionalOrdersRepository =
        entityManager.getRepository(OrderEntity);
      const transactionalOrderItemsRepository =
        entityManager.getRepository(OrderItemEntity);
      const transactionalProductsRepository =
        entityManager.getRepository(ProductEntity);
      const transactionalHistoryRepository = entityManager.getRepository(
        OrderStatusHistoryEntity,
      );
      const transactionalInventoryTransactionsRepository =
        entityManager.getRepository(InventoryTransactionEntity);
      const transactionalDiscountsRepository =
        entityManager.getRepository(DiscountEntity);
      const transactionalCouponUsageRepository =
        entityManager.getRepository(CouponUsageEntity);

      // BACKORDERED â†’ PENDING: fulfill backorder, trá»« stock chÃ­nh thá»©c
      if (
        previousStatus === OrderStatus.BACKORDERED &&
        nextStatus === OrderStatus.PENDING
      ) {
        const items = await transactionalOrderItemsRepository.find({
          where: { orderId: order.orderId },
        });
        for (const item of items) {
          const product = await transactionalProductsRepository.findOne({
            where: { productId: item.productId },
            lock: { mode: 'pessimistic_write' },
          });
          if (!product) {
            throw new BadRequestException(
              `Sáº£n pháº©m trong Ä‘Æ¡n khÃ´ng cÃ²n tá»“n táº¡i`,
            );
          }
          if (item.quantity > product.quantityAvailable) {
            throw new BadRequestException(
              `Sáº£n pháº©m ${product.productName} váº«n chÆ°a Ä‘á»§ tá»“n kho Ä‘á»ƒ fulfill`,
            );
          }
          const qtyBefore = product.quantityAvailable;
          product.quantityAvailable -= item.quantity;
          product.quantityReserved =
            (product.quantityReserved ?? 0) + item.quantity;
          await transactionalProductsRepository.save(product);

          const tx = transactionalInventoryTransactionsRepository.create({
            productId: item.productId,
            performedBy: currentUser._id,
            transactionType: InventoryTransactionType.EXPORT,
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
          await this.syncDefaultWarehouseStock(
            entityManager,
            item.productId,
            -item.quantity,
          );
        }
      }

      if (
        nextStatus === OrderStatus.CANCELLED ||
        nextStatus === OrderStatus.RETURNED
      ) {
        // Backorder bá»‹ cancel: KHÃ”NG restock vÃ¬ chÆ°a tá»«ng trá»« stock
        const isBackorderCancel =
          previousStatus === OrderStatus.BACKORDERED &&
          nextStatus === OrderStatus.CANCELLED;

        if (isBackorderCancel) {
          await this.revertDiscountUsage(
            order,
            transactionalDiscountsRepository,
            transactionalCouponUsageRepository,
          );
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

        // RETURNED: KHÃ”NG tá»± restock, chá»‰ giáº£i phÃ³ng reserved (náº¿u chÆ°a giao)
        // â†’ HÃ ng pháº£i qua inspection trÆ°á»›c. Stock chá»‰ Ä‘Æ°á»£c restock khi
        //   admin inspect = USABLE.
        // CANCELLED: váº«n restock bÃ¬nh thÆ°á»ng (hÃ ng chÆ°a rá»i kho).
        if (nextStatus === OrderStatus.CANCELLED) {
          if (order.paymentStatus === PaymentStatus.PAID) {
            throw new BadRequestException('PAID_ORDER_CANCEL_REQUIRES_REFUND');
          }
          await this.restockOrderItems(
            order.orderId,
            transactionalProductsRepository,
            transactionalOrderItemsRepository,
            entityManager,
            {
              performedBy: currentUser._id,
              note: updateOrderStatusDto.note ?? 'Restock by admin cancellation',
            },
          );
          await this.revertDiscountUsage(
            order,
            transactionalDiscountsRepository,
            transactionalCouponUsageRepository,
          );
        } else if (nextStatus === OrderStatus.RETURNED) {
          // HÃ ng tráº£ vá» â€” giáº£i phÃ³ng quantityReserved náº¿u cÃ³ (Ä‘Æ¡n chÆ°a DELIVERED)
          // Stock physical KHÃ”NG cá»™ng láº¡i â€” chá» inspect.
          // Náº¿u Ä‘Æ¡n Ä‘Ã£ DELIVERED rá»“i: reserved = 0, khÃ´ng cÃ³ gÃ¬ Ä‘á»ƒ release.
          for (const item of items) {
            const product = await transactionalProductsRepository.findOne({
              where: { productId: item.productId },
              lock: { mode: 'pessimistic_write' },
            });
            if (!product) continue;

            // Táº¡o Return record vá»›i inspectionStatus = PENDING
            const returnRecord = entityManager
              .getRepository(ReturnEntity)
              .create({
                orderId: order.orderId,
                orderItemId: item.orderItemId,
                userId: order.userId,
                reason:
                  updateOrderStatusDto.note ?? 'Returned by admin',
                description: null,
                returnQuantity: this.getDeliveredQuantityForReturn(item),
                maxRefundableAmount: item.lineTotal,
                refundedQuantity: 0,
                returnStatus: ReturnStatus.RECEIVED,
                inspectionStatus: ReturnInspectionStatus.PENDING,
                refundAmount: null,
              });
            await entityManager
              .getRepository(ReturnEntity)
              .save(returnRecord);
          }
        }
      }

      // Khi DELIVERED: giáº£i phÃ³ng reserved (hÃ ng Ä‘Ã£ rá»i kho tháº­t sá»±)
      if (nextStatus === OrderStatus.DELIVERED) {
        await this.releaseReservedOnDelivered(
          order.orderId,
          transactionalProductsRepository,
          transactionalOrderItemsRepository,
        );
      }

      order.orderStatus = nextStatus;

      // Payment status logic:
      // - COD + DELIVERED â†’ PAID (khÃ¡ch tráº£ tiá»n khi nháº­n hÃ ng)
      // - Online (non-COD) khi CONFIRMED: KHÃ”NG tá»± Ä‘áº·t PAID ná»¯a.
      //   Pháº£i cÃ³ PaymentTransaction tá»« gateway hoáº·c admin xÃ¡c nháº­n thá»§ cÃ´ng.
      //   (giá»¯ nguyÃªn paymentStatus hiá»‡n táº¡i â€” thÆ°á»ng lÃ  UNPAID)
      if (
        nextStatus === OrderStatus.DELIVERED &&
        order.paymentMethod === PaymentMethod.COD
      ) {
        order.paymentStatus = PaymentStatus.PAID;
      }

      if (nextStatus === OrderStatus.CANCELLED) {
        order.paymentStatus =
          order.paymentStatus === PaymentStatus.PAID
            ? PaymentStatus.REFUNDED
            : PaymentStatus.FAILED;
      }

      if (nextStatus === OrderStatus.RETURNED) {
        order.paymentStatus =
          order.paymentStatus === PaymentStatus.PAID
            ? PaymentStatus.REFUNDED
            : PaymentStatus.FAILED;
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

    // HoÃ n láº¡i cÃ´ng ná»£ khi admin há»§y Ä‘Æ¡n mua ná»£ chÆ°a thanh toÃ¡n
    if (
      nextStatus === OrderStatus.CANCELLED &&
      order.paymentMethod === PaymentMethod.CREDIT &&
      previousPaymentStatus === PaymentStatus.UNPAID
    ) {
      await this.creditLimitRepository.update(
        { userId: order.userId },
        { currentDebt: () => `GREATEST(0, current_debt - ${Number(order.totalPayment)})` },
      );
    }

    const updatedOrder = await this.findAnyOrder(orderId);
    await this.notificationsService.sendOrderStatusNotification(
      updatedOrder.userId,
      orderId,
      nextStatus,
    );

    if (
      nextStatus === OrderStatus.DELIVERED &&
      updatedOrder.userId &&
      !(await this.isGuestUserId(updatedOrder.userId))
    ) {
      void this.membershipService.recalculateAndReward(updatedOrder.userId);
    }

    return this.buildOrderDetail(updatedOrder);
  }

  async initiatePayment(
    currentUser: IUser | undefined,
    orderId: string,
    initiatePaymentDto: InitiatePaymentDto,
  ) {
    const order = currentUser
      ? await this.findAccessibleOrder(currentUser, orderId)
      : await this.findAnyOrder(orderId);

    if (currentUser) {
      await this.ensureUserExists(currentUser._id);
    } else {
      const normalizePhone = (value: string) => value.replace(/\s+/g, '');
      if (!(await this.isGuestUserId(order.userId))) {
        throw new UnauthorizedException('Order is not a guest order');
      }
      if (
        !initiatePaymentDto.phone ||
        normalizePhone(order.phone) !== normalizePhone(initiatePaymentDto.phone)
      ) {
        throw new UnauthorizedException('Phone number does not match order');
      }
    }

    if (!this.isOnlinePaymentMethod(order.paymentMethod)) {
      throw new BadRequestException('Order does not require online payment');
    }

    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('Order has already been paid');
    }

    const transactionRef = `${orderId}-${Date.now()}`;
    const paymentTransaction = this.paymentTransactionsRepository.create({
      orderId,
      userId: order.userId,
      provider: order.paymentMethod,
      transactionRef,
      transactionStatus: PaymentTransactionStatus.PENDING,
      paymentStatus: PaymentStatus.UNPAID,
      amount: order.totalPayment,
      gatewayCode: null,
      gatewayMessage: null,
      rawPayload: {
        returnUrl: initiatePaymentDto.returnUrl ?? null,
      },
    });

    await this.paymentTransactionsRepository.save(paymentTransaction);

    // Sentinel value â€” frontend detects this and shows simulation modal
    let paymentUrl = `https://payment-gateway.local?provider=${order.paymentMethod}&transactionRef=${transactionRef}&orderId=${orderId}`;

    if (order.paymentMethod === PaymentMethod.MOMO) {
      const momoUrl = await this.buildMomoPaymentUrl(
        orderId,
        transactionRef,
        Math.round(Number(order.totalPayment)),
        initiatePaymentDto.returnUrl ?? `${process.env.FRONTEND_URL ?? 'http://localhost:5173'}/client/payment`,
      ).catch((err: unknown) => {
        console.error('[MoMo] buildMomoPaymentUrl error:', err);
        return null;
      });
      if (momoUrl) {
        paymentUrl = momoUrl;
      } else {
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

  private async buildMomoPaymentUrl(
    internalOrderId: string,
    requestId: string,
    amount: number,
    redirectUrl: string,
  ): Promise<string | null> {
    const { partnerCode, accessKey, secretKey } =
      await this.settingsService.getMomoConfig();

    if (!partnerCode || !accessKey || !secretKey) return null;

    // Use requestId as MoMo orderId to guarantee uniqueness per request
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

    const signature = createHmac('sha256', secretKey).update(rawSignature).digest('hex');

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

    // Use sandbox endpoint when partner code is the MoMo test value
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

    const data = (await response.json()) as { resultCode?: number; payUrl?: string; message?: string };
    console.log('[MoMo] Response:', JSON.stringify(data));
    if (data.resultCode === 0 && data.payUrl) return data.payUrl;
    console.error(`[MoMo] resultCode=${data.resultCode ?? 'N/A'} message=${data.message ?? 'N/A'}`);
    return null;
  }

  async handleMomoIpn(body: Record<string, unknown>) {
    const { accessKey, secretKey } = await this.settingsService.getMomoConfig();
    if (!secretKey || !accessKey) return { message: 'ignored' };

    // 1. VERIFY HMAC SIGNATURE â€” chá»‘ng fake callback
    if (!verifyMomoSignature(body, accessKey, secretKey)) {
      throw new UnauthorizedException('Invalid MoMo signature');
    }

    const {
      orderId: momoOrderId,
      requestId,
      amount,
      resultCode,
      transId,
      message: gwMessage,
    } = body as {
      orderId?: string;
      requestId?: string;
      amount?: number;
      resultCode?: number | string;
      transId?: string;
      message?: string;
    };

    // momoOrderId = transactionRef (requestId) â€” look up the real order via transactions table
    const txRef = momoOrderId ?? requestId;
    if (!txRef) return { message: 'missing orderId' };

    const transaction = await this.paymentTransactionsRepository
      .findOne({ where: { transactionRef: txRef } })
      .catch(() => null);

    const internalOrderId = transaction?.orderId;
    if (!internalOrderId) return { message: 'transaction not found' };

    const order = await this.ordersRepository
      .findOneBy({ orderId: internalOrderId })
      .catch(() => null);
    if (!order) return { message: 'order not found' };

    // 2. IDEMPOTENCY â€” Náº¿u Ä‘Ã£ xá»­ lÃ½ transId nÃ y thÃ nh SUCCESS rá»“i thÃ¬ return luÃ´n
    if (
      transaction &&
      transaction.transactionStatus === PaymentTransactionStatus.SUCCESS &&
      transaction.gatewayCode === String(resultCode ?? '')
    ) {
      return { message: 'already processed', transId };
    }

    // 3. AMOUNT MISMATCH GUARD â€” TrÃ¡nh fake amount nhá»
    if (amount !== undefined && amount !== null) {
      const expectedAmount = Number(order.totalPayment);
      const reportedAmount = Number(amount);
      if (
        Number.isFinite(expectedAmount) &&
        Number.isFinite(reportedAmount) &&
        Math.abs(expectedAmount - reportedAmount) > 0.01
      ) {
        // LÆ°u transaction lÃ  FAILED do amount mismatch â€” khÃ´ng update order
        if (transaction) {
          transaction.transactionStatus = PaymentTransactionStatus.FAILED;
          transaction.gatewayCode = 'AMOUNT_MISMATCH';
          transaction.gatewayMessage = `Expected ${expectedAmount}, got ${reportedAmount}`;
          transaction.rawPayload = body;
          await this.paymentTransactionsRepository.save(transaction);
        }
        throw new BadRequestException('Payment amount mismatch');
      }
    }

    const resultCodeValue = Number(resultCode);
    const success = resultCodeValue === 0;
    const paymentStatus = success ? PaymentStatus.PAID : PaymentStatus.FAILED;

    // Update existing transaction status if found, or create a new one
    if (transaction) {
      transaction.transactionStatus = success
        ? PaymentTransactionStatus.SUCCESS
        : PaymentTransactionStatus.FAILED;
      transaction.paymentStatus = paymentStatus;
      transaction.gatewayCode = String(resultCode ?? '');
      transaction.gatewayMessage = (gwMessage as string) ?? null;
      transaction.rawPayload = body;
      await this.paymentTransactionsRepository.save(transaction);
    } else {
      const newTx = this.paymentTransactionsRepository.create({
        orderId: internalOrderId,
        userId: order.userId,
        provider: PaymentMethod.MOMO,
        transactionRef: txRef,
        transactionStatus: success
          ? PaymentTransactionStatus.SUCCESS
          : PaymentTransactionStatus.FAILED,
        paymentStatus,
        amount: String(amount ?? order.totalPayment),
        gatewayCode: String(resultCode ?? ''),
        gatewayMessage: (gwMessage as string) ?? null,
        rawPayload: body,
      });
      await this.paymentTransactionsRepository.save(newTx);
    }

    order.paymentStatus = paymentStatus;
    await this.ordersRepository.save(order);

    await this.notificationsService.sendPaymentNotification(
      order.userId,
      internalOrderId,
      paymentStatus,
      PaymentMethod.MOMO,
    );

    return { message: 'ok', transId };
  }

  async handlePaymentCallback(
    provider: string,
    paymentCallbackDto: PaymentCallbackDto,
  ) {
    const normalizedProvider = provider.toLowerCase() as PaymentMethod;
    const order = await this.findAnyOrder(paymentCallbackDto.orderId);

    if (order.paymentMethod !== normalizedProvider) {
      throw new BadRequestException('Payment provider does not match order');
    }

    // 1. IDEMPOTENCY â€” TrÃ¡nh xá»­ lÃ½ láº¡i cÃ¹ng transactionRef
    const existingTx = await this.paymentTransactionsRepository.findOne({
      where: { transactionRef: paymentCallbackDto.transactionRef },
    });
    if (
      existingTx &&
      existingTx.transactionStatus === PaymentTransactionStatus.SUCCESS &&
      paymentCallbackDto.success
    ) {
      return {
        orderId: order.orderId,
        provider: normalizedProvider,
        transactionRef: paymentCallbackDto.transactionRef,
        paymentStatus: existingTx.paymentStatus,
        message: 'already processed',
      };
    }

    // 2. AMOUNT MISMATCH GUARD â€” KhÃ´ng cho fake amount nhá» hÆ¡n
    if (paymentCallbackDto.success) {
      const expectedAmount = Number(order.totalPayment);
      const reportedAmount = Number(paymentCallbackDto.amount);
      if (
        Number.isFinite(expectedAmount) &&
        Number.isFinite(reportedAmount) &&
        Math.abs(expectedAmount - reportedAmount) > 0.01
      ) {
        throw new BadRequestException(
          `Payment amount mismatch: expected ${expectedAmount}, got ${reportedAmount}`,
        );
      }
    }

    const paymentStatus = paymentCallbackDto.success
      ? PaymentStatus.PAID
      : PaymentStatus.FAILED;

    if (existingTx) {
      existingTx.transactionStatus = paymentCallbackDto.success
        ? PaymentTransactionStatus.SUCCESS
        : PaymentTransactionStatus.FAILED;
      existingTx.paymentStatus = paymentStatus;
      existingTx.gatewayCode = paymentCallbackDto.gatewayCode ?? null;
      existingTx.gatewayMessage = paymentCallbackDto.gatewayMessage ?? null;
      existingTx.rawPayload = paymentCallbackDto.rawPayload ?? null;
      await this.paymentTransactionsRepository.save(existingTx);
    } else {
      const transaction = this.paymentTransactionsRepository.create({
        orderId: order.orderId,
        userId: order.userId,
        provider: normalizedProvider,
        transactionRef: paymentCallbackDto.transactionRef,
        transactionStatus: paymentCallbackDto.success
          ? PaymentTransactionStatus.SUCCESS
          : PaymentTransactionStatus.FAILED,
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
    await this.notificationsService.sendPaymentNotification(
      order.userId,
      order.orderId,
      paymentStatus,
      normalizedProvider,
    );

    return {
      orderId: order.orderId,
      provider: normalizedProvider,
      transactionRef: paymentCallbackDto.transactionRef,
      paymentStatus,
    };
  }

  /**
   * Cron reconciliation â€” cháº¡y má»—i 15 phÃºt.
   * TÃ¬m cÃ¡c Ä‘Æ¡n online (non-COD) Ä‘Ã£ PENDING + paymentStatus=UNPAID quÃ¡ 30 phÃºt
   * â†’ Äá»‘i soÃ¡t vá»›i gateway hoáº·c tá»± cancel Ä‘á»ƒ giáº£i phÃ³ng stock.
   *
   * Hiá»‡n táº¡i: KHÃ”NG gá»i MoMo query API tháº­t (cáº§n endpoint /v2/gateway/api/query
   * + signature) â€” sáº½ AUTO CANCEL Ä‘Æ¡n náº¿u quÃ¡ 30 phÃºt khÃ´ng thanh toÃ¡n.
   * Stock sáº½ Ä‘Æ°á»£c restock thÃ´ng qua updateOrderStatus â†’ CANCELLED.
   */
  @Cron('*/15 * * * *') // má»—i 15 phÃºt
  async reconcileStalePayments() {
    try {
      const cutoff = new Date(Date.now() - this.stalePaymentTtlMs);
      const stale = await this.ordersRepository.find({
        where: {
          orderStatus: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.UNPAID,
          paymentMethod: In([
            PaymentMethod.MOMO,
            PaymentMethod.VNPAY,
            PaymentMethod.ZALOPAY,
            PaymentMethod.BANK_TRANSFER,
            PaymentMethod.PAYPAL,
          ]),
          createdAt: LessThan(cutoff),
        },
        take: 100, // batch nhá» Ä‘á»ƒ trÃ¡nh ngháº½n DB
      });

      if (stale.length === 0) return;

      this.logger.log(
        `[reconcileStalePayments] Found ${stale.length} stale unpaid orders`,
      );

      for (const order of stale) {
        try {
          // Kiá»ƒm tra cÃ³ PaymentTransaction SUCCESS chÆ°a (case race condition)
          const succeeded = await this.paymentTransactionsRepository.findOne({
            where: {
              orderId: order.orderId,
              transactionStatus: PaymentTransactionStatus.SUCCESS,
            },
          });
          if (succeeded) {
            order.paymentStatus = PaymentStatus.PAID;
            await this.ordersRepository.save(order);
            continue;
          }

          // Auto-cancel + restock
          await this.ordersRepository.manager.transaction(async (em) => {
            const items = await em.find(OrderItemEntity, {
              where: { orderId: order.orderId },
            });
            // Restock tá»«ng item
            for (const item of items) {
              const product = await em.findOne(ProductEntity, {
                where: { productId: item.productId },
                lock: { mode: 'pessimistic_write' },
              });
              if (product) {
                product.quantityAvailable += item.quantity;
                product.quantityReserved = Math.max(
                  0,
                  (product.quantityReserved ?? 0) - item.quantity,
                );
                await em.save(ProductEntity, product);
              }
              await em.save(
                InventoryTransactionEntity,
                em.create(InventoryTransactionEntity, {
                  productId: item.productId,
                  performedBy: null,
                  transactionType: InventoryTransactionType.RETURN_IN,
                  quantityChange: item.quantity,
                  referenceType: 'ORDER',
                  referenceId: order.orderId,
                  note: 'Auto-cancel by reconciliation (unpaid > 30min)',
                  relatedOrderId: order.orderId,
                }),
              );
            }
            order.orderStatus = OrderStatus.CANCELLED;
            order.paymentStatus = PaymentStatus.FAILED;
            await em.save(OrderEntity, order);
            await em.save(
              OrderStatusHistoryEntity,
              em.create(OrderStatusHistoryEntity, {
                orderId: order.orderId,
                oldStatus: OrderStatus.PENDING,
                newStatus: OrderStatus.CANCELLED,
                changedBy: null,
                note: 'Auto-cancelled by reconciliation cron (unpaid > 30 min)',
              }),
            );
          });
          this.logger.log(
            `[reconcileStalePayments] Cancelled order ${order.orderId}`,
          );
        } catch (err) {
          this.logger.error(
            `[reconcileStalePayments] Failed for order ${order.orderId}`,
            err instanceof Error ? err.stack : String(err),
          );
        }
      }
    } catch (err) {
      this.logger.error(
        '[reconcileStalePayments] Top-level error',
        err instanceof Error ? err.stack : String(err),
      );
    }
  }

  async findPaymentTransactions(currentUser: IUser, orderId: string) {
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

  async findAllPaymentTransactions(params: {
    page: number;
    limit: number;
    provider?: string;
    status?: string;
  }) {
    const { page, limit, provider, status } = params;
    const skip = (page - 1) * limit;

    const query = this.paymentTransactionsRepository.createQueryBuilder('pt');
    if (provider) query.andWhere('pt.provider = :provider', { provider });
    if (status) query.andWhere('pt.transactionStatus = :status', { status });
    query.orderBy('pt.createdAt', 'DESC').skip(skip).take(limit);

    const [items, total] = await query.getManyAndCount();

    // Fetch user info in bulk
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
          username: userMap.get(i.userId)!.username,
          email: userMap.get(i.userId)!.email,
        } : null,
      })),
    };
  }

  async findAllRefunds(params: {
    page: number;
    limit: number;
    status?: string;
    reason?: string;
    orderId?: string;
  }) {
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
      ? await this.ordersRepository.find({ where: { orderId: In(orderIds) } })
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

  async createCancelPaidOrderRefund(
    currentUser: IUser,
    dto: CreateCancelPaidRefundDto,
  ) {
    await this.ensureUserExists(currentUser._id);
    const order = await this.findAnyOrder(dto.orderId);

    if (
      ![OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(order.orderStatus)
    ) {
      throw new BadRequestException('ORDER_NOT_ELIGIBLE_FOR_CANCEL_REFUND');
    }
    if (order.paymentStatus !== PaymentStatus.PAID) {
      throw new BadRequestException('ORDER_PAYMENT_NOT_PAID');
    }

    const duplicate = await this.orderRefundsRepository.findOne({
      where: {
        orderId: order.orderId,
        reason: OrderRefundReason.CANCEL_PAID_ORDER,
        refundStatus: In([OrderRefundStatus.PENDING, OrderRefundStatus.APPROVED]),
      },
    });
    if (duplicate) {
      throw new BadRequestException('OPEN_CANCEL_REFUND_ALREADY_EXISTS');
    }

    const completedRefunds = await this.getCompletedRefundAmount(order.orderId);
    const refundable = Math.max(0, Number(order.totalPayment) - completedRefunds);
    const amount = dto.amount ?? refundable;
    if (!Number.isFinite(amount) || amount <= 0 || amount > refundable) {
      throw new BadRequestException('REFUND_AMOUNT_EXCEEDS_AVAILABLE');
    }

    return this.orderRefundsRepository.save(
      this.orderRefundsRepository.create({
        orderId: order.orderId,
        returnId: null,
        reason: OrderRefundReason.CANCEL_PAID_ORDER,
        refundStatus: OrderRefundStatus.PENDING,
        amount: amount.toFixed(2),
        paymentProvider: order.paymentMethod,
        manualReference: null,
        note: dto.note ?? 'Pending paid order cancellation refund',
        createdBy: currentUser._id,
        updatedBy: currentUser._id,
      }),
    );
  }

  async updateRefundStatus(
    currentUser: IUser,
    refundId: string,
    dto: UpdateRefundStatusDto,
  ) {
    await this.ensureUserExists(currentUser._id);
    const refund = await this.orderRefundsRepository.findOneBy({ refundId });
    if (!refund) {
      throw new NotFoundException('Refund not found');
    }
    if (refund.refundStatus === OrderRefundStatus.COMPLETED) {
      throw new BadRequestException('Refund already completed');
    }
    if (
      dto.status === OrderRefundStatus.COMPLETED &&
      !(dto.manualReference?.trim() || dto.note?.trim() || refund.manualReference)
    ) {
      throw new BadRequestException('REFUND_COMPLETION_REFERENCE_REQUIRED');
    }

    refund.refundStatus = dto.status;
    refund.manualReference =
      dto.manualReference?.trim() || refund.manualReference || null;
    refund.note = dto.note?.trim() || refund.note;
    refund.updatedBy = currentUser._id;

    await this.ordersRepository.manager.transaction(async (em) => {
      await em.save(OrderRefundEntity, refund);

      if (dto.status !== OrderRefundStatus.COMPLETED) {
        return;
      }

      const order = await em.findOne(OrderEntity, {
        where: { orderId: refund.orderId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (refund.reason === OrderRefundReason.CANCEL_PAID_ORDER) {
        if (order.orderStatus === OrderStatus.CANCELLED) {
          return;
        }
        if (
          ![OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(order.orderStatus)
        ) {
          throw new BadRequestException('ORDER_NOT_ELIGIBLE_FOR_CANCEL_REFUND');
        }

        await this.restockOrderItems(
          order.orderId,
          em.getRepository(ProductEntity),
          em.getRepository(OrderItemEntity),
          em,
          {
            performedBy: currentUser._id,
            note: 'Restock after paid order refund completion',
          },
        );
        await this.revertDiscountUsage(
          order,
          em.getRepository(DiscountEntity),
          em.getRepository(CouponUsageEntity),
        );
        order.orderStatus = OrderStatus.CANCELLED;
        order.paymentStatus = PaymentStatus.REFUNDED;
        await em.save(OrderEntity, order);
        await em.save(
          OrderStatusHistoryEntity,
          em.create(OrderStatusHistoryEntity, {
            orderId: order.orderId,
            oldStatus: OrderStatus.PENDING,
            newStatus: OrderStatus.CANCELLED,
            changedBy: currentUser._id,
            note: 'Cancel paid order after manual refund completion',
          }),
        );
      }

      if (refund.reason === OrderRefundReason.RETURN && refund.returnId) {
        const returnRequest = await em.findOne(ReturnEntity, {
          where: { returnId: refund.returnId },
        });
        if (returnRequest) {
          returnRequest.refundAmount = refund.amount;
          returnRequest.refundedQuantity = returnRequest.returnQuantity;
          returnRequest.returnStatus = ReturnStatus.REFUNDED;
          await em.save(ReturnEntity, returnRequest);
        }
        if (Number(refund.amount) >= Number(order.totalPayment)) {
          order.paymentStatus = PaymentStatus.REFUNDED;
          await em.save(OrderEntity, order);
        }
      }
    });

    return this.orderRefundsRepository.findOneBy({ refundId });
  }

  async createReturn(userId: string, createReturnDto: CreateReturnDto) {
    await this.ensureUserExists(userId);
    const order = await this.findOwnedOrder(userId, createReturnDto.orderId);

    if (
      ![OrderStatus.DELIVERED, OrderStatus.PARTIAL_DELIVERED].includes(
        order.orderStatus,
      )
    ) {
      throw new BadRequestException('RETURN_NOT_DELIVERED_YET');
    }
    const returnWindow = await this.getOrderReturnWindow(order);
    if (!returnWindow.canCreateReturn) {
      throw new BadRequestException(returnWindow.returnBlockedReason);
    }

    const orderItem = await this.orderItemsRepository.findOneBy({
      orderItemId: createReturnDto.orderItemId,
      orderId: order.orderId,
    });
    if (!orderItem) {
      throw new NotFoundException('Order item not found');
    }

    const deliveredQuantity = this.getDeliveredQuantityForReturn(orderItem);
    if (deliveredQuantity <= 0) {
      throw new BadRequestException('Item has not been delivered');
    }

    const alreadyReturned = await this.getReturnedQuantityForItem(
      createReturnDto.orderItemId,
    );
    const remainingReturnable = Math.max(0, deliveredQuantity - alreadyReturned);
    if (createReturnDto.returnQuantity > remainingReturnable) {
      throw new BadRequestException(
        `RETURN_QUANTITY_EXCEEDS_AVAILABLE:${remainingReturnable}`,
      );
    }

    const maxRefundableAmount = this.calculateLineRefundAmount(
      orderItem,
      createReturnDto.returnQuantity,
    );

    const created = this.returnsRepository.create({
      orderId: order.orderId,
      orderItemId: createReturnDto.orderItemId,
      returnQuantity: createReturnDto.returnQuantity,
      userId,
      reason: createReturnDto.reason,
      description: createReturnDto.description ?? null,
      returnStatus: ReturnStatus.REQUESTED,
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

  async findMyReturns(
    userId: string,
    query: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      from?: string;
      to?: string;
    } = {},
  ) {
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
            where: { orderItemId: In(orderItemIds) },
          })
        : Promise.resolve([]),
      orderIds.length
        ? this.ordersRepository.find({ where: { orderId: In(orderIds) } })
        : Promise.resolve([]),
    ]);
    const orderItemMap = new Map(orderItems.map((item) => [item.orderItemId, item]));
    const orderMap = new Map(orders.map((order) => [order.orderId, order]));
    const itemImageMap = await this.getOrderItemImageMap(orderItems);

    const enriched = await Promise.all(
      items.map(async (item) => {
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
      }),
    );
    const fromTime = query.from ? new Date(query.from).getTime() : null;
    const toTime = query.to ? new Date(query.to).getTime() : null;
    const filtered = enriched.filter((item) => {
      if (query.status && query.status !== 'all' && item.status !== query.status) return false;
      const createdTime = new Date(item.createdAt).getTime();
      if (fromTime && createdTime < fromTime) return false;
      if (toTime && createdTime > toTime + 24 * 60 * 60 * 1000 - 1) return false;
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
        if (!haystack.includes(normalizedSearch)) return false;
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
          where: { orderItemId: In(orderItemIds) },
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
        ? this.getDeliveredQuantityForReturn(orderItemMap.get(item.orderItemId)!)
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

  async updateReturnStatus(
    currentUser: IUser,
    returnId: string,
    updateReturnStatusDto: UpdateReturnStatusDto,
  ) {
    await this.ensureUserExists(currentUser._id);
    const returnRequest = await this.returnsRepository.findOneBy({ returnId });
    if (!returnRequest) {
      throw new NotFoundException('Return request not found');
    }

    if (
      returnRequest.returnStatus !== updateReturnStatusDto.status &&
      !this.validateReturnStatusTransition(
        returnRequest.returnStatus,
        updateReturnStatusDto.status,
      )
    ) {
      throw new BadRequestException('Invalid return status transition');
    }

    const orderItem = await this.orderItemsRepository.findOneBy({
      orderItemId: returnRequest.orderItemId,
    });
    if (!orderItem) {
      throw new NotFoundException('Order item not found');
    }

    if (updateReturnStatusDto.status === ReturnStatus.RECEIVED) {
      // RECEIVED: chá»‰ Ä‘Ã¡nh dáº¥u Ä‘Ã£ nháº­n, KHÃ”NG tá»± restock.
      // HÃ ng pháº£i qua inspection (admin gá»i PATCH /returns/:id/inspect)
      // Ä‘á»ƒ quyáº¿t Ä‘á»‹nh nháº­p kho / bÃ¡o há»ng / tráº£ NCC.
      returnRequest.inspectionStatus = ReturnInspectionStatus.PENDING;
    }

    returnRequest.returnStatus = updateReturnStatusDto.status;
    if (updateReturnStatusDto.status === ReturnStatus.REFUNDED) {
      if (returnRequest.inspectionStatus === ReturnInspectionStatus.PENDING) {
        throw new BadRequestException('RETURN_INSPECTION_REQUIRED');
      }
      const requestedRefund = Number(
        updateReturnStatusDto.refundAmount ?? returnRequest.maxRefundableAmount,
      );
      const maxRefund = Number(returnRequest.maxRefundableAmount);
      if (!Number.isFinite(requestedRefund) || requestedRefund <= 0) {
        throw new BadRequestException('INVALID_REFUND_AMOUNT');
      }
      if (requestedRefund > maxRefund) {
        throw new BadRequestException('REFUND_AMOUNT_EXCEEDS_MAX');
      }
      returnRequest.refundAmount =
        updateReturnStatusDto.refundAmount ?? returnRequest.maxRefundableAmount;
      returnRequest.refundedQuantity = returnRequest.returnQuantity;
      const order = await this.findAnyOrder(returnRequest.orderId);
      const existingRefund = await this.orderRefundsRepository.findOne({
        where: {
          returnId: returnRequest.returnId,
          reason: OrderRefundReason.RETURN,
        },
      });
      if (existingRefund) {
        existingRefund.amount = requestedRefund.toFixed(2);
        existingRefund.refundStatus = OrderRefundStatus.COMPLETED;
        existingRefund.manualReference =
          updateReturnStatusDto.note ?? existingRefund.manualReference;
        existingRefund.note = updateReturnStatusDto.note ?? existingRefund.note;
        existingRefund.updatedBy = currentUser._id;
        await this.orderRefundsRepository.save(existingRefund);
      } else {
        await this.orderRefundsRepository.save(
          this.orderRefundsRepository.create({
            orderId: returnRequest.orderId,
            returnId: returnRequest.returnId,
            reason: OrderRefundReason.RETURN,
            refundStatus: OrderRefundStatus.COMPLETED,
            amount: requestedRefund.toFixed(2),
            paymentProvider: order.paymentMethod,
            manualReference: updateReturnStatusDto.note ?? null,
            note: updateReturnStatusDto.note ?? 'Return refund completed',
            createdBy: currentUser._id,
            updatedBy: currentUser._id,
          }),
        );
      }

      const orderItems = await this.orderItemsRepository.find({
        where: { orderId: order.orderId },
      });
      const allDeliveredQty = orderItems.reduce(
        (sum, item) => sum + this.getDeliveredQuantityForReturn(item),
        0,
      );
      const returnedQtyRows = await this.returnsRepository
        .createQueryBuilder('r')
        .select('COALESCE(SUM(r.return_quantity), 0)', 'quantity')
        .where('r.order_id = :orderId', { orderId: order.orderId })
        .andWhere('r.return_status = :status', {
          status: ReturnStatus.REFUNDED,
        })
        .getRawOne<{ quantity: string }>();
      const refundedQty =
        Number(returnedQtyRows?.quantity ?? 0) + returnRequest.returnQuantity;
      if (allDeliveredQty > 0 && refundedQty >= allDeliveredQty) {
        order.orderStatus = OrderStatus.RETURNED;
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

  /**
   * Admin xÃ¡c nháº­n giao má»™t pháº§n (partial delivery).
   * KhÃ¡ch mua 10 â†’ giao thá»±c táº¿ 6 â†’ cÃ¡c bÆ°á»›c:
   *   1. Cáº­p nháº­t order_items.quantity_delivered cho tá»«ng line
   *   2. Pháº§n chÆ°a giao (4 cÃ¡i) â†’ cá»™ng láº¡i quantityAvailable, giáº£m reserved
   *   3. Táº¡o inventory_transaction RETURN_IN cho pháº§n thiáº¿u
   *   4. Giáº£m reserved cho pháº§n Ä‘Ã£ giao (nhÆ° delivered bÃ¬nh thÆ°á»ng)
   *   5. Äáº·t status = PARTIAL_DELIVERED náº¿u cÃ²n thiáº¿u, DELIVERED náº¿u Ä‘á»§
   *   6. TÃ­nh láº¡i totalPayment theo pháº§n Ä‘Ã£ giao thá»±c táº¿
   *
   * Pháº£i gá»i tá»« status SHIPPING (chá»‰ giao Ä‘Æ°á»£c khi Ä‘ang ship).
   */
  async partialDeliverOrder(
    currentUser: IUser,
    orderId: string,
    items: { orderItemId: string; deliveredQty: number }[],
    note?: string,
  ) {
    await this.ensureUserExists(currentUser._id);
    const order = await this.findAnyOrder(orderId);

    if (order.orderStatus !== OrderStatus.SHIPPING) {
      throw new BadRequestException(
        'Partial delivery chá»‰ thá»±c hiá»‡n khi Ä‘Æ¡n Ä‘ang SHIPPING',
      );
    }

    const orderItems = await this.orderItemsRepository.find({
      where: { orderId: order.orderId },
    });
    const itemMap = new Map(orderItems.map((it) => [it.orderItemId, it]));

    // Validate: deliveredQty khÃ´ng Ä‘Æ°á»£c vÆ°á»£t qty Ä‘áº·t
    for (const dto of items) {
      const oi = itemMap.get(dto.orderItemId);
      if (!oi) {
        throw new BadRequestException(
          `Order item ${dto.orderItemId} khÃ´ng thuá»™c Ä‘Æ¡n nÃ y`,
        );
      }
      if (dto.deliveredQty > oi.quantity) {
        throw new BadRequestException(
          `Sá»‘ lÆ°á»£ng giao (${dto.deliveredQty}) khÃ´ng thá»ƒ vÆ°á»£t sá»‘ Ä‘áº·t (${oi.quantity}) cá»§a ${oi.productName}`,
        );
      }
      if (dto.deliveredQty < 0) {
        throw new BadRequestException('deliveredQty khÃ´ng Ä‘Æ°á»£c Ã¢m');
      }
    }

    let totalDeliveredQty = 0;
    let totalOrderedQty = 0;
    let newSubtotal = 0;

    await withDeadlockRetry(() =>
      this.ordersRepository.manager.transaction(async (em) => {
        for (const dto of items) {
          const oi = itemMap.get(dto.orderItemId)!;
          const undeliveredQty = oi.quantity - dto.deliveredQty;
          totalDeliveredQty += dto.deliveredQty;
          totalOrderedQty += oi.quantity;
          newSubtotal += dto.deliveredQty * Number(oi.unitPrice);

          oi.quantityDelivered = dto.deliveredQty;
          await em.save(OrderItemEntity, oi);

          // Pháº§n Ä‘Ã£ giao: giáº£m reserved (hÃ ng Ä‘Ã£ rá»i kho tháº­t)
          // Pháº§n KHÃ”NG giao: cá»™ng láº¡i quantityAvailable + giáº£m reserved
          if (oi.quantity > 0) {
            const product = await em.findOne(ProductEntity, {
              where: { productId: oi.productId },
              lock: { mode: 'pessimistic_write' },
            });
            if (!product) continue;

            const releaseReserved = oi.quantity; // toÃ n bá»™ qty cá»§a line
            product.quantityReserved = Math.max(
              0,
              (product.quantityReserved ?? 0) - releaseReserved,
            );
            // Cá»™ng láº¡i pháº§n thiáº¿u vÃ o available
            if (undeliveredQty > 0) {
              const qtyBefore = product.quantityAvailable;
              product.quantityAvailable += undeliveredQty;
              await em.save(ProductEntity, product);

              await em.save(
                InventoryTransactionEntity,
                em.create(InventoryTransactionEntity, {
                  productId: product.productId,
                  performedBy: currentUser._id,
                  transactionType: InventoryTransactionType.RETURN_IN,
                  quantityChange: undeliveredQty,
                  quantityBefore: qtyBefore,
                  quantityAfter: product.quantityAvailable,
                  referenceType: 'ORDER',
                  referenceId: order.orderId,
                  unitCostAtTime: product.avgCost ?? null,
                  note: `Partial delivery: ${dto.deliveredQty}/${oi.quantity} delivered, ${undeliveredQty} restocked`,
                  relatedOrderId: order.orderId,
                }),
              );
              await this.syncDefaultWarehouseStock(
                em,
                product.productId,
                undeliveredQty,
              );
            } else {
              await em.save(ProductEntity, product);
            }
          }
        }

        // Cáº­p nháº­t order: status + total
        const isFullyDelivered = totalDeliveredQty === totalOrderedQty;
        order.orderStatus = isFullyDelivered
          ? OrderStatus.DELIVERED
          : OrderStatus.PARTIAL_DELIVERED;
        order.totalQuantity = totalDeliveredQty;
        // Recalc totalPayment = subtotal má»›i - discount + delivery
        const newTotalPayment =
          newSubtotal -
          Number(order.discountAmount) +
          Number(order.deliveryCost);
        order.subtotalAmount = newSubtotal.toFixed(2);
        order.totalPayment = Math.max(0, newTotalPayment).toFixed(2);

        // COD: chá»‰ PAID náº¿u giao Ä‘á»§
        if (
          isFullyDelivered &&
          order.paymentMethod === PaymentMethod.COD
        ) {
          order.paymentStatus = PaymentStatus.PAID;
        }

        await em.save(OrderEntity, order);
        await em.save(
          OrderStatusHistoryEntity,
          em.create(OrderStatusHistoryEntity, {
            orderId: order.orderId,
            oldStatus: OrderStatus.SHIPPING,
            newStatus: order.orderStatus,
            changedBy: currentUser._id,
            note:
              note ??
              `Partial delivery: ${totalDeliveredQty}/${totalOrderedQty}`,
          }),
        );
      }),
    );

    await this.notificationsService.sendOrderStatusNotification(
      order.userId,
      order.orderId,
      order.orderStatus,
    );

    return this.buildOrderDetail(await this.findAnyOrder(order.orderId));
  }

  /**
   * Admin kiá»ƒm tra hÃ ng tráº£ vá» vÃ  quyáº¿t Ä‘á»‹nh:
   *   USABLE             â†’ nháº­p láº¡i kho chÃ­nh
   *   DAMAGED            â†’ ghi DAMAGE adjustment, KHÃ”NG nháº­p kho (loss)
   *   RETURN_TO_SUPPLIER â†’ Ä‘Ã¡nh dáº¥u Ä‘á»ƒ admin táº¡o Supplier Return riÃªng
   *
   * Chá»‰ cháº¡y Ä‘Æ°á»£c khi return Ä‘Ã£ RECEIVED + inspectionStatus = PENDING.
   */
  async inspectReturn(
    currentUser: IUser,
    returnId: string,
    decision: ReturnInspectionStatus,
    note?: string,
  ) {
    await this.ensureUserExists(currentUser._id);
    if (decision === ReturnInspectionStatus.PENDING) {
      throw new BadRequestException('Decision khÃ´ng thá»ƒ lÃ  PENDING');
    }

    const returnRequest = await this.returnsRepository.findOneBy({ returnId });
    if (!returnRequest) {
      throw new NotFoundException('Return request not found');
    }
    if (returnRequest.returnStatus !== ReturnStatus.RECEIVED) {
      throw new BadRequestException(
        'Chá»‰ cÃ³ thá»ƒ inspect return Ä‘Ã£ RECEIVED',
      );
    }
    if (returnRequest.inspectionStatus !== ReturnInspectionStatus.PENDING) {
      throw new BadRequestException(
        `Return nÃ y Ä‘Ã£ Ä‘Æ°á»£c inspect (${returnRequest.inspectionStatus})`,
      );
    }

    const orderItem = await this.orderItemsRepository.findOneBy({
      orderItemId: returnRequest.orderItemId,
    });
    if (!orderItem) throw new NotFoundException('Order item not found');

    await this.ordersRepository.manager.transaction(async (em) => {
      const product = await em.findOne(ProductEntity, {
        where: { productId: orderItem.productId },
        lock: { mode: 'pessimistic_write' },
      });

      if (decision === ReturnInspectionStatus.USABLE && product) {
        // Nháº­p láº¡i kho chÃ­nh
        const returnQty = returnRequest.returnQuantity;
        const qtyBefore = product.quantityAvailable;
        product.quantityAvailable += returnQty;
        await em.save(ProductEntity, product);

        if (orderItem.variantId) {
          const variant = await em.findOne(ProductVariantEntity, {
            where: { variantId: orderItem.variantId },
            lock: { mode: 'pessimistic_write' },
          });
          if (variant) {
            variant.stockQuantity += returnQty;
            await em.save(ProductVariantEntity, variant);
          }
        }

        await em.save(
          InventoryTransactionEntity,
          em.create(InventoryTransactionEntity, {
            productId: product.productId,
            performedBy: currentUser._id,
            transactionType: InventoryTransactionType.RETURN_IN,
            quantityChange: returnQty,
            quantityBefore: qtyBefore,
            quantityAfter: product.quantityAvailable,
            referenceType: 'RETURN',
            referenceId: String(returnRequest.returnId),
            unitCostAtTime: product.avgCost ?? null,
            note: note ?? 'Return inspection: USABLE â€” restocked',
            relatedOrderId: returnRequest.orderId,
          }),
        );
        await this.syncDefaultWarehouseStock(
          em,
          product.productId,
          returnQty,
        );
      } else if (decision === ReturnInspectionStatus.DAMAGED && product) {
        // Há»ng â€” KHÃ”NG nháº­p kho. Ghi DAMAGE inventory_transaction (loss).
        await em.save(
          InventoryTransactionEntity,
          em.create(InventoryTransactionEntity, {
            productId: product.productId,
            performedBy: currentUser._id,
            transactionType: InventoryTransactionType.DAMAGE,
            quantityChange: 0, // khÃ´ng thay Ä‘á»•i tá»“n (vÃ¬ chÆ°a nháº­p)
            quantityBefore: product.quantityAvailable,
            quantityAfter: product.quantityAvailable,
            referenceType: 'RETURN',
            referenceId: String(returnRequest.returnId),
            unitCostAtTime: product.avgCost ?? null,
            note: note ?? `Return inspection: DAMAGED â€” written off ${orderItem.quantity} unit(s)`,
            relatedOrderId: returnRequest.orderId,
          }),
        );
      }
      // RETURN_TO_SUPPLIER: khÃ´ng Ä‘á»™ng vÃ o kho. Admin sáº½ táº¡o Supplier Return riÃªng.

      returnRequest.inspectionStatus = decision;
      returnRequest.inspectionNote = note ?? null;
      returnRequest.inspectedBy = currentUser._id;
      returnRequest.inspectedAt = new Date();
      returnRequest.returnStatus = ReturnStatus.INSPECTED;
      await em.save(ReturnEntity, returnRequest);
    });

    return this.returnsRepository.findOneBy({ returnId });
  }

  /**
   * Admin xÃ¡c nháº­n thanh toÃ¡n thá»§ cÃ´ng cho Ä‘Æ¡n non-COD (BANK_TRANSFER, online chÆ°a tá»± ghi nháº­n).
   */
  async confirmPayment(currentUser: IUser, orderId: string) {
    await this.ensureUserExists(currentUser._id);
    const order = await this.findAnyOrder(orderId);

    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('ÄÆ¡n hÃ ng Ä‘Ã£ Ä‘Æ°á»£c thanh toÃ¡n');
    }
    if (order.paymentMethod === PaymentMethod.COD) {
      throw new BadRequestException('COD tá»± Ä‘á»™ng ghi nháº­n khi giao â€” khÃ´ng cáº§n xÃ¡c nháº­n thá»§ cÃ´ng');
    }
    if (order.paymentMethod === PaymentMethod.CREDIT) {
      throw new BadRequestException('ÄÆ¡n hÃ ng mua ná»£ â€” cÃ´ng ná»£ Ä‘Æ°á»£c quáº£n lÃ½ riÃªng qua háº¡n má»©c tÃ­n dá»¥ng');
    }

    order.paymentStatus = PaymentStatus.PAID;
    await this.ordersRepository.save(order);

    const tx = this.paymentTransactionsRepository.create({
      orderId: order.orderId,
      userId: order.userId,
      provider: order.paymentMethod,
      transactionRef: `manual-${Date.now()}`,
      transactionStatus: PaymentTransactionStatus.SUCCESS,
      paymentStatus: PaymentStatus.PAID,
      amount: order.totalPayment,
      gatewayCode: 'MANUAL',
      gatewayMessage: `XÃ¡c nháº­n thá»§ cÃ´ng bá»Ÿi admin ${currentUser._id}`,
      rawPayload: { confirmedBy: currentUser._id, confirmedAt: new Date().toISOString() },
    });
    await this.paymentTransactionsRepository.save(tx);

    await this.notificationsService.sendPaymentNotification(
      order.userId,
      orderId,
      PaymentStatus.PAID,
      order.paymentMethod,
    );

    return this.buildOrderDetail(await this.findAnyOrder(orderId));
  }

  /**
   * KhÃ¡ch hÃ ng xÃ¡c nháº­n Ä‘Ã£ nháº­n hÃ ng (khi Ä‘Æ¡n Ä‘ang SHIPPING).
   * Chuyá»ƒn â†’ DELIVERED + giáº£i phÃ³ng reserved + COD tá»± PAID.
   */
  async confirmReceivedByCustomer(currentUser: IUser, orderId: string) {
    await this.ensureUserExists(currentUser._id);
    const order = await this.findOrderDetail(currentUser, orderId);

    if (order.status !== OrderStatus.SHIPPING) {
      throw new BadRequestException('Chá»‰ cÃ³ thá»ƒ xÃ¡c nháº­n nháº­n hÃ ng khi Ä‘Æ¡n Ä‘ang Ä‘Æ°á»£c giao');
    }

    await this.ordersRepository.manager.transaction(async (em) => {
      const transactionalProductsRepo = em.getRepository(ProductEntity);
      const transactionalOrderItemsRepo = em.getRepository(OrderItemEntity);

      await this.releaseReservedOnDelivered(
        orderId,
        transactionalProductsRepo,
        transactionalOrderItemsRepo,
      );

      const dbOrder = await em.getRepository(OrderEntity).findOneBy({ orderId });
      if (!dbOrder) return;

      dbOrder.orderStatus = OrderStatus.DELIVERED;
      if (dbOrder.paymentMethod === PaymentMethod.COD) {
        dbOrder.paymentStatus = PaymentStatus.PAID;
      }

      await em.save(OrderEntity, dbOrder);
      await em.save(
        OrderStatusHistoryEntity,
        em.create(OrderStatusHistoryEntity, {
          orderId,
          oldStatus: OrderStatus.SHIPPING,
          newStatus: OrderStatus.DELIVERED,
          changedBy: currentUser._id,
          note: 'Khách hàng xác nhận đã nhận hàng',
        }),
      );
    });

    const updated = await this.findAnyOrder(orderId);
    await this.notificationsService.sendOrderStatusNotification(
      updated.userId,
      orderId,
      OrderStatus.DELIVERED,
    );

    if (updated.userId) {
      void this.membershipService.recalculateAndReward(updated.userId);
    }

    return this.buildOrderDetail(updated);
  }
}

