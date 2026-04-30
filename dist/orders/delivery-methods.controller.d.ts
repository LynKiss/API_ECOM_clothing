import { Repository } from 'typeorm';
import { DeliveryMethodEntity } from './entities/delivery-method.entity';
declare class CreateDeliveryMethodDto {
    name: string;
    description?: string | null;
    basePrice?: number;
    minOrderAmount?: number;
    region?: string | null;
    isDefault?: boolean;
    isActive?: boolean;
}
declare class UpdateDeliveryMethodDto {
    name?: string;
    description?: string | null;
    basePrice?: number;
    minOrderAmount?: number;
    region?: string | null;
    isDefault?: boolean;
    isActive?: boolean;
}
export declare class DeliveryMethodsController {
    private readonly deliveryMethodsRepository;
    constructor(deliveryMethodsRepository: Repository<DeliveryMethodEntity>);
    getDeliveryMethods(): Promise<{
        id: string;
        name: string;
        description: string | null;
        basePrice: number;
        minOrderAmount: number;
        region: string | null;
        isDefault: boolean;
        isActive: boolean;
        createdAt: Date;
    }[]>;
    getAllDeliveryMethods(): Promise<{
        id: string;
        name: string;
        description: string | null;
        basePrice: number;
        minOrderAmount: number;
        region: string | null;
        isDefault: boolean;
        isActive: boolean;
        createdAt: Date;
    }[]>;
    createDeliveryMethod(dto: CreateDeliveryMethodDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        basePrice: number;
        minOrderAmount: number;
        region: string | null;
        isDefault: boolean;
        isActive: boolean;
        createdAt: Date;
    }>;
    updateDeliveryMethod(id: string, dto: UpdateDeliveryMethodDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        basePrice: number;
        minOrderAmount: number;
        region: string | null;
        isDefault: boolean;
        isActive: boolean;
        createdAt: Date;
    }>;
    deleteDeliveryMethod(id: string): Promise<{
        deleted: boolean;
    }>;
    private toResponse;
}
export {};
