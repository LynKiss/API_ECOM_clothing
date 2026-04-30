import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateVirtualTryOnDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(36)
  @Matches(/^[a-zA-Z0-9-]+$/)
  productId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(36)
  @Matches(/^[a-zA-Z0-9-]+$/)
  variantId?: string;

  @IsOptional()
  @IsIn(['front', 'side', 'auto'])
  posePreference?: 'front' | 'side' | 'auto';

  @IsOptional()
  @IsString()
  @MaxLength(240)
  note?: string;
}
