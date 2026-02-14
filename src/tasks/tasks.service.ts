import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { DatabaseService } from 'src/database/database.service';
import { TaskResponseDto } from './dto/task-response.dto';
import { Task } from '@prisma/client';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';

const TaskListCacheKey = (userId: number): string => `user:${userId}:tasks`;
const TaskByIdCacheKey = (userId: number, taskId: number): string => `user:${userId}:task:${taskId}`;

@Injectable()
export class TasksService {
  constructor(
    private $context: DatabaseService,
    private cacheService: RedisCacheService,
  ) {}

  async create(userId: number, dto: CreateTaskDto): Promise<TaskResponseDto> {
    const task = this.$context.task.create({
      data: {
        title: dto.title,
        completed: dto.completed,
        userId,
      },
    });
    // clear caching when create new task;
    this.cacheService.removeItem(TaskListCacheKey(userId));

    return task;
  }

  async findAll(userId: number): Promise<TaskResponseDto[]> {
    const cachedTasks = (await this.cacheService.getItem(TaskListCacheKey(userId))) as TaskResponseDto[];

    if (cachedTasks) return cachedTasks;

    const tasks = await this.$context.task.findMany({
      where: {
        userId,
      },
    });
    await this.cacheService.setItem(TaskListCacheKey(userId), tasks);
    return tasks;
  }

  async findOne(userId: number, id: number): Promise<TaskResponseDto> {
    const cachedTask = (await this.cacheService.getItem(TaskByIdCacheKey(userId, id))) as TaskResponseDto;

    if (cachedTask) return cachedTask;

    const task = await this.getTaskById(userId, id);
    if (!task) throw new NotFoundException();

    await this.cacheService.setItem(TaskByIdCacheKey(userId, id), task);

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

    // Clear the Cache from invalid data.
    await this.cacheService.removeItem(TaskListCacheKey(userId));
    await this.cacheService.removeItem(TaskByIdCacheKey(userId, id));

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

    // Clear the cache from invalid data.
    await this.cacheService.removeItem(TaskByIdCacheKey(userId, id));

    return task;
  }

  private async getTaskById(userId: number, id: number): Promise<Task | null> {
    return await this.$context.task.findFirst({
      where: {
        userId,
        id,
      },
    });
  }
}
