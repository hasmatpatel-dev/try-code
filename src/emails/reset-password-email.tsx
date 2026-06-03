import * as React from 'react';

export function ResetPasswordEmailTemplate({
  name,
  resetUrl,
}: {
  name: string;
  resetUrl: string;
}) {
  return (
    <html>
      <body style={{ fontFamily: 'sans-serif', maxWidth: 480, margin: '0 auto' }}>
        <h2>Reset your TryCode password</h2>
        <p>Hi {name},</p>
        <p>We received a request to reset your password.</p>
        <a
          href={resetUrl}
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#000',
            color: '#fff',
            borderRadius: 6,
            textDecoration: 'none',
          }}
        >
          Reset Password
        </a>
        <p style={{ color: '#888', fontSize: 12 }}>
          This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
        </p>
      </body>
    </html>
  );
}
