import { ToBoolean } from '../../common/dto-transformers';
import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

class CreateProductVariantColorDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  colorName: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  colorCode?: string;
}

class CreateProductVariantSizeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  sizeName: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  sizeCode?: string;
}

export class CreateProductVariantDto {
  @IsOptional()
  @IsNumberString()
  colorId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateProductVariantColorDto)
  newColor?: CreateProductVariantColorDto;

  @IsOptional()
  @IsNumberString()
  sizeId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateProductVariantSizeDto)
  newSize?: CreateProductVariantSizeDto;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  sku?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  barcode?: string;

  @IsOptional()
  @IsNumberString()
  price?: string;

  @IsOptional()
  @IsNumberString()
  salePrice?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stockQuantity?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  weightGrams?: number;

  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateProductDto {
  @IsOptional()
  @IsUUID()
  productId?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  productName: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  productSlug?: string;

  @IsNumberString()
  categoryId: string;

  @IsOptional()
  @IsNumberString()
  subcategoryId?: string;

  @IsOptional()
  @IsNumberString()
  originId?: string;

  @IsNumberString()
  productPrice: string;

  @IsOptional()
  @IsNumberString()
  productPriceSale?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  quantityAvailable?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  isShow?: boolean;

  @IsOptional()
  @IsString()
  expiredAt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  unit?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  quantityPerBox?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  barcode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  boxBarcode?: string;

  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  tagIds?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants?: CreateProductVariantDto[];
}
