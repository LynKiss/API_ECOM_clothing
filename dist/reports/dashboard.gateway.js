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
var DashboardGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const roles_service_1 = require("../roles/roles.service");
const dashboard_realtime_constants_1 = require("./dashboard-realtime.constants");
const dashboard_publisher_1 = require("./dashboard.publisher");
let DashboardGateway = DashboardGateway_1 = class DashboardGateway {
    jwtService;
    rolesService;
    dashboardPublisher;
    server;
    logger = new common_1.Logger(DashboardGateway_1.name);
    constructor(jwtService, rolesService, dashboardPublisher) {
        this.jwtService = jwtService;
        this.rolesService = rolesService;
        this.dashboardPublisher = dashboardPublisher;
    }
    afterInit(server) {
        this.dashboardPublisher.attach(server);
    }
    async handleConnection(client) {
        try {
            const currentUser = await this.authenticateClient(client);
            client.data.user = currentUser;
            void client.join(dashboard_realtime_constants_1.DASHBOARD_ROOM);
            await this.dashboardPublisher.emitSnapshot(client);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Socket authentication failed';
            this.logger.warn(`Reject dashboard socket ${client.id}: ${message}`);
            client.emit(dashboard_realtime_constants_1.DASHBOARD_ERROR_EVENT, { message });
            client.disconnect();
        }
    }
    async handleRefresh(client) {
        this.getCurrentUser(client);
        await this.dashboardPublisher.emitSnapshot(client, 'manual_refresh');
    }
    getCurrentUser(client) {
        const currentUser = client.data.user;
        if (!currentUser) {
            throw new common_1.UnauthorizedException('Socket user is missing');
        }
        return currentUser;
    }
    async authenticateClient(client) {
        const token = this.extractToken(client);
        if (!token) {
            throw new common_1.UnauthorizedException('Missing access token');
        }
        const payload = await this.jwtService.verifyAsync(token);
        const role = payload.role?._id
            ? await this.rolesService.findOne(payload.role._id)
            : null;
        const currentUser = {
            _id: payload._id,
            username: payload.username,
            email: payload.email,
            role: payload.role,
            permissions: role?.permissions ?? [],
        };
        const canViewReports = currentUser.permissions.some((permission) => permission.key === 'manage_reports');
        if (!canViewReports) {
            throw new common_1.ForbiddenException('You cannot access dashboard realtime');
        }
        return currentUser;
    }
    extractToken(client) {
        const authToken = typeof client.handshake.auth?.token === 'string'
            ? client.handshake.auth.token
            : null;
        const authorizationHeader = client.handshake.headers.authorization;
        if (authToken) {
            return authToken.replace(/^Bearer\s+/i, '').trim();
        }
        if (typeof authorizationHeader === 'string') {
            return authorizationHeader.replace(/^Bearer\s+/i, '').trim();
        }
        return null;
    }
};
exports.DashboardGateway = DashboardGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Function)
], DashboardGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('dashboard:refresh'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], DashboardGateway.prototype, "handleRefresh", null);
exports.DashboardGateway = DashboardGateway = DashboardGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: dashboard_realtime_constants_1.DASHBOARD_NAMESPACE,
        cors: {
            origin: true,
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        roles_service_1.RolesService,
        dashboard_publisher_1.DashboardPublisher])
], DashboardGateway);
//# sourceMappingURL=dashboard.gateway.js.map