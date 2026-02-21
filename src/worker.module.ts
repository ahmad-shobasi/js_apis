import { Module } from '@nestjs/common';
import { MailProcessor } from './mail/mail.processor';
import { AppModule } from './app.module';
import { ProcessorsModule } from './queue/processors.module';

/**
 * This module is used to run the worker process that will handle the background jobs.
 * It imports the AppModule to have access to all the services and modules defined in the application,
 * and the ProcessorsModule to have access to the job processors.
 */
@Module({
  imports: [AppModule, ProcessorsModule],
  providers: [],
})
export class WorkerModule {}
