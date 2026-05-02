import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SuperAdminRefreshToken,
  SuperAdminRefreshTokenSchema,
} from './schemas/super-admin-refresh-token.schema';
import {
  SuperAdmin,
  SuperAdminSchema,
} from './schemas/super-admin.schema';
import { SuperAdminController } from './super-admin.controller';
import { SuperAdminGuard } from './super-admin.guard';
import { SuperAdminService } from './super-admin.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule,
    MongooseModule.forFeature(
      [
        { name: SuperAdmin.name, schema: SuperAdminSchema },
        {
          name: SuperAdminRefreshToken.name,
          schema: SuperAdminRefreshTokenSchema,
        },
      ],
      'superAdminConnection',
    ),
  ],
  controllers: [SuperAdminController],
  providers: [SuperAdminService, SuperAdminGuard],
  exports: [SuperAdminService, SuperAdminGuard],
})
export class SuperAdminModule {}
