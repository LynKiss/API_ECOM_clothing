import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { SettingsService } from '../settings/settings.service';
import { CampaignStatus, NewsletterCampaignEntity } from './entities/newsletter-campaign.entity';
import { NewsletterSubscriberEntity, SubscriberStatus } from './entities/newsletter-subscriber.entity';
export declare class NewsletterService {
    private readonly subscribersRepository;
    private readonly campaignsRepository;
    private readonly configService;
    private readonly settingsService;
    private readonly logger;
    constructor(subscribersRepository: Repository<NewsletterSubscriberEntity>, campaignsRepository: Repository<NewsletterCampaignEntity>, configService: ConfigService, settingsService: SettingsService);
    subscribe(email: string, name?: string): Promise<{
        message: string;
    }>;
    unsubscribeByToken(token: string): Promise<{
        message: string;
    }>;
    findSubscribers(page: number, limit: number, status?: string): Promise<{
        items: {
            id: string;
            email: string;
            name: string | null;
            status: SubscriberStatus;
            createdAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    deleteSubscriber(subscriberId: string): Promise<{
        success: boolean;
    }>;
    createCampaign(subject: string, body: string, scheduledAt?: Date | null): Promise<{
        id: string;
        subject: string;
        body: string;
        status: CampaignStatus;
        sentAt: Date | null;
        scheduledAt: Date | null;
        recipientCount: number;
        totalRecipientCount: number;
        createdAt: Date;
    }>;
    updateCampaign(campaignId: string, subject: string, body: string, scheduledAt?: Date | null): Promise<{
        id: string;
        subject: string;
        body: string;
        status: CampaignStatus;
        sentAt: Date | null;
        scheduledAt: Date | null;
        recipientCount: number;
        totalRecipientCount: number;
        createdAt: Date;
    }>;
    deleteCampaign(campaignId: string): Promise<{
        success: boolean;
    }>;
    findCampaigns(): Promise<{
        id: string;
        subject: string;
        body: string;
        status: CampaignStatus;
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
    updateAutomationSmtpSettings(value: unknown): Promise<{
        isConfigured: boolean;
        source: string;
        host: string;
        port: string;
        user: string;
        pass: string;
        from: string;
        secure: boolean;
    }>;
    sendCampaign(campaignId: string): Promise<{
        sent: number;
        message: string;
        total?: undefined;
    } | {
        sent: number;
        total: number;
        message?: undefined;
    }>;
    checkScheduledCampaigns(): Promise<void>;
    notifyNewArticle(title: string, slug: string, excerpt: string): Promise<void>;
    private getMailer;
    private wrapCampaignHtml;
    private mapSubscriber;
    private mapCampaign;
    private mapAutomationSmtp;
    private normalizeScheduledAt;
}
