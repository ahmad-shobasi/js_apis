import { Controller, Get, Param, Post } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';

@Controller('cache-test')
export class TestCacheController {
  constructor(private cacheService: RedisCacheService) {}

  @Get()
  async test() {
    const existing = await this.cacheService.getItem('time');
    if (existing) {
      return { from: 'redis-cache', data: existing };
    }

    const value = new Date().toISOString();

    await this.cacheService.setItem('time', value);

    return { from: 'server-generated', data: value };
  }

  @Post('set-task/:task')
  async setAge(@Param('task') task: string) {
    await this.cacheService.setItem('task', task);
    const val = await this.cacheService.getItem('task');
    return {
      key: 'task',
      value: val,
    };
  }

  @Get('name')
  async getName() {
    const val = await this.cacheService.getItem('age');
    console.log('age: ');
    console.log(val);

    return { key: 'age', value: val };
  }
}
