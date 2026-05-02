import { IsString, MaxLength, MinLength } from 'class-validator';

export class SuperAdminLoginDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(128)
  password: string;
}
