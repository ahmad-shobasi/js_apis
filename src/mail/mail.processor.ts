import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MAIL_QUEUE } from './mail.constant';

@Processor(MAIL_QUEUE)
export class MailProcessor extends WorkerHost {
  async process(job: Job<any>): Promise<any> {
    if (job.name === 'welcome-email') {
      const { email, userId } = job.data;

      try {
        console.log(`Sending email to ${email} for user ${userId}`);

        // simulate email sending
        await new Promise((res) => setTimeout(res, 4000));

        console.log('Email sent!');
      } catch (err) {
        console.error(`Failed to send email for ${email} :`, err);
        throw err;
      }
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    console.error(`Job ${job.id} failed after ${job.attemptsMade} attempts:`, error);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`Job ${job.id} completed`);
  }
}
