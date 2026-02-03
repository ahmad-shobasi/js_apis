import { Role } from 'generated/prisma';

export class UpdateEmployeeResponseDto {
  id: number;
  name: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
