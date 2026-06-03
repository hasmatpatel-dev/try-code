import * as React from 'react';

export function WelcomeEmailTemplate({ name }: { name: string }) {
  return (
    <html>
      <body style={{ fontFamily: 'sans-serif', maxWidth: 480, margin: '0 auto' }}>
        <h2>Welcome to TryCode 🎉</h2>
        <p>Hi {name},</p>
        <p>Your account is verified. You can now access the dashboard and start learning.</p>
        <a
          href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`}
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#000',
            color: '#fff',
            borderRadius: 6,
            textDecoration: 'none',
          }}
        >
          Go to Dashboard
        </a>
      </body>
    </html>
  );
}
