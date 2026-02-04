import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { Roles } from './user.model';
import { UsersService } from './users.service';
import { CreateUserDto } from './Dtos/create-user.dto';
import { UpdateUserDto } from './Dtos/update-user.dto';
import { GetUserResponseDto } from './Dtos/get-user-response.dto';
import { GetUserQueryDto } from './Dtos/role-query.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  async getUsers(
    @Query(ValidationPipe) query?: GetUserQueryDto,
  ): Promise<GetUserResponseDto[]> {
    const users = await this.service.FindAll(query?.role);
    return users;
  }

  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetUserResponseDto | null> {
    const user = await this.service.FindById(id);
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  @Post()
  async createUser(
    @Body(ValidationPipe) user: CreateUserDto,
  ): Promise<GetUserResponseDto> {
    const createdUser = await this.service.CreateUser(user);
    return createdUser;
  }
  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) user: UpdateUserDto,
  ): Promise<GetUserResponseDto | null> {
    const updatedUser = await this.service.UpdateUser(id, user);
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  @Delete(':id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: boolean }> {
    const deleted = await this.service.DeleteUser(id);
    return { success: deleted };
  }
}
