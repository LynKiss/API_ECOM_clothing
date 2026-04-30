"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const product_entity_1 = require("../products/entities/product.entity");
const product_image_entity_1 = require("../products/entities/product-image.entity");
const color_entity_1 = require("../products/entities/color.entity");
const product_variant_entity_1 = require("../products/entities/product-variant.entity");
const size_entity_1 = require("../products/entities/size.entity");
const variant_image_entity_1 = require("../products/entities/variant-image.entity");
const user_entity_1 = require("../users/entities/user.entity");
const carts_controller_1 = require("./carts.controller");
const cart_item_entity_1 = require("./entities/cart-item.entity");
const shopping_cart_entity_1 = require("./entities/shopping-cart.entity");
const carts_service_1 = require("./carts.service");
let CartsModule = class CartsModule {
};
exports.CartsModule = CartsModule;
exports.CartsModule = CartsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                shopping_cart_entity_1.ShoppingCartEntity,
                cart_item_entity_1.CartItemEntity,
                product_entity_1.ProductEntity,
                product_image_entity_1.ProductImageEntity,
                product_variant_entity_1.ProductVariantEntity,
                variant_image_entity_1.VariantImageEntity,
                color_entity_1.ColorEntity,
                size_entity_1.SizeEntity,
                user_entity_1.UserEntity,
            ]),
        ],
        controllers: [carts_controller_1.CartsController],
        providers: [carts_service_1.CartsService],
        exports: [carts_service_1.CartsService, typeorm_1.TypeOrmModule],
    })
], CartsModule);
//# sourceMappingURL=carts.module.js.map