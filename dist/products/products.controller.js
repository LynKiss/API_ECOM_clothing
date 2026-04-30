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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const customize_1 = require("../decorator/customize");
const create_color_dto_1 = require("./dto/create-color.dto");
const create_product_dto_1 = require("./dto/create-product.dto");
const create_size_dto_1 = require("./dto/create-size.dto");
const query_products_dto_1 = require("./dto/query-products.dto");
const reorder_images_dto_1 = require("./dto/reorder-images.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const upsert_product_variant_dto_1 = require("./dto/upsert-product-variant.dto");
const products_service_1 = require("./products.service");
let ProductsController = class ProductsController {
    productsService;
    constructor(productsService) {
        this.productsService = productsService;
    }
    getProducts(query) {
        return this.productsService.findAll(query);
    }
    getColors() {
        return this.productsService.findColors();
    }
    createColor(dto) {
        return this.productsService.createColor(dto);
    }
    getSizes() {
        return this.productsService.findSizes();
    }
    createSize(dto) {
        return this.productsService.createSize(dto);
    }
    getProduct(id) {
        return this.productsService.findOne(id);
    }
    createProduct(createProductDto) {
        return this.productsService.create(createProductDto);
    }
    updateProduct(id, updateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }
    getProductVariants(id) {
        return this.productsService.findProductVariants(id);
    }
    createProductVariant(id, dto) {
        return this.productsService.createVariant(id, dto);
    }
    updateProductVariant(id, variantId, dto) {
        return this.productsService.updateVariant(id, variantId, dto);
    }
    deactivateProductVariant(id, variantId) {
        return this.productsService.deactivateVariant(id, variantId);
    }
    uploadProductVariantImage(id, variantId, file) {
        return this.productsService.uploadVariantImage(id, variantId, file);
    }
    deleteProductVariantImage(id, variantId, imageId) {
        return this.productsService.deleteVariantImage(id, variantId, imageId);
    }
    toggleProductVisibility(id) {
        return this.productsService.toggleVisibility(id);
    }
    toggleProductFeatured(id) {
        return this.productsService.toggleFeatured(id);
    }
    removeProduct(id) {
        return this.productsService.remove(id);
    }
    getProductImages(id) {
        return this.productsService.getProductImages(id);
    }
    uploadProductImage(id, file, isPrimary) {
        return this.productsService.uploadProductImage(id, file, isPrimary === 'true');
    }
    setPrimaryImage(id, imageId) {
        return this.productsService.setPrimaryImage(id, imageId);
    }
    reorderProductImages(id, dto) {
        return this.productsService.reorderProductImages(id, dto);
    }
    deleteProductImage(id, imageId) {
        return this.productsService.deleteProductImage(id, imageId);
    }
    getDescriptionImages(id) {
        return this.productsService.getDescriptionImages(id);
    }
    uploadDescriptionImage(id, file) {
        return this.productsService.uploadDescriptionImage(id, file);
    }
    deleteDescriptionImage(id, imageId) {
        return this.productsService.deleteDescriptionImage(id, imageId);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Get)(),
    (0, customize_1.ResponseMessage)('Get products list'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_products_dto_1.QueryProductsDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "getProducts", null);
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Get)('colors'),
    (0, customize_1.ResponseMessage)('Get product colors'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "getColors", null);
__decorate([
    (0, common_1.Post)('colors'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Create product color'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_color_dto_1.CreateColorDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "createColor", null);
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Get)('sizes'),
    (0, customize_1.ResponseMessage)('Get product sizes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "getSizes", null);
__decorate([
    (0, common_1.Post)('sizes'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Create product size'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_size_dto_1.CreateSizeDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "createSize", null);
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Get)(':id'),
    (0, customize_1.ResponseMessage)('Get product detail'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "getProduct", null);
__decorate([
    (0, common_1.Post)(),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Create product'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Update product'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "updateProduct", null);
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Get)(':id/variants'),
    (0, customize_1.ResponseMessage)('Get product variants'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "getProductVariants", null);
__decorate([
    (0, common_1.Post)(':id/variants'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Create product variant'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, upsert_product_variant_dto_1.UpsertProductVariantDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "createProductVariant", null);
__decorate([
    (0, common_1.Patch)(':id/variants/:variantId'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Update product variant'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('variantId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, upsert_product_variant_dto_1.UpsertProductVariantDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "updateProductVariant", null);
__decorate([
    (0, common_1.Delete)(':id/variants/:variantId'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Deactivate product variant'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('variantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "deactivateProductVariant", null);
__decorate([
    (0, common_1.Post)(':id/variants/:variantId/images'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, customize_1.ResponseMessage)('Upload product variant image'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('variantId')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "uploadProductVariantImage", null);
__decorate([
    (0, common_1.Delete)(':id/variants/:variantId/images/:imageId'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Delete product variant image'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('variantId')),
    __param(2, (0, common_1.Param)('imageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "deleteProductVariantImage", null);
__decorate([
    (0, common_1.Patch)(':id/toggle-visibility'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Toggle product visibility'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "toggleProductVisibility", null);
__decorate([
    (0, common_1.Patch)(':id/toggle-featured'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Toggle product featured'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "toggleProductFeatured", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Delete product'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "removeProduct", null);
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Get)(':id/images'),
    (0, customize_1.ResponseMessage)('Get product images'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "getProductImages", null);
__decorate([
    (0, common_1.Post)(':id/images'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, customize_1.ResponseMessage)('Upload product image'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)('isPrimary')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "uploadProductImage", null);
__decorate([
    (0, common_1.Patch)(':id/images/:imageId/set-primary'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Set primary image'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('imageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "setPrimaryImage", null);
__decorate([
    (0, common_1.Patch)(':id/images/reorder'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Reorder product images'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reorder_images_dto_1.ReorderImagesDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "reorderProductImages", null);
__decorate([
    (0, common_1.Delete)(':id/images/:imageId'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Delete product image'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('imageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "deleteProductImage", null);
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Get)(':id/description-images'),
    (0, customize_1.ResponseMessage)('Get product description images'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "getDescriptionImages", null);
__decorate([
    (0, common_1.Post)(':id/description-images'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, customize_1.ResponseMessage)('Upload product description image'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "uploadDescriptionImage", null);
__decorate([
    (0, common_1.Delete)(':id/description-images/:imageId'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Delete product description image'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('imageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "deleteDescriptionImage", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map