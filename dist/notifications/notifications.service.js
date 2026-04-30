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
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nodemailer = __importStar(require("nodemailer"));
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../products/entities/product.entity");
const settings_service_1 = require("../settings/settings.service");
const user_entity_1 = require("../users/entities/user.entity");
const notification_entity_1 = require("./entities/notification.entity");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    notificationsRepository;
    usersRepository;
    productsRepository;
    settingsService;
    logger = new common_1.Logger(NotificationsService_1.name);
    constructor(notificationsRepository, usersRepository, productsRepository, settingsService) {
        this.notificationsRepository = notificationsRepository;
        this.usersRepository = usersRepository;
        this.productsRepository = productsRepository;
        this.settingsService = settingsService;
    }
    async createNotification(input) {
        const notification = this.notificationsRepository.create({
            userId: input.userId ?? null,
            email: input.email ?? null,
            channel: input.channel ?? notification_entity_1.NotificationChannel.SYSTEM,
            status: notification_entity_1.NotificationStatus.PENDING,
            title: input.title,
            message: input.message,
            metadata: input.metadata ?? null,
            deliveryError: null,
            sentAt: null,
        });
        try {
            const saved = await this.notificationsRepository.save(notification);
            return this.dispatchNotification(saved);
        }
        catch (error) {
            if (this.isMissingNotificationsTable(error)) {
                this.logger.warn('Notifications table is missing. Notification was skipped.');
                return this.toFallbackResponse(notification);
            }
            throw error;
        }
    }
    async getAdminSummary() {
        try {
            const items = await this.notificationsRepository.find({
                where: [
                    { channel: notification_entity_1.NotificationChannel.SYSTEM, userId: (0, typeorm_2.IsNull)() },
                ],
                order: { createdAt: 'DESC' },
                take: 20,
            });
            const dbNotifications = items.map((item) => this.toResponse(item));
            const lowStockAlerts = await this.getLowStockAlerts();
            const merged = [...dbNotifications, ...lowStockAlerts];
            merged.sort((a, b) => {
                const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return bTime - aTime;
            });
            return merged.slice(0, 30);
        }
        catch (error) {
            if (this.isMissingNotificationsTable(error)) {
                return [];
            }
            throw error;
        }
    }
    async getLowStockAlerts() {
        try {
            const lowStockProducts = await this.productsRepository.find({
                where: { isShow: true },
                order: { quantityAvailable: 'ASC' },
                take: 10,
            });
            const filtered = lowStockProducts.filter((p) => p.quantityAvailable <= 10);
            return filtered.map((p) => ({
                id: `low-stock-${p.productId}`,
                userId: null,
                email: null,
                channel: notification_entity_1.NotificationChannel.SYSTEM,
                status: notification_entity_1.NotificationStatus.SENT,
                title: 'Sản phẩm sắp hết hàng',
                message: `${p.productName} chỉ còn ${p.quantityAvailable} đơn vị`,
                metadata: {
                    productId: p.productId,
                    type: 'low_stock',
                    quantity: p.quantityAvailable,
                },
                deliveryError: null,
                sentAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            }));
        }
        catch {
            return [];
        }
    }
    async listMyNotifications(userId) {
        try {
            const items = await this.notificationsRepository.find({
                where: { userId },
                order: { createdAt: 'DESC' },
            });
            return items.map((item) => this.toResponse(item));
        }
        catch (error) {
            if (this.isMissingNotificationsTable(error)) {
                this.logger.warn('Notifications table is missing. Returning empty notifications list.');
                return [];
            }
            throw error;
        }
    }
    async sendOrderCreatedNotification(userId, orderId) {
        const user = await this.usersRepository.findOneBy({ userId });
        if (!user) {
            return null;
        }
        return Promise.all([
            this.createNotification({
                userId,
                channel: notification_entity_1.NotificationChannel.SYSTEM,
                title: 'Don hang da duoc tao',
                message: `Don hang ${orderId} da duoc tao thanh cong.`,
                metadata: { orderId, type: 'order_created' },
            }),
            this.createNotification({
                userId,
                email: user.email,
                channel: notification_entity_1.NotificationChannel.EMAIL,
                title: 'Xac nhan don hang',
                message: `He thong da ghi nhan don hang ${orderId} cua ban.`,
                metadata: { orderId, type: 'order_created' },
            }),
        ]);
    }
    async sendAdminOrderCreatedNotification(input) {
        return this.createNotification({
            userId: null,
            channel: notification_entity_1.NotificationChannel.SYSTEM,
            title: 'Co don hang moi',
            message: `Don ${input.orderId} tu ${input.fullName || input.phone} co tong tien ${input.totalPayment}.`,
            metadata: {
                orderId: input.orderId,
                fullName: input.fullName,
                phone: input.phone,
                totalPayment: input.totalPayment,
                type: 'admin_order_created',
            },
        });
    }
    async sendOrderStatusNotification(userId, orderId, status) {
        const user = await this.usersRepository.findOneBy({ userId });
        if (!user) {
            return null;
        }
        return Promise.all([
            this.createNotification({
                userId,
                channel: notification_entity_1.NotificationChannel.SYSTEM,
                title: 'Don hang da thay doi trang thai',
                message: `Don hang ${orderId} hien dang o trang thai ${status}.`,
                metadata: { orderId, status, type: 'order_status_changed' },
            }),
            this.createNotification({
                userId,
                email: user.email,
                channel: notification_entity_1.NotificationChannel.EMAIL,
                title: 'Cap nhat trang thai don hang',
                message: `Don hang ${orderId} da chuyen sang trang thai ${status}.`,
                metadata: { orderId, status, type: 'order_status_changed' },
            }),
        ]);
    }
    async sendPaymentNotification(userId, orderId, paymentStatus, provider) {
        const user = await this.usersRepository.findOneBy({ userId });
        if (!user) {
            return null;
        }
        return Promise.all([
            this.createNotification({
                userId,
                channel: notification_entity_1.NotificationChannel.SYSTEM,
                title: 'Cap nhat thanh toan',
                message: `Thanh toan ${provider} cho don ${orderId} da o trang thai ${paymentStatus}.`,
                metadata: { orderId, paymentStatus, provider, type: 'payment_status' },
            }),
            this.createNotification({
                userId,
                email: user.email,
                channel: notification_entity_1.NotificationChannel.EMAIL,
                title: 'Cap nhat thanh toan don hang',
                message: `Don hang ${orderId} co ket qua thanh toan ${paymentStatus} qua ${provider}.`,
                metadata: { orderId, paymentStatus, provider, type: 'payment_status' },
            }),
        ]);
    }
    async dispatchNotification(notification) {
        if (notification.channel === notification_entity_1.NotificationChannel.SYSTEM) {
            notification.status = notification_entity_1.NotificationStatus.SENT;
            notification.sentAt = new Date();
            return this.toResponse(await this.notificationsRepository.save(notification));
        }
        const smtp = await this.settingsService.getResolvedSmtpConfig();
        const { host, port, user, pass, from } = smtp;
        if (!host || !user || !pass || !notification.email) {
            notification.status = notification_entity_1.NotificationStatus.SKIPPED;
            notification.deliveryError = 'SMTP not configured';
            return this.toResponse(await this.notificationsRepository.save(notification));
        }
        try {
            const transporter = nodemailer.createTransport({
                host,
                port,
                secure: smtp.secure,
                auth: { user, pass },
            });
            await transporter.sendMail({
                from,
                to: notification.email,
                subject: notification.title,
                text: notification.message,
            });
            notification.status = notification_entity_1.NotificationStatus.SENT;
            notification.sentAt = new Date();
            notification.deliveryError = null;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            notification.status = notification_entity_1.NotificationStatus.FAILED;
            notification.deliveryError = message;
            this.logger.error(`Failed to send email notification: ${message}`);
        }
        return this.toResponse(await this.notificationsRepository.save(notification));
    }
    toResponse(notification) {
        return {
            id: notification.notificationId,
            userId: notification.userId,
            email: notification.email,
            channel: notification.channel,
            status: notification.status,
            title: notification.title,
            message: notification.message,
            metadata: notification.metadata,
            deliveryError: notification.deliveryError,
            sentAt: notification.sentAt,
            createdAt: notification.createdAt,
            updatedAt: notification.updatedAt,
        };
    }
    toFallbackResponse(notification) {
        return {
            id: null,
            userId: notification.userId ?? null,
            email: notification.email ?? null,
            channel: notification.channel ?? notification_entity_1.NotificationChannel.SYSTEM,
            status: notification_entity_1.NotificationStatus.SKIPPED,
            title: notification.title ?? '',
            message: notification.message ?? '',
            metadata: notification.metadata ?? null,
            deliveryError: 'Notifications table is missing',
            sentAt: null,
            createdAt: null,
            updatedAt: null,
        };
    }
    isMissingNotificationsTable(error) {
        if (!(error instanceof typeorm_2.QueryFailedError)) {
            return false;
        }
        const driverError = error.driverError;
        return (driverError?.code === 'ER_NO_SUCH_TABLE' ||
            driverError?.errno === 1146 ||
            driverError?.sqlMessage?.includes("Table 'agri_ecommerce.notifications_v2' doesn't exist") === true);
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.NotificationEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.ProductEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        settings_service_1.SettingsService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map