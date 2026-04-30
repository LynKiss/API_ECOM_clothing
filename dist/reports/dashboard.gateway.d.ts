import { OnGatewayConnection, OnGatewayInit } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import type { Server, Socket } from 'socket.io';
import { RolesService } from '../roles/roles.service';
import { DashboardPublisher } from './dashboard.publisher';
export declare class DashboardGateway implements OnGatewayInit, OnGatewayConnection {
    private readonly jwtService;
    private readonly rolesService;
    private readonly dashboardPublisher;
    private server;
    private readonly logger;
    constructor(jwtService: JwtService, rolesService: RolesService, dashboardPublisher: DashboardPublisher);
    afterInit(server: Server): void;
    handleConnection(client: Socket): Promise<void>;
    handleRefresh(client: Socket): Promise<void>;
    private getCurrentUser;
    private authenticateClient;
    private extractToken;
}
