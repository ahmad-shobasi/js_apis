import { Role } from 'generated/prisma';
import { EmployeeRoles } from '../entities/employee.entity';

export class CreatedEmployeeResponseDto {
  id: number;
  name: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
