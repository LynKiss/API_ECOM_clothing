import { PaymentMethod } from '../entities/order.entity';
export declare class CreateOrderDto {
    shippingAddressId: string;
    deliveryId: string;
    paymentMethod: PaymentMethod;
    note?: string;
    discountCode?: string;
    allowBackorder?: boolean;
}
