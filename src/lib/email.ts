import { resend, FROM } from '@/lib/resend';
import { VerificationEmailTemplate } from '@/emails/verification-email';
import { ResetPasswordEmailTemplate } from '@/emails/reset-password-email';
import { WelcomeEmailTemplate } from '@/emails/welcome-email';

export async function sendVerificationEmail(
  to: string,
  name: string,
  verificationUrl: string
) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Verify your TryCode account',
    react: VerificationEmailTemplate({ name, verificationUrl }),
  });
}

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetUrl: string
) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Reset your TryCode password',
    react: ResetPasswordEmailTemplate({ name, resetUrl }),
  });
}

export async function sendWelcomeEmail(to: string, name: string) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Welcome to TryCode 🎉',
    react: WelcomeEmailTemplate({ name }),
  });
}
