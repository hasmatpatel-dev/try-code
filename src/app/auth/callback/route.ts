import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendWelcomeEmail } from '@/lib/email';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    // Use exchangeCodeForSession which is standard in Next.js App Router auth flows
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const user = data.user;
      
      // Determine if this is the first email confirmation
      // If email_confirmed_at is within the last 10 seconds, trigger welcome email
      const isFirstVerification =
        user.email_confirmed_at &&
        new Date(user.email_confirmed_at).getTime() > Date.now() - 10000;

      if (isFirstVerification && user.email) {
        try {
          await sendWelcomeEmail(
            user.email,
            user.user_metadata?.name ?? 'there'
          );
        } catch (emailError) {
          // Non-blocking error logging
          console.error('Failed to send welcome email:', emailError);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Redirect to login with error status if token/code verification fails
  return NextResponse.redirect(`${origin}/auth/login?error=Verification failed`);
}
