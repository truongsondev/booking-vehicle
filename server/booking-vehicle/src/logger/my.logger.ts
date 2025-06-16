import { LoggerService } from '@nestjs/common';

export class MyLogger implements LoggerService {
  log(message: string, context?: string) {
    console.log(`***INFO***[${context}] | ${message}`);
  }

  error(message: string, trace?: string, context?: string) {
    console.error(`***INFO***[${context}] | ${message}`);
  }

  warn(message: string, context?: string) {
    console.warn(`***INFO***[${context}] | ${message}`);
  }

  debug?(message: string, context?: string) {
    console.debug(`***INFO***[${context}] | ${message}`);
  }

  verbose?(message: string, context?: string) {
    console.info(`***INFO***[${context}] | ${message}`);
  }
}
