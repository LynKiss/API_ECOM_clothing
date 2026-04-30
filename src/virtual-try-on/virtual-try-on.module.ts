import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColorEntity } from '../products/entities/color.entity';
import { ProductImageEntity } from '../products/entities/product-image.entity';
import { ProductVariantEntity } from '../products/entities/product-variant.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { SizeEntity } from '../products/entities/size.entity';
import { VariantImageEntity } from '../products/entities/variant-image.entity';
import { VirtualTryOnController } from './virtual-try-on.controller';
import { VirtualTryOnService } from './virtual-try-on.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductVariantEntity,
      ProductImageEntity,
      VariantImageEntity,
      ColorEntity,
      SizeEntity,
    ]),
  ],
  controllers: [VirtualTryOnController],
  providers: [VirtualTryOnService],
  exports: [VirtualTryOnService],
})
export class VirtualTryOnModule {}
