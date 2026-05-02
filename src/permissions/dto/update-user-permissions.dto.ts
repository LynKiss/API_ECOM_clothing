import { IsArray, IsNumberString } from 'class-validator';

export class UpdateUserPermissionsDto {
  @IsArray()
  @IsNumberString({}, { each: true })
  permissionIds: string[];
}
