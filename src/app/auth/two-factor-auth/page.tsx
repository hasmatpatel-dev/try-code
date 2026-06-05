'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field';
import {
  InputOTP, InputOTPGroup, InputOTPSlot,
} from '@/components/ui/input-otp';

const schema = z.object({
  otp: z.string().length(6, 'Enter the 6-digit code'),
});

type TwoFactorInputs = z.infer<typeof schema>;

function TwoFactorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<TwoFactorInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      otp: '',
    },
  });

  const otpValue = watch('otp');

  const onSubmit = async (data: TwoFactorInputs) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: data.otp,
        type: 'email',
      });

      if (!error) {
        toast.success('Code verified successfully!');
        router.push('/dashboard');
      } else {
        setError('otp', { message: error.message || 'Invalid or expired code' });
        toast.error(error.message || 'Invalid code');
      }
    } catch (err) {
      toast.error('An unexpected error occurred.');
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
              <div className="mdn">TryCode</div>
            </Link>
          </div>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-2xl font-medium text-white">
              Two Factor Authentication
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground font-normal">
              Please confirm access to your account by entering the code
              provided by your authenticator application
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="gap-6">
              <div className="flex flex-col items-center gap-4">
                <InputOTP
                  maxLength={6}
                  id="otp"
                  value={otpValue}
                  onChange={(val) => setValue('otp', val)}
                >
                  <InputOTPGroup className="gap-1 *:data-[slot=input-otp-slot]:rounded-xl *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:size-9 text-white">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>

                {errors.otp && (
                  <p className="text-sm text-destructive text-center mt-1">
                    {errors.otp.message}
                  </p>
                )}

                <Field className="gap-6 w-full mt-4">
                  <FieldDescription className="text-center text-sm font-normal text-muted-foreground">
                    Didn't get the code?{' '}
                    <button
                      type="button"
                      onClick={() => toast.info('A new code has been requested.')}
                      className="font-medium text-white no-underline hover:underline cursor-pointer"
                    >
                      Resend code
                    </button>
                  </FieldDescription>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading || otpValue.length < 6}
                    className="rounded-lg h-10 hover:bg-primary/80 cursor-pointer w-full"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      'Confirm'
                    )}
                  </Button>
                  <Link href="/auth/login" className="block text-center text-sm underline text-white mt-2 w-full">
                    Back to Login
                  </Link>
                </Field>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

import { Suspense } from 'react';

export default function TwoFactorPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#030712] text-white">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    }>
      <TwoFactorContent />
    </Suspense>
  );
}
