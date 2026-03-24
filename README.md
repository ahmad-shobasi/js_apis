# JS APIs (NestJS)

A backend API built with NestJS, Prisma, PostgreSQL, Redis, and BullMQ.

It includes authentication with JWT, role-based authorization, task management, user profile avatar upload, Redis caching, and background email delivery through a worker process.

## Tech stack

- NestJS (TypeScript)
- Prisma + PostgreSQL
- Redis (`cache-manager` + BullMQ)
- JWT + Passport
- Nodemailer
- Swagger + Scalar API docs
- Winston logger

## Main features

- User authentication:
  - sign up, login, refresh token, logout
  - account verification by email token
- Role-based route protection (`ADMIN`, `USER`, `GUEST`)
- Tasks API (CRUD) with user ownership checks
- User profile API with avatar upload
- Redis caching for task/profile reads
- Background mail jobs using BullMQ worker
- Request throttling and global validation/error handling

## Project structure

```text
src/
  auth/            # auth controller, service, guards, strategies, DTOs
  tasks/           # task controller/service/DTOs
  user-profile/    # profile endpoints, avatar upload logic
  mail/            # queue producer + email job processor
  queue/           # BullMQ root setup and processor wiring
  redis-cache/     # cache module/service
  config/          # env parsing + Joi validation
  common/          # logger, filters, decorators, middleware
  database/        # Prisma service/module
  main.ts          # API bootstrap
  worker.ts        # worker bootstrap
prisma/
  schema.prisma
```

## Prerequisites

- Node.js 20+
- npm
- PostgreSQL
- Redis

## Environment variables

Create `.env.development` (or `.env.production`) from `.env.example`.

Required variables:

```env
NODE_ENV=development
PORT=4000
APP_URL=http://localhost:4000

DATABASE_URL=postgresql://user:password@127.0.0.1:5432/db_name

JWT_ACCESS_SECRET=your_long_secret
JWT_REFRESH_SECRET=your_long_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

REDIS_HOST=localhost
REDIS_PORT=6379

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass

# optional
MAIL_FROM=no-reply@example.com
```

## Install

```bash
npm install
```

## Database setup

Generate Prisma client and apply your schema:

```bash
npx prisma generate
npx prisma migrate dev
```

For a production database:

```bash
npx prisma migrate deploy
```

## Run the app

### API server

```bash
npm run start:dev
```

API base URL:

- `http://localhost:4000/api` (if `PORT=4000`)

### Worker process (required for email jobs)

Run this in a second terminal:

```bash
npm run start:worker
```

Without the worker, queued emails are not processed.

## API documentation and dashboards

In non-production environments:

- Swagger UI: `/api`
- Scalar reference: `/reference`
- Bull Board queues: `/admin/queues`

Example local links:

- `http://localhost:4000/api`
- `http://localhost:4000/reference`
- `http://localhost:4000/admin/queues`

## Scripts

- `npm run start` - run API
- `npm run start:dev` - run API in watch mode (`NODE_ENV=development`)
- `npm run start:prod` - run compiled API (`NODE_ENV=production`)
- `npm run start:worker` - run BullMQ worker process
- `npm run build` - build app
- `npm run test` - run unit tests
- `npm run test:e2e` - run e2e tests
- `npm run test:cov` - run coverage
- `npm run lint` - lint and auto-fix

## Data model overview

- `User`
  - name, email, password, role, refresh token id, verification state
- `Task`
  - title, completed, belongs to one user
- `UserProfile`
  - avatar URL, belongs to one user

## Notes for contributors

- Keep environment secrets out of source control.
- Run API and worker together when testing signup/email flow.
- Ensure PostgreSQL and Redis are running before starting the app.
- Keep `.env.example` updated whenever new env variables are introduced.

## License

This repository is currently marked as `UNLICENSED` in `package.json`.
