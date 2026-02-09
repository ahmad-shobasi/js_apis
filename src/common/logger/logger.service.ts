import { Injectable, LoggerService } from '@nestjs/common';
import { winstonLogger } from './logger.config';

@Injectable()
export class AppLoggerService implements LoggerService {
  log(message: any, context?: string) {
    winstonLogger.info(message, { context });
  }

  error(message: any, trace?: string, context?: string) {
    winstonLogger.error(message, { trace, context });
  }

  warn(message: any, context?: string) {
    winstonLogger.warn(message, { context });
  }

  debug(message: any, context?: string) {
    winstonLogger.debug(message, { context });
  }

  verbose(message: any, context?: string) {
    winstonLogger.verbose(message, { context });
  }
}
