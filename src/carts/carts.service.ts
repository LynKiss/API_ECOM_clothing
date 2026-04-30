import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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

type VariantPresentation = {
  variant: ProductVariantEntity;
  color: ColorEntity | null;
  size: SizeEntity | null;
  imageUrl: string | null;
};

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(ShoppingCartEntity)
    private readonly cartsRepository: Repository<ShoppingCartEntity>,
    @InjectRepository(CartItemEntity)
    private readonly cartItemsRepository: Repository<CartItemEntity>,
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
    @InjectRepository(ProductImageEntity)
    private readonly productImagesRepository: Repository<ProductImageEntity>,
    @InjectRepository(ProductVariantEntity)
    private readonly productVariantsRepository: Repository<ProductVariantEntity>,
    @InjectRepository(VariantImageEntity)
    private readonly variantImagesRepository: Repository<VariantImageEntity>,
    @InjectRepository(ColorEntity)
    private readonly colorsRepository: Repository<ColorEntity>,
    @InjectRepository(SizeEntity)
    private readonly sizesRepository: Repository<SizeEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  private async ensureUserExists(userId: string) {
    const user = await this.usersRepository.findOneBy({ userId });
    if (!user) {
      throw new UnauthorizedException('Nguoi dung khong ton tai');
    }
  }

  private getEffectivePrice(product: ProductEntity, variant?: ProductVariantEntity | null) {
    if (variant) {
      return variant.salePrice ?? variant.price ?? product.productPriceSale ?? product.productPrice;
    }
    return product.productPriceSale ?? product.productPrice;
  }

  private toCartItemResponse(
    item: CartItemEntity,
    product?: ProductEntity | null,
    productImageUrl?: string | null,
    variantInfo?: VariantPresentation | null,
  ) {
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

  private async getOrCreateCart(userId: string) {
    let cart = await this.cartsRepository.findOneBy({ userId });
    if (!cart) {
      cart = this.cartsRepository.create({ userId });
      cart = await this.cartsRepository.save(cart);
    }

    return cart;
  }

  private async findOwnedCartItem(userId: string, cartItemId: string) {
    const cart = await this.getOrCreateCart(userId);
    const item = await this.cartItemsRepository.findOneBy({
      cartItemId,
      cartId: cart.cartId,
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    return { cart, item };
  }

  private async findAvailableProduct(productId: string) {
    const product = await this.productsRepository.findOneBy({ productId });
    if (!product || !product.isShow) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  private async findAvailableVariant(product: ProductEntity, variantId?: string | null) {
    const variants = await this.productVariantsRepository.find({
      where: { productId: product.productId },
    });

    if (variants.length === 0) {
      return null;
    }

    if (!variantId) {
      throw new BadRequestException('Vui long chon mau sac va kich thuoc');
    }

    const selected = variants.find((variant) => variant.variantId === variantId);
    if (!selected || !selected.isActive) {
      throw new BadRequestException('Bien the san pham khong kha dung');
    }

    return selected;
  }

  private async findCartLine(cartId: string, productId: string, variantId: string | null) {
    const query = this.cartItemsRepository
      .createQueryBuilder('item')
      .where('item.cart_id = :cartId', { cartId })
      .andWhere('item.product_id = :productId', { productId });

    if (variantId) {
      query.andWhere('item.variant_id = :variantId', { variantId });
    } else {
      query.andWhere('item.variant_id IS NULL');
    }

    return query.getOne();
  }

  private async getVariantPresentations(variantIds: string[]) {
    const variants = variantIds.length
      ? await this.productVariantsRepository.find({ where: { variantId: In(variantIds) } })
      : [];
    if (variants.length === 0) return new Map<string, VariantPresentation>();

    const colorIds = [...new Set(variants.map((variant) => variant.colorId).filter((id): id is string => Boolean(id)))];
    const sizeIds = [...new Set(variants.map((variant) => variant.sizeId).filter((id): id is string => Boolean(id)))];
    const [colors, sizes, images] = await Promise.all([
      colorIds.length ? this.colorsRepository.find({ where: { colorId: In(colorIds) } }) : Promise.resolve([]),
      sizeIds.length ? this.sizesRepository.find({ where: { sizeId: In(sizeIds) } }) : Promise.resolve([]),
      this.variantImagesRepository.find({
        where: { variantId: In(variantIds) },
        order: { sortOrder: 'ASC', createdAt: 'ASC' },
      }),
    ]);

    const colorById = new Map(colors.map((color) => [color.colorId, color]));
    const sizeById = new Map(sizes.map((size) => [size.sizeId, size]));
    const imageByVariantId = new Map<string, string>();
    for (const image of images) {
      if (!imageByVariantId.has(image.variantId)) {
        imageByVariantId.set(image.variantId, image.imageUrl);
      }
    }

    return new Map(
      variants.map((variant) => [
        variant.variantId,
        {
          variant,
          color: variant.colorId ? colorById.get(variant.colorId) ?? null : null,
          size: variant.sizeId ? sizeById.get(variant.sizeId) ?? null : null,
          imageUrl: imageByVariantId.get(variant.variantId) ?? null,
        },
      ]),
    );
  }

  async getMyCart(userId: string) {
    await this.ensureUserExists(userId);
    const cart = await this.getOrCreateCart(userId);
    const items = await this.cartItemsRepository.find({
      where: { cartId: cart.cartId },
      order: { createdAt: 'DESC' },
    });

    const productIds = [...new Set(items.map((item) => item.productId))];
    const variantIds = [...new Set(items.map((item) => item.variantId).filter((id): id is string => Boolean(id)))];
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
    const mappedItems = items.map((item) =>
      this.toCartItemResponse(
        item,
        productsById.get(item.productId),
        primaryImageByProductId.get(item.productId),
        item.variantId ? variantsById.get(item.variantId) : null,
      ),
    );
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

  async addItem(userId: string, addCartItemDto: AddCartItemDto) {
    await this.ensureUserExists(userId);
    const cart = await this.getOrCreateCart(userId);
    const product = await this.findAvailableProduct(addCartItemDto.productId);
    const variant = await this.findAvailableVariant(product, addCartItemDto.variantId ?? null);
    const availableQuantity = variant?.stockQuantity ?? product.quantityAvailable;

    const existingItem = await this.findCartLine(
      cart.cartId,
      addCartItemDto.productId,
      variant?.variantId ?? null,
    );

    const nextQuantity = (existingItem?.quantity ?? 0) + addCartItemDto.quantity;

    if (nextQuantity > availableQuantity) {
      throw new BadRequestException('Quantity exceeds available stock');
    }

    const item =
      existingItem ??
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
      variant ? this.getVariantPresentations([variant.variantId]) : Promise.resolve(new Map<string, VariantPresentation>()),
    ]);
    const savedItem = await this.cartItemsRepository.save(item);
    return this.toCartItemResponse(
      savedItem,
      product,
      primaryImg?.imageUrl,
      variant ? variantsById.get(variant.variantId) : null,
    );
  }

  async updateItem(
    userId: string,
    cartItemId: string,
    updateCartItemDto: UpdateCartItemDto,
  ) {
    await this.ensureUserExists(userId);
    const { item } = await this.findOwnedCartItem(userId, cartItemId);
    const product = await this.findAvailableProduct(item.productId);
    const variant = item.variantId
      ? await this.productVariantsRepository.findOneBy({ variantId: item.variantId, productId: item.productId })
      : null;
    if (item.variantId && (!variant || !variant.isActive)) {
      throw new BadRequestException('Bien the san pham khong kha dung');
    }

    const availableQuantity = variant?.stockQuantity ?? product.quantityAvailable;
    if (updateCartItemDto.quantity > availableQuantity) {
      throw new BadRequestException('Quantity exceeds available stock');
    }

    item.quantity = updateCartItemDto.quantity;
    item.priceAtAdded = this.getEffectivePrice(product, variant);

    const [primaryImg, variantsById] = await Promise.all([
      this.productImagesRepository.findOneBy({ productId: product.productId, isPrimary: true }),
      variant ? this.getVariantPresentations([variant.variantId]) : Promise.resolve(new Map<string, VariantPresentation>()),
    ]);
    const savedItem = await this.cartItemsRepository.save(item);
    return this.toCartItemResponse(
      savedItem,
      product,
      primaryImg?.imageUrl,
      variant ? variantsById.get(variant.variantId) : null,
    );
  }

  async deleteItem(userId: string, cartItemId: string) {
    await this.ensureUserExists(userId);
    const { item } = await this.findOwnedCartItem(userId, cartItemId);

    await this.cartItemsRepository.delete({ cartItemId: item.cartItemId });

    return {
      id: item.cartItemId,
      deleted: true,
    };
  }
}
