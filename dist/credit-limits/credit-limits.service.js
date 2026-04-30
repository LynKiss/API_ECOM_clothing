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
exports.CreditLimitsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
const order_entity_1 = require("../orders/entities/order.entity");
const user_entity_1 = require("../users/entities/user.entity");
const customer_credit_limit_entity_1 = require("./entities/customer-credit-limit.entity");
let CreditLimitsService = class CreditLimitsService {
    repo;
    userRepo;
    orderRepo;
    constructor(repo, userRepo, orderRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
        this.orderRepo = orderRepo;
    }
    async findAll(page = 1, limit = 20) {
        const [items, total] = await this.repo.findAndCount({
            where: { isActive: true },
            order: { updatedAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        const enriched = await Promise.all(items.map(async (item) => {
            const user = await this.userRepo.findOne({ where: { userId: item.userId } });
            return {
                ...item,
                username: user?.username ?? null,
                email: user?.email ?? null,
                availableCredit: Math.max(0, Number(item.creditLimit) - Number(item.currentDebt ?? 0)),
            };
        }));
        return { items: enriched, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    async findByUser(userId) {
        const limit = await this.repo.findOne({ where: { userId } });
        if (!limit)
            return null;
        const user = await this.userRepo.findOne({ where: { userId } });
        const availableCredit = Math.max(0, Number(limit.creditLimit) - Number(limit.currentDebt ?? 0));
        return {
            ...limit,
            username: user?.username ?? null,
            email: user?.email ?? null,
            availableCredit,
        };
    }
    async upsert(dto) {
        const user = await this.userRepo.findOne({ where: { userId: dto.userId } });
        if (!user)
            throw new common_1.NotFoundException('Không tìm thấy người dùng');
        let existing = await this.repo.findOne({ where: { userId: dto.userId } });
        if (!existing) {
            existing = this.repo.create({
                limitId: (0, uuid_1.v4)(),
                userId: dto.userId,
                creditLimit: String(dto.creditLimit),
                currentDebt: '0',
                paymentTerms: 30,
                isActive: true,
                notes: dto.notes ?? null,
            });
        }
        else {
            existing.creditLimit = String(dto.creditLimit);
            if (dto.notes !== undefined)
                existing.notes = dto.notes;
        }
        await this.repo.save(existing);
        return this.findByUser(dto.userId);
    }
    async syncDebt(userId) {
        const unpaidTotal = await this.orderRepo
            .createQueryBuilder('o')
            .select('COALESCE(SUM(o.total_payment), 0)', 'total')
            .where('o.user_id = :userId', { userId })
            .andWhere('o.payment_status = :ps', { ps: order_entity_1.PaymentStatus.UNPAID })
            .andWhere('o.order_status NOT IN (:...cancelled)', {
            cancelled: [order_entity_1.OrderStatus.CANCELLED, order_entity_1.OrderStatus.RETURNED],
        })
            .getRawOne();
        const debt = Number(unpaidTotal?.total ?? 0);
        await this.repo.update({ userId }, { currentDebt: String(debt) });
        return this.findByUser(userId);
    }
    async recordPayment(dto) {
        const limit = await this.repo.findOne({ where: { userId: dto.userId } });
        if (!limit)
            throw new common_1.NotFoundException('Chưa cài hạn mức cho người dùng này');
        const newDebt = Math.max(0, Number(limit.currentDebt ?? 0) - dto.amount);
        limit.currentDebt = String(newDebt);
        if (dto.notes)
            limit.notes = dto.notes;
        await this.repo.save(limit);
        return this.findByUser(dto.userId);
    }
    async checkCreditAllowed(userId, orderAmount) {
        const limit = await this.repo.findOne({ where: { userId } });
        if (!limit || !limit.isActive)
            return { allowed: true };
        const available = Number(limit.creditLimit) - Number(limit.currentDebt ?? 0);
        if (orderAmount > available) {
            return {
                allowed: false,
                message: `Vượt hạn mức tín dụng. Hạn mức còn lại: ${available.toLocaleString('vi-VN')}₫`,
            };
        }
        return { allowed: true };
    }
    async remove(userId) {
        const limit = await this.repo.findOne({ where: { userId } });
        if (!limit)
            throw new common_1.NotFoundException('Không tìm thấy hạn mức');
        limit.isActive = false;
        await this.repo.save(limit);
        return { message: 'Đã vô hiệu hạn mức' };
    }
};
exports.CreditLimitsService = CreditLimitsService;
exports.CreditLimitsService = CreditLimitsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_credit_limit_entity_1.CustomerCreditLimitEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(order_entity_1.OrderEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CreditLimitsService);
//# sourceMappingURL=credit-limits.service.js.map