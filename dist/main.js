"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const node_path_1 = require("node:path");
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = require("express");
const app_module_1 = require("./app.module");
const jwt_auth_guard_1 = require("./auth/jwt-auth.guard");
const transform_interceptor_1 = require("./core/transform.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bodyParser: false,
    });
    const reflector = app.get(core_1.Reflector);
    app.use((0, express_1.json)({ limit: process.env.JSON_BODY_LIMIT ?? '20mb' }));
    app.use((0, express_1.urlencoded)({ extended: true, limit: process.env.URLENCODED_BODY_LIMIT ?? '20mb' }));
    app.use((0, helmet_1.default)());
    app.use((0, cookie_parser_1.default)());
    app.useGlobalGuards(new jwt_auth_guard_1.JwtAuthGuard(reflector));
    app.useStaticAssets((0, node_path_1.join)(__dirname, '..', 'public'));
    app.useStaticAssets((0, node_path_1.join)(process.cwd(), 'uploads'), { prefix: '/uploads' });
    app.setBaseViewsDir((0, node_path_1.join)(__dirname, '..', 'views'));
    app.setViewEngine('ejs');
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor(reflector));
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: '1',
    });
    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
//# sourceMappingURL=main.js.map