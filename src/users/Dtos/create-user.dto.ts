import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Roles } from '../user.model';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  password: string;

  @IsEnum(Roles, { message: 'valid role required' })
  role: Roles;
}
