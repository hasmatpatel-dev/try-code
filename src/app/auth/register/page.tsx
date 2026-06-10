'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Controller } from 'react-hook-form';

import LogoSvg from '@/assets/trycode.svg';
import Image from 'next/image';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['Admin', 'Editor', 'Author', 'Student']),
});

type RegisterInputs = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<RegisterInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'Student',
    },
  });

  const onSubmit = async (data: RegisterInputs) => {
    setLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: data.role,
          },
        },
      });

      if (error) {
        toast.error(error.message || 'Registration failed');
      } else {
        toast.success('Account created successfully! Please verify your email.');
        setTimeout(() => {
          router.push(`/auth/verify-email?email=${encodeURIComponent(data.email)}`);
        }, 1000);
      }
    } catch (err: any) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignUp = async (provider: 'google') => {
    const selectedRole = watch('role') || 'Student';
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${appUrl}/auth/callback?role=${selectedRole}`,
        },
      });
      if (error) toast.error(error.message);
    } catch (err) {
      toast.error('Failed to initiate OAuth sign up.');
    }
  };

  return (
    <div className="max-w-lg px-4 sm:px-0 mx-auto w-full z-10">
      <Card className="max-w-lg px-6 py-8 sm:p-12 relative gap-6 border border-border/40 bg-[#090D1A] shadow-2xl">
        <CardHeader className="text-center gap-6 p-0">
          <div className="mx-auto">
            <Link href="/">
              <div className="mdn"><Image src={LogoSvg} alt="TryCode" height={40} width={40} /></div>
            </Link>
          </div>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-2xl font-medium text-white">
              Signup to TryCode
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground font-normal">
              Signup to your account now
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
                  onClick={() => handleOAuthSignUp('google')}
                  className="w-full text-sm text-medium text-card-foreground gap-2 cursor-pointer dark:bg-background rounded-lg h-9 shadow-xs"
                >
                  <img
                    src="https://images.shadcnspace.com/assets/svgs/icon-google.svg"
                    alt="google icon"
                    className="h-4 w-4"
                  />
                  Sign up with Google
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-[#090D1A] text-sm text-muted-foreground bg-transparent">
                <span className="px-4">or sign up with</span>
              </FieldSeparator>

              <div className="flex flex-col gap-4">
                <Field className="gap-1.5">
                  <FieldLabel
                    htmlFor="name"
                    className="text-sm text-muted-foreground font-normal"
                  >
                    Name*
                  </FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    placeholder="enter your name"
                    className="dark:bg-background shadow-xs h-9 text-white"
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                  )}
                </Field>
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
                    className="dark:bg-background shadow-xs h-9 text-white"
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
                      className="dark:bg-background shadow-xs h-9 text-white pr-10"
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
                <Field className="gap-1.5">
                  <FieldLabel
                    htmlFor="role"
                    className="text-sm text-muted-foreground font-normal"
                  >
                    Account Role*
                  </FieldLabel>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full h-9 dark:bg-background border rounded-lg shadow-xs px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer text-white">
                          <SelectValue placeholder="Select account role" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover text-popover-foreground">
                          <SelectItem value="Student">Student (Read-only)</SelectItem>
                          <SelectItem value="Author">Author (Manage own posts)</SelectItem>
                          <SelectItem value="Editor">Editor (Manage all content)</SelectItem>
                          <SelectItem value="Admin">Admin (Full Control)</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.role && (
                    <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>
                  )}
                </Field>
              </div>

              <Field className="gap-4">
                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="rounded-lg cursor-pointer h-10 hover:bg-primary/80 w-full"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    'Sign up'
                  )}
                </Button>
                <FieldDescription className="text-center text-sm font-normal text-muted-foreground">
                  Already have an account?{' '}
                  <Link
                    href="/auth/login"
                    className="font-medium text-white no-underline hover:underline"
                  >
                    Sign in
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
