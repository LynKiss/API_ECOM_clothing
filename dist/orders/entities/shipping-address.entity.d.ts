export declare class ShippingAddressEntity {
    shippingAddressId: string;
    userId: string;
    recipientName: string;
    phone: string;
    addressLine: string;
    ward: string | null;
    district: string | null;
    province: string | null;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}
