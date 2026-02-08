import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { env } from 'prisma/config';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  constructor() {
    const pool = new PrismaPg({
      connectionString: env('DATABASE_URL'),
    });
    super({
      adapter: pool,
    });
  }
  async onModuleInit() {
    await this.$connect();
  }
}
