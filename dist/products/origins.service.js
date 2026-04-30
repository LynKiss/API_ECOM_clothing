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
exports.OriginsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const origin_entity_1 = require("./entities/origin.entity");
let OriginsService = class OriginsService {
    originsRepository;
    constructor(originsRepository) {
        this.originsRepository = originsRepository;
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const where = query.search
            ? { originName: (0, typeorm_2.Like)(`%${query.search}%`) }
            : {};
        const [items, total] = await this.originsRepository.findAndCount({
            where,
            order: { originName: 'ASC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
            items,
        };
    }
    async findOne(originId) {
        const origin = await this.originsRepository.findOneBy({ originId });
        if (!origin) {
            throw new common_1.NotFoundException('Brand not found');
        }
        return origin;
    }
    async create(dto) {
        await this.ensureNameUnique(dto.originName);
        const origin = this.originsRepository.create({
            originName: dto.originName,
            originImage: dto.originImage ?? null,
            brandSlug: this.slugify(dto.originName),
            brandDescription: null,
            isActive: true,
        });
        return this.originsRepository.save(origin);
    }
    async update(originId, dto) {
        const origin = await this.findOne(originId);
        if (dto.originName && dto.originName !== origin.originName) {
            await this.ensureNameUnique(dto.originName, originId);
        }
        origin.originName = dto.originName ?? origin.originName;
        origin.originImage =
            dto.originImage !== undefined ? (dto.originImage ?? null) : origin.originImage;
        origin.brandSlug = dto.originName ? this.slugify(origin.originName) : origin.brandSlug;
        return this.originsRepository.save(origin);
    }
    async remove(originId) {
        const origin = await this.findOne(originId);
        await this.originsRepository.remove(origin);
        return { success: true };
    }
    slugify(value) {
        return value
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || 'brand';
    }
    async ensureNameUnique(name, excludeId) {
        const existing = await this.originsRepository.findOneBy({
            originName: name,
        });
        if (existing && existing.originId !== excludeId) {
            throw new common_1.ConflictException('Brand name already exists');
        }
    }
};
exports.OriginsService = OriginsService;
exports.OriginsService = OriginsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(origin_entity_1.OriginEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OriginsService);
//# sourceMappingURL=origins.service.js.map