export declare class ProductBundleEntity {
    bundleId: string;
    bundleCode: string;
    bundleName: string;
    description: string | null;
    bundlePrice: string;
    imageUrl: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ProductBundleItemEntity {
    bundleItemId: string;
    bundleId: string;
    productId: string;
    componentQty: number;
    createdAt: Date;
}
