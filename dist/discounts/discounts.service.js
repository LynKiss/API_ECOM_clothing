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
exports.DiscountsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("../categories/entities/category.entity");
const product_entity_1 = require("../products/entities/product.entity");
const coupon_usage_entity_1 = require("./entities/coupon-usage.entity");
const discount_category_entity_1 = require("./entities/discount-category.entity");
const discount_product_entity_1 = require("./entities/discount-product.entity");
const saved_voucher_entity_1 = require("./entities/saved-voucher.entity");
const discount_entity_1 = require("./entities/discount.entity");
let DiscountsService = class DiscountsService {
    discountsRepository;
    discountCategoriesRepository;
    discountProductsRepository;
    couponUsageRepository;
    savedVoucherRepository;
    categoriesRepository;
    productsRepository;
    constructor(discountsRepository, discountCategoriesRepository, discountProductsRepository, couponUsageRepository, savedVoucherRepository, categoriesRepository, productsRepository) {
        this.discountsRepository = discountsRepository;
        this.discountCategoriesRepository = discountCategoriesRepository;
        this.discountProductsRepository = discountProductsRepository;
        this.couponUsageRepository = couponUsageRepository;
        this.savedVoucherRepository = savedVoucherRepository;
        this.categoriesRepository = categoriesRepository;
        this.productsRepository = productsRepository;
    }
    async findAllForAdmin() {
        const discounts = await this.discountsRepository.find({
            order: { createdAt: 'DESC' },
        });
        return discounts.map((d) => ({
            ...d,
            isExpired: d.expireDate.getTime() < Date.now(),
            isStarted: d.startAt.getTime() <= Date.now(),
        }));
    }
    async findOne(discountId) {
        const discount = await this.discountsRepository.findOneBy({ discountId });
        if (!discount) {
            throw new common_1.NotFoundException('Discount not found');
        }
        const [categoryIds, productIds, stats] = await Promise.all([
            this.findDiscountCategoryIds(discount.discountId),
            this.findDiscountProductIds(discount.discountId),
            this.getDiscountStatsInternal(discount.discountId),
        ]);
        return {
            ...discount,
            categoryIds,
            productIds,
            stats,
            isExpired: discount.expireDate.getTime() < Date.now(),
            isStarted: discount.startAt.getTime() <= Date.now(),
        };
    }
    async create(createDiscountDto) {
        await this.ensureDiscountCodeUnique(createDiscountDto.discountCode);
        this.validateDiscountDates(createDiscountDto.startAt, createDiscountDto.expireDate);
        this.validateDiscountValue(createDiscountDto.discountType, createDiscountDto.discountValue, createDiscountDto.maxDiscountAmount);
        await this.validateDiscountTargets(createDiscountDto);
        const needApproval = this.discountNeedsApproval(createDiscountDto.discountType, createDiscountDto.discountValue);
        const discount = this.discountsRepository.create({
            discountCode: this.normalizeDiscountCode(createDiscountDto.discountCode),
            discountName: createDiscountDto.discountName,
            discountType: createDiscountDto.discountType,
            appliesTo: createDiscountDto.appliesTo ?? discount_entity_1.DiscountApplyTarget.ORDER,
            startAt: new Date(createDiscountDto.startAt),
            expireDate: new Date(createDiscountDto.expireDate),
            userId: createDiscountDto.userId ?? null,
            discountDescription: createDiscountDto.discountDescription ?? null,
            discountValue: createDiscountDto.discountValue,
            isActive: needApproval ? false : (createDiscountDto.isActive ?? true),
            approvalStatus: needApproval
                ? discount_entity_1.DiscountApprovalStatus.PENDING_APPROVAL
                : discount_entity_1.DiscountApprovalStatus.NOT_REQUIRED,
            usageLimit: createDiscountDto.usageLimit ?? null,
            usedCount: 0,
            minOrderValue: createDiscountDto.minOrderValue ?? '0',
            maxDiscountAmount: createDiscountDto.maxDiscountAmount ?? null,
        });
        const saved = await this.discountsRepository.save(discount);
        await this.syncDiscountTargets(saved.discountId, createDiscountDto);
        return this.findOne(saved.discountId);
    }
    discountNeedsApproval(type, value) {
        const v = Number(value);
        if (type === discount_entity_1.DiscountType.PERCENT)
            return v > discount_entity_1.DISCOUNT_APPROVAL_THRESHOLD_PCT;
        if (type === discount_entity_1.DiscountType.FIXED)
            return v > discount_entity_1.DISCOUNT_APPROVAL_THRESHOLD_FIXED;
        return false;
    }
    async approveDiscount(discountId, approvedBy, note) {
        const discount = await this.findOne(discountId);
        if (discount.approvalStatus !== discount_entity_1.DiscountApprovalStatus.PENDING_APPROVAL) {
            throw new common_1.BadRequestException('Chỉ có thể duyệt discount đang ở trạng thái PENDING_APPROVAL');
        }
        discount.approvalStatus = discount_entity_1.DiscountApprovalStatus.APPROVED;
        discount.approvedBy = approvedBy;
        discount.approvedAt = new Date();
        discount.approvalNote = note ?? null;
        discount.isActive = true;
        await this.discountsRepository.save(discount);
        return this.findOne(discountId);
    }
    async rejectDiscount(discountId, rejectedBy, note) {
        const discount = await this.findOne(discountId);
        if (discount.approvalStatus !== discount_entity_1.DiscountApprovalStatus.PENDING_APPROVAL) {
            throw new common_1.BadRequestException('Chỉ có thể từ chối discount đang ở trạng thái PENDING_APPROVAL');
        }
        discount.approvalStatus = discount_entity_1.DiscountApprovalStatus.REJECTED;
        discount.approvedBy = rejectedBy;
        discount.approvedAt = new Date();
        discount.approvalNote = note ?? null;
        discount.isActive = false;
        await this.discountsRepository.save(discount);
        return this.findOne(discountId);
    }
    async update(discountId, updateDiscountDto) {
        const discount = await this.findOne(discountId);
        const nextCode = updateDiscountDto.discountCode
            ? this.normalizeDiscountCode(updateDiscountDto.discountCode)
            : discount.discountCode;
        await this.ensureDiscountCodeUnique(nextCode, discount.discountId);
        const nextStartAt = updateDiscountDto.startAt
            ? new Date(updateDiscountDto.startAt)
            : discount.startAt;
        const nextExpireDate = updateDiscountDto.expireDate
            ? new Date(updateDiscountDto.expireDate)
            : discount.expireDate;
        this.validateDiscountDates(nextStartAt, nextExpireDate);
        this.validateDiscountValue(updateDiscountDto.discountType ?? discount.discountType, updateDiscountDto.discountValue ?? discount.discountValue, updateDiscountDto.maxDiscountAmount !== undefined
            ? updateDiscountDto.maxDiscountAmount
            : discount.maxDiscountAmount);
        await this.validateDiscountTargets({
            appliesTo: updateDiscountDto.appliesTo ?? discount.appliesTo,
            categoryIds: updateDiscountDto.categoryIds,
            productIds: updateDiscountDto.productIds,
        });
        discount.discountCode = nextCode;
        discount.discountName =
            updateDiscountDto.discountName ?? discount.discountName;
        discount.discountType =
            updateDiscountDto.discountType ?? discount.discountType;
        discount.appliesTo = updateDiscountDto.appliesTo ?? discount.appliesTo;
        discount.startAt = nextStartAt;
        discount.expireDate = nextExpireDate;
        discount.userId =
            updateDiscountDto.userId !== undefined
                ? updateDiscountDto.userId || null
                : discount.userId;
        discount.discountDescription =
            updateDiscountDto.discountDescription ?? discount.discountDescription;
        discount.discountValue =
            updateDiscountDto.discountValue ?? discount.discountValue;
        discount.isActive = updateDiscountDto.isActive ?? discount.isActive;
        discount.usageLimit =
            updateDiscountDto.usageLimit !== undefined
                ? updateDiscountDto.usageLimit
                : discount.usageLimit;
        discount.minOrderValue =
            updateDiscountDto.minOrderValue ?? discount.minOrderValue;
        discount.maxDiscountAmount =
            updateDiscountDto.maxDiscountAmount !== undefined
                ? updateDiscountDto.maxDiscountAmount || null
                : discount.maxDiscountAmount;
        if (discount.usageLimit !== null &&
            discount.usedCount > discount.usageLimit) {
            throw new common_1.BadRequestException('Usage limit cannot be lower than used count');
        }
        const saved = await this.discountsRepository.save(discount);
        await this.syncDiscountTargets(saved.discountId, {
            appliesTo: discount.appliesTo,
            categoryIds: updateDiscountDto.categoryIds,
            productIds: updateDiscountDto.productIds,
        });
        return this.findOne(saved.discountId);
    }
    async remove(discountId) {
        const discount = await this.findOne(discountId);
        await this.discountsRepository.remove(discount);
        return { success: true };
    }
    async toggleActive(discountId) {
        const discount = await this.discountsRepository.findOneBy({ discountId });
        if (!discount) {
            throw new common_1.NotFoundException('Discount not found');
        }
        discount.isActive = !discount.isActive;
        await this.discountsRepository.save(discount);
        return { discountId, isActive: discount.isActive };
    }
    async findAvailableOrderDiscounts() {
        const now = new Date();
        const discounts = await this.discountsRepository.find({
            where: { appliesTo: discount_entity_1.DiscountApplyTarget.ORDER, isActive: true },
            order: { createdAt: 'DESC' },
        });
        return discounts
            .filter((d) => {
            const withinRange = d.startAt.getTime() <= now.getTime() &&
                d.expireDate.getTime() >= now.getTime();
            const hasRemaining = d.usageLimit === null || d.usedCount < d.usageLimit;
            const approvalOk = this.isDiscountApprovedForUse(d);
            return withinRange && hasRemaining && d.userId === null && approvalOk;
        })
            .map((d) => this.toVoucherPayload(d, { isSaved: false }));
    }
    async findAvailableCouponsForUser(userId, dto) {
        const now = new Date();
        const orderValue = Number(dto.orderValue ?? 0);
        const discounts = await this.discountsRepository.find({
            where: { appliesTo: discount_entity_1.DiscountApplyTarget.ORDER, isActive: true },
            order: { expireDate: 'ASC', createdAt: 'DESC' },
        });
        const visibleDiscounts = discounts.filter((discount) => {
            const withinRange = discount.startAt.getTime() <= now.getTime() &&
                discount.expireDate.getTime() >= now.getTime();
            const hasRemaining = discount.usageLimit === null ||
                discount.usedCount < discount.usageLimit;
            const visibleForUser = discount.userId === null || discount.userId === userId;
            const approvalOk = [
                discount_entity_1.DiscountApprovalStatus.NOT_REQUIRED,
                discount_entity_1.DiscountApprovalStatus.APPROVED,
            ].includes(discount.approvalStatus);
            return withinRange && hasRemaining && visibleForUser && approvalOk;
        });
        const [usageRows, savedRows] = visibleDiscounts.length
            ? await Promise.all([
                this.couponUsageRepository.findBy(visibleDiscounts.map((discount) => ({
                    discountId: discount.discountId,
                    userId,
                }))),
                this.savedVoucherRepository.findBy(visibleDiscounts.map((discount) => ({
                    discountId: discount.discountId,
                    userId,
                }))),
            ])
            : [[], []];
        const usedDiscountIds = new Set(usageRows.map((usage) => usage.discountId));
        const savedDiscountIds = new Set(savedRows.map((saved) => saved.discountId));
        return visibleDiscounts.map((discount) => {
            const minOrderValue = Number(discount.minOrderValue);
            const isUsed = usedDiscountIds.has(discount.discountId);
            const missingAmount = Math.max(0, minOrderValue - orderValue);
            const eligible = !isUsed && missingAmount <= 0;
            const discountAmount = eligible && orderValue > 0
                ? this.calculateDiscountAmount(discount, orderValue)
                : 0;
            return {
                ...this.toVoucherPayload(discount, {
                    isSaved: savedDiscountIds.has(discount.discountId),
                }),
                usageLimit: discount.usageLimit,
                usedCount: discount.usedCount,
                eligible,
                isUsed,
                missingAmount: missingAmount.toFixed(2),
                discountAmount: discountAmount.toFixed(2),
                finalPrice: Math.max(0, orderValue - discountAmount).toFixed(2),
                reason: isUsed
                    ? 'Bạn đã dùng voucher này'
                    : missingAmount > 0
                        ? `Cần mua thêm ${missingAmount.toFixed(0)}đ để dùng voucher`
                        : 'Có thể áp dụng cho giỏ hàng hiện tại',
            };
        });
    }
    async validateCoupon(userId, dto) {
        const code = this.normalizeDiscountCode(dto.discountCode);
        const discount = await this.discountsRepository.findOneBy({
            discountCode: code,
            isActive: true,
        });
        if (!discount) {
            throw new common_1.NotFoundException('Discount code not found or inactive');
        }
        const now = new Date();
        if (discount.startAt.getTime() > now.getTime()) {
            throw new common_1.BadRequestException('Discount code is not yet active');
        }
        if (discount.expireDate.getTime() < now.getTime()) {
            throw new common_1.BadRequestException('Discount code has expired');
        }
        if (discount.usageLimit !== null &&
            discount.usedCount >= discount.usageLimit) {
            throw new common_1.BadRequestException('Discount code usage limit reached');
        }
        if (discount.userId && discount.userId !== userId) {
            throw new common_1.BadRequestException('This discount code is not for your account');
        }
        const orderValue = Number(dto.orderValue);
        if (orderValue < Number(discount.minOrderValue)) {
            throw new common_1.BadRequestException(`Minimum order value is ${discount.minOrderValue}`);
        }
        const perUserLimit = 1;
        const usageCount = await this.couponUsageRepository.countBy({
            discountId: discount.discountId,
            userId,
        });
        if (usageCount >= perUserLimit) {
            throw new common_1.BadRequestException('You have already used this discount code');
        }
        if (discount.appliesTo === discount_entity_1.DiscountApplyTarget.PRODUCT) {
            if (!dto.productIds || dto.productIds.length === 0) {
                throw new common_1.BadRequestException('No applicable products in cart for this discount');
            }
            const applicableProducts = await this.discountProductsRepository.findBy(dto.productIds.map((productId) => ({
                discountId: discount.discountId,
                productId,
            })));
            if (applicableProducts.length === 0) {
                throw new common_1.BadRequestException('No products in cart qualify for this discount');
            }
        }
        const discountAmount = this.calculateDiscountAmount(discount, orderValue);
        const finalPrice = Math.max(0, orderValue - discountAmount);
        return {
            valid: true,
            discountId: discount.discountId,
            code: discount.discountCode,
            name: discount.discountName,
            type: discount.discountType,
            value: discount.discountValue,
            discountAmount: discountAmount.toFixed(2),
            finalPrice: finalPrice.toFixed(2),
            appliesTo: discount.appliesTo,
        };
    }
    async applyCoupon(userId, dto) {
        const code = this.normalizeDiscountCode(dto.discountCode);
        const discount = await this.discountsRepository.findOneBy({
            discountCode: code,
            isActive: true,
        });
        if (!discount) {
            throw new common_1.NotFoundException('Discount code not found');
        }
        const alreadyUsed = await this.couponUsageRepository.findOneBy({
            discountId: discount.discountId,
            userId,
            orderId: dto.orderId,
        });
        if (alreadyUsed) {
            throw new common_1.ConflictException('Coupon already applied to this order');
        }
        const usage = this.couponUsageRepository.create({
            discountId: discount.discountId,
            userId,
            orderId: dto.orderId,
        });
        await this.couponUsageRepository.save(usage);
        discount.usedCount += 1;
        await this.discountsRepository.save(discount);
        return { success: true, usedCount: discount.usedCount };
    }
    async getDiscountStats(discountId) {
        const discount = await this.discountsRepository.findOneBy({ discountId });
        if (!discount) {
            throw new common_1.NotFoundException('Discount not found');
        }
        return this.getDiscountStatsInternal(discountId);
    }
    async getUserCouponHistory(userId) {
        const usages = await this.couponUsageRepository.find({
            where: { userId },
            order: { usedAt: 'DESC' },
        });
        const discountIds = [...new Set(usages.map((u) => u.discountId))];
        const discounts = discountIds.length
            ? await this.discountsRepository.findBy(discountIds.map((id) => ({ discountId: id })))
            : [];
        const discountMap = new Map(discounts.map((d) => [d.discountId, d]));
        return usages.map((u) => {
            const d = discountMap.get(u.discountId);
            return {
                usageId: u.usageId,
                orderId: u.orderId,
                usedAt: u.usedAt,
                discount: d
                    ? {
                        code: d.discountCode,
                        name: d.discountName,
                        type: d.discountType,
                        value: d.discountValue,
                    }
                    : null,
            };
        });
    }
    async saveVoucher(userId, discountId) {
        const discount = await this.discountsRepository.findOneBy({ discountId });
        if (!discount || !this.isDiscountClaimableByUser(discount, userId)) {
            throw new common_1.NotFoundException('Voucher not found or unavailable');
        }
        const existing = await this.savedVoucherRepository.findOneBy({
            userId,
            discountId,
        });
        if (existing) {
            return {
                saved: true,
                savedAt: existing.savedAt,
                voucher: this.toVoucherPayload(discount, { isSaved: true }),
            };
        }
        const saved = await this.savedVoucherRepository.save(this.savedVoucherRepository.create({ userId, discountId }));
        return {
            saved: true,
            savedAt: saved.savedAt,
            voucher: this.toVoucherPayload(discount, { isSaved: true }),
        };
    }
    async getSavedVouchers(userId) {
        const rows = await this.savedVoucherRepository.find({
            where: { userId },
            order: { savedAt: 'DESC' },
        });
        const discountIds = rows.map((row) => row.discountId);
        const discounts = discountIds.length
            ? await this.discountsRepository.findBy(discountIds.map((discountId) => ({ discountId })))
            : [];
        const discountMap = new Map(discounts.map((discount) => [discount.discountId, discount]));
        return rows
            .map((row) => {
            const discount = discountMap.get(row.discountId);
            if (!discount)
                return null;
            return {
                savedVoucherId: row.savedVoucherId,
                savedAt: row.savedAt,
                ...this.toVoucherPayload(discount, { isSaved: true }),
                isAvailable: this.isDiscountClaimableByUser(discount, userId),
            };
        })
            .filter(Boolean);
    }
    async findDiscountsByProduct(productId) {
        const now = new Date();
        const productMappings = await this.discountProductsRepository.findBy({
            productId,
        });
        const discountIds = productMappings.map((m) => m.discountId);
        if (discountIds.length === 0)
            return [];
        const discounts = await this.discountsRepository.findBy(discountIds.map((id) => ({ discountId: id })));
        return discounts.filter((d) => d.isActive &&
            d.startAt.getTime() <= now.getTime() &&
            d.expireDate.getTime() >= now.getTime());
    }
    async findDiscountsByCategory(categoryId) {
        const now = new Date();
        const categoryMappings = await this.discountCategoriesRepository.findBy({
            categoryId,
        });
        const discountIds = categoryMappings.map((m) => m.discountId);
        if (discountIds.length === 0)
            return [];
        const discounts = await this.discountsRepository.findBy(discountIds.map((id) => ({ discountId: id })));
        return discounts.filter((d) => d.isActive &&
            d.startAt.getTime() <= now.getTime() &&
            d.expireDate.getTime() >= now.getTime());
    }
    toVoucherPayload(discount, options = {}) {
        return {
            id: discount.discountId,
            code: discount.discountCode,
            name: discount.discountName,
            description: discount.discountDescription,
            type: discount.discountType,
            value: discount.discountValue,
            appliesTo: discount.appliesTo,
            minOrderValue: discount.minOrderValue,
            maxDiscountAmount: discount.maxDiscountAmount,
            expiresAt: discount.expireDate,
            isPrivate: discount.userId !== null,
            usageLimit: discount.usageLimit,
            usedCount: discount.usedCount,
            remainingUses: this.getRemainingUses(discount),
            isSaved: options.isSaved ?? false,
        };
    }
    getRemainingUses(discount) {
        if (discount.usageLimit === null)
            return null;
        return Math.max(0, discount.usageLimit - discount.usedCount);
    }
    isDiscountApprovedForUse(discount) {
        return [
            discount_entity_1.DiscountApprovalStatus.NOT_REQUIRED,
            discount_entity_1.DiscountApprovalStatus.APPROVED,
        ].includes(discount.approvalStatus);
    }
    isDiscountClaimableByUser(discount, userId) {
        const now = Date.now();
        return (discount.appliesTo === discount_entity_1.DiscountApplyTarget.ORDER &&
            discount.isActive &&
            discount.startAt.getTime() <= now &&
            discount.expireDate.getTime() >= now &&
            this.getRemainingUses(discount) !== 0 &&
            (discount.userId === null || discount.userId === userId) &&
            this.isDiscountApprovedForUse(discount));
    }
    calculateDiscountAmount(discount, orderValue) {
        const raw = discount.discountType === discount_entity_1.DiscountType.PERCENT
            ? (orderValue * Number(discount.discountValue)) / 100
            : Number(discount.discountValue);
        const max = discount.maxDiscountAmount
            ? Number(discount.maxDiscountAmount)
            : null;
        const capped = max !== null ? Math.min(raw, max) : raw;
        return Math.min(capped, orderValue);
    }
    async getDiscountStatsInternal(discountId) {
        const totalUsage = await this.couponUsageRepository.countBy({ discountId });
        const uniqueUsers = await this.couponUsageRepository
            .createQueryBuilder('usage')
            .select('COUNT(DISTINCT usage.user_id)', 'count')
            .where('usage.discount_id = :discountId', { discountId })
            .getRawOne();
        return {
            totalUsage,
            uniqueUsers: Number(uniqueUsers?.count ?? 0),
        };
    }
    normalizeDiscountCode(value) {
        return value.trim().toUpperCase();
    }
    async ensureDiscountCodeUnique(discountCode, excludeDiscountId) {
        const normalized = this.normalizeDiscountCode(discountCode);
        const existing = await this.discountsRepository.findOneBy({
            discountCode: normalized,
        });
        if (existing && existing.discountId !== excludeDiscountId) {
            throw new common_1.ConflictException('Discount code already exists');
        }
    }
    validateDiscountValue(type, value, maxDiscountAmount) {
        const numValue = Number(value);
        if (isNaN(numValue) || numValue <= 0) {
            throw new common_1.BadRequestException('Discount value must be greater than 0');
        }
        if (type === discount_entity_1.DiscountType.PERCENT && numValue > 100) {
            throw new common_1.BadRequestException('Percent discount cannot exceed 100%');
        }
        if (maxDiscountAmount != null) {
            const numMax = Number(maxDiscountAmount);
            if (isNaN(numMax) || numMax <= 0) {
                throw new common_1.BadRequestException('Max discount amount must be greater than 0');
            }
        }
    }
    validateDiscountDates(startAt, expireDate) {
        const start = startAt instanceof Date ? startAt : new Date(startAt);
        const expire = expireDate instanceof Date ? expireDate : new Date(expireDate);
        if (start.getTime() >= expire.getTime()) {
            throw new common_1.BadRequestException('Expire date must be after start date');
        }
    }
    async validateDiscountTargets(payload) {
        if (payload.appliesTo === discount_entity_1.DiscountApplyTarget.CATEGORY) {
            if (!payload.categoryIds || payload.categoryIds.length === 0) {
                throw new common_1.BadRequestException('Category discount requires categoryIds');
            }
            const categories = await this.categoriesRepository.findBy(payload.categoryIds.map((id) => ({ categoryId: id })));
            if (categories.length !== payload.categoryIds.length) {
                throw new common_1.NotFoundException('One or more categories not found');
            }
        }
        if (payload.appliesTo === discount_entity_1.DiscountApplyTarget.PRODUCT) {
            if (!payload.productIds || payload.productIds.length === 0) {
                throw new common_1.BadRequestException('Product discount requires productIds');
            }
            const products = await this.productsRepository.findBy(payload.productIds.map((id) => ({ productId: id })));
            if (products.length !== payload.productIds.length) {
                throw new common_1.NotFoundException('One or more products not found');
            }
        }
    }
    async syncDiscountTargets(discountId, payload) {
        await Promise.all([
            this.discountCategoriesRepository.delete({ discountId }),
            this.discountProductsRepository.delete({ discountId }),
        ]);
        if (payload.appliesTo === discount_entity_1.DiscountApplyTarget.CATEGORY &&
            payload.categoryIds?.length) {
            const entities = payload.categoryIds.map((categoryId) => this.discountCategoriesRepository.create({ discountId, categoryId }));
            await this.discountCategoriesRepository.save(entities);
        }
        if (payload.appliesTo === discount_entity_1.DiscountApplyTarget.PRODUCT &&
            payload.productIds?.length) {
            const entities = payload.productIds.map((productId) => this.discountProductsRepository.create({ discountId, productId }));
            await this.discountProductsRepository.save(entities);
        }
    }
    async findDiscountCategoryIds(discountId) {
        const mappings = await this.discountCategoriesRepository.find({
            where: { discountId },
            order: { categoryId: 'ASC' },
        });
        return mappings.map((m) => m.categoryId);
    }
    async findDiscountProductIds(discountId) {
        const mappings = await this.discountProductsRepository.find({
            where: { discountId },
            order: { productId: 'ASC' },
        });
        return mappings.map((m) => m.productId);
    }
};
exports.DiscountsService = DiscountsService;
exports.DiscountsService = DiscountsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(discount_entity_1.DiscountEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(discount_category_entity_1.DiscountCategoryEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(discount_product_entity_1.DiscountProductEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(coupon_usage_entity_1.CouponUsageEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(saved_voucher_entity_1.SavedVoucherEntity)),
    __param(5, (0, typeorm_1.InjectRepository)(category_entity_1.CategoryEntity)),
    __param(6, (0, typeorm_1.InjectRepository)(product_entity_1.ProductEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DiscountsService);
//# sourceMappingURL=discounts.service.js.map