import { Injectable, LoggerService } from '@nestjs/common';
import { winstonLogger } from './logger.config';
import { RequestContext } from '../context/request-context';

@Injectable()
export class AppLoggerService implements LoggerService {
  private enrich(meta: any = {}) {
    const store = RequestContext.getStore();
    return {
      requestId: store?.requestId ?? 'system',
      sessionId: store?.sessionId ?? null,
      ...meta,
    };
  }

  log(message: any, context?: string) {
    winstonLogger.info(message, this.enrich({ context }));
  }

  error(message: any, trace?: string, context?: string) {
    winstonLogger.error(message, this.enrich({ trace, context }));
  }

  warn(message: any, context?: string) {
    winstonLogger.warn(message, this.enrich({ context }));
  }

  debug(message: any, context?: string) {
    winstonLogger.debug(message, this.enrich({ context }));
  }

  verbose(message: any, context?: string) {
    winstonLogger.verbose(message, this.enrich({ context }));
  }
}
