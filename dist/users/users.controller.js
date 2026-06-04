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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const customize_1 = require("../decorator/customize");
const change_password_dto_1 = require("./dto/change-password.dto");
const create_admin_user_dto_1 = require("./dto/create-admin-user.dto");
const create_shipping_address_dto_1 = require("./dto/create-shipping-address.dto");
const query_admin_users_dto_1 = require("./dto/query-admin-users.dto");
const reset_admin_user_password_dto_1 = require("./dto/reset-admin-user-password.dto");
const update_shipping_address_dto_1 = require("./dto/update-shipping-address.dto");
const update_admin_user_dto_1 = require("./dto/update-admin-user.dto");
const update_admin_user_status_dto_1 = require("./dto/update-admin-user-status.dto");
const users_service_1 = require("./users.service");
const update_user_dto_1 = require("./dto/update-user.dto");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    getUsers(query) {
        return this.usersService.findAll(query);
    }
    createCustomer(currentUser, createAdminUserDto) {
        return this.usersService.createAdminUser(currentUser._id, createAdminUserDto);
    }
    getCustomerDetail(id) {
        return this.usersService.findAdminUserDetail(id);
    }
    updateCustomer(currentUser, id, updateAdminUserDto) {
        return this.usersService.updateAdminUser(currentUser._id, id, updateAdminUserDto);
    }
    uploadCustomerAvatar(currentUser, id, file) {
        return this.usersService.uploadAdminUserAvatar(currentUser._id, id, file);
    }
    updateCustomerStatus(currentUser, id, updateAdminUserStatusDto) {
        return this.usersService.updateAdminUserStatus(currentUser._id, id, updateAdminUserStatusDto);
    }
    resetCustomerPassword(currentUser, id, resetAdminUserPasswordDto) {
        return this.usersService.resetAdminUserPassword(currentUser._id, id, resetAdminUserPasswordDto);
    }
    deleteCustomer(currentUser, id) {
        return this.usersService.deleteAdminUser(currentUser._id, id);
    }
    getMyProfile(currentUser) {
        return this.usersService.findProfile(currentUser._id);
    }
    updateMyProfile(currentUser, updateUserDto) {
        return this.usersService.updateProfile(currentUser._id, updateUserDto);
    }
    uploadMyAvatar(currentUser, file) {
        return this.usersService.uploadMyAvatar(currentUser._id, file);
    }
    changeMyPassword(currentUser, changePasswordDto) {
        return this.usersService.changePassword(currentUser._id, changePasswordDto);
    }
    getMyShippingAddresses(currentUser) {
        return this.usersService.findMyShippingAddresses(currentUser._id);
    }
    createMyShippingAddress(currentUser, createShippingAddressDto) {
        return this.usersService.createShippingAddress(currentUser._id, createShippingAddressDto);
    }
    updateMyShippingAddress(currentUser, id, updateShippingAddressDto) {
        return this.usersService.updateShippingAddress(currentUser._id, id, updateShippingAddressDto);
    }
    deleteMyShippingAddress(currentUser, id) {
        return this.usersService.deleteShippingAddress(currentUser._id, id);
    }
    setMyDefaultShippingAddress(currentUser, id) {
        return this.usersService.setDefaultShippingAddress(currentUser._id, id);
    }
    getMyOrders(currentUser, page = '1', limit = '10', status, paymentStatus, paymentMethod, search, from, to) {
        return this.usersService.findMyOrders(currentUser._id, {
            page: Math.max(1, parseInt(page, 10) || 1),
            limit: Math.min(50, Math.max(1, parseInt(limit, 10) || 10)),
            status,
            paymentStatus,
            paymentMethod,
            search,
            from,
            to,
        });
    }
    getMyOrderDetail(currentUser, id) {
        return this.usersService.findMyOrderDetail(currentUser._id, id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    (0, customize_1.RequirePermissions)('manage_users'),
    (0, customize_1.ResponseMessage)('Get users list'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_admin_users_dto_1.QueryAdminUsersDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Post)('admin/customers'),
    (0, customize_1.RequirePermissions)('manage_users'),
    (0, customize_1.ResponseMessage)('Create customer account'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_admin_user_dto_1.CreateAdminUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "createCustomer", null);
__decorate([
    (0, common_1.Get)('admin/customers/:id'),
    (0, customize_1.RequirePermissions)('manage_users'),
    (0, customize_1.ResponseMessage)('Get customer detail'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getCustomerDetail", null);
__decorate([
    (0, common_1.Patch)('admin/customers/:id'),
    (0, customize_1.RequirePermissions)('manage_users'),
    (0, customize_1.ResponseMessage)('Update customer account'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_admin_user_dto_1.UpdateAdminUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateCustomer", null);
__decorate([
    (0, common_1.Post)('admin/customers/:id/avatar'),
    (0, customize_1.RequirePermissions)('manage_users'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, customize_1.ResponseMessage)('Upload customer avatar'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "uploadCustomerAvatar", null);
__decorate([
    (0, common_1.Patch)('admin/customers/:id/status'),
    (0, customize_1.RequirePermissions)('manage_users'),
    (0, customize_1.ResponseMessage)('Update customer status'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_admin_user_status_dto_1.UpdateAdminUserStatusDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateCustomerStatus", null);
__decorate([
    (0, common_1.Patch)('admin/customers/:id/reset-password'),
    (0, customize_1.RequirePermissions)('manage_users'),
    (0, customize_1.ResponseMessage)('Reset customer password'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, reset_admin_user_password_dto_1.ResetAdminUserPasswordDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "resetCustomerPassword", null);
__decorate([
    (0, common_1.Delete)('admin/customers/:id'),
    (0, customize_1.RequirePermissions)('manage_users'),
    (0, customize_1.ResponseMessage)('Delete customer account'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "deleteCustomer", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, customize_1.ResponseMessage)('Get my profile'),
    __param(0, (0, customize_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Patch)('me'),
    (0, customize_1.ResponseMessage)('Update my profile'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateMyProfile", null);
__decorate([
    (0, common_1.Post)('me/avatar'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, customize_1.ResponseMessage)('Upload my avatar'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "uploadMyAvatar", null);
__decorate([
    (0, common_1.Patch)('me/change-password'),
    (0, customize_1.ResponseMessage)('Change password'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "changeMyPassword", null);
__decorate([
    (0, common_1.Get)('me/addresses'),
    (0, customize_1.ResponseMessage)('Get my shipping addresses'),
    __param(0, (0, customize_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getMyShippingAddresses", null);
__decorate([
    (0, common_1.Post)('me/addresses'),
    (0, customize_1.ResponseMessage)('Create my shipping address'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_shipping_address_dto_1.CreateShippingAddressDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "createMyShippingAddress", null);
__decorate([
    (0, common_1.Patch)('me/addresses/:id'),
    (0, customize_1.ResponseMessage)('Update my shipping address'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_shipping_address_dto_1.UpdateShippingAddressDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateMyShippingAddress", null);
__decorate([
    (0, common_1.Delete)('me/addresses/:id'),
    (0, customize_1.ResponseMessage)('Delete my shipping address'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "deleteMyShippingAddress", null);
__decorate([
    (0, common_1.Patch)('me/addresses/:id/default'),
    (0, customize_1.ResponseMessage)('Set my default shipping address'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "setMyDefaultShippingAddress", null);
__decorate([
    (0, common_1.Get)('me/orders'),
    (0, customize_1.ResponseMessage)('Get my orders'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('paymentStatus')),
    __param(5, (0, common_1.Query)('paymentMethod')),
    __param(6, (0, common_1.Query)('search')),
    __param(7, (0, common_1.Query)('from')),
    __param(8, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getMyOrders", null);
__decorate([
    (0, common_1.Get)('me/orders/:id'),
    (0, customize_1.ResponseMessage)('Get my order detail'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getMyOrderDetail", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map