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
exports.WishlistController = void 0;
const common_1 = require("@nestjs/common");
const customize_1 = require("../decorator/customize");
const products_service_1 = require("./products.service");
let WishlistController = class WishlistController {
    productsService;
    constructor(productsService) {
        this.productsService = productsService;
    }
    getWishlist(currentUser) {
        return this.productsService.findWishlist(currentUser._id);
    }
    addWishlistItem(currentUser, productId) {
        return this.productsService.addWishlistItem(currentUser._id, productId);
    }
    removeWishlistItem(currentUser, productId) {
        return this.productsService.removeWishlistItem(currentUser._id, productId);
    }
};
exports.WishlistController = WishlistController;
__decorate([
    (0, common_1.Get)(),
    (0, customize_1.ResponseMessage)('Get wishlist'),
    __param(0, (0, customize_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "getWishlist", null);
__decorate([
    (0, common_1.Post)(':productId'),
    (0, customize_1.ResponseMessage)('Add product to wishlist'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "addWishlistItem", null);
__decorate([
    (0, common_1.Delete)(':productId'),
    (0, customize_1.ResponseMessage)('Remove product from wishlist'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "removeWishlistItem", null);
exports.WishlistController = WishlistController = __decorate([
    (0, common_1.Controller)('wishlist'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], WishlistController);
//# sourceMappingURL=wishlist.controller.js.map