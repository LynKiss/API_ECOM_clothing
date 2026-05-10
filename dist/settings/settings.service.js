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
var SettingsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = exports.createDefaultClientFeatureSettings = exports.createDefaultAdminSidebarSettings = exports.createDefaultSmtpSettings = exports.createDefaultPaymentSettings = exports.createDefaultMembershipTierSettings = exports.PAYMENT_METHOD_KEYS = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const system_setting_entity_1 = require("./entities/system-setting.entity");
exports.PAYMENT_METHOD_KEYS = [
    'cod',
    'bank_transfer',
    'momo',
    'vnpay',
    'zalopay',
];
const PAYMENT_SETTINGS_KEY = 'commerce_payments';
const SMTP_SETTINGS_KEY = 'commerce_smtp';
const ADMIN_SIDEBAR_SETTINGS_KEY = 'admin_sidebar';
const CLIENT_FEATURE_SETTINGS_KEY = 'client_features';
const MEMBERSHIP_TIERS_KEY = 'membership_tiers';
const createDefaultMembershipTierSettings = () => [
    { tier: 'silver', label: 'Bạc', minSpent: 3_000_000, discountPercent: 5, couponValidDays: 30 },
    { tier: 'gold', label: 'Vàng', minSpent: 10_000_000, discountPercent: 10, couponValidDays: 60 },
    { tier: 'diamond', label: 'Kim Cương', minSpent: 20_000_000, discountPercent: 15, couponValidDays: 90 },
];
exports.createDefaultMembershipTierSettings = createDefaultMembershipTierSettings;
const createDefaultPaymentSettings = () => ({
    cod: {
        isActive: true,
        description: 'Khach hang thanh toan khi nhan hang.',
    },
    bank_transfer: {
        isActive: true,
        description: 'Chuyen khoan ngan hang va doi doi chieu giao dich.',
        bankName: '',
        accountNumber: '',
        accountHolder: '',
    },
    momo: {
        isActive: false,
        description: 'Thanh toan qua vi MoMo.',
        partnerCode: '',
        accessKey: '',
        secretKey: '',
    },
    vnpay: {
        isActive: false,
        description: 'Thanh toan qua cong VNPay.',
        tmnCode: '',
        hashSecret: '',
    },
    zalopay: {
        isActive: false,
        description: 'Thanh toan qua vi ZaloPay.',
        appId: '',
        key1: '',
        key2: '',
    },
});
exports.createDefaultPaymentSettings = createDefaultPaymentSettings;
const createDefaultSmtpSettings = () => ({
    host: '',
    port: '587',
    user: '',
    pass: '',
    from: '',
    secure: false,
});
exports.createDefaultSmtpSettings = createDefaultSmtpSettings;
const createDefaultAdminSidebarSettings = () => ({
    hiddenItemIds: [],
});
exports.createDefaultAdminSidebarSettings = createDefaultAdminSidebarSettings;
const createDefaultClientFeatureSettings = () => ({
    productRecommendationsEnabled: true,
});
exports.createDefaultClientFeatureSettings = createDefaultClientFeatureSettings;
let SettingsService = SettingsService_1 = class SettingsService {
    settingsRepository;
    configService;
    logger = new common_1.Logger(SettingsService_1.name);
    constructor(settingsRepository, configService) {
        this.settingsRepository = settingsRepository;
        this.configService = configService;
    }
    async getAdminCommerceSettings() {
        const [payments, smtp, clientFeatures] = await Promise.all([
            this.getPaymentSettings(),
            this.getSmtpSettings(),
            this.getClientFeatureSettings(),
        ]);
        return { payments, smtp, clientFeatures };
    }
    async getPublicCommerceSettings() {
        const [payments, clientFeatures] = await Promise.all([
            this.getPaymentSettings(),
            this.getClientFeatureSettings(),
        ]);
        const publicPayments = exports.PAYMENT_METHOD_KEYS.reduce((accumulator, key) => {
            const current = payments[key];
            accumulator[key] = {
                isActive: current.isActive,
                description: current.description,
                bankName: current.bankName ?? '',
                accountNumber: current.accountNumber ?? '',
                accountHolder: current.accountHolder ?? '',
            };
            return accumulator;
        }, this.createDefaultPublicPaymentSettings());
        return { payments: publicPayments, clientFeatures };
    }
    async getPaymentSettings() {
        return this.getJsonSetting(PAYMENT_SETTINGS_KEY, (0, exports.createDefaultPaymentSettings)(), (value) => this.normalizePaymentSettings(value));
    }
    async savePaymentSettings(value) {
        const nextValue = this.normalizePaymentSettings(value);
        await this.saveJsonSetting(PAYMENT_SETTINGS_KEY, nextValue);
        return nextValue;
    }
    async getSmtpSettings() {
        return this.getJsonSetting(SMTP_SETTINGS_KEY, (0, exports.createDefaultSmtpSettings)(), (value) => this.normalizeSmtpSettings(value));
    }
    async saveSmtpSettings(value) {
        const nextValue = this.normalizeSmtpSettings(value);
        await this.saveJsonSetting(SMTP_SETTINGS_KEY, nextValue);
        return nextValue;
    }
    async getAdminSidebarSettings() {
        return this.getJsonSetting(ADMIN_SIDEBAR_SETTINGS_KEY, (0, exports.createDefaultAdminSidebarSettings)(), (value) => this.normalizeAdminSidebarSettings(value));
    }
    async saveAdminSidebarSettings(value) {
        const nextValue = this.normalizeAdminSidebarSettings(value);
        await this.saveJsonSetting(ADMIN_SIDEBAR_SETTINGS_KEY, nextValue);
        return nextValue;
    }
    async getClientFeatureSettings() {
        return this.getJsonSetting(CLIENT_FEATURE_SETTINGS_KEY, (0, exports.createDefaultClientFeatureSettings)(), (value) => this.normalizeClientFeatureSettings(value));
    }
    async saveClientFeatureSettings(value) {
        const nextValue = this.normalizeClientFeatureSettings(value);
        await this.saveJsonSetting(CLIENT_FEATURE_SETTINGS_KEY, nextValue);
        return nextValue;
    }
    async getMembershipTierSettings() {
        return this.getJsonSetting(MEMBERSHIP_TIERS_KEY, (0, exports.createDefaultMembershipTierSettings)(), (value) => this.normalizeMembershipTierSettings(value));
    }
    async saveMembershipTierSettings(value) {
        const nextValue = this.normalizeMembershipTierSettings(value);
        await this.saveJsonSetting(MEMBERSHIP_TIERS_KEY, nextValue);
        return nextValue;
    }
    normalizeMembershipTierSettings(value) {
        const defaults = (0, exports.createDefaultMembershipTierSettings)();
        if (!Array.isArray(value))
            return defaults;
        const tiers = [];
        for (const item of value) {
            const src = this.asRecord(item);
            if (!src)
                continue;
            const tier = this.asString(src.tier);
            if (!['silver', 'gold', 'diamond'].includes(tier))
                continue;
            const def = defaults.find((d) => d.tier === tier);
            tiers.push({
                tier,
                label: this.asString(src.label) || def.label,
                minSpent: typeof src.minSpent === 'number' ? src.minSpent : def.minSpent,
                discountPercent: typeof src.discountPercent === 'number' ? src.discountPercent : def.discountPercent,
                couponValidDays: typeof src.couponValidDays === 'number' ? src.couponValidDays : def.couponValidDays,
            });
        }
        if (tiers.length === 0)
            return defaults;
        return tiers.sort((a, b) => b.minSpent - a.minSpent);
    }
    async getResolvedSmtpConfig() {
        const smtp = await this.getSmtpSettings();
        const port = Number(smtp.port || this.configService.get('SMTP_PORT') || '587');
        return {
            host: smtp.host || this.configService.get('SMTP_HOST') || '',
            port,
            user: smtp.user || this.configService.get('SMTP_USER') || '',
            pass: smtp.pass || this.configService.get('SMTP_PASS') || '',
            from: smtp.from ||
                this.configService.get('SMTP_FROM') ||
                'no-reply@example.com',
            secure: smtp.secure || port === 465,
        };
    }
    async getMomoConfig() {
        const payments = await this.getPaymentSettings();
        const momo = payments.momo;
        return {
            partnerCode: momo.partnerCode ||
                this.configService.get('MOMO_PARTNER_CODE') ||
                '',
            accessKey: momo.accessKey || this.configService.get('MOMO_ACCESS_KEY') || '',
            secretKey: momo.secretKey || this.configService.get('MOMO_SECRET_KEY') || '',
        };
    }
    async isPaymentMethodActive(method) {
        if (!exports.PAYMENT_METHOD_KEYS.includes(method)) {
            return false;
        }
        const payments = await this.getPaymentSettings();
        return payments[method]?.isActive ?? false;
    }
    createDefaultPublicPaymentSettings() {
        const defaults = (0, exports.createDefaultPaymentSettings)();
        return exports.PAYMENT_METHOD_KEYS.reduce((accumulator, key) => {
            accumulator[key] = {
                isActive: defaults[key].isActive,
                description: defaults[key].description,
                bankName: defaults[key].bankName ?? '',
                accountNumber: defaults[key].accountNumber ?? '',
                accountHolder: defaults[key].accountHolder ?? '',
            };
            return accumulator;
        }, {});
    }
    normalizePaymentSettings(value) {
        const source = this.asRecord(value);
        const defaults = (0, exports.createDefaultPaymentSettings)();
        return exports.PAYMENT_METHOD_KEYS.reduce((accumulator, key) => {
            const current = this.asRecord(source?.[key]);
            const fallback = defaults[key];
            accumulator[key] = {
                ...fallback,
                isActive: this.asBoolean(current?.isActive, fallback.isActive),
                description: this.asString(current?.description) || fallback.description,
                bankName: this.asString(current?.bankName),
                accountNumber: this.asString(current?.accountNumber),
                accountHolder: this.asString(current?.accountHolder),
                partnerCode: this.asString(current?.partnerCode),
                accessKey: this.asString(current?.accessKey),
                secretKey: this.asString(current?.secretKey),
                tmnCode: this.asString(current?.tmnCode),
                hashSecret: this.asString(current?.hashSecret),
                appId: this.asString(current?.appId),
                key1: this.asString(current?.key1),
                key2: this.asString(current?.key2),
            };
            return accumulator;
        }, (0, exports.createDefaultPaymentSettings)());
    }
    normalizeSmtpSettings(value) {
        const source = this.asRecord(value);
        const defaults = (0, exports.createDefaultSmtpSettings)();
        return {
            host: this.asString(source?.host),
            port: this.asString(source?.port) || defaults.port,
            user: this.asString(source?.user),
            pass: this.asString(source?.pass),
            from: this.asString(source?.from),
            secure: this.asBoolean(source?.secure, defaults.secure),
        };
    }
    normalizeAdminSidebarSettings(value) {
        const source = this.asRecord(value);
        const rawIds = Array.isArray(source?.hiddenItemIds)
            ? source.hiddenItemIds
            : [];
        return {
            hiddenItemIds: [
                ...new Set(rawIds
                    .filter((id) => typeof id === 'string')
                    .map((id) => id.trim())
                    .filter(Boolean)),
            ],
        };
    }
    normalizeClientFeatureSettings(value) {
        const source = this.asRecord(value);
        const defaults = (0, exports.createDefaultClientFeatureSettings)();
        return {
            productRecommendationsEnabled: this.asBoolean(source?.productRecommendationsEnabled, defaults.productRecommendationsEnabled),
        };
    }
    async getJsonSetting(key, fallback, normalize) {
        try {
            const current = await this.settingsRepository.findOneBy({ settingKey: key });
            if (!current) {
                return fallback;
            }
            return normalize(JSON.parse(current.settingValue));
        }
        catch (error) {
            if (this.isMissingSettingsTable(error)) {
                this.logger.warn('System settings table is missing. Returning default configuration.');
                return fallback;
            }
            if (error instanceof SyntaxError) {
                return fallback;
            }
            throw error;
        }
    }
    async saveJsonSetting(key, value) {
        try {
            const current = await this.settingsRepository.findOneBy({ settingKey: key });
            if (current) {
                current.settingValue = JSON.stringify(value);
                await this.settingsRepository.save(current);
                return;
            }
            await this.settingsRepository.save(this.settingsRepository.create({
                settingKey: key,
                settingValue: JSON.stringify(value),
            }));
        }
        catch (error) {
            if (this.isMissingSettingsTable(error)) {
                throw new common_1.BadRequestException('Bang system_settings chua ton tai. Hay chay updatev8_system_settings.sql truoc.');
            }
            throw error;
        }
    }
    asRecord(value) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return null;
        }
        return value;
    }
    asString(value) {
        return typeof value === 'string' ? value.trim() : '';
    }
    asBoolean(value, fallback) {
        if (typeof value === 'boolean') {
            return value;
        }
        if (value === 'true') {
            return true;
        }
        if (value === 'false') {
            return false;
        }
        return fallback;
    }
    isMissingSettingsTable(error) {
        if (!(error instanceof typeorm_2.QueryFailedError)) {
            return false;
        }
        const driverError = error.driverError;
        return (driverError?.code === 'ER_NO_SUCH_TABLE' ||
            driverError?.errno === 1146 ||
            driverError?.sqlMessage?.includes("Table 'agri_ecommerce.system_settings' doesn't exist") === true);
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = SettingsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(system_setting_entity_1.SystemSettingEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map