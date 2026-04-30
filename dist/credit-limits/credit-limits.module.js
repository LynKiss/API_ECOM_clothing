"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditLimitsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const order_entity_1 = require("../orders/entities/order.entity");
const user_entity_1 = require("../users/entities/user.entity");
const credit_limits_controller_1 = require("./credit-limits.controller");
const credit_limits_service_1 = require("./credit-limits.service");
const customer_credit_limit_entity_1 = require("./entities/customer-credit-limit.entity");
let CreditLimitsModule = class CreditLimitsModule {
};
exports.CreditLimitsModule = CreditLimitsModule;
exports.CreditLimitsModule = CreditLimitsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([customer_credit_limit_entity_1.CustomerCreditLimitEntity, user_entity_1.UserEntity, order_entity_1.OrderEntity]),
        ],
        controllers: [credit_limits_controller_1.CreditLimitsController],
        providers: [credit_limits_service_1.CreditLimitsService],
        exports: [credit_limits_service_1.CreditLimitsService],
    })
], CreditLimitsModule);
//# sourceMappingURL=credit-limits.module.js.map