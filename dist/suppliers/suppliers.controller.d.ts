import { CreateSupplierDto } from './dto/create-supplier.dto';
import { QuerySuppliersDto } from './dto/query-suppliers.dto';
import { SuppliersService } from './suppliers.service';
export declare class SuppliersController {
    private readonly service;
    constructor(service: SuppliersService);
    findAll(query: QuerySuppliersDto): Promise<{
        items: import("./entities/supplier.entity").SupplierEntity[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findAllActive(): Promise<import("./entities/supplier.entity").SupplierEntity[]>;
    findOne(id: string): Promise<import("./entities/supplier.entity").SupplierEntity>;
    create(dto: CreateSupplierDto, req: any): Promise<import("./entities/supplier.entity").SupplierEntity>;
    update(id: string, dto: Partial<CreateSupplierDto>, req: any): Promise<import("./entities/supplier.entity").SupplierEntity>;
    toggleActive(id: string, req: any): Promise<import("./entities/supplier.entity").SupplierEntity>;
}
