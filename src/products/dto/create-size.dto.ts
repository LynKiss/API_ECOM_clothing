import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateSizeDto {
  @IsString()
  @MaxLength(80)
  sizeName: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  sizeCode?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
