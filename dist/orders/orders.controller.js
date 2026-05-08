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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const customize_1 = require("../decorator/customize");
const create_guest_order_dto_1 = require("./dto/create-guest-order.dto");
const create_order_dto_1 = require("./dto/create-order.dto");
const partial_deliver_dto_1 = require("./dto/partial-deliver.dto");
const query_orders_dto_1 = require("./dto/query-orders.dto");
const update_order_tracking_live_dto_1 = require("./dto/update-order-tracking-live.dto");
const update_order_tracking_manual_dto_1 = require("./dto/update-order-tracking-manual.dto");
const update_order_tracking_mode_dto_1 = require("./dto/update-order-tracking-mode.dto");
const update_order_status_dto_1 = require("./dto/update-order-status.dto");
const orders_service_1 = require("./orders.service");
let OrdersController = class OrdersController {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    createOrder(currentUser, createOrderDto, idempotencyKey) {
        return this.ordersService.createOrder(currentUser._id, createOrderDto, idempotencyKey?.trim() || undefined);
    }
    createGuestOrder(dto, idempotencyKey) {
        return this.ordersService.createGuestOrder(dto, idempotencyKey?.trim() || undefined);
    }
    getGuestOrder(orderId, phone) {
        return this.ordersService.findGuestOrder(orderId, phone);
    }
    getOrders(query) {
        return this.ordersService.findAllOrders(query);
    }
    getOrderStats() {
        return this.ordersService.getOrderStats();
    }
    getOrderDetail(currentUser, id) {
        return this.ordersService.findOrderDetail(currentUser, id);
    }
    getOrderTracking(currentUser, id) {
        return this.ordersService.findOrderTracking(currentUser, id);
    }
    cancelOrder(currentUser, id) {
        return this.ordersService.cancelOrder(currentUser._id, id);
    }
    updateOrderStatus(currentUser, id, updateOrderStatusDto) {
        return this.ordersService.updateOrderStatus(currentUser, id, updateOrderStatusDto);
    }
    partialDeliver(currentUser, id, dto) {
        return this.ordersService.partialDeliverOrder(currentUser, id, dto.items, dto.note);
    }
    updateOrderTrackingMode(currentUser, id, updateOrderTrackingModeDto) {
        return this.ordersService.updateOrderTrackingMode(currentUser, id, updateOrderTrackingModeDto);
    }
    updateManualOrderTracking(currentUser, id, updateOrderTrackingManualDto) {
        return this.ordersService.updateManualOrderTracking(currentUser, id, updateOrderTrackingManualDto);
    }
    updateLiveOrderTracking(currentUser, id, updateOrderTrackingLiveDto) {
        return this.ordersService.updateLiveOrderTracking(currentUser, id, updateOrderTrackingLiveDto);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)(),
    (0, customize_1.ResponseMessage)('Create order'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('x-idempotency-key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_order_dto_1.CreateOrderDto, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "createOrder", null);
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Post)('guest'),
    (0, customize_1.ResponseMessage)('Create guest order'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-idempotency-key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_guest_order_dto_1.CreateGuestOrderDto, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "createGuestOrder", null);
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Get)('guest/:orderId'),
    (0, customize_1.ResponseMessage)('Get guest order'),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Query)('phone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getGuestOrder", null);
__decorate([
    (0, common_1.Get)(),
    (0, customize_1.RequirePermissions)('manage_orders'),
    (0, customize_1.ResponseMessage)('Get orders list'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_orders_dto_1.QueryOrdersDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Get)('admin/stats'),
    (0, customize_1.RequirePermissions)('manage_orders'),
    (0, customize_1.ResponseMessage)('Get order stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getOrderStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, customize_1.ResponseMessage)('Get order detail'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getOrderDetail", null);
__decorate([
    (0, common_1.Get)(':id/tracking'),
    (0, customize_1.ResponseMessage)('Get order tracking detail'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getOrderTracking", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    (0, customize_1.ResponseMessage)('Cancel order'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "cancelOrder", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, customize_1.RequirePermissions)('manage_orders'),
    (0, customize_1.ResponseMessage)('Update order status'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_order_status_dto_1.UpdateOrderStatusDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "updateOrderStatus", null);
__decorate([
    (0, common_1.Patch)(':id/partial-deliver'),
    (0, customize_1.RequirePermissions)('manage_orders'),
    (0, customize_1.ResponseMessage)('Partial deliver order'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, partial_deliver_dto_1.PartialDeliverDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "partialDeliver", null);
__decorate([
    (0, common_1.Patch)(':id/tracking/mode'),
    (0, customize_1.RequirePermissions)('manage_orders'),
    (0, customize_1.ResponseMessage)('Update order tracking mode'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_order_tracking_mode_dto_1.UpdateOrderTrackingModeDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "updateOrderTrackingMode", null);
__decorate([
    (0, common_1.Patch)(':id/tracking/manual'),
    (0, customize_1.RequirePermissions)('manage_orders'),
    (0, customize_1.ResponseMessage)('Update manual order tracking point'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_order_tracking_manual_dto_1.UpdateOrderTrackingManualDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "updateManualOrderTracking", null);
__decorate([
    (0, common_1.Patch)(':id/tracking/live'),
    (0, customize_1.RequirePermissions)('manage_orders'),
    (0, customize_1.ResponseMessage)('Update live order tracking point'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_order_tracking_live_dto_1.UpdateOrderTrackingLiveDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "updateLiveOrderTracking", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map