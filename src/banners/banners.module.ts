import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannersController } from './banners.controller';
import { BannersService } from './banners.service';
import { BannerEntity } from './entities/banner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BannerEntity])],
  controllers: [BannersController],
  providers: [BannersService],
})
export class BannersModule {}
