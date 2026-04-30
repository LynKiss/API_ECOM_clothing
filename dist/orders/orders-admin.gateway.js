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
var OrdersAdminGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersAdminGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const jwt_1 = require("@nestjs/jwt");
const roles_service_1 = require("../roles/roles.service");
const orders_admin_realtime_constants_1 = require("./orders-admin-realtime.constants");
const orders_admin_publisher_1 = require("./orders-admin.publisher");
let OrdersAdminGateway = OrdersAdminGateway_1 = class OrdersAdminGateway {
    jwtService;
    rolesService;
    ordersAdminPublisher;
    server;
    logger = new common_1.Logger(OrdersAdminGateway_1.name);
    constructor(jwtService, rolesService, ordersAdminPublisher) {
        this.jwtService = jwtService;
        this.rolesService = rolesService;
        this.ordersAdminPublisher = ordersAdminPublisher;
    }
    afterInit(server) {
        this.ordersAdminPublisher.attach(server);
    }
    async handleConnection(client) {
        try {
            const currentUser = await this.authenticateClient(client);
            client.data.user = currentUser;
            void client.join(orders_admin_realtime_constants_1.ORDERS_ADMIN_ROOM);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Socket authentication failed';
            this.logger.warn(`Reject orders admin socket ${client.id}: ${message}`);
            client.emit(orders_admin_realtime_constants_1.ORDERS_ADMIN_ERROR_EVENT, { message });
            client.disconnect();
        }
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
        const canManageOrders = currentUser.permissions.some((permission) => permission.key === 'manage_orders');
        if (!canManageOrders) {
            throw new common_1.ForbiddenException('You cannot access order realtime');
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
exports.OrdersAdminGateway = OrdersAdminGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Function)
], OrdersAdminGateway.prototype, "server", void 0);
exports.OrdersAdminGateway = OrdersAdminGateway = OrdersAdminGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: orders_admin_realtime_constants_1.ORDERS_ADMIN_NAMESPACE,
        cors: {
            origin: true,
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        roles_service_1.RolesService,
        orders_admin_publisher_1.OrdersAdminPublisher])
], OrdersAdminGateway);
//# sourceMappingURL=orders-admin.gateway.js.map