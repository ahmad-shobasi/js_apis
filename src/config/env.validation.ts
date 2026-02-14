import * as joi from 'joi';

export const envValidation = joi.object({
  NODE_ENV: joi.string().valid('development', 'production').required(),

  DATABASE_URL: joi.string().required(),

  JWT_ACCESS_SECRET: joi.string().min(32).required(),
  JWT_REFRESH_SECRET: joi.string().min(32).required(),

  REDIS_HOST: joi.string().required(),
  REDIS_PORT: joi.string().required(),
});
