import { Injectable } from '@nestjs/common';
import User, { Roles } from './user.model';
import { CreateUserDto } from './Dtos/create-user.dto';
import { UpdateUserDto } from './Dtos/update-user.dto';

@Injectable()
export class UsersService {
  private users: User[] = [
    { id: 1, name: 'Alice', password: 'alice123', role: Roles.ADMIN },
    { id: 2, name: 'Bob', password: 'bob123', role: Roles.USER },
    { id: 3, name: 'Charlie', password: 'charlie123', role: Roles.USER },
    { id: 4, name: 'Diana', password: 'diana123', role: Roles.GUEST },
    { id: 5, name: 'Ethan', password: 'ethan123', role: Roles.USER },
  ];

  public FindAll(role?: Roles): User[] {
    if (role) {
      return this.users.filter((user) => user.role === role);
    }
    return this.users;
  }
  public FindById(id: number): User | null {
    const user = this.users.find((user) => user.id === id);
    return user || null;
  }

  public CreateUser(user: CreateUserDto): User {
    const userByHighestId = [...this.users].sort((a, b) => b.id - a.id);
    const newUSer: User = {
      id: userByHighestId[0].id + 1,
      ...user,
    };
    this.users.push(newUSer);
    return newUSer;
  }

  public UpdateUser(id: number, user: UpdateUserDto): User | null {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      return null;
    }
    const updatedUser: User = { ...this.users[index], ...user, id };
    this.users[index] = updatedUser;
    return updatedUser;
  }

  public DeleteUser(id: number): boolean {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      return false;
    }
    this.users.splice(index, 1);
    return true;
  }
}
