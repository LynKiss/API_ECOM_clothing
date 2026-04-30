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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const customize_1 = require("../decorator/customize");
let HealthController = class HealthController {
    dataSource;
    startTime = Date.now();
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async check() {
        const uptimeSec = Math.floor((Date.now() - this.startTime) / 1000);
        return {
            status: 'ok',
            uptime: uptimeSec,
            timestamp: new Date().toISOString(),
            memoryMb: Math.round(process.memoryUsage().rss / 1024 / 1024),
        };
    }
    async ready() {
        try {
            await this.dataSource.query('SELECT 1');
            return {
                status: 'ready',
                database: 'up',
                timestamp: new Date().toISOString(),
            };
        }
        catch (err) {
            throw new common_1.ServiceUnavailableException({
                status: 'not ready',
                database: 'down',
                error: err instanceof Error ? err.message : String(err),
            });
        }
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Get)(),
    (0, customize_1.ResponseMessage)('Health check'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "check", null);
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Get)('ready'),
    (0, customize_1.ResponseMessage)('Readiness check'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "ready", null);
exports.HealthController = HealthController = __decorate([
    (0, common_1.Controller)('health'),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], HealthController);
//# sourceMappingURL=health.controller.js.map