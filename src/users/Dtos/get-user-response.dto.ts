import { UserRole } from '@prisma/client';
import { Roles } from '../user.model';

export class GetUserResponseDto {
  id: number;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
