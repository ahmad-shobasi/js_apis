import { defineConfig, env } from 'prisma/config';
import * as dotenv from 'dotenv';

// Configuring prisma to behave like the app and load the used .env file correctly.
// NOTE: you need to run the app before running prisma to let the app load the correct .env file.
const environment = process.env.NODE_ENV || 'development';

dotenv.config({
  path: `.env.${environment}`,
});

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
