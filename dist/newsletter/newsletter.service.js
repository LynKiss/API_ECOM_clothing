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
var NewsletterService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const crypto = __importStar(require("crypto"));
const nodemailer = __importStar(require("nodemailer"));
const typeorm_2 = require("typeorm");
const settings_service_1 = require("../settings/settings.service");
const newsletter_campaign_entity_1 = require("./entities/newsletter-campaign.entity");
const newsletter_subscriber_entity_1 = require("./entities/newsletter-subscriber.entity");
let NewsletterService = NewsletterService_1 = class NewsletterService {
    subscribersRepository;
    campaignsRepository;
    configService;
    settingsService;
    logger = new common_1.Logger(NewsletterService_1.name);
    constructor(subscribersRepository, campaignsRepository, configService, settingsService) {
        this.subscribersRepository = subscribersRepository;
        this.campaignsRepository = campaignsRepository;
        this.configService = configService;
        this.settingsService = settingsService;
    }
    async subscribe(email, name) {
        const existing = await this.subscribersRepository.findOneBy({ email });
        if (existing) {
            if (existing.status === newsletter_subscriber_entity_1.SubscriberStatus.ACTIVE) {
                return { message: 'Email da duoc dang ky' };
            }
            existing.status = newsletter_subscriber_entity_1.SubscriberStatus.ACTIVE;
            existing.name = name ?? existing.name;
            await this.subscribersRepository.save(existing);
            return { message: 'Dang ky thanh cong' };
        }
        const token = crypto.randomBytes(32).toString('hex');
        const subscriber = this.subscribersRepository.create({
            email,
            name: name ?? null,
            status: newsletter_subscriber_entity_1.SubscriberStatus.ACTIVE,
            unsubscribeToken: token,
        });
        await this.subscribersRepository.save(subscriber);
        return { message: 'Dang ky thanh cong' };
    }
    async unsubscribeByToken(token) {
        const subscriber = await this.subscribersRepository.findOneBy({
            unsubscribeToken: token,
        });
        if (!subscriber) {
            throw new common_1.NotFoundException('Token khong hop le');
        }
        subscriber.status = newsletter_subscriber_entity_1.SubscriberStatus.UNSUBSCRIBED;
        await this.subscribersRepository.save(subscriber);
        return { message: 'Huy dang ky thanh cong' };
    }
    async findSubscribers(page, limit, status) {
        const qb = this.subscribersRepository
            .createQueryBuilder('s')
            .orderBy('s.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        if (status) {
            qb.andWhere('s.status = :status', { status });
        }
        const [items, total] = await qb.getManyAndCount();
        return {
            items: items.map((subscriber) => this.mapSubscriber(subscriber)),
            total,
            page,
            limit,
        };
    }
    async deleteSubscriber(subscriberId) {
        const subscriber = await this.subscribersRepository.findOneBy({
            subscriberId,
        });
        if (!subscriber) {
            throw new common_1.NotFoundException('Khong tim thay nguoi dang ky');
        }
        await this.subscribersRepository.delete({ subscriberId });
        return { success: true };
    }
    async createCampaign(subject, body, scheduledAt) {
        const nextScheduledAt = this.normalizeScheduledAt(scheduledAt);
        const status = nextScheduledAt ? newsletter_campaign_entity_1.CampaignStatus.SCHEDULED : newsletter_campaign_entity_1.CampaignStatus.DRAFT;
        const campaign = this.campaignsRepository.create({
            subject,
            body,
            status,
            sentAt: null,
            scheduledAt: nextScheduledAt,
            recipientCount: 0,
            totalRecipientCount: 0,
        });
        const saved = await this.campaignsRepository.save(campaign);
        return this.mapCampaign(saved);
    }
    async updateCampaign(campaignId, subject, body, scheduledAt) {
        const campaign = await this.campaignsRepository.findOneBy({ campaignId });
        if (!campaign) {
            throw new common_1.NotFoundException('Khong tim thay chien dich');
        }
        if (campaign.status === newsletter_campaign_entity_1.CampaignStatus.SENT) {
            throw new common_1.BadRequestException('Khong the chinh sua chien dich da gui');
        }
        const nextScheduledAt = this.normalizeScheduledAt(scheduledAt);
        campaign.subject = subject;
        campaign.body = body;
        campaign.scheduledAt = nextScheduledAt;
        campaign.status = nextScheduledAt
            ? newsletter_campaign_entity_1.CampaignStatus.SCHEDULED
            : newsletter_campaign_entity_1.CampaignStatus.DRAFT;
        const saved = await this.campaignsRepository.save(campaign);
        return this.mapCampaign(saved);
    }
    async deleteCampaign(campaignId) {
        const campaign = await this.campaignsRepository.findOneBy({ campaignId });
        if (!campaign) {
            throw new common_1.NotFoundException('Khong tim thay chien dich');
        }
        if (campaign.status === newsletter_campaign_entity_1.CampaignStatus.SENT) {
            throw new common_1.BadRequestException('Khong the xoa chien dich da gui');
        }
        await this.campaignsRepository.delete({ campaignId });
        return { success: true };
    }
    async findCampaigns() {
        const campaigns = await this.campaignsRepository.find({
            order: { createdAt: 'DESC' },
        });
        return campaigns.map((campaign) => this.mapCampaign(campaign));
    }
    async getAutomationSettings() {
        const [storedSmtp, resolvedSmtp, totalScheduled, nextScheduledCampaign] = await Promise.all([
            this.settingsService.getSmtpSettings(),
            this.settingsService.getResolvedSmtpConfig(),
            this.campaignsRepository.count({
                where: { status: newsletter_campaign_entity_1.CampaignStatus.SCHEDULED },
            }),
            this.campaignsRepository.findOne({
                where: { status: newsletter_campaign_entity_1.CampaignStatus.SCHEDULED },
                order: { scheduledAt: 'ASC' },
            }),
        ]);
        return {
            smtp: this.mapAutomationSmtp(storedSmtp, resolvedSmtp),
            scheduler: {
                isEnabled: true,
                cron: '* * * * *',
                intervalMinutes: 1,
            },
            scheduledCampaigns: {
                total: totalScheduled,
                nextScheduledAt: nextScheduledCampaign?.scheduledAt ?? null,
            },
        };
    }
    async updateAutomationSmtpSettings(value) {
        const storedSmtp = await this.settingsService.saveSmtpSettings(value);
        const resolvedSmtp = await this.settingsService.getResolvedSmtpConfig();
        return this.mapAutomationSmtp(storedSmtp, resolvedSmtp);
    }
    async sendCampaign(campaignId) {
        const campaign = await this.campaignsRepository.findOneBy({ campaignId });
        if (!campaign) {
            throw new common_1.NotFoundException('Khong tim thay chien dich');
        }
        if (campaign.status === newsletter_campaign_entity_1.CampaignStatus.SENT) {
            throw new common_1.BadRequestException('Chien dich da duoc gui');
        }
        const subscribers = await this.subscribersRepository.find({
            where: { status: newsletter_subscriber_entity_1.SubscriberStatus.ACTIVE },
        });
        if (subscribers.length === 0) {
            return { sent: 0, message: 'Khong co nguoi dang ky nao' };
        }
        const mailer = await this.getMailer();
        if (!mailer) {
            throw new common_1.BadRequestException('SMTP chua duoc cau hinh');
        }
        const backendUrl = this.configService.get('BACKEND_URL') ?? 'http://localhost:8000';
        let sent = 0;
        const BATCH_SIZE = 10;
        const BATCH_DELAY_MS = 1500;
        const INTER_EMAIL_DELAY_MS = 150;
        for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
            const batch = subscribers.slice(i, i + BATCH_SIZE);
            for (const subscriber of batch) {
                try {
                    const unsubscribeUrl = `${backendUrl}/api/v1/newsletter/unsubscribe?token=${subscriber.unsubscribeToken}`;
                    await mailer.transporter.sendMail({
                        from: mailer.from,
                        to: subscriber.email,
                        subject: campaign.subject,
                        html: this.wrapCampaignHtml(campaign.body, campaign.subject, unsubscribeUrl),
                    });
                    sent++;
                }
                catch (error) {
                    const message = error instanceof Error ? error.message : String(error);
                    this.logger.error(`Failed to send campaign ${campaignId} to ${subscriber.email}: ${message}`);
                }
                await new Promise((resolve) => setTimeout(resolve, INTER_EMAIL_DELAY_MS));
            }
            if (i + BATCH_SIZE < subscribers.length) {
                await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS));
            }
        }
        campaign.status = newsletter_campaign_entity_1.CampaignStatus.SENT;
        campaign.sentAt = new Date();
        campaign.recipientCount = sent;
        campaign.totalRecipientCount = subscribers.length;
        await this.campaignsRepository.save(campaign);
        return { sent, total: subscribers.length };
    }
    async checkScheduledCampaigns() {
        const dueCampaigns = await this.campaignsRepository.find({
            where: {
                status: newsletter_campaign_entity_1.CampaignStatus.SCHEDULED,
                scheduledAt: (0, typeorm_2.LessThanOrEqual)(new Date()),
            },
        });
        for (const campaign of dueCampaigns) {
            const claimed = await this.campaignsRepository.update({
                campaignId: campaign.campaignId,
                status: newsletter_campaign_entity_1.CampaignStatus.SCHEDULED,
            }, { status: newsletter_campaign_entity_1.CampaignStatus.DRAFT });
            if ((claimed.affected ?? 0) === 0) {
                continue;
            }
            try {
                await this.sendCampaign(campaign.campaignId);
            }
            catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                this.logger.error(`Scheduled send failed for ${campaign.campaignId}: ${message}`);
                await this.campaignsRepository.update({ campaignId: campaign.campaignId }, { status: newsletter_campaign_entity_1.CampaignStatus.SCHEDULED });
            }
        }
    }
    async notifyNewArticle(title, slug, excerpt) {
        const subscribers = await this.subscribersRepository.find({
            where: { status: newsletter_subscriber_entity_1.SubscriberStatus.ACTIVE },
        });
        if (!subscribers.length) {
            return;
        }
        const mailer = await this.getMailer();
        if (!mailer) {
            return;
        }
        const frontendUrl = this.configService.get('FRONTEND_URL') ?? 'http://localhost:5173';
        const backendUrl = this.configService.get('BACKEND_URL') ?? 'http://localhost:8000';
        const articleUrl = `${frontendUrl}/client/news/${slug}`;
        const subject = `BÃ i viáº¿t má»›i: ${title}`;
        const body = `<p>${excerpt}</p><p><a href="${articleUrl}" style="color:#2563EB;font-weight:bold;">Äá»c bÃ i viáº¿t â†’</a></p>`;
        const BATCH_SIZE = 10;
        const BATCH_DELAY_MS = 1500;
        const INTER_EMAIL_DELAY_MS = 150;
        for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
            const batch = subscribers.slice(i, i + BATCH_SIZE);
            for (const subscriber of batch) {
                const unsubscribeUrl = `${backendUrl}/api/v1/newsletter/unsubscribe?token=${subscriber.unsubscribeToken}`;
                try {
                    await mailer.transporter.sendMail({
                        from: mailer.from,
                        to: subscriber.email,
                        subject,
                        html: this.wrapCampaignHtml(body, subject, unsubscribeUrl),
                    });
                }
                catch { }
                await new Promise((resolve) => setTimeout(resolve, INTER_EMAIL_DELAY_MS));
            }
            if (i + BATCH_SIZE < subscribers.length) {
                await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS));
            }
        }
    }
    async getMailer() {
        const smtp = await this.settingsService.getResolvedSmtpConfig();
        if (!smtp.host || !smtp.user || !smtp.pass) {
            return null;
        }
        return {
            from: smtp.from,
            transporter: nodemailer.createTransport({
                host: smtp.host,
                port: smtp.port,
                secure: smtp.secure,
                auth: {
                    user: smtp.user,
                    pass: smtp.pass,
                },
            }),
        };
    }
    wrapCampaignHtml(body, subject, unsubscribeUrl) {
        return `<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:32px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;max-width:600px">
        <tr><td style="background:#0B0F19;padding:24px 32px">
          <p style="margin:0;color:#DBEAFE;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase">Fashion Ledger</p>
          <h1 style="margin:4px 0 0;color:#fff;font-size:22px">${subject}</h1>
        </td></tr>
        <tr><td style="padding:32px;color:#374151;font-size:15px;line-height:1.7">
          ${body}
        </td></tr>
        <tr><td style="background:#f9f9f9;padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb">
          <p style="margin:0;color:#9ca3af;font-size:12px">
            Ban nhan email nay vi da dang ky nhan tin tuc tu chung toi.<br>
            <a href="${unsubscribeUrl}" style="color:#2563EB">Huy dang ky</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
    }
    mapSubscriber(subscriber) {
        return {
            id: subscriber.subscriberId,
            email: subscriber.email,
            name: subscriber.name,
            status: subscriber.status,
            createdAt: subscriber.createdAt,
        };
    }
    mapCampaign(campaign) {
        return {
            id: campaign.campaignId,
            subject: campaign.subject,
            body: campaign.body,
            status: campaign.status,
            sentAt: campaign.sentAt,
            scheduledAt: campaign.scheduledAt,
            recipientCount: campaign.recipientCount,
            totalRecipientCount: campaign.totalRecipientCount,
            createdAt: campaign.createdAt,
        };
    }
    mapAutomationSmtp(storedSmtp, resolvedSmtp) {
        const hasStoredConfig = Boolean(storedSmtp.host || storedSmtp.user || storedSmtp.pass || storedSmtp.from);
        const hasResolvedConfig = Boolean(resolvedSmtp.host && resolvedSmtp.user && resolvedSmtp.pass);
        return {
            ...storedSmtp,
            isConfigured: hasResolvedConfig,
            source: hasStoredConfig ? 'settings' : hasResolvedConfig ? 'env' : 'none',
        };
    }
    normalizeScheduledAt(scheduledAt) {
        if (!scheduledAt) {
            return null;
        }
        const nextDate = scheduledAt instanceof Date ? scheduledAt : new Date(scheduledAt);
        if (Number.isNaN(nextDate.getTime())) {
            throw new common_1.BadRequestException('Thoi gian len lich khong hop le');
        }
        if (nextDate.getTime() <= Date.now()) {
            throw new common_1.BadRequestException('Thoi gian len lich phai o tuong lai');
        }
        return nextDate;
    }
};
exports.NewsletterService = NewsletterService;
__decorate([
    (0, schedule_1.Cron)('* * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NewsletterService.prototype, "checkScheduledCampaigns", null);
exports.NewsletterService = NewsletterService = NewsletterService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(newsletter_subscriber_entity_1.NewsletterSubscriberEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(newsletter_campaign_entity_1.NewsletterCampaignEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService,
        settings_service_1.SettingsService])
], NewsletterService);
//# sourceMappingURL=newsletter.service.js.map