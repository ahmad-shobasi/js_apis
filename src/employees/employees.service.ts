import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { DatabaseService } from 'src/database/database.service';
import { CreatedEmployeeResponseDto } from './dto/created-employee-response.dto';
import { Prisma } from 'generated/prisma/client';
import { Role } from 'generated/prisma';
import { UpdateEmployeeResponseDto } from './dto/update-employee-response.dto';
import { DeleteEmployeeResponseDto } from './dto/delete-employee-response.dto';

@Injectable()
export class EmployeesService {
  constructor(private readonly $context: DatabaseService) {}
  async create(
    createEmployeeDto: CreateEmployeeDto,
  ): Promise<CreatedEmployeeResponseDto> {
    return await this.$context.employee.create({
      data: createEmployeeDto,
    });
  }

  async findAll(role?: string): Promise<CreatedEmployeeResponseDto[]> {
    if (role)
      return await this.$context.employee.findMany({
        where: {
          role: role as Role,
        },
      });
    return await this.$context.employee.findMany();
  }

  async findOne(id: number): Promise<CreatedEmployeeResponseDto | null> {
    return this.$context.employee.findUnique({
      where: { id },
    });
  }

  async update(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<UpdateEmployeeResponseDto | null> {
    const updatedEmployee = await this.$context.employee.update({
      where: { id },
      data: updateEmployeeDto,
    });
    return updatedEmployee;
  }

  async remove(id: number): Promise<DeleteEmployeeResponseDto> {
    const removedEmployee = await this.$context.employee.delete({
      where: { id },
    });
    const removedEmployeeDto: DeleteEmployeeResponseDto =
      new DeleteEmployeeResponseDto();

    if (!removedEmployee) {
      removedEmployeeDto.status = false;
    } else {
      removedEmployeeDto.status = true;
      removedEmployeeDto.deletedEmployee = removedEmployee;
    }
    return removedEmployeeDto;
  }
}
