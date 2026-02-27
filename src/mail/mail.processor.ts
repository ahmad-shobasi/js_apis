import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MAIL_QUEUE, VERIFY_TOKEN_SECRET } from './mail.constant';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Processor(MAIL_QUEUE)
export class MailProcessor extends WorkerHost {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
  ) {
    super();
  }
  async process(job: Job<any>): Promise<any> {
    if (job.name === 'welcome-email') {
      const { email, userId } = job.data;
      const verificationToken = await this.generateVerificationToken(userId);
      try {
        const message = `
        Welcome to my server system and thank you for joining.
        Your account doesn't verified yet, please click the link below to verify your account:
        ${this.config.get('appUrl')}/api/verify-account?token=${verificationToken}
        `;
        console.log(message);

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

  private async generateVerificationToken(userId: number): Promise<string> {
    return await this.jwt.signAsync({ sub: userId }, { secret: VERIFY_TOKEN_SECRET, expiresIn: '1d' });
  }
}
