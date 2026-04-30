import { Repository } from 'typeorm';
import { AuditLogEntity } from './entities/audit-log.entity';
export interface CreateAuditLogParams {
    changedBy?: string;
    entityType: string;
    entityId: string;
    action: string;
    beforeData?: Record<string, unknown>;
    afterData?: Record<string, unknown>;
    ipAddress?: string;
    notes?: string;
}
export declare class AuditLogsService {
    private readonly repo;
    constructor(repo: Repository<AuditLogEntity>);
    log(params: CreateAuditLogParams): Promise<AuditLogEntity>;
    findAll(query: {
        entityType?: string;
        entityId?: string;
        action?: string;
        changedBy?: string;
        from?: string;
        to?: string;
        page?: number;
        limit?: number;
    }): Promise<{
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
