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
exports.DeliveryMethodsController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const customize_1 = require("../decorator/customize");
const delivery_method_entity_1 = require("./entities/delivery-method.entity");
class CreateDeliveryMethodDto {
    name;
    description;
    basePrice;
    minOrderAmount;
    region;
    isDefault;
    isActive;
}
class UpdateDeliveryMethodDto {
    name;
    description;
    basePrice;
    minOrderAmount;
    region;
    isDefault;
    isActive;
}
let DeliveryMethodsController = class DeliveryMethodsController {
    deliveryMethodsRepository;
    constructor(deliveryMethodsRepository) {
        this.deliveryMethodsRepository = deliveryMethodsRepository;
    }
    async getDeliveryMethods() {
        const methods = await this.deliveryMethodsRepository.find({
            where: { isActive: true },
            order: { basePrice: 'ASC' },
        });
        return methods.map((m) => this.toResponse(m));
    }
    async getAllDeliveryMethods() {
        const methods = await this.deliveryMethodsRepository.find({
            order: { createdAt: 'ASC' },
        });
        return methods.map((m) => this.toResponse(m));
    }
    async createDeliveryMethod(dto) {
        if (dto.isDefault) {
            await this.deliveryMethodsRepository.update({}, { isDefault: false });
        }
        const method = this.deliveryMethodsRepository.create({
            name: dto.name,
            description: dto.description ?? null,
            basePrice: String(dto.basePrice ?? 0),
            minOrderAmount: String(dto.minOrderAmount ?? 0),
            region: dto.region ?? null,
            isDefault: dto.isDefault ?? false,
            isActive: dto.isActive ?? true,
        });
        const saved = await this.deliveryMethodsRepository.save(method);
        return this.toResponse(saved);
    }
    async updateDeliveryMethod(id, dto) {
        const method = await this.deliveryMethodsRepository.findOneBy({ deliveryId: id });
        if (!method)
            throw new common_1.NotFoundException('Delivery method not found');
        if (dto.isDefault === true) {
            await this.deliveryMethodsRepository.update({}, { isDefault: false });
        }
        if (dto.name !== undefined)
            method.name = dto.name;
        if (dto.description !== undefined)
            method.description = dto.description ?? null;
        if (dto.basePrice !== undefined)
            method.basePrice = String(dto.basePrice);
        if (dto.minOrderAmount !== undefined)
            method.minOrderAmount = String(dto.minOrderAmount);
        if (dto.region !== undefined)
            method.region = dto.region ?? null;
        if (dto.isDefault !== undefined)
            method.isDefault = dto.isDefault;
        if (dto.isActive !== undefined)
            method.isActive = dto.isActive;
        const saved = await this.deliveryMethodsRepository.save(method);
        return this.toResponse(saved);
    }
    async deleteDeliveryMethod(id) {
        const method = await this.deliveryMethodsRepository.findOneBy({ deliveryId: id });
        if (!method)
            throw new common_1.NotFoundException('Delivery method not found');
        await this.deliveryMethodsRepository.remove(method);
        return { deleted: true };
    }
    toResponse(m) {
        return {
            id: m.deliveryId,
            name: m.name,
            description: m.description,
            basePrice: Number(m.basePrice),
            minOrderAmount: Number(m.minOrderAmount),
            region: m.region,
            isDefault: m.isDefault,
            isActive: m.isActive,
            createdAt: m.createdAt,
        };
    }
};
exports.DeliveryMethodsController = DeliveryMethodsController;
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Get)(),
    (0, customize_1.ResponseMessage)('Get delivery methods'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DeliveryMethodsController.prototype, "getDeliveryMethods", null);
__decorate([
    (0, common_1.Get)('admin/all'),
    (0, customize_1.RequirePermissions)('manage_settings'),
    (0, customize_1.ResponseMessage)('Get all delivery methods'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DeliveryMethodsController.prototype, "getAllDeliveryMethods", null);
__decorate([
    (0, common_1.Post)(),
    (0, customize_1.RequirePermissions)('manage_settings'),
    (0, customize_1.ResponseMessage)('Create delivery method'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateDeliveryMethodDto]),
    __metadata("design:returntype", Promise)
], DeliveryMethodsController.prototype, "createDeliveryMethod", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, customize_1.RequirePermissions)('manage_settings'),
    (0, customize_1.ResponseMessage)('Update delivery method'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateDeliveryMethodDto]),
    __metadata("design:returntype", Promise)
], DeliveryMethodsController.prototype, "updateDeliveryMethod", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, customize_1.RequirePermissions)('manage_settings'),
    (0, common_1.HttpCode)(200),
    (0, customize_1.ResponseMessage)('Delete delivery method'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeliveryMethodsController.prototype, "deleteDeliveryMethod", null);
exports.DeliveryMethodsController = DeliveryMethodsController = __decorate([
    (0, common_1.Controller)('delivery-methods'),
    __param(0, (0, typeorm_1.InjectRepository)(delivery_method_entity_1.DeliveryMethodEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DeliveryMethodsController);
//# sourceMappingURL=delivery-methods.controller.js.map