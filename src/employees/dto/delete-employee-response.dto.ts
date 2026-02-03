import { Employee } from 'generated/prisma';

export class DeleteEmployeeResponseDto {
  status: boolean;
  deletedEmployee: Employee;
}
