import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { MAIL_QUEUE } from './mail.constant';

@Injectable()
export class MailService {
  constructor(@InjectQueue(MAIL_QUEUE) private mailQueue: Queue) {}

  async sendWelcomeEmail(userId: number, email: string) {
    await this.mailQueue.add(
      'welcome-email',
      { userId, email },
      {
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );
  }
}
