import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  ValidationPipe,
  ParseIntPipe,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreatedEmployeeResponseDto } from './dto/created-employee-response.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  async create(
    @Body(ValidationPipe) createEmployeeDto: CreateEmployeeDto,
  ): Promise<CreatedEmployeeResponseDto> {
    const createdEmployee =
      await this.employeesService.create(createEmployeeDto);

    if (!createdEmployee) throw new BadRequestException();

    return createdEmployee;
  }

  @Get()
  async findAll(
    @Query('role') role?: string,
  ): Promise<CreatedEmployeeResponseDto[]> {
    return await this.employeesService.findAll(role);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CreatedEmployeeResponseDto> {
    const employee = await this.employeesService.findOne(id);
    if (!employee) throw new NotFoundException();
    return employee;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    const updatedEmployee = await this.employeesService.update(
      id,
      updateEmployeeDto,
    );
    if (!updateEmployeeDto) throw new NotFoundException();
    return updatedEmployee;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.remove(id);
  }
}
