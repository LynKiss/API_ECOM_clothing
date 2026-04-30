import type { Server } from 'socket.io';
import { OrderEntity } from './entities/order.entity';
export type AdminNewOrderPayload = {
    orderId: string;
    fullName: string;
    phone: string;
    totalPayment: string;
    status: string;
    paymentStatus: string;
    createdAt: Date;
};
export declare class OrdersAdminPublisher {
    private server;
    attach(server: Server): void;
    emitNewOrder(order: OrderEntity): void;
}
