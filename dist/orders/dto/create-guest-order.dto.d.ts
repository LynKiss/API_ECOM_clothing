import { PaymentMethod } from '../entities/order.entity';
export declare class GuestOrderItemDto {
    productId: string;
    variantId?: string;
    quantity: number;
}
export declare class GuestShippingDto {
    recipientName: string;
    phone: string;
    email?: string;
    addressLine: string;
    ward?: string;
    district?: string;
    province: string;
}
export declare class CreateGuestOrderDto {
    shipping: GuestShippingDto;
    deliveryId: string;
    paymentMethod: PaymentMethod;
    items: GuestOrderItemDto[];
    note?: string;
    discountCode?: string;
    allowBackorder?: boolean;
}
