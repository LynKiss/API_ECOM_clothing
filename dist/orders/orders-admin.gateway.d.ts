import { OnGatewayConnection, OnGatewayInit } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import type { Server, Socket } from 'socket.io';
import { RolesService } from '../roles/roles.service';
import { OrdersAdminPublisher } from './orders-admin.publisher';
export declare class OrdersAdminGateway implements OnGatewayInit, OnGatewayConnection {
    private readonly jwtService;
    private readonly rolesService;
    private readonly ordersAdminPublisher;
    private server;
    private readonly logger;
    constructor(jwtService: JwtService, rolesService: RolesService, ordersAdminPublisher: OrdersAdminPublisher);
    afterInit(server: Server): void;
    handleConnection(client: Socket): Promise<void>;
    private authenticateClient;
    private extractToken;
}
