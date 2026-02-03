import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EmployeeRoles } from '../entities/employee.entity';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(EmployeeRoles, { message: 'valid role required' })
  role: EmployeeRoles;
}
