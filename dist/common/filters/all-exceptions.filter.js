"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let AllExceptionsFilter = class AllExceptionsFilter {
    logger = new common_1.Logger('Exception');
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const path = request?.originalUrl ?? request?.url ?? '';
        const method = request?.method ?? '';
        const userInfo = request?.user?.username
            ? ` user=${request.user.username}`
            : '';
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errorName;
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            if (typeof res === 'string') {
                message = res;
            }
            else if (res && typeof res === 'object') {
                const r = res;
                message = r.message ?? exception.message;
                errorName = r.error;
            }
            else {
                message = exception.message;
            }
        }
        else if (exception instanceof typeorm_1.QueryFailedError) {
            status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Database error';
            errorName = 'QueryFailedError';
        }
        else if (exception instanceof Error) {
            message = exception.message || 'Internal server error';
        }
        const logLine = `${method} ${path} ${status}${userInfo} — ${Array.isArray(message) ? message.join(', ') : message}`;
        if (status >= 500) {
            const stack = exception instanceof Error ? exception.stack : String(exception);
            this.logger.error(logLine, stack);
        }
        else if (status >= 400) {
            this.logger.warn(logLine);
        }
        response.status(status).json({
            statusCode: status,
            message,
            error: errorName,
            timestamp: new Date().toISOString(),
            path,
        });
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
//# sourceMappingURL=all-exceptions.filter.js.map