import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async setItem(key: string, value: unknown, ttl?: number) {
    await this.cacheManager.set(key, value, ttl ? ttl : undefined);
  }

  async getItem(key: string) {
    return await this.cacheManager.get(key);
  }

  async removeItem(key: string) {
    await this.cacheManager.del(key);
  }

  async clearCache() {
    await this.cacheManager.clear();
  }
}
