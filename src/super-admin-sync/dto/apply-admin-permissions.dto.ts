import { IsArray, IsOptional, IsString } from 'class-validator';

export class ApplyAdminPermissionsDto {
  @IsArray()
  @IsString({ each: true })
  permissionKeys: string[];

  @IsOptional()
  @IsString()
  syncedBy?: string;
}
