export declare enum CampaignStatus {
    DRAFT = "draft",
    SCHEDULED = "scheduled",
    SENT = "sent"
}
export declare class NewsletterCampaignEntity {
    campaignId: string;
    subject: string;
    body: string;
    status: CampaignStatus;
    sentAt: Date | null;
    scheduledAt: Date | null;
    recipientCount: number;
    totalRecipientCount: number;
    createdAt: Date;
    updatedAt: Date;
}
