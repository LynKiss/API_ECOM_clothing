import { OrderStatus } from './order.entity';
export declare class OrderStatusHistoryEntity {
    historyId: string;
    orderId: string;
    oldStatus: OrderStatus | null;
    newStatus: OrderStatus;
    changedBy: string | null;
    note: string | null;
    createdAt: Date;
}
