import * as joi from 'joi';

export const envValidation = joi.object({
  NODE_ENV: joi.string().valid('development', 'production', 'test').required(),
  PORT: joi.number().port().required(),
  APP_URL: joi.string().uri({ scheme: ['http', 'https'] }).required(),

  DATABASE_URL: joi.string().required(),

  JWT_ACCESS_SECRET: joi.string().min(32).required(),
  JWT_REFRESH_SECRET: joi.string().min(32).required(),
  JWT_ACCESS_EXPIRES: joi.string().required(),
  JWT_REFRESH_EXPIRES: joi.string().required(),

  REDIS_HOST: joi.string().required(),
  REDIS_PORT: joi.number().port().required(),

  SMTP_HOST: joi.string().required(),
  SMTP_PORT: joi.number().port().required(),
  SMTP_SECURE: joi.boolean().required(),
  SMTP_USER: joi.string().required(),
  SMTP_PASS: joi.string().required(),
  MAIL_FROM: joi.string().email().optional(),
});
