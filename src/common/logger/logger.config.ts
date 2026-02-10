import * as winston from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, printf, errors, json } = winston.format;

const logFormat = printf((info) => {
  const { level, message, timestamp, stack, context, ...meta } = info;

  return JSON.stringify({
    time: timestamp,
    level,
    context,
    message,
    ...meta,
    stack,
  });
});

export const winstonLogger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), errors({ stack: true }), json(), logFormat),
  transports: [
    new winston.transports.Console(),
    new winston.transports.DailyRotateFile({
      filename: 'logs/%DATE%-error.log',
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d',
      maxSize: '10m',
    }),
    new winston.transports.DailyRotateFile({
      filename: 'logs/%DATE%-combined.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '15d',
      maxSize: '20m',
    }),
  ],
});
