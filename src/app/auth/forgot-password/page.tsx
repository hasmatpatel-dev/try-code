'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Loader2, CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import LogoSvg from '@/assets/trycode.svg';
import Image from 'next/image';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordInputs = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInputs) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
      });

      if (error) {
        toast.error(error.message || 'Failed to send reset link');
      } else {
        setSent(true);
        toast.success('Reset link sent to your email!');
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
              <div className="mdn"><Image src={LogoSvg} alt="TryCode" height={40} width={40} /></div>
            </Link>
          </div>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-2xl font-medium text-white">
              {sent ? 'Check your email' : 'Forgot your password?'}
            </CardTitle>
            <CardDescription className="text-sm font-normal text-muted-foreground">
              {sent
                ? 'We have sent a password reset link to your email address.'
                : 'Please enter the email address associated with your account and we will email you a link to reset your password.'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {sent ? (
            <div className="flex flex-col items-center gap-6 text-center">
              <CheckCircle2 className="h-16 w-16 text-green-500 animate-bounce" />
              <p className="text-sm text-muted-foreground">
                Click the link in the email to set a new password.
              </p>
              <div className="w-full flex flex-col gap-3">
                <Link href="/auth/login" className="w-full">
                  <Button variant="outline" className="w-full h-10 cursor-pointer text-white">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup className="gap-6">
                <div className="flex flex-col gap-4">
                  <Field className="gap-1.5">
                    <FieldLabel
                      htmlFor="email"
                      className="text-sm text-muted-foreground font-normal"
                    >
                      Email*
                    </FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@trycode.com"
                      className="dark:bg-background h-9 shadow-xs text-white"
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                    )}
                  </Field>
                </div>
                <Field className="gap-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="rounded-xl h-10 cursor-pointer hover:bg-primary/80 w-full"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      'Forgot password'
                    )}
                  </Button>
                  <Link href="/auth/login" className="w-full text-center">
                    <Button
                      type="button"
                      size="lg"
                      variant="ghost"
                      className="rounded-xl cursor-pointer w-full text-white"
                    >
                      Back to Login
                    </Button>
                  </Link>
                </Field>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
