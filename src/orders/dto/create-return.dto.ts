import { IsInt, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateReturnDto {
  @IsString()
  @MaxLength(36)
  orderId: string;

  @IsString()
  @MaxLength(20)
  orderItemId: string;

  @IsInt()
  @Min(1)
  @Max(9999)
  returnQuantity: number;

  @IsString()
  @MaxLength(255)
  reason: string;

  @IsString()
  @MaxLength(1000)
  description: string;
}
