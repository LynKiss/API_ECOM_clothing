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
exports.SuppliersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
const supplier_entity_1 = require("./entities/supplier.entity");
let SuppliersService = class SuppliersService {
    repo;
    auditLogs;
    constructor(repo, auditLogs) {
        this.repo = repo;
        this.auditLogs = auditLogs;
    }
    async findAll(query) {
        const { search, status = 'all', page = 1, limit = 20 } = query;
        const qb = this.repo.createQueryBuilder('s').orderBy('s.createdAt', 'DESC');
        if (search?.trim()) {
            const kw = `%${search.trim()}%`;
            qb.andWhere('(s.name LIKE :kw OR s.code LIKE :kw OR s.phone LIKE :kw OR s.email LIKE :kw)', { kw });
        }
        if (status === 'active')
            qb.andWhere('s.isActive = 1');
        if (status === 'inactive')
            qb.andWhere('s.isActive = 0');
        const total = await qb.getCount();
        const items = await qb
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();
        return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    async findOne(id) {
        const s = await this.repo.findOne({ where: { supplierId: id } });
        if (!s)
            throw new common_1.NotFoundException('Không tìm thấy nhà cung cấp');
        return s;
    }
    async create(dto, performer) {
        const nameDup = await this.repo.findOne({ where: { name: dto.name } });
        if (nameDup)
            throw new common_1.ConflictException('Tên nhà cung cấp đã tồn tại');
        if (dto.code) {
            const codeDup = await this.repo.findOne({ where: { code: dto.code } });
            if (codeDup)
                throw new common_1.ConflictException('Mã nhà cung cấp đã tồn tại');
        }
        const entity = this.repo.create({
            supplierId: (0, uuid_1.v4)(),
            name: dto.name,
            code: dto.code ?? null,
            phone: dto.phone ?? null,
            email: dto.email ?? null,
            address: dto.address ?? null,
            taxCode: dto.taxCode ?? null,
            contactPerson: dto.contactPerson ?? null,
            paymentTerms: dto.paymentTerms ?? 30,
            notes: dto.notes ?? null,
            isActive: true,
        });
        const saved = await this.repo.save(entity);
        void this.auditLogs.log({
            entityType: 'SUPPLIER',
            entityId: saved.supplierId,
            action: 'CREATE',
            changedBy: performer?.username,
            ipAddress: performer?.ip,
            afterData: { name: saved.name, code: saved.code },
        });
        return saved;
    }
    async update(id, dto, performer) {
        const s = await this.findOne(id);
        if (dto.name && dto.name !== s.name) {
            const nameDup = await this.repo.findOne({ where: { name: dto.name } });
            if (nameDup)
                throw new common_1.ConflictException('Tên nhà cung cấp đã tồn tại');
        }
        if (dto.code && dto.code !== s.code) {
            const codeDup = await this.repo.findOne({ where: { code: dto.code } });
            if (codeDup)
                throw new common_1.ConflictException('Mã nhà cung cấp đã tồn tại');
        }
        const before = { name: s.name, code: s.code, isActive: s.isActive };
        Object.assign(s, {
            name: dto.name ?? s.name,
            code: dto.code !== undefined ? (dto.code ?? null) : s.code,
            phone: dto.phone !== undefined ? (dto.phone ?? null) : s.phone,
            email: dto.email !== undefined ? (dto.email ?? null) : s.email,
            address: dto.address !== undefined ? (dto.address ?? null) : s.address,
            taxCode: dto.taxCode !== undefined ? (dto.taxCode ?? null) : s.taxCode,
            contactPerson: dto.contactPerson !== undefined ? (dto.contactPerson ?? null) : s.contactPerson,
            paymentTerms: dto.paymentTerms ?? s.paymentTerms,
            notes: dto.notes !== undefined ? (dto.notes ?? null) : s.notes,
        });
        const saved = await this.repo.save(s);
        void this.auditLogs.log({
            entityType: 'SUPPLIER',
            entityId: id,
            action: 'UPDATE',
            changedBy: performer?.username,
            ipAddress: performer?.ip,
            beforeData: before,
            afterData: { name: saved.name, code: saved.code },
        });
        return saved;
    }
    async toggleActive(id, performer) {
        const s = await this.findOne(id);
        const before = { isActive: s.isActive };
        s.isActive = !s.isActive;
        const saved = await this.repo.save(s);
        void this.auditLogs.log({
            entityType: 'SUPPLIER',
            entityId: id,
            action: 'UPDATE',
            changedBy: performer?.username,
            ipAddress: performer?.ip,
            beforeData: before,
            afterData: { isActive: saved.isActive },
        });
        return saved;
    }
    async findAllActive() {
        return this.repo.find({ where: { isActive: true }, order: { name: 'ASC' } });
    }
};
exports.SuppliersService = SuppliersService;
exports.SuppliersService = SuppliersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(supplier_entity_1.SupplierEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        audit_logs_service_1.AuditLogsService])
], SuppliersService);
//# sourceMappingURL=suppliers.service.js.map