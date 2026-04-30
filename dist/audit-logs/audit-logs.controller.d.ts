import { AuditLogsService } from './audit-logs.service';
export declare class AuditLogsController {
    private readonly svc;
    constructor(svc: AuditLogsService);
    findAll(entityType?: string, entityId?: string, action?: string, changedBy?: string, from?: string, to?: string, page?: number, limit?: number): Promise<{
        items: {
            beforeData: Record<string, unknown> | null;
            afterData: Record<string, unknown> | null;
            logId: string;
            entityType: string;
            entityId: string;
            action: string;
            changedBy: string | null;
            ipAddress: string | null;
            notes: string | null;
            changedAt: Date;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
