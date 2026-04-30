"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const config_1 = require("@nestjs/config");
exports.typeOrmConfig = {
    inject: [config_1.ConfigService],
    useFactory: (configService) => ({
        type: 'mysql',
        host: configService.get('MYSQL_HOST') ?? '127.0.0.1',
        port: Number(configService.get('MYSQL_PORT') ?? '3306'),
        username: configService.get('MYSQL_USER') ?? 'root',
        password: configService.get('MYSQL_PASSWORD') ?? '',
        database: configService.get('MYSQL_DB') ?? 'agri_ecommerce',
        synchronize: configService.get('TYPEORM_SYNC') === 'true',
        autoLoadEntities: true,
    }),
};
//# sourceMappingURL=typeorm.config.js.map