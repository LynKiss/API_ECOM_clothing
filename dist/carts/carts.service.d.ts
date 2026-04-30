import { Repository } from 'typeorm';
import { ColorEntity } from '../products/entities/color.entity';
import { ProductImageEntity } from '../products/entities/product-image.entity';
import { ProductVariantEntity } from '../products/entities/product-variant.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { SizeEntity } from '../products/entities/size.entity';
import { VariantImageEntity } from '../products/entities/variant-image.entity';
import { UserEntity } from '../users/entities/user.entity';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartItemEntity } from './entities/cart-item.entity';
import { ShoppingCartEntity } from './entities/shopping-cart.entity';
export declare class CartsService {
    private readonly cartsRepository;
    private readonly cartItemsRepository;
    private readonly productsRepository;
    private readonly productImagesRepository;
    private readonly productVariantsRepository;
    private readonly variantImagesRepository;
    private readonly colorsRepository;
    private readonly sizesRepository;
    private readonly usersRepository;
    constructor(cartsRepository: Repository<ShoppingCartEntity>, cartItemsRepository: Repository<CartItemEntity>, productsRepository: Repository<ProductEntity>, productImagesRepository: Repository<ProductImageEntity>, productVariantsRepository: Repository<ProductVariantEntity>, variantImagesRepository: Repository<VariantImageEntity>, colorsRepository: Repository<ColorEntity>, sizesRepository: Repository<SizeEntity>, usersRepository: Repository<UserEntity>);
    private ensureUserExists;
    private getEffectivePrice;
    private toCartItemResponse;
    private getOrCreateCart;
    private findOwnedCartItem;
    private findAvailableProduct;
    private findAvailableVariant;
    private findCartLine;
    private getVariantPresentations;
    getMyCart(userId: string): Promise<{
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
    addItem(userId: string, addCartItemDto: AddCartItemDto): Promise<{
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
    updateItem(userId: string, cartItemId: string, updateCartItemDto: UpdateCartItemDto): Promise<{
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
    deleteItem(userId: string, cartItemId: string): Promise<{
        id: string;
        deleted: boolean;
    }>;
}
