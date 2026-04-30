import { CreateOriginDto } from './dto/create-origin.dto';
import { QueryOriginsDto } from './dto/query-origins.dto';
import { UpdateOriginDto } from './dto/update-origin.dto';
import { OriginsService } from './origins.service';
export declare class OriginsController {
    private readonly originsService;
    constructor(originsService: OriginsService);
    getOrigins(query: QueryOriginsDto): Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        items: import("./entities/origin.entity").OriginEntity[];
    }>;
    getOrigin(id: string): Promise<import("./entities/origin.entity").OriginEntity>;
    createOrigin(dto: CreateOriginDto): Promise<import("./entities/origin.entity").OriginEntity>;
    updateOrigin(id: string, dto: UpdateOriginDto): Promise<import("./entities/origin.entity").OriginEntity>;
    removeOrigin(id: string): Promise<{
        success: boolean;
    }>;
}
