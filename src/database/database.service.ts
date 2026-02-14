import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  constructor(config: ConfigService) {
    const pool = new PrismaPg({
      connectionString: config.get('database.url'),
    });
    super({
      adapter: pool,
    });
    console.log(config);
  }
  async onModuleInit() {
    await this.$connect();
  }
}
