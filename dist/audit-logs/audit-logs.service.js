"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const audit_log_entity_1 = require("./entities/audit-log.entity");
let AuditLogsService = class AuditLogsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async log(params) {
        const entry = this.repo.create({
            changedBy: params.changedBy ?? null,
            entityType: params.entityType,
            entityId: params.entityId,
            action: params.action,
            beforeData: params.beforeData ? JSON.stringify(params.beforeData) : null,
            afterData: params.afterData ? JSON.stringify(params.afterData) : null,
            ipAddress: params.ipAddress ?? null,
            notes: params.notes ?? null,
        });
        await this.repo.save(entry);
        return entry;
    }
    async findAll(query) {
        const { page = 1, limit = 30 } = query;
        const qb = this.repo.createQueryBuilder('log').orderBy('log.changedAt', 'DESC');
        if (query.entityType)
            qb.andWhere('log.entityType = :et', { et: query.entityType });
        if (query.entityId)
            qb.andWhere('log.entityId = :ei', { ei: query.entityId });
        if (query.action)
            qb.andWhere('log.action = :action', { action: query.action });
        if (query.changedBy)
            qb.andWhere('log.changedBy = :cb', { cb: query.changedBy });
        if (query.from)
            qb.andWhere('log.changedAt >= :from', { from: query.from });
        if (query.to)
            qb.andWhere('log.changedAt <= :to', { to: query.to });
        const total = await qb.getCount();
        const items = await qb.skip((page - 1) * limit).take(limit).getMany();
        return {
            items: items.map((item) => ({
                ...item,
                beforeData: item.beforeData ? JSON.parse(item.beforeData) : null,
                afterData: item.afterData ? JSON.parse(item.afterData) : null,
            })),
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
};
exports.AuditLogsService = AuditLogsService;
exports.AuditLogsService = AuditLogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(audit_log_entity_1.AuditLogEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AuditLogsService);
//# sourceMappingURL=audit-logs.service.js.map