import { Controller, Get, Inject, Logger, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private logger = new Logger();
  constructor() {}
  @Inject('APP_SERVICE')
  private readonly appService: AppService;
  @Get()
  getHello(): string {
    this.logger.error('This is an error log', AppController.name);
    this.logger.warn('This is a warning log', AppController.name);
    this.logger.log('This is a log message', AppController.name);
    this.logger.debug('This is a debug message', AppController.name);
    this.logger.verbose('This is a verbose message', AppController.name);

    return this.appService.getHello();
  }
}
