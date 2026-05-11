export declare enum OrderStatus {
    PENDING = "pending",
    BACKORDERED = "backordered",
    CONFIRMED = "confirmed",
    PROCESSING = "processing",
    SHIPPING = "shipping",
    DELIVERED = "delivered",
    PARTIAL_DELIVERED = "partial_delivered",
    CANCELLED = "cancelled",
    RETURNED = "returned"
}
export declare enum PaymentMethod {
    COD = "cod",
    BANK_TRANSFER = "bank_transfer",
    MOMO = "momo",
    VNPAY = "vnpay",
    ZALOPAY = "zalopay",
    PAYPAL = "paypal",
    CREDIT = "credit"
}
export declare enum PaymentStatus {
    UNPAID = "unpaid",
    PAID = "paid",
    FAILED = "failed",
    REFUNDED = "refunded"
}
export declare class OrderEntity {
    orderId: string;
    userId: string;
    shippingAddressId: string | null;
    deliveryId: string | null;
    discountId: string | null;
    orderStatus: OrderStatus;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    subtotalAmount: string;
    discountAmount: string;
    deliveryCost: string;
    totalPayment: string;
    totalQuantity: number;
    note: string | null;
    fullName: string;
    phone: string;
    address: string;
    idempotencyKey: string | null;
    createdAt: Date;
    updatedAt: Date;
}
