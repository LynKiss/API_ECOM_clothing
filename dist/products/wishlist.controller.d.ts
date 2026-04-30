import type { IUser } from '../users/users.interface';
import { ProductsService } from './products.service';
export declare class WishlistController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    getWishlist(currentUser: IUser): Promise<{
        productId: string;
        createdAt: Date;
        product: {
            category: {
                categoryId: string;
                categoryName: string;
            } | null;
            primaryImageUrl: string | null;
            basePrice: string;
            effectivePrice: string;
            appliedDiscount: {
                id: string;
                code: string;
                name: string;
                type: import("../discounts/entities/discount.entity").DiscountType;
                value: string;
                appliesTo: import("../discounts/entities/discount.entity").DiscountApplyTarget;
            } | null;
            productId: string;
            productName: string;
            productSlug: string;
            categoryId: string;
            subcategoryId: string | null;
            originId: string | null;
            gender: "men" | "women" | "unisex" | "kids";
            material: string | null;
            fitType: string | null;
            style: string | null;
            productPrice: string;
            productPriceSale: string | null;
            quantityAvailable: number;
            quantityReserved: number;
            avgCost: string;
            description: string | null;
            ratingAverage: string;
            ratingCount: number;
            isShow: boolean;
            isFeatured: boolean;
            expiredAt: Date | null;
            unit: string | null;
            quantityPerBox: number | null;
            barcode: string | null;
            boxBarcode: string | null;
            costPrice: string | null;
            bulkPrice: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    }[]>;
    addWishlistItem(currentUser: IUser, productId: string): Promise<import("./entities/wishlist.entity").WishlistEntity>;
    removeWishlistItem(currentUser: IUser, productId: string): Promise<{
        success: boolean;
    }>;
}
