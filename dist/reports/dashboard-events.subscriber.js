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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardEventsSubscriber = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const dashboard_publisher_1 = require("./dashboard.publisher");
let DashboardEventsSubscriber = class DashboardEventsSubscriber {
    dashboardPublisher;
    watchedTables = new Set([
        'orders',
        'order_items',
        'products',
        'inventory_transactions',
        'users',
        'discounts',
        'coupon_usage',
        'comments',
        'purchase_orders',
        'goods_receipts',
        'supplier_returns',
        'rice_diagnosis_history',
    ]);
    constructor(dataSource, dashboardPublisher) {
        this.dashboardPublisher = dashboardPublisher;
        dataSource.subscribers.push(this);
    }
    afterInsert(event) {
        this.notify('insert', event.metadata.tableName);
    }
    afterUpdate(event) {
        this.notify('update', event.metadata.tableName);
    }
    afterRemove(event) {
        this.notify('remove', event.metadata.tableName);
    }
    afterSoftRemove(event) {
        this.notify('soft_remove', event.metadata.tableName);
    }
    notify(action, tableName) {
        if (!tableName || !this.watchedTables.has(tableName)) {
            return;
        }
        this.dashboardPublisher.notifyChanged(`${tableName}:${action}`);
    }
};
exports.DashboardEventsSubscriber = DashboardEventsSubscriber;
exports.DashboardEventsSubscriber = DashboardEventsSubscriber = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        dashboard_publisher_1.DashboardPublisher])
], DashboardEventsSubscriber);
//# sourceMappingURL=dashboard-events.subscriber.js.map