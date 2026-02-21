import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MAIL_QUEUE } from './mail.constant';

@Processor(MAIL_QUEUE)
export class MailProcessor extends WorkerHost {
  async process(job: Job<any>): Promise<any> {
    if (job.name === 'welcome-email') {
      const { email, userId } = job.data;

      console.log(`Sending email to ${email} for user ${userId}`);

      // simulate email sending
      await new Promise((res) => setTimeout(res, 4000));

      console.log('Email sent!');
    }
  }
}
