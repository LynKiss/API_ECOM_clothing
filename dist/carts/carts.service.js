"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const color_entity_1 = require("../products/entities/color.entity");
const product_image_entity_1 = require("../products/entities/product-image.entity");
const product_variant_entity_1 = require("../products/entities/product-variant.entity");
const product_entity_1 = require("../products/entities/product.entity");
const size_entity_1 = require("../products/entities/size.entity");
const variant_image_entity_1 = require("../products/entities/variant-image.entity");
const user_entity_1 = require("../users/entities/user.entity");
const cart_item_entity_1 = require("./entities/cart-item.entity");
const shopping_cart_entity_1 = require("./entities/shopping-cart.entity");
let CartsService = class CartsService {
    cartsRepository;
    cartItemsRepository;
    productsRepository;
    productImagesRepository;
    productVariantsRepository;
    variantImagesRepository;
    colorsRepository;
    sizesRepository;
    usersRepository;
    constructor(cartsRepository, cartItemsRepository, productsRepository, productImagesRepository, productVariantsRepository, variantImagesRepository, colorsRepository, sizesRepository, usersRepository) {
        this.cartsRepository = cartsRepository;
        this.cartItemsRepository = cartItemsRepository;
        this.productsRepository = productsRepository;
        this.productImagesRepository = productImagesRepository;
        this.productVariantsRepository = productVariantsRepository;
        this.variantImagesRepository = variantImagesRepository;
        this.colorsRepository = colorsRepository;
        this.sizesRepository = sizesRepository;
        this.usersRepository = usersRepository;
    }
    async ensureUserExists(userId) {
        const user = await this.usersRepository.findOneBy({ userId });
        if (!user) {
            throw new common_1.UnauthorizedException('Nguoi dung khong ton tai');
        }
    }
    getEffectivePrice(product, variant) {
        if (variant) {
            return variant.salePrice ?? variant.price ?? product.productPriceSale ?? product.productPrice;
        }
        return product.productPriceSale ?? product.productPrice;
    }
    toCartItemResponse(item, product, productImageUrl, variantInfo) {
        const unitPrice = item.priceAtAdded;
        const quantity = item.quantity;
        const lineTotal = (Number(unitPrice) * quantity).toFixed(2);
        return {
            id: item.cartItemId,
            productId: item.productId,
            variantId: item.variantId,
            sku: variantInfo?.variant.sku ?? null,
            productName: product?.productName ?? null,
            primaryImageUrl: variantInfo?.imageUrl ?? productImageUrl ?? null,
            color: variantInfo?.color
                ? {
                    colorId: variantInfo.color.colorId,
                    colorName: variantInfo.color.colorName,
                    colorCode: variantInfo.color.colorCode,
                }
                : null,
            size: variantInfo?.size
                ? {
                    sizeId: variantInfo.size.sizeId,
                    sizeName: variantInfo.size.sizeName,
                    sizeCode: variantInfo.size.sizeCode,
                }
                : null,
            quantity,
            unitPrice,
            lineTotal,
            availableQuantity: variantInfo?.variant.stockQuantity ?? product?.quantityAvailable ?? null,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        };
    }
    async getOrCreateCart(userId) {
        let cart = await this.cartsRepository.findOneBy({ userId });
        if (!cart) {
            cart = this.cartsRepository.create({ userId });
            cart = await this.cartsRepository.save(cart);
        }
        return cart;
    }
    async findOwnedCartItem(userId, cartItemId) {
        const cart = await this.getOrCreateCart(userId);
        const item = await this.cartItemsRepository.findOneBy({
            cartItemId,
            cartId: cart.cartId,
        });
        if (!item) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        return { cart, item };
    }
    async findAvailableProduct(productId) {
        const product = await this.productsRepository.findOneBy({ productId });
        if (!product || !product.isShow) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async findAvailableVariant(product, variantId) {
        const variants = await this.productVariantsRepository.find({
            where: { productId: product.productId },
        });
        if (variants.length === 0) {
            return null;
        }
        if (!variantId) {
            throw new common_1.BadRequestException('Vui long chon mau sac va kich thuoc');
        }
        const selected = variants.find((variant) => variant.variantId === variantId);
        if (!selected || !selected.isActive) {
            throw new common_1.BadRequestException('Bien the san pham khong kha dung');
        }
        return selected;
    }
    async findCartLine(cartId, productId, variantId) {
        const query = this.cartItemsRepository
            .createQueryBuilder('item')
            .where('item.cart_id = :cartId', { cartId })
            .andWhere('item.product_id = :productId', { productId });
        if (variantId) {
            query.andWhere('item.variant_id = :variantId', { variantId });
        }
        else {
            query.andWhere('item.variant_id IS NULL');
        }
        return query.getOne();
    }
    async getVariantPresentations(variantIds) {
        const variants = variantIds.length
            ? await this.productVariantsRepository.find({ where: { variantId: (0, typeorm_2.In)(variantIds) } })
            : [];
        if (variants.length === 0)
            return new Map();
        const colorIds = [...new Set(variants.map((variant) => variant.colorId).filter((id) => Boolean(id)))];
        const sizeIds = [...new Set(variants.map((variant) => variant.sizeId).filter((id) => Boolean(id)))];
        const [colors, sizes, images] = await Promise.all([
            colorIds.length ? this.colorsRepository.find({ where: { colorId: (0, typeorm_2.In)(colorIds) } }) : Promise.resolve([]),
            sizeIds.length ? this.sizesRepository.find({ where: { sizeId: (0, typeorm_2.In)(sizeIds) } }) : Promise.resolve([]),
            this.variantImagesRepository.find({
                where: { variantId: (0, typeorm_2.In)(variantIds) },
                order: { sortOrder: 'ASC', createdAt: 'ASC' },
            }),
        ]);
        const colorById = new Map(colors.map((color) => [color.colorId, color]));
        const sizeById = new Map(sizes.map((size) => [size.sizeId, size]));
        const imageByVariantId = new Map();
        for (const image of images) {
            if (!imageByVariantId.has(image.variantId)) {
                imageByVariantId.set(image.variantId, image.imageUrl);
            }
        }
        return new Map(variants.map((variant) => [
            variant.variantId,
            {
                variant,
                color: variant.colorId ? colorById.get(variant.colorId) ?? null : null,
                size: variant.sizeId ? sizeById.get(variant.sizeId) ?? null : null,
                imageUrl: imageByVariantId.get(variant.variantId) ?? null,
            },
        ]));
    }
    async getMyCart(userId) {
        await this.ensureUserExists(userId);
        const cart = await this.getOrCreateCart(userId);
        const items = await this.cartItemsRepository.find({
            where: { cartId: cart.cartId },
            order: { createdAt: 'DESC' },
        });
        const productIds = [...new Set(items.map((item) => item.productId))];
        const variantIds = [...new Set(items.map((item) => item.variantId).filter((id) => Boolean(id)))];
        const [products, primaryImages, variantsById] = await Promise.all([
            productIds.length
                ? this.productsRepository.findBy(productIds.map((productId) => ({ productId })))
                : Promise.resolve([]),
            productIds.length
                ? this.productImagesRepository.findBy(productIds.map((productId) => ({ productId, isPrimary: true })))
                : Promise.resolve([]),
            this.getVariantPresentations(variantIds),
        ]);
        const productsById = new Map(products.map((product) => [product.productId, product]));
        const primaryImageByProductId = new Map(primaryImages.map((img) => [img.productId, img.imageUrl]));
        const mappedItems = items.map((item) => this.toCartItemResponse(item, productsById.get(item.productId), primaryImageByProductId.get(item.productId), item.variantId ? variantsById.get(item.variantId) : null));
        const totalQuantity = mappedItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = mappedItems.reduce((sum, item) => sum + Number(item.lineTotal), 0).toFixed(2);
        return {
            id: cart.cartId,
            totalItems: mappedItems.length,
            totalQuantity,
            totalAmount,
            items: mappedItems,
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt,
        };
    }
    async addItem(userId, addCartItemDto) {
        await this.ensureUserExists(userId);
        const cart = await this.getOrCreateCart(userId);
        const product = await this.findAvailableProduct(addCartItemDto.productId);
        const variant = await this.findAvailableVariant(product, addCartItemDto.variantId ?? null);
        const availableQuantity = variant?.stockQuantity ?? product.quantityAvailable;
        const existingItem = await this.findCartLine(cart.cartId, addCartItemDto.productId, variant?.variantId ?? null);
        const nextQuantity = (existingItem?.quantity ?? 0) + addCartItemDto.quantity;
        if (nextQuantity > availableQuantity) {
            throw new common_1.BadRequestException('Quantity exceeds available stock');
        }
        const item = existingItem ??
            this.cartItemsRepository.create({
                cartId: cart.cartId,
                productId: addCartItemDto.productId,
                variantId: variant?.variantId ?? null,
                quantity: 0,
                priceAtAdded: this.getEffectivePrice(product, variant),
            });
        item.quantity = nextQuantity;
        item.priceAtAdded = this.getEffectivePrice(product, variant);
        const [primaryImg, variantsById] = await Promise.all([
            this.productImagesRepository.findOneBy({ productId: product.productId, isPrimary: true }),
            variant ? this.getVariantPresentations([variant.variantId]) : Promise.resolve(new Map()),
        ]);
        const savedItem = await this.cartItemsRepository.save(item);
        return this.toCartItemResponse(savedItem, product, primaryImg?.imageUrl, variant ? variantsById.get(variant.variantId) : null);
    }
    async updateItem(userId, cartItemId, updateCartItemDto) {
        await this.ensureUserExists(userId);
        const { item } = await this.findOwnedCartItem(userId, cartItemId);
        const product = await this.findAvailableProduct(item.productId);
        const variant = item.variantId
            ? await this.productVariantsRepository.findOneBy({ variantId: item.variantId, productId: item.productId })
            : null;
        if (item.variantId && (!variant || !variant.isActive)) {
            throw new common_1.BadRequestException('Bien the san pham khong kha dung');
        }
        const availableQuantity = variant?.stockQuantity ?? product.quantityAvailable;
        if (updateCartItemDto.quantity > availableQuantity) {
            throw new common_1.BadRequestException('Quantity exceeds available stock');
        }
        item.quantity = updateCartItemDto.quantity;
        item.priceAtAdded = this.getEffectivePrice(product, variant);
        const [primaryImg, variantsById] = await Promise.all([
            this.productImagesRepository.findOneBy({ productId: product.productId, isPrimary: true }),
            variant ? this.getVariantPresentations([variant.variantId]) : Promise.resolve(new Map()),
        ]);
        const savedItem = await this.cartItemsRepository.save(item);
        return this.toCartItemResponse(savedItem, product, primaryImg?.imageUrl, variant ? variantsById.get(variant.variantId) : null);
    }
    async deleteItem(userId, cartItemId) {
        await this.ensureUserExists(userId);
        const { item } = await this.findOwnedCartItem(userId, cartItemId);
        await this.cartItemsRepository.delete({ cartItemId: item.cartItemId });
        return {
            id: item.cartItemId,
            deleted: true,
        };
    }
};
exports.CartsService = CartsService;
exports.CartsService = CartsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(shopping_cart_entity_1.ShoppingCartEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(cart_item_entity_1.CartItemEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.ProductEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(product_image_entity_1.ProductImageEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(product_variant_entity_1.ProductVariantEntity)),
    __param(5, (0, typeorm_1.InjectRepository)(variant_image_entity_1.VariantImageEntity)),
    __param(6, (0, typeorm_1.InjectRepository)(color_entity_1.ColorEntity)),
    __param(7, (0, typeorm_1.InjectRepository)(size_entity_1.SizeEntity)),
    __param(8, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CartsService);
//# sourceMappingURL=carts.service.js.map