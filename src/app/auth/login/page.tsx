'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginInputs = z.infer<typeof loginSchema>;

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInputs) => {
    setLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error(error.message || 'Invalid credentials');
      } else {
        toast.success('Logged in successfully!');
        // Small delay to ensure cookies are written before routing
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 300);
      }
    } catch (err: any) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemoAdmin = () => {
    setValue('email', 'admin@trycode.com');
    setValue('password', 'admin123');
    toast.info('Demo credentials loaded!');
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectUrl)}`,
        },
      });
      if (error) toast.error(error.message);
    } catch (err) {
      toast.error('Failed to initiate OAuth sign in.');
    }
  };

  return (
    <section className="bg-foreground dark:bg-background min-h-screen flex items-center justify-center relative">
      <div className="pointer-events-none absolute inset-0 right-0 overflow-hidden md:block hidden">
        {/* Outer big circle */}
        <div className="absolute left-1/1 top-0 h-650 w-650 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10" />
        {/* Inner circle */}
        <div className="absolute left-1/1 top-0 h-175 w-175 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground dark:bg-background" />
      </div>

      <div className="py-10 md:py-20 max-w-lg px-4 sm:px-0 mx-auto w-full z-10">
        <Card className="max-w-lg px-6 py-8 sm:p-12 relative gap-6">
          <CardHeader className="text-center gap-6 p-0">
            <div className="mx-auto">
              <Link href="/">
                <div className="mdn">TryCode</div>
              </Link>
            </div>
            <div className="flex flex-col gap-1">
              <CardTitle className="text-2xl font-medium text-card-foreground">
                Welcome to TryCode
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground font-normal">
                Login to your account now
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup className="gap-6">
                <Field className="grid md:grid-cols-2 md:gap-6 gap-3">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => handleOAuthSignIn('google')}
                    className="text-sm text-medium text-card-foreground gap-2 dark:bg-background rounded-lg h-9 shadow-xs cursor-pointer"
                  >
                    <img
                      src="https://images.shadcnspace.com/assets/svgs/icon-google.svg"
                      alt="google icon"
                      className="h-4 w-4"
                    />
                    Sign in with Google
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => handleOAuthSignIn('github')}
                    className="text-sm text-medium text-card-foreground gap-2 dark:bg-background rounded-lg h-9 shadow-xs cursor-pointer"
                  >
                    <img
                      src="https://images.shadcnspace.com/assets/svgs/icon-github.svg"
                      alt="github icon"
                      className="dark:hidden h-4 w-4"
                    />
                    <img
                      src="https://images.shadcnspace.com/assets/svgs/icon-github-white.svg"
                      alt="github icon"
                      className="hidden dark:block h-4 w-4"
                    />
                    Sign in with GitHub
                  </Button>
                </Field>
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card text-sm text-muted-foreground bg-transparent">
                  <span className="px-4">or sign in with</span>
                </FieldSeparator>

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
                      placeholder="name@example.com"
                      className="dark:bg-background h-9 shadow-xs"
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                    )}
                  </Field>
                  <Field className="gap-1.5">
                    <FieldLabel
                      htmlFor="password"
                      className="text-sm text-muted-foreground font-normal"
                    >
                      Password*
                    </FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="dark:bg-background h-9 shadow-xs"
                      {...register('password')}
                    />
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                    )}
                  </Field>
                </div>

                <Field orientation="horizontal" className="justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="remember"
                      defaultChecked
                      className="cursor-pointer"
                    />
                    <FieldLabel
                      htmlFor="remember"
                      className="text-sm text-primary font-normal cursor-pointer"
                    >
                      Remember this device
                    </FieldLabel>
                  </div>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-card-foreground font-medium text-end hover:underline"
                  >
                    Forgot password?
                  </Link>
                </Field>

                <Field className="gap-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="rounded-lg h-10 hover:bg-primary/80 cursor-pointer w-full"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      'Sign in'
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleFillDemoAdmin}
                    className="w-full text-xs text-muted-foreground border-dashed border-purple-500/30 hover:bg-purple-500/5 h-9 cursor-pointer"
                  >
                    Use Demo Admin Account (admin@trycode.com)
                  </Button>

                  <FieldDescription className="text-center text-sm font-normal text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <Link
                      href="/auth/register"
                      className="font-medium text-card-foreground no-underline hover:underline"
                    >
                      Create an account
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#030712] text-white">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
