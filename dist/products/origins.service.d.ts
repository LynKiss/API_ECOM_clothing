import { Repository } from 'typeorm';
import { CreateOriginDto } from './dto/create-origin.dto';
import { QueryOriginsDto } from './dto/query-origins.dto';
import { UpdateOriginDto } from './dto/update-origin.dto';
import { OriginEntity } from './entities/origin.entity';
export declare class OriginsService {
    private readonly originsRepository;
    constructor(originsRepository: Repository<OriginEntity>);
    findAll(query: QueryOriginsDto): Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        items: OriginEntity[];
    }>;
    findOne(originId: string): Promise<OriginEntity>;
    create(dto: CreateOriginDto): Promise<OriginEntity>;
    update(originId: string, dto: UpdateOriginDto): Promise<OriginEntity>;
    remove(originId: string): Promise<{
        success: boolean;
    }>;
    private slugify;
    private ensureNameUnique;
}
