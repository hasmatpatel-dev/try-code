'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  // Display error message from URL query params (e.g., from OAuth redirect errors)
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      toast.error(decodeURIComponent(errorParam));
      // Clean up error parameter from URL to prevent showing it again on refresh
      const newUrl = window.location.pathname + (searchParams.get('redirect') ? `?redirect=${encodeURIComponent(redirectUrl)}` : '');
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams, redirectUrl]);

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

  const handleOAuthSignIn = async (provider: 'google') => {
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${appUrl}/auth/callback?next=${encodeURIComponent(redirectUrl)}`,
        },
      });
      if (error) toast.error(error.message);
    } catch (err) {
      toast.error('Failed to initiate OAuth sign in.');
    }
  };

  return (
    <div className="max-w-lg px-4 sm:px-0 mx-auto w-full z-10">
      <Card className="max-w-lg px-6 py-8 sm:p-12 relative gap-6 border border-border/40 bg-[#090D1A] shadow-2xl">
        <CardHeader className="text-center gap-6 p-0">
          <div className="mx-auto">
            <Link href="/">
              <div className="mdn">TryCode</div>
            </Link>
          </div>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-2xl font-medium text-white">
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
              <Field className="flex w-full">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleOAuthSignIn('google')}
                  className="w-full text-sm text-medium text-card-foreground gap-2 dark:bg-background rounded-lg h-9 shadow-xs"
                >
                  <img
                    src="https://images.shadcnspace.com/assets/svgs/icon-google.svg"
                    alt="google icon"
                    className="h-4 w-4"
                  />
                  Sign in with Google
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-[#090D1A] text-sm text-muted-foreground bg-transparent">
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
                    className="dark:bg-background h-9 shadow-xs text-white"
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
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="dark:bg-background h-9 shadow-xs text-white pr-10"
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
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
                  className="text-sm text-muted-foreground font-medium text-end hover:underline"
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
                    className="font-medium text-white no-underline hover:underline"
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
