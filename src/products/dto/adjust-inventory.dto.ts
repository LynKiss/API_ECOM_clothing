import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export enum InventoryAdjustmentMode {
  SET = 'set',
  INCREASE = 'increase',
  DECREASE = 'decrease',
}

export class AdjustInventoryDto {
  @IsString()
  @MaxLength(36)
  productId: string;

  @IsOptional()
  @IsString()
  @MaxLength(36)
  variantId?: string;

  @IsEnum(InventoryAdjustmentMode)
  mode: InventoryAdjustmentMode;

  @IsInt()
  @Min(0)
  quantity: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
