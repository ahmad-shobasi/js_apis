import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MailProcessor } from 'src/mail/mail.processor';

@Module({
  imports: [JwtModule.register({})],
  providers: [MailProcessor],
})
export class ProcessorsModule {}
