export declare class DeliveryMethodEntity {
    deliveryId: string;
    name: string;
    description: string | null;
    basePrice: string;
    minOrderAmount: string;
    region: string | null;
    isActive: boolean;
    isDefault: boolean;
    isPickup: boolean;
    createdAt: Date;
    updatedAt: Date;
}
