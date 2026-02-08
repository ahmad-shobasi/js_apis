import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { DatabaseService } from 'src/database/database.service';
import { TaskResponseDto } from './dto/task-response.dto';
import { Task } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private $context: DatabaseService) {}
  async create(userId: number, dto: CreateTaskDto): Promise<TaskResponseDto> {
    return this.$context.task.create({
      data: {
        title: dto.title,
        userId,
      },
    });
  }

  async findAll(userId: number): Promise<TaskResponseDto[]> {
    const tasks = await this.$context.task.findMany({
      where: {
        userId,
      },
      orderBy: { createdAt: 'desc' },
    });
    return tasks;
  }

  async findOne(userId: number, id: number): Promise<TaskResponseDto> {
    const task = await this.getTaskById(userId, id);
    if (!task) throw new NotFoundException();
    return task;
  }

  async update(userId: number, id: number, dto: UpdateTaskDto): Promise<TaskResponseDto> {
    const task = await this.$context.task.update({
      where: {
        userId,
        id,
      },
      data: dto,
    });
    if (!task) throw new NotFoundException();

    return task;
  }

  async remove(userId: number, id: number): Promise<TaskResponseDto> {
    const task = await this.$context.task.delete({
      where: {
        userId,
        id,
      },
    });
    if (!task) throw new NotFoundException();
    return task;
  }

  async getTaskById(userId: number, id: number): Promise<Task | null> {
    return await this.$context.task.findFirst({
      where: {
        userId,
        id,
      },
    });
  }
}
