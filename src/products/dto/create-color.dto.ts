import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateColorDto {
  @IsString()
  @MaxLength(100)
  colorName: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  colorCode?: string;
}
