import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateCancelPaidRefundDto {
  @IsString()
  @MaxLength(36)
  orderId: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  amount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
