import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import User, { Roles } from './user.model';
import { UsersService } from './users.service';
import { CreateUserDto } from './Dtos/create-user.dto';
import { UpdateUserDto } from './Dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}
  @Get()
  getUsers(@Query('role') role?: string): User[] {
    if (role && !['admin', 'user', 'guest'].includes(role)) {
      throw new BadRequestException('Invalid role');
    }
    const users = this.service.FindAll(role as Roles);
    return users;
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number): User {
    const user = this.service.FindById(id);
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  @Post()
  createUser(@Body(ValidationPipe) user: CreateUserDto): User {
    const createdUser = this.service.CreateUser(user);
    return createdUser;
  }
  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) user: UpdateUserDto,
  ): User {
    const updatedUser = this.service.UpdateUser(id, user);
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }
}
