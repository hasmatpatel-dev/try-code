import * as React from 'react';

export function VerificationEmailTemplate({
  name,
  verificationUrl,
}: {
  name: string;
  verificationUrl: string;
}) {
  return (
    <html>
      <body style={{ fontFamily: 'sans-serif', maxWidth: 480, margin: '0 auto' }}>
        <h2>Verify your TryCode account</h2>
        <p>Hi {name},</p>
        <p>Click the button below to verify your email address.</p>
        <a
          href={verificationUrl}
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#000',
            color: '#fff',
            borderRadius: 6,
            textDecoration: 'none',
          }}
        >
          Verify Email
        </a>
        <p style={{ color: '#888', fontSize: 12 }}>
          This link expires in 1 hour. If you didn't create an account, ignore this email.
        </p>
      </body>
    </html>
  );
}
