import { UserRole } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpRequestDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsEnum(UserRole, { message: 'valid role required' })
  role: UserRole;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
