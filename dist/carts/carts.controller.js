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
exports.CartsController = void 0;
const common_1 = require("@nestjs/common");
const customize_1 = require("../decorator/customize");
const add_cart_item_dto_1 = require("./dto/add-cart-item.dto");
const update_cart_item_dto_1 = require("./dto/update-cart-item.dto");
const carts_service_1 = require("./carts.service");
let CartsController = class CartsController {
    cartsService;
    constructor(cartsService) {
        this.cartsService = cartsService;
    }
    getMyCart(currentUser) {
        return this.cartsService.getMyCart(currentUser._id);
    }
    addCartItem(currentUser, addCartItemDto) {
        return this.cartsService.addItem(currentUser._id, addCartItemDto);
    }
    updateCartItem(currentUser, id, updateCartItemDto) {
        return this.cartsService.updateItem(currentUser._id, id, updateCartItemDto);
    }
    deleteCartItem(currentUser, id) {
        return this.cartsService.deleteItem(currentUser._id, id);
    }
};
exports.CartsController = CartsController;
__decorate([
    (0, common_1.Get)(),
    (0, customize_1.ResponseMessage)('Get my cart'),
    __param(0, (0, customize_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CartsController.prototype, "getMyCart", null);
__decorate([
    (0, common_1.Post)('items'),
    (0, customize_1.ResponseMessage)('Add item to cart'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, add_cart_item_dto_1.AddCartItemDto]),
    __metadata("design:returntype", void 0)
], CartsController.prototype, "addCartItem", null);
__decorate([
    (0, common_1.Patch)('items/:id'),
    (0, customize_1.ResponseMessage)('Update cart item'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_cart_item_dto_1.UpdateCartItemDto]),
    __metadata("design:returntype", void 0)
], CartsController.prototype, "updateCartItem", null);
__decorate([
    (0, common_1.Delete)('items/:id'),
    (0, customize_1.ResponseMessage)('Delete cart item'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CartsController.prototype, "deleteCartItem", null);
exports.CartsController = CartsController = __decorate([
    (0, common_1.Controller)('cart'),
    __metadata("design:paramtypes", [carts_service_1.CartsService])
], CartsController);
//# sourceMappingURL=carts.controller.js.map