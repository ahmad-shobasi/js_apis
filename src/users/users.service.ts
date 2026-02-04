import { Injectable } from '@nestjs/common';
import User, { Roles } from './user.model';
import { CreateUserDto } from './Dtos/create-user.dto';
import { UpdateUserDto } from './Dtos/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { GetUserResponseDto } from './Dtos/get-user-response.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly $context: DatabaseService) {}

  async FindAll(role?: UserRole): Promise<GetUserResponseDto[]> {
    if (role) {
      return await this.$context.user.findMany({ where: { role } });
    }
    return await this.$context.user.findMany();
  }

  async FindById(id: number): Promise<GetUserResponseDto | null> {
    const user = this.$context.user.findUnique({ where: { id } });
    return (await user) || null;
  }

  async CreateUser(user: CreateUserDto): Promise<GetUserResponseDto> {
    return await this.$context.user.create({ data: user });
  }

  async UpdateUser(
    id: number,
    user: UpdateUserDto,
  ): Promise<GetUserResponseDto | null> {
    return await this.$context.user.update({
      where: { id },
      data: user,
    });
  }

  async DeleteUser(id: number): Promise<boolean> {
    return await this.$context.user
      .delete({ where: { id } })
      .then(() => true)
      .catch(() => false);
  }
}
