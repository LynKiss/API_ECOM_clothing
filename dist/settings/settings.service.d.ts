import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { SystemSettingEntity } from './entities/system-setting.entity';
export declare const PAYMENT_METHOD_KEYS: readonly ["cod", "bank_transfer", "momo", "vnpay", "zalopay"];
export type PaymentMethodKey = (typeof PAYMENT_METHOD_KEYS)[number];
export type PaymentMethodConfig = {
    isActive: boolean;
    description: string;
    bankName?: string;
    accountNumber?: string;
    accountHolder?: string;
    partnerCode?: string;
    accessKey?: string;
    secretKey?: string;
    tmnCode?: string;
    hashSecret?: string;
    appId?: string;
    key1?: string;
    key2?: string;
};
export type PaymentSettings = Record<PaymentMethodKey, PaymentMethodConfig>;
export type PublicPaymentMethodConfig = Pick<PaymentMethodConfig, 'isActive' | 'description' | 'bankName' | 'accountNumber' | 'accountHolder'>;
export type PublicPaymentSettings = Record<PaymentMethodKey, PublicPaymentMethodConfig>;
export type SmtpSettings = {
    host: string;
    port: string;
    user: string;
    pass: string;
    from: string;
    secure: boolean;
};
export type AdminSidebarSettings = {
    hiddenItemIds: string[];
};
export declare const createDefaultPaymentSettings: () => PaymentSettings;
export declare const createDefaultSmtpSettings: () => SmtpSettings;
export declare const createDefaultAdminSidebarSettings: () => AdminSidebarSettings;
export declare class SettingsService {
    private readonly settingsRepository;
    private readonly configService;
    private readonly logger;
    constructor(settingsRepository: Repository<SystemSettingEntity>, configService: ConfigService);
    getAdminCommerceSettings(): Promise<{
        payments: PaymentSettings;
        smtp: SmtpSettings;
    }>;
    getPublicCommerceSettings(): Promise<{
        payments: PublicPaymentSettings;
    }>;
    getPaymentSettings(): Promise<PaymentSettings>;
    savePaymentSettings(value: unknown): Promise<PaymentSettings>;
    getSmtpSettings(): Promise<SmtpSettings>;
    saveSmtpSettings(value: unknown): Promise<SmtpSettings>;
    getAdminSidebarSettings(): Promise<AdminSidebarSettings>;
    saveAdminSidebarSettings(value: unknown): Promise<AdminSidebarSettings>;
    getResolvedSmtpConfig(): Promise<{
        host: string;
        port: number;
        user: string;
        pass: string;
        from: string;
        secure: boolean;
    }>;
    getMomoConfig(): Promise<{
        partnerCode: string;
        accessKey: string;
        secretKey: string;
    }>;
    isPaymentMethodActive(method: string): Promise<boolean>;
    private createDefaultPublicPaymentSettings;
    private normalizePaymentSettings;
    private normalizeSmtpSettings;
    private normalizeAdminSidebarSettings;
    private getJsonSetting;
    private saveJsonSetting;
    private asRecord;
    private asString;
    private asBoolean;
    private isMissingSettingsTable;
}
