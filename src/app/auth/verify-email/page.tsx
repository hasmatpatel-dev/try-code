'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Loader2, MailCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field';

import LogoSvg from '@/assets/trycode.svg';
import Image from 'next/image';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? 'your email address';
  const [cooldown, setCooldown] = useState(0);
  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message || 'Failed to resend email');
      } else {
        setResent(true);
        setCooldown(60);
        toast.success('Verification email resent!');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg px-4 sm:px-0 mx-auto w-full z-10">
      <Card className="px-6 py-8 sm:p-12 relative gap-6 border border-border/40 bg-[#090D1A] shadow-2xl">
        <CardHeader className="text-center gap-6 p-0">
          <div className="mx-auto">
            <Link href="/">
              <div className="mdn"><Image src={LogoSvg} alt="TryCode" height={40} width={40} /></div>
            </Link>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <MailCheck className="h-12 w-12 text-primary" />
            <CardTitle className="text-2xl font-medium text-white">
              Verify your email
            </CardTitle>
            <CardDescription className="text-sm font-normal text-muted-foreground text-center">
              An activation link has been sent to your email address:
              <strong className="block text-white my-1">{email}</strong>
              Please check your inbox and click on the link to complete the activation process.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-6">
          <FieldGroup>
            <Field className="gap-4">
              <Button
                onClick={handleResend}
                disabled={cooldown > 0 || loading}
                size="lg"
                className="rounded-xl h-10 hover:bg-primary/80 cursor-pointer w-full"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : cooldown > 0 ? (
                  `Resend in ${cooldown}s`
                ) : (
                  'Resend verification email'
                )}
              </Button>
              {resent && (
                <p className="text-xs text-green-500 text-center">Email resent successfully!</p>
              )}
              <FieldDescription className="text-center text-sm font-normal text-muted-foreground">
                Need to change credentials or login?{' '}
                <Link
                  href="/auth/login"
                  className="font-medium text-white no-underline hover:underline"
                >
                  Back to Login
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
}

import { Suspense } from 'react';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#030712] text-white">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
