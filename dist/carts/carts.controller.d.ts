import type { IUser } from '../users/users.interface';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartsService } from './carts.service';
export declare class CartsController {
    private readonly cartsService;
    constructor(cartsService: CartsService);
    getMyCart(currentUser: IUser): Promise<{
        id: string;
        totalItems: number;
        totalQuantity: number;
        totalAmount: string;
        items: {
            id: string;
            productId: string;
            variantId: string | null;
            sku: string | null;
            productName: string | null;
            primaryImageUrl: string | null;
            color: {
                colorId: string;
                colorName: string;
                colorCode: string | null;
            } | null;
            size: {
                sizeId: string;
                sizeName: string;
                sizeCode: string | null;
            } | null;
            quantity: number;
            unitPrice: string;
            lineTotal: string;
            availableQuantity: number | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    addCartItem(currentUser: IUser, addCartItemDto: AddCartItemDto): Promise<{
        id: string;
        productId: string;
        variantId: string | null;
        sku: string | null;
        productName: string | null;
        primaryImageUrl: string | null;
        color: {
            colorId: string;
            colorName: string;
            colorCode: string | null;
        } | null;
        size: {
            sizeId: string;
            sizeName: string;
            sizeCode: string | null;
        } | null;
        quantity: number;
        unitPrice: string;
        lineTotal: string;
        availableQuantity: number | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateCartItem(currentUser: IUser, id: string, updateCartItemDto: UpdateCartItemDto): Promise<{
        id: string;
        productId: string;
        variantId: string | null;
        sku: string | null;
        productName: string | null;
        primaryImageUrl: string | null;
        color: {
            colorId: string;
            colorName: string;
            colorCode: string | null;
        } | null;
        size: {
            sizeId: string;
            sizeName: string;
            sizeCode: string | null;
        } | null;
        quantity: number;
        unitPrice: string;
        lineTotal: string;
        availableQuantity: number | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteCartItem(currentUser: IUser, id: string): Promise<{
        id: string;
        deleted: boolean;
    }>;
}
