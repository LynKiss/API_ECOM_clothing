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
var DashboardPublisher_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardPublisher = void 0;
const common_1 = require("@nestjs/common");
const dashboard_realtime_constants_1 = require("./dashboard-realtime.constants");
const reports_service_1 = require("./reports.service");
let DashboardPublisher = DashboardPublisher_1 = class DashboardPublisher {
    reportsService;
    server = null;
    refreshTimer = null;
    pendingReasons = new Set();
    logger = new common_1.Logger(DashboardPublisher_1.name);
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    attach(server) {
        this.server = server;
    }
    async emitSnapshot(client, reason = 'initial') {
        const dashboard = await this.reportsService.getDashboard();
        client.emit(dashboard_realtime_constants_1.DASHBOARD_SNAPSHOT_EVENT, {
            reason,
            refreshedAt: new Date().toISOString(),
            dashboard,
        });
    }
    notifyChanged(reason = 'data_changed') {
        if (!this.server) {
            return;
        }
        this.pendingReasons.add(reason);
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
        }
        this.refreshTimer = setTimeout(() => {
            void this.flush();
        }, 350);
    }
    async flush() {
        if (!this.server) {
            return;
        }
        const reasons = [...this.pendingReasons];
        this.pendingReasons.clear();
        this.refreshTimer = null;
        try {
            const dashboard = await this.reportsService.getDashboard();
            this.server.to(dashboard_realtime_constants_1.DASHBOARD_ROOM).emit(dashboard_realtime_constants_1.DASHBOARD_UPDATED_EVENT, {
                reason: reasons.join(',') || 'data_changed',
                refreshedAt: new Date().toISOString(),
                dashboard,
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to refresh dashboard';
            this.logger.error(message, error instanceof Error ? error.stack : undefined);
            this.server.to(dashboard_realtime_constants_1.DASHBOARD_ROOM).emit(dashboard_realtime_constants_1.DASHBOARD_ERROR_EVENT, { message });
        }
    }
};
exports.DashboardPublisher = DashboardPublisher;
exports.DashboardPublisher = DashboardPublisher = DashboardPublisher_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], DashboardPublisher);
//# sourceMappingURL=dashboard.publisher.js.map