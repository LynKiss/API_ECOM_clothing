import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class AddCartItemDto {
  @IsString()
  @MaxLength(36)
  productId: string;

  @IsOptional()
  @IsString()
  @MaxLength(36)
  variantId?: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
