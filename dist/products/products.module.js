"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const notifications_module_1 = require("../notifications/notifications.module");
const category_entity_1 = require("../categories/entities/category.entity");
const discount_category_entity_1 = require("../discounts/entities/discount-category.entity");
const discount_product_entity_1 = require("../discounts/entities/discount-product.entity");
const discount_entity_1 = require("../discounts/entities/discount.entity");
const user_entity_1 = require("../users/entities/user.entity");
const warehouse_entity_1 = require("../warehouses/entities/warehouse.entity");
const warehouse_stock_entity_1 = require("../warehouses/entities/warehouse-stock.entity");
const inventory_transaction_entity_1 = require("./entities/inventory-transaction.entity");
const color_entity_1 = require("./entities/color.entity");
const origin_entity_1 = require("./entities/origin.entity");
const product_description_image_entity_1 = require("./entities/product-description-image.entity");
const product_image_entity_1 = require("./entities/product-image.entity");
const product_tag_entity_1 = require("./entities/product-tag.entity");
const product_variant_entity_1 = require("./entities/product-variant.entity");
const product_entity_1 = require("./entities/product.entity");
const size_entity_1 = require("./entities/size.entity");
const subcategory_entity_1 = require("./entities/subcategory.entity");
const tag_entity_1 = require("./entities/tag.entity");
const variant_image_entity_1 = require("./entities/variant-image.entity");
const wishlist_entity_1 = require("./entities/wishlist.entity");
const inventory_controller_1 = require("./inventory.controller");
const origins_controller_1 = require("./origins.controller");
const origins_service_1 = require("./origins.service");
const products_controller_1 = require("./products.controller");
const products_service_1 = require("./products.service");
const subcategories_controller_1 = require("./subcategories.controller");
const subcategories_service_1 = require("./subcategories.service");
const tags_controller_1 = require("./tags.controller");
const tags_service_1 = require("./tags.service");
const wishlist_controller_1 = require("./wishlist.controller");
let ProductsModule = class ProductsModule {
};
exports.ProductsModule = ProductsModule;
exports.ProductsModule = ProductsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            notifications_module_1.NotificationsModule,
            typeorm_1.TypeOrmModule.forFeature([
                product_entity_1.ProductEntity,
                category_entity_1.CategoryEntity,
                subcategory_entity_1.SubcategoryEntity,
                origin_entity_1.OriginEntity,
                tag_entity_1.TagEntity,
                product_image_entity_1.ProductImageEntity,
                product_description_image_entity_1.ProductDescriptionImageEntity,
                product_tag_entity_1.ProductTagEntity,
                product_variant_entity_1.ProductVariantEntity,
                color_entity_1.ColorEntity,
                size_entity_1.SizeEntity,
                variant_image_entity_1.VariantImageEntity,
                inventory_transaction_entity_1.InventoryTransactionEntity,
                wishlist_entity_1.WishlistEntity,
                warehouse_entity_1.WarehouseEntity,
                warehouse_stock_entity_1.WarehouseStockEntity,
                user_entity_1.UserEntity,
                discount_entity_1.DiscountEntity,
                discount_category_entity_1.DiscountCategoryEntity,
                discount_product_entity_1.DiscountProductEntity,
            ]),
        ],
        controllers: [
            products_controller_1.ProductsController,
            inventory_controller_1.InventoryController,
            wishlist_controller_1.WishlistController,
            origins_controller_1.OriginsController,
            subcategories_controller_1.SubcategoriesController,
            tags_controller_1.TagsController,
        ],
        providers: [products_service_1.ProductsService, origins_service_1.OriginsService, subcategories_service_1.SubcategoriesService, tags_service_1.TagsService],
        exports: [
            products_service_1.ProductsService,
            origins_service_1.OriginsService,
            subcategories_service_1.SubcategoriesService,
            tags_service_1.TagsService,
            typeorm_1.TypeOrmModule,
        ],
    })
], ProductsModule);
//# sourceMappingURL=products.module.js.map