import { NewsletterService } from './newsletter.service';
export declare class NewsletterController {
    private readonly newsletterService;
    constructor(newsletterService: NewsletterService);
    subscribe(body: {
        email: string;
        name?: string;
    }): Promise<{
        message: string;
    }>;
    unsubscribe(token: string): Promise<{
        message: string;
    }>;
    getSubscribers(page?: string, limit?: string, status?: string): Promise<{
        items: {
            id: string;
            email: string;
            name: string | null;
            status: import("./entities/newsletter-subscriber.entity").SubscriberStatus;
            createdAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    deleteSubscriber(id: string): Promise<{
        success: boolean;
    }>;
    getCampaigns(): Promise<{
        id: string;
        subject: string;
        body: string;
        status: import("./entities/newsletter-campaign.entity").CampaignStatus;
        sentAt: Date | null;
        scheduledAt: Date | null;
        recipientCount: number;
        totalRecipientCount: number;
        createdAt: Date;
    }[]>;
    getAutomationSettings(): Promise<{
        smtp: {
            isConfigured: boolean;
            source: string;
            host: string;
            port: string;
            user: string;
            pass: string;
            from: string;
            secure: boolean;
        };
        scheduler: {
            isEnabled: boolean;
            cron: string;
            intervalMinutes: number;
        };
        scheduledCampaigns: {
            total: number;
            nextScheduledAt: Date | null;
        };
    }>;
    createCampaign(body: {
        subject: string;
        body: string;
        scheduledAt?: string;
    }): Promise<{
        id: string;
        subject: string;
        body: string;
        status: import("./entities/newsletter-campaign.entity").CampaignStatus;
        sentAt: Date | null;
        scheduledAt: Date | null;
        recipientCount: number;
        totalRecipientCount: number;
        createdAt: Date;
    }>;
    updateCampaign(id: string, body: {
        subject: string;
        body: string;
        scheduledAt?: string;
    }): Promise<{
        id: string;
        subject: string;
        body: string;
        status: import("./entities/newsletter-campaign.entity").CampaignStatus;
        sentAt: Date | null;
        scheduledAt: Date | null;
        recipientCount: number;
        totalRecipientCount: number;
        createdAt: Date;
    }>;
    updateAutomationSmtpSettings(body: {
        smtp?: Record<string, unknown>;
    }): Promise<{
        isConfigured: boolean;
        source: string;
        host: string;
        port: string;
        user: string;
        pass: string;
        from: string;
        secure: boolean;
    }>;
    deleteCampaign(id: string): Promise<{
        success: boolean;
    }>;
    sendCampaign(id: string): Promise<{
        sent: number;
        message: string;
        total?: undefined;
    } | {
        sent: number;
        total: number;
        message?: undefined;
    }>;
}
