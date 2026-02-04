import { UserRole } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class GetUserQueryDto {
  @IsOptional()
  @IsEnum(UserRole, { message: 'role must be valid' })
  role?: UserRole;
}
