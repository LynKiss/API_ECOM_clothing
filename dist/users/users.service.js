"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const node_crypto_1 = require("node:crypto");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = __importStar(require("bcrypt"));
const cart_item_entity_1 = require("../carts/entities/cart-item.entity");
const shopping_cart_entity_1 = require("../carts/entities/shopping-cart.entity");
const contact_entity_1 = require("../contacts/entities/contact.entity");
const notification_entity_1 = require("../notifications/entities/notification.entity");
const order_item_entity_1 = require("../orders/entities/order-item.entity");
const order_entity_1 = require("../orders/entities/order.entity");
const payment_transaction_entity_1 = require("../orders/entities/payment-transaction.entity");
const return_entity_1 = require("../orders/entities/return.entity");
const shipping_address_entity_1 = require("../orders/entities/shipping-address.entity");
const typeorm_2 = require("typeorm");
const refresh_token_entity_1 = require("./entities/refresh-token.entity");
const user_entity_1 = require("./entities/user.entity");
const wishlist_entity_1 = require("../products/entities/wishlist.entity");
let UsersService = class UsersService {
    usersRepository;
    refreshTokensRepository;
    contactsRepository;
    shoppingCartsRepository;
    cartItemsRepository;
    wishlistRepository;
    notificationsRepository;
    shippingAddressesRepository;
    ordersRepository;
    orderItemsRepository;
    returnsRepository;
    paymentTransactionsRepository;
    constructor(usersRepository, refreshTokensRepository, contactsRepository, shoppingCartsRepository, cartItemsRepository, wishlistRepository, notificationsRepository, shippingAddressesRepository, ordersRepository, orderItemsRepository, returnsRepository, paymentTransactionsRepository) {
        this.usersRepository = usersRepository;
        this.refreshTokensRepository = refreshTokensRepository;
        this.contactsRepository = contactsRepository;
        this.shoppingCartsRepository = shoppingCartsRepository;
        this.cartItemsRepository = cartItemsRepository;
        this.wishlistRepository = wishlistRepository;
        this.notificationsRepository = notificationsRepository;
        this.shippingAddressesRepository = shippingAddressesRepository;
        this.ordersRepository = ordersRepository;
        this.orderItemsRepository = orderItemsRepository;
        this.returnsRepository = returnsRepository;
        this.paymentTransactionsRepository = paymentTransactionsRepository;
    }
    async findOneByUsername(username) {
        return this.usersRepository.findOne({
            where: [{ username }, { email: username }],
        });
    }
    async findOneByIdForAuth(userId) {
        return this.usersRepository.findOne({
            where: { userId },
        });
    }
    async findAll(query) {
        const page = query?.page ?? 1;
        const limit = query?.limit ?? 10;
        const queryBuilder = this.usersRepository.createQueryBuilder('user');
        if (query?.search) {
            queryBuilder.andWhere('(user.username LIKE :search OR user.email LIKE :search)', { search: `%${query.search}%` });
        }
        if (query?.role) {
            queryBuilder.andWhere('user.role = :role', { role: query.role });
        }
        if (query?.isActive !== undefined) {
            queryBuilder.andWhere('user.is_active = :isActive', {
                isActive: query.isActive === 'true',
            });
        }
        queryBuilder
            .orderBy('user.created_at', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        const [users, total] = await queryBuilder.getManyAndCount();
        return {
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            items: users.map((user) => ({
                ...this.toPublicUser(user),
                isActive: user.isActive,
                isWholesale: user.isWholesale,
                createdAt: user.createdAt,
            })),
        };
    }
    async findProfile(userId) {
        const user = await this.usersRepository.findOneBy({ userId });
        if (!user) {
            throw new common_1.UnauthorizedException('Nguoi dung khong ton tai');
        }
        return { ...this.toPublicUser(user), isWholesale: user.isWholesale };
    }
    async register(registerUserDto) {
        const existedUser = await this.usersRepository.findOne({
            where: [
                { username: registerUserDto.username },
                { email: registerUserDto.email },
            ],
        });
        if (existedUser) {
            throw new common_1.ConflictException('Username hoac email da ton tai');
        }
        const user = this.usersRepository.create({
            userId: (0, node_crypto_1.randomUUID)(),
            username: registerUserDto.username,
            email: registerUserDto.email,
            fullName: registerUserDto.fullName?.trim() || null,
            phoneNumber: registerUserDto.phoneNumber?.trim() || null,
            avatarUrl: registerUserDto.avatarUrl ?? null,
            role: user_entity_1.UserRole.CUSTOMER,
            passwordHash: await this.hashPassword(registerUserDto.password),
            provider: 'local',
            providerId: null,
            isActive: true,
            resetPasswordCode: null,
            resetPasswordExpiresAt: null,
        });
        const savedUser = await this.usersRepository.save(user);
        return {
            _id: savedUser.userId,
            username: savedUser.username,
            email: savedUser.email,
            role: savedUser.role,
            message: 'Dang ky tai khoan thanh cong',
        };
    }
    async hashPassword(password) {
        return bcrypt.hash(password, 10);
    }
    async createAdminUser(actorUserId, createAdminUserDto) {
        await this.ensureUserExists(actorUserId);
        await this.ensureUniqueIdentity(createAdminUserDto.username, createAdminUserDto.email);
        const user = this.usersRepository.create({
            userId: (0, node_crypto_1.randomUUID)(),
            username: createAdminUserDto.username,
            email: createAdminUserDto.email,
            fullName: createAdminUserDto.fullName?.trim() || null,
            phoneNumber: createAdminUserDto.phoneNumber?.trim() || null,
            avatarUrl: createAdminUserDto.avatarUrl ?? null,
            role: createAdminUserDto.role ?? user_entity_1.UserRole.CUSTOMER,
            passwordHash: await this.hashPassword(createAdminUserDto.password),
            provider: 'local',
            providerId: null,
            isActive: createAdminUserDto.isActive ?? true,
            resetPasswordCode: null,
            resetPasswordExpiresAt: null,
        });
        const savedUser = await this.usersRepository.save(user);
        return {
            ...this.toPublicUser(savedUser),
            isActive: savedUser.isActive,
            createdAt: savedUser.createdAt,
            updatedAt: savedUser.updatedAt,
        };
    }
    async checkUserPassword(password, hash) {
        if (!hash) {
            return false;
        }
        return bcrypt.compare(password, hash);
    }
    async updateUserRefreshToken(userId, refreshToken, expiredAt) {
        if (!refreshToken) {
            await this.refreshTokensRepository.update({ userId, isRevoked: false }, { isRevoked: true });
            return;
        }
        await this.refreshTokensRepository.update({ userId, isRevoked: false }, { isRevoked: true });
        const hashedRefreshToken = await this.hashPassword(refreshToken);
        const existingToken = await this.refreshTokensRepository.findOne({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
        if (existingToken) {
            existingToken.refreshToken = hashedRefreshToken;
            existingToken.expiredAt = expiredAt ?? new Date();
            existingToken.isRevoked = false;
            await this.refreshTokensRepository.save(existingToken);
            return;
        }
        const entity = this.refreshTokensRepository.create({
            userId,
            refreshToken: hashedRefreshToken,
            expiredAt: expiredAt ?? new Date(),
            isRevoked: false,
        });
        await this.refreshTokensRepository.save(entity);
    }
    async validateStoredRefreshToken(userId, refreshToken) {
        const storedToken = await this.refreshTokensRepository.findOne({
            where: { userId, isRevoked: false },
            order: { createdAt: 'DESC' },
        });
        if (!storedToken) {
            throw new common_1.UnauthorizedException('Refresh token khong hop le');
        }
        const isValid = await this.checkUserPassword(refreshToken, storedToken.refreshToken);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Refresh token khong hop le');
        }
        if (storedToken.expiredAt.getTime() <= Date.now()) {
            await this.refreshTokensRepository.update({ tokenId: storedToken.tokenId }, { isRevoked: true });
            throw new common_1.UnauthorizedException('Refresh token da het han');
        }
    }
    async revokeActiveRefreshTokens(userId) {
        await this.refreshTokensRepository.update({ userId, isRevoked: false }, { isRevoked: true });
    }
    toPublicUser(user) {
        return {
            _id: user.userId,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            avatarUrl: user.avatarUrl,
            role: {
                _id: user.role,
                name: user.role,
            },
            permissions: [],
        };
    }
    toShippingAddressResponse(address) {
        return {
            id: address.shippingAddressId,
            recipientName: address.recipientName,
            phone: address.phone,
            addressLine: address.addressLine,
            ward: address.ward,
            district: address.district,
            province: address.province,
            isDefault: address.isDefault,
            createdAt: address.createdAt,
            updatedAt: address.updatedAt,
        };
    }
    toOrderSummaryResponse(order) {
        return {
            id: order.orderId,
            status: order.orderStatus,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            totalPayment: order.totalPayment,
            totalQuantity: order.totalQuantity,
            createdAt: order.createdAt,
            fullName: order.fullName,
            phone: order.phone,
            address: order.address,
        };
    }
    async ensureUserExists(userId) {
        const user = await this.usersRepository.findOneBy({ userId });
        if (!user) {
            throw new common_1.UnauthorizedException('Nguoi dung khong ton tai');
        }
        return user;
    }
    async ensureUniqueIdentity(username, email, excludeUserId) {
        const existedByUsername = await this.usersRepository.findOne({
            where: { username },
        });
        if (existedByUsername && existedByUsername.userId !== excludeUserId) {
            throw new common_1.ConflictException('Username da ton tai');
        }
        const existedByEmail = await this.usersRepository.findOne({
            where: { email },
        });
        if (existedByEmail && existedByEmail.userId !== excludeUserId) {
            throw new common_1.ConflictException('Email da ton tai');
        }
    }
    async clearDefaultShippingAddress(userId) {
        await this.shippingAddressesRepository.update({ userId }, { isDefault: false });
    }
    async findOwnedShippingAddress(userId, shippingAddressId) {
        const address = await this.shippingAddressesRepository.findOneBy({
            shippingAddressId,
            userId,
        });
        if (!address) {
            throw new common_1.NotFoundException('Dia chi giao hang khong ton tai');
        }
        return address;
    }
    async updateProfile(userId, updateUserDto) {
        const user = await this.ensureUserExists(userId);
        if (updateUserDto.username !== undefined) {
            const existedUsername = await this.usersRepository.findOne({
                where: { username: updateUserDto.username },
            });
            if (existedUsername && existedUsername.userId !== userId) {
                throw new common_1.ConflictException('Username da ton tai');
            }
            user.username = updateUserDto.username;
        }
        if (updateUserDto.avatarUrl !== undefined) {
            user.avatarUrl = updateUserDto.avatarUrl;
        }
        if (updateUserDto.fullName !== undefined) {
            user.fullName = updateUserDto.fullName.trim() || null;
        }
        if (updateUserDto.phoneNumber !== undefined) {
            user.phoneNumber = updateUserDto.phoneNumber.trim() || null;
        }
        const savedUser = await this.usersRepository.save(user);
        return this.toPublicUser(savedUser);
    }
    async uploadMyAvatar(userId, file) {
        const user = await this.ensureUserExists(userId);
        user.avatarUrl = await this.uploadAvatarToCloudinary(file, userId);
        const savedUser = await this.usersRepository.save(user);
        return this.toPublicUser(savedUser);
    }
    async changePassword(userId, dto) {
        const user = await this.ensureUserExists(userId);
        if (!user.passwordHash) {
            throw new common_1.BadRequestException('Tai khoan khong ho tro mat khau');
        }
        const isCorrectPassword = await this.checkUserPassword(dto.oldPassword, user.passwordHash);
        if (!isCorrectPassword) {
            throw new common_1.BadRequestException('Mat khau cu khong dung');
        }
        const isSamePassword = await this.checkUserPassword(dto.newPassword, user.passwordHash);
        if (isSamePassword) {
            throw new common_1.BadRequestException('Mat khau moi phai khac mat khau cu');
        }
        user.passwordHash = await this.hashPassword(dto.newPassword);
        await this.usersRepository.save(user);
        return {
            message: 'Doi mat khau thanh cong',
        };
    }
    async findMyShippingAddresses(userId) {
        await this.ensureUserExists(userId);
        const addresses = await this.shippingAddressesRepository.find({
            where: { userId },
            order: { isDefault: 'DESC', updatedAt: 'DESC' },
        });
        return addresses.map((address) => this.toShippingAddressResponse(address));
    }
    async createShippingAddress(userId, createShippingAddressDto) {
        await this.ensureUserExists(userId);
        const existingCount = await this.shippingAddressesRepository.count({
            where: { userId },
        });
        const shouldSetDefault = createShippingAddressDto.isDefault === true || existingCount === 0;
        if (shouldSetDefault) {
            await this.clearDefaultShippingAddress(userId);
        }
        const address = this.shippingAddressesRepository.create({
            userId,
            recipientName: createShippingAddressDto.recipientName,
            phone: createShippingAddressDto.phone,
            addressLine: createShippingAddressDto.addressLine,
            ward: createShippingAddressDto.ward ?? null,
            district: createShippingAddressDto.district ?? null,
            province: createShippingAddressDto.province ?? null,
            isDefault: shouldSetDefault,
        });
        const savedAddress = await this.shippingAddressesRepository.save(address);
        return this.toShippingAddressResponse(savedAddress);
    }
    async updateShippingAddress(userId, shippingAddressId, updateShippingAddressDto) {
        const address = await this.findOwnedShippingAddress(userId, shippingAddressId);
        if (updateShippingAddressDto.isDefault === true) {
            await this.clearDefaultShippingAddress(userId);
            address.isDefault = true;
        }
        if (updateShippingAddressDto.recipientName !== undefined) {
            address.recipientName = updateShippingAddressDto.recipientName;
        }
        if (updateShippingAddressDto.phone !== undefined) {
            address.phone = updateShippingAddressDto.phone;
        }
        if (updateShippingAddressDto.addressLine !== undefined) {
            address.addressLine = updateShippingAddressDto.addressLine;
        }
        if (updateShippingAddressDto.ward !== undefined) {
            address.ward = updateShippingAddressDto.ward ?? null;
        }
        if (updateShippingAddressDto.district !== undefined) {
            address.district = updateShippingAddressDto.district ?? null;
        }
        if (updateShippingAddressDto.province !== undefined) {
            address.province = updateShippingAddressDto.province ?? null;
        }
        const savedAddress = await this.shippingAddressesRepository.save(address);
        return this.toShippingAddressResponse(savedAddress);
    }
    async deleteShippingAddress(userId, shippingAddressId) {
        const address = await this.findOwnedShippingAddress(userId, shippingAddressId);
        await this.shippingAddressesRepository.delete({
            shippingAddressId,
            userId,
        });
        if (address.isDefault) {
            const nextAddress = await this.shippingAddressesRepository.findOne({
                where: { userId },
                order: { updatedAt: 'DESC' },
            });
            if (nextAddress) {
                nextAddress.isDefault = true;
                await this.shippingAddressesRepository.save(nextAddress);
            }
        }
        return {
            id: shippingAddressId,
            deleted: true,
        };
    }
    async setDefaultShippingAddress(userId, shippingAddressId) {
        const address = await this.findOwnedShippingAddress(userId, shippingAddressId);
        await this.clearDefaultShippingAddress(userId);
        address.isDefault = true;
        const savedAddress = await this.shippingAddressesRepository.save(address);
        return this.toShippingAddressResponse(savedAddress);
    }
    async findMyOrders(userId, opts) {
        await this.ensureUserExists(userId);
        const where = { userId };
        if (opts.status && opts.status !== 'all')
            where.status = opts.status;
        const [orders, total] = await this.ordersRepository.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            skip: (opts.page - 1) * opts.limit,
            take: opts.limit,
        });
        return {
            items: orders.map((order) => this.toOrderSummaryResponse(order)),
            total,
            page: opts.page,
            limit: opts.limit,
            totalPages: Math.ceil(total / opts.limit),
        };
    }
    async findMyOrderDetail(userId, orderId) {
        await this.ensureUserExists(userId);
        const order = await this.ordersRepository.findOneBy({ orderId, userId });
        if (!order) {
            throw new common_1.NotFoundException('Don hang khong ton tai');
        }
        const items = await this.orderItemsRepository.find({
            where: { orderId: order.orderId },
            order: { createdAt: 'ASC', orderItemId: 'ASC' },
        });
        return {
            ...this.toOrderSummaryResponse(order),
            shippingAddressId: order.shippingAddressId,
            deliveryId: order.deliveryId,
            discountId: order.discountId,
            subtotalAmount: order.subtotalAmount,
            discountAmount: order.discountAmount,
            deliveryCost: order.deliveryCost,
            note: order.note,
            items: items.map((item) => ({
                id: item.orderItemId,
                productId: item.productId,
                productName: item.productName,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                lineTotal: item.lineTotal,
            })),
        };
    }
    async findAdminUserDetail(userId) {
        const user = await this.usersRepository.findOneBy({ userId });
        if (!user) {
            throw new common_1.NotFoundException('Nguoi dung khong ton tai');
        }
        const [addressesCount, ordersCount] = await Promise.all([
            this.shippingAddressesRepository.count({ where: { userId } }),
            this.ordersRepository.count({ where: { userId } }),
        ]);
        return {
            ...this.toPublicUser(user),
            isActive: user.isActive,
            isWholesale: user.isWholesale,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            statistics: {
                addressesCount,
                ordersCount,
            },
        };
    }
    async updateAdminUser(actorUserId, userId, updateAdminUserDto) {
        const user = await this.ensureUserExists(userId);
        if (updateAdminUserDto.username !== undefined) {
            await this.ensureUniqueIdentity(updateAdminUserDto.username, updateAdminUserDto.email ?? user.email, userId);
            user.username = updateAdminUserDto.username;
        }
        if (updateAdminUserDto.email !== undefined &&
            updateAdminUserDto.email !== user.email) {
            await this.ensureUniqueIdentity(updateAdminUserDto.username ?? user.username, updateAdminUserDto.email, userId);
            user.email = updateAdminUserDto.email;
        }
        if (updateAdminUserDto.avatarUrl !== undefined) {
            user.avatarUrl = updateAdminUserDto.avatarUrl;
        }
        if (updateAdminUserDto.fullName !== undefined) {
            user.fullName = updateAdminUserDto.fullName.trim() || null;
        }
        if (updateAdminUserDto.phoneNumber !== undefined) {
            user.phoneNumber = updateAdminUserDto.phoneNumber.trim() || null;
        }
        if (updateAdminUserDto.password !== undefined) {
            user.passwordHash = await this.hashPassword(updateAdminUserDto.password);
        }
        if (updateAdminUserDto.role !== undefined) {
            if (actorUserId === userId && updateAdminUserDto.role !== user.role) {
                throw new common_1.BadRequestException('Khong the tu thay doi vai tro cua chinh minh');
            }
            user.role = updateAdminUserDto.role;
        }
        if (updateAdminUserDto.isActive !== undefined) {
            if (actorUserId === userId && updateAdminUserDto.isActive === false) {
                throw new common_1.BadRequestException('Khong the tu vo hieu hoa tai khoan cua chinh minh');
            }
            user.isActive = updateAdminUserDto.isActive;
        }
        if (updateAdminUserDto.isWholesale !== undefined) {
            user.isWholesale = updateAdminUserDto.isWholesale;
        }
        const savedUser = await this.usersRepository.save(user);
        return {
            ...this.toPublicUser(savedUser),
            isActive: savedUser.isActive,
            isWholesale: savedUser.isWholesale,
            createdAt: savedUser.createdAt,
            updatedAt: savedUser.updatedAt,
        };
    }
    async uploadAdminUserAvatar(actorUserId, userId, file) {
        await this.ensureUserExists(actorUserId);
        const user = await this.ensureUserExists(userId);
        user.avatarUrl = await this.uploadAvatarToCloudinary(file, userId);
        const savedUser = await this.usersRepository.save(user);
        return {
            ...this.toPublicUser(savedUser),
            isActive: savedUser.isActive,
            createdAt: savedUser.createdAt,
            updatedAt: savedUser.updatedAt,
        };
    }
    async updateAdminUserStatus(actorUserId, userId, updateAdminUserStatusDto) {
        const user = await this.ensureUserExists(userId);
        if (updateAdminUserStatusDto.isActive !== undefined) {
            if (actorUserId === userId && updateAdminUserStatusDto.isActive === false) {
                throw new common_1.BadRequestException('Khong the tu vo hieu hoa tai khoan cua chinh minh');
            }
            user.isActive = updateAdminUserStatusDto.isActive;
        }
        const savedUser = await this.usersRepository.save(user);
        return {
            ...this.toPublicUser(savedUser),
            isActive: savedUser.isActive,
        };
    }
    async resetAdminUserPassword(actorUserId, userId, dto) {
        const user = await this.ensureUserExists(userId);
        if (actorUserId === userId) {
            throw new common_1.BadRequestException('Khong the tu reset mat khau cua chinh minh bang thao tac admin');
        }
        user.passwordHash = await this.hashPassword(dto.newPassword);
        const savedUser = await this.usersRepository.save(user);
        await this.refreshTokensRepository.update({ userId: savedUser.userId, isRevoked: false }, { isRevoked: true });
        return {
            ...this.toPublicUser(savedUser),
            passwordReset: true,
        };
    }
    async deleteAdminUser(actorUserId, userId) {
        const user = await this.ensureUserExists(userId);
        if (actorUserId === userId) {
            throw new common_1.BadRequestException('Khong the tu xoa tai khoan cua chinh minh');
        }
        const [ordersCount, returnsCount, paymentTransactionsCount] = await Promise.all([
            this.ordersRepository.count({ where: { userId } }),
            this.returnsRepository.count({ where: { userId } }),
            this.paymentTransactionsRepository.count({ where: { userId } }),
        ]);
        if (ordersCount > 0 || returnsCount > 0 || paymentTransactionsCount > 0) {
            throw new common_1.BadRequestException('Khong the xoa tai khoan da phat sinh don hang, tra hang hoac giao dich thanh toan');
        }
        const carts = await this.shoppingCartsRepository.find({
            where: { userId },
            select: { cartId: true },
        });
        const cartIds = carts.map((cart) => cart.cartId);
        if (cartIds.length > 0) {
            await this.cartItemsRepository.delete({ cartId: (0, typeorm_2.In)(cartIds) });
            await this.shoppingCartsRepository.delete({ userId });
        }
        await Promise.all([
            this.wishlistRepository.delete({ userId }),
            this.shippingAddressesRepository.delete({ userId }),
            this.refreshTokensRepository.delete({ userId }),
            this.contactsRepository.update({ userId }, { userId: null }),
            this.notificationsRepository.update({ userId }, { userId: null, email: user.email }),
        ]);
        await this.usersRepository.delete({ userId });
        return {
            _id: user.userId,
            deleted: true,
        };
    }
    async uploadAvatarToCloudinary(file, userId) {
        if (!file) {
            throw new common_1.BadRequestException('Image file is required');
        }
        if (!file.mimetype.startsWith('image/')) {
            throw new common_1.BadRequestException('Only image files are allowed');
        }
        if (file.size > 5 * 1024 * 1024) {
            throw new common_1.BadRequestException('Image size must be 5MB or less');
        }
        const cloudName = process.env.CLOUD_NAME;
        const apiKey = process.env.API_KEY;
        const apiSecret = process.env.API_SECRET;
        if (!cloudName || !apiKey || !apiSecret) {
            throw new common_1.InternalServerErrorException('Cloudinary environment variables are missing');
        }
        const folder = 'agri_ecommerce/avatars';
        const timestamp = Math.floor(Date.now() / 1000);
        const publicId = `${userId}-${Date.now()}`;
        const signature = (0, node_crypto_1.createHash)('sha1')
            .update(`folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
            .digest('hex');
        const formData = new FormData();
        formData.append('file', new Blob([new Uint8Array(file.buffer)], { type: file.mimetype }), file.originalname);
        formData.append('api_key', apiKey);
        formData.append('timestamp', String(timestamp));
        formData.append('signature', signature);
        formData.append('folder', folder);
        formData.append('public_id', publicId);
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: formData });
        const payload = (await response.json());
        if (!response.ok || !payload.secure_url) {
            throw new common_1.InternalServerErrorException(payload.error?.message ?? 'Unable to upload image to Cloudinary');
        }
        return payload.secure_url;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(refresh_token_entity_1.RefreshTokenEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(contact_entity_1.ContactEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(shopping_cart_entity_1.ShoppingCartEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(cart_item_entity_1.CartItemEntity)),
    __param(5, (0, typeorm_1.InjectRepository)(wishlist_entity_1.WishlistEntity)),
    __param(6, (0, typeorm_1.InjectRepository)(notification_entity_1.NotificationEntity)),
    __param(7, (0, typeorm_1.InjectRepository)(shipping_address_entity_1.ShippingAddressEntity)),
    __param(8, (0, typeorm_1.InjectRepository)(order_entity_1.OrderEntity)),
    __param(9, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItemEntity)),
    __param(10, (0, typeorm_1.InjectRepository)(return_entity_1.ReturnEntity)),
    __param(11, (0, typeorm_1.InjectRepository)(payment_transaction_entity_1.PaymentTransactionEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map