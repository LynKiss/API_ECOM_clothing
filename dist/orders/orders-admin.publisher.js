"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersAdminPublisher = void 0;
const common_1 = require("@nestjs/common");
const orders_admin_realtime_constants_1 = require("./orders-admin-realtime.constants");
let OrdersAdminPublisher = class OrdersAdminPublisher {
    server = null;
    attach(server) {
        this.server = server;
    }
    emitNewOrder(order) {
        if (!this.server) {
            return;
        }
        const payload = {
            orderId: order.orderId,
            fullName: order.fullName,
            phone: order.phone,
            totalPayment: order.totalPayment,
            status: order.orderStatus,
            paymentStatus: order.paymentStatus,
            createdAt: order.createdAt,
        };
        this.server.to(orders_admin_realtime_constants_1.ORDERS_ADMIN_ROOM).emit(orders_admin_realtime_constants_1.ORDERS_ADMIN_NEW_EVENT, payload);
    }
};
exports.OrdersAdminPublisher = OrdersAdminPublisher;
exports.OrdersAdminPublisher = OrdersAdminPublisher = __decorate([
    (0, common_1.Injectable)()
], OrdersAdminPublisher);
//# sourceMappingURL=orders-admin.publisher.js.map