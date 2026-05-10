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
export type ClientFeatureSettings = {
    productRecommendationsEnabled: boolean;
};
export type MembershipTierSetting = {
    tier: 'silver' | 'gold' | 'diamond';
    minSpent: number;
    discountPercent: number;
    couponValidDays: number;
    label: string;
};
export type MembershipTierSettings = MembershipTierSetting[];
export declare const createDefaultMembershipTierSettings: () => MembershipTierSettings;
export declare const createDefaultPaymentSettings: () => PaymentSettings;
export declare const createDefaultSmtpSettings: () => SmtpSettings;
export declare const createDefaultAdminSidebarSettings: () => AdminSidebarSettings;
export declare const createDefaultClientFeatureSettings: () => ClientFeatureSettings;
export declare class SettingsService {
    private readonly settingsRepository;
    private readonly configService;
    private readonly logger;
    constructor(settingsRepository: Repository<SystemSettingEntity>, configService: ConfigService);
    getAdminCommerceSettings(): Promise<{
        payments: PaymentSettings;
        smtp: SmtpSettings;
        clientFeatures: ClientFeatureSettings;
    }>;
    getPublicCommerceSettings(): Promise<{
        payments: PublicPaymentSettings;
        clientFeatures: ClientFeatureSettings;
    }>;
    getPaymentSettings(): Promise<PaymentSettings>;
    savePaymentSettings(value: unknown): Promise<PaymentSettings>;
    getSmtpSettings(): Promise<SmtpSettings>;
    saveSmtpSettings(value: unknown): Promise<SmtpSettings>;
    getAdminSidebarSettings(): Promise<AdminSidebarSettings>;
    saveAdminSidebarSettings(value: unknown): Promise<AdminSidebarSettings>;
    getClientFeatureSettings(): Promise<ClientFeatureSettings>;
    saveClientFeatureSettings(value: unknown): Promise<ClientFeatureSettings>;
    getMembershipTierSettings(): Promise<MembershipTierSettings>;
    saveMembershipTierSettings(value: unknown): Promise<MembershipTierSettings>;
    private normalizeMembershipTierSettings;
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
    private normalizeClientFeatureSettings;
    private getJsonSetting;
    private saveJsonSetting;
    private asRecord;
    private asString;
    private asBoolean;
    private isMissingSettingsTable;
}
