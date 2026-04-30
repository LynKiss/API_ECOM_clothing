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
var SimpleCacheService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleCacheService = void 0;
const common_1 = require("@nestjs/common");
let SimpleCacheService = SimpleCacheService_1 = class SimpleCacheService {
    logger = new common_1.Logger(SimpleCacheService_1.name);
    store = new Map();
    constructor() {
        setInterval(() => this.cleanupExpired(), 60_000).unref();
    }
    get(key) {
        const entry = this.store.get(key);
        if (!entry)
            return undefined;
        if (Date.now() > entry.expiresAt) {
            this.store.delete(key);
            return undefined;
        }
        return entry.value;
    }
    set(key, value, ttlSeconds = 300) {
        this.store.set(key, {
            value,
            expiresAt: Date.now() + ttlSeconds * 1000,
        });
    }
    del(key) {
        this.store.delete(key);
    }
    invalidatePrefix(prefix) {
        let count = 0;
        for (const key of this.store.keys()) {
            if (key.startsWith(prefix)) {
                this.store.delete(key);
                count++;
            }
        }
        return count;
    }
    clear() {
        this.store.clear();
    }
    async getOrCompute(key, ttlSeconds, compute) {
        const cached = this.get(key);
        if (cached !== undefined)
            return cached;
        const fresh = await compute();
        this.set(key, fresh, ttlSeconds);
        return fresh;
    }
    cleanupExpired() {
        const now = Date.now();
        let removed = 0;
        for (const [key, entry] of this.store.entries()) {
            if (now > entry.expiresAt) {
                this.store.delete(key);
                removed++;
            }
        }
        if (removed > 0) {
            this.logger.debug(`Cleanup: removed ${removed} expired cache entries`);
        }
    }
};
exports.SimpleCacheService = SimpleCacheService;
exports.SimpleCacheService = SimpleCacheService = SimpleCacheService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SimpleCacheService);
//# sourceMappingURL=simple-cache.service.js.map