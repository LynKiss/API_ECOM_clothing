"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let LoggingInterceptor = class LoggingInterceptor {
    logger = new common_1.Logger('HTTP');
    SKIP_PATHS = new Set(['/health', '/favicon.ico']);
    intercept(context, next) {
        const httpCtx = context.switchToHttp();
        const req = httpCtx.getRequest();
        const res = httpCtx.getResponse();
        const url = req.originalUrl ?? req.url ?? '';
        if (this.SKIP_PATHS.has(url)) {
            return next.handle();
        }
        const method = req.method ?? 'UNKNOWN';
        const startedAt = Date.now();
        const userInfo = req.user?.username
            ? ` user=${req.user.username}`
            : '';
        return next.handle().pipe((0, operators_1.tap)({
            next: () => {
                const duration = Date.now() - startedAt;
                const status = res.statusCode ?? 200;
                this.logger.log(`${method} ${url} ${status} ${duration}ms${userInfo}`);
            },
            error: (err) => {
                const duration = Date.now() - startedAt;
                const status = err?.status ?? err?.response?.statusCode ?? res.statusCode ?? 500;
                this.logger.warn(`${method} ${url} ${status} ${duration}ms${userInfo} — ${err?.message ?? 'error'}`);
            },
        }));
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = __decorate([
    (0, common_1.Injectable)()
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map