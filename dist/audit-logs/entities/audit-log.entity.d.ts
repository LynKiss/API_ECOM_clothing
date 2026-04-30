export declare class AuditLogEntity {
    logId: string;
    entityType: string;
    entityId: string;
    action: string;
    changedBy: string | null;
    beforeData: string | null;
    afterData: string | null;
    ipAddress: string | null;
    notes: string | null;
    changedAt: Date;
}
