import { OrderStatus } from '../entities/order.entity';
export declare class QueryOrdersDto {
    status?: OrderStatus;
    search?: string;
    page?: number;
    limit?: number;
}
