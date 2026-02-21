import { Module } from '@nestjs/common';
import { MailProcessor } from 'src/mail/mail.processor';

@Module({
  providers: [MailProcessor],
})
export class ProcessorsModule {}
