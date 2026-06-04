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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const customize_1 = require("../decorator/customize");
const create_cancel_paid_refund_dto_1 = require("./dto/create-cancel-paid-refund.dto");
const initiate_payment_dto_1 = require("./dto/initiate-payment.dto");
const payment_callback_dto_1 = require("./dto/payment-callback.dto");
const update_refund_status_dto_1 = require("./dto/update-refund-status.dto");
const orders_service_1 = require("./orders.service");
let PaymentsController = class PaymentsController {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    initiatePayment(currentUser, orderId, initiatePaymentDto) {
        return this.ordersService.initiatePayment(currentUser, orderId, initiatePaymentDto);
    }
    initiateGuestPayment(orderId, initiatePaymentDto) {
        return this.ordersService.initiatePayment(undefined, orderId, initiatePaymentDto);
    }
    handlePaymentCallback(provider, paymentCallbackDto) {
        return this.ordersService.handlePaymentCallback(provider, paymentCallbackDto);
    }
    getPaymentTransactions(currentUser, orderId) {
        return this.ordersService.findPaymentTransactions(currentUser, orderId);
    }
    reconcileOrderPayment(currentUser, orderId) {
        return this.ordersService.reconcileOrderPayment(currentUser, orderId);
    }
    handleMomoIpn(body) {
        return this.ordersService.handleMomoIpn(body);
    }
    verifyMomoRedirect(body) {
        return this.ordersService.handleMomoIpn(body);
    }
    getAllTransactions(page = '1', limit = '20', provider, status) {
        return this.ordersService.findAllPaymentTransactions({
            page: Math.max(1, parseInt(page, 10) || 1),
            limit: Math.min(100, Math.max(1, parseInt(limit, 10) || 20)),
            provider,
            status,
        });
    }
    getRefunds(page = '1', limit = '20', status, reason, orderId) {
        return this.ordersService.findAllRefunds({
            page: Math.max(1, parseInt(page, 10) || 1),
            limit: Math.min(100, Math.max(1, parseInt(limit, 10) || 20)),
            status,
            reason,
            orderId,
        });
    }
    createCancelPaidOrderRefund(currentUser, dto) {
        return this.ordersService.createCancelPaidOrderRefund(currentUser, dto);
    }
    updateRefundStatus(currentUser, refundId, dto) {
        return this.ordersService.updateRefundStatus(currentUser, refundId, dto);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)('orders/:orderId/initiate'),
    (0, customize_1.ResponseMessage)('Initiate payment'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('orderId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, initiate_payment_dto_1.InitiatePaymentDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "initiatePayment", null);
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Post)('guest/orders/:orderId/initiate'),
    (0, customize_1.ResponseMessage)('Initiate guest payment'),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, initiate_payment_dto_1.InitiatePaymentDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "initiateGuestPayment", null);
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Post)('callback/:provider'),
    (0, customize_1.ResponseMessage)('Handle payment callback'),
    __param(0, (0, common_1.Param)('provider')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payment_callback_dto_1.PaymentCallbackDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "handlePaymentCallback", null);
__decorate([
    (0, common_1.Get)('orders/:orderId/transactions'),
    (0, customize_1.ResponseMessage)('Get order payment transactions'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getPaymentTransactions", null);
__decorate([
    (0, common_1.Post)('orders/:orderId/reconcile'),
    (0, customize_1.ResponseMessage)('Reconcile order payment'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "reconcileOrderPayment", null);
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Post)('momo/ipn'),
    (0, customize_1.ResponseMessage)('MoMo IPN received'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "handleMomoIpn", null);
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Post)('momo/verify'),
    (0, customize_1.ResponseMessage)('MoMo payment verified'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "verifyMomoRedirect", null);
__decorate([
    (0, customize_1.RequirePermissions)('manage_payments'),
    (0, common_1.Get)('admin/transactions'),
    (0, customize_1.ResponseMessage)('Get all payment transactions'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('provider')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getAllTransactions", null);
__decorate([
    (0, customize_1.RequirePermissions)('manage_payments'),
    (0, common_1.Get)('admin/refunds'),
    (0, customize_1.ResponseMessage)('Get refund queue'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('reason')),
    __param(4, (0, common_1.Query)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getRefunds", null);
__decorate([
    (0, customize_1.RequirePermissions)('manage_payments'),
    (0, common_1.Post)('admin/refunds/cancel-paid-order'),
    (0, customize_1.ResponseMessage)('Create paid order cancellation refund'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_cancel_paid_refund_dto_1.CreateCancelPaidRefundDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "createCancelPaidOrderRefund", null);
__decorate([
    (0, customize_1.RequirePermissions)('manage_payments'),
    (0, common_1.Patch)('admin/refunds/:refundId/status'),
    (0, customize_1.ResponseMessage)('Update refund status'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('refundId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_refund_status_dto_1.UpdateRefundStatusDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "updateRefundStatus", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map