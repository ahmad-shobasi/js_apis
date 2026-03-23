import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MAIL_QUEUE, VERIFY_TOKEN_SECRET } from './mail.constant';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

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
        await this.sendEmail(email, verificationToken);
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

  private async sendEmail(to: string, token: string) {
    const host = this.config.get<string>('mail.smtp.host');
    const user = this.config.get<string>('mail.smtp.user');
    const pass = this.config.get<string>('mail.smtp.pass');
    if (!host || !user || !pass) {
      throw new Error(
        'SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in your environment (see .env.example).',
      );
    }

    const port = this.config.get<number>('mail.smtp.port');
    const secure = this.config.get<boolean>('mail.smtp.secure');
    const from =
      this.config.get<string>('mail.from')?.trim() || user;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
    const appUrl = this.config.get<string>('appUrl') || '';
    const normalizedAppUrl = appUrl.replace(/\/$/, '');
    const link = `${normalizedAppUrl}/api/auth/verify-account?token=${token}`;
    await transporter.sendMail({
      from,
      to,
      subject: 'Welcome to Our Service',
      html: `
      <h1>Welcome to Our Service</h1>
      <p>Your account doesn't verified yet, please click the link below to verify your account:</p>
      <a href="${link}" style="color: blue; text-decoration: underline;">Verify Account</a>
      `,
    });
    console.log(`email sent to ${to}`);
  }
}
