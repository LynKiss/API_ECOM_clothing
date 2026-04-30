import { Repository } from 'typeorm';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { QuerySuppliersDto } from './dto/query-suppliers.dto';
import { SupplierEntity } from './entities/supplier.entity';
export declare class SuppliersService {
    private readonly repo;
    private readonly auditLogs;
    constructor(repo: Repository<SupplierEntity>, auditLogs: AuditLogsService);
    findAll(query: QuerySuppliersDto): Promise<{
        items: SupplierEntity[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<SupplierEntity>;
    create(dto: CreateSupplierDto, performer?: {
        userId: string;
        username: string;
        ip?: string;
    }): Promise<SupplierEntity>;
    update(id: string, dto: Partial<CreateSupplierDto>, performer?: {
        userId: string;
        username: string;
        ip?: string;
    }): Promise<SupplierEntity>;
    toggleActive(id: string, performer?: {
        userId: string;
        username: string;
        ip?: string;
    }): Promise<SupplierEntity>;
    findAllActive(): Promise<SupplierEntity[]>;
}
