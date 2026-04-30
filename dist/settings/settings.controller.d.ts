import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getPublicCommerceSettings(): Promise<{
        payments: import("./settings.service").PublicPaymentSettings;
    }>;
    getAdminCommerceSettings(): Promise<{
        payments: import("./settings.service").PaymentSettings;
        smtp: import("./settings.service").SmtpSettings;
    }>;
    updatePaymentSettings(body: {
        payments?: Record<string, unknown>;
    }): Promise<import("./settings.service").PaymentSettings>;
    updateSmtpSettings(body: {
        smtp?: Record<string, unknown>;
    }): Promise<import("./settings.service").SmtpSettings>;
    getAdminSidebarSettings(): Promise<import("./settings.service").AdminSidebarSettings>;
    updateAdminSidebarSettings(body: {
        hiddenItemIds?: string[];
    }): Promise<import("./settings.service").AdminSidebarSettings>;
}
