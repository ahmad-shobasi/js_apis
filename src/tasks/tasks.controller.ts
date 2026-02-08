import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRoles } from 'src/common/decorators/user-role.decorator';
import { UserRoleGuard } from 'src/auth/strategies/user-role/user-role.guard';

@UseGuards(JwtAuthGuard, UserRoleGuard)
@UserRoles('ADMIN', 'USER')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('create')
  create(@CurrentUser('id') userId: number, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(userId, createTaskDto);
  }

  @Get('all-tasks')
  findAll(@CurrentUser('id') userId: number) {
    return this.tasksService.findAll(userId);
  }

  @Get('task/:id')
  findOne(@CurrentUser('id') userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(userId, id);
  }

  @Patch('update/:id')
  update(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(userId, id, updateTaskDto);
  }

  @Delete('remove/:id')
  remove(@CurrentUser('id') userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.tasksService.remove(userId, id);
  }
}
