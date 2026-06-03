'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { updateSettings } from '@/features/settingsSlice';
import {
  Settings,
  Globe,
  Sliders,
  MessageSquare,
  Save,
  HelpCircle,
} from 'lucide-react';

const settingsSchema = z.object({
  siteName: z.string().min(2, 'Site name must be at least 2 characters'),
  siteDescription: z.string().optional(),
  allowRegistration: z.boolean(),
  allowComments: z.boolean(),
  requireCommentApproval: z.boolean(),
});

type SettingsInputs = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);

  const { register, handleSubmit, control, formState: { errors } } = useForm<SettingsInputs>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      allowRegistration: settings.allowRegistration,
      allowComments: settings.allowComments,
      requireCommentApproval: settings.requireCommentApproval,
    },
  });

  const onSubmit = (data: SettingsInputs) => {
    dispatch(updateSettings(data));
    toast.success('Site configurations saved successfully!');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#161C2C] pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">System Settings</h1>
          <p className="text-sm text-gray-400">Configure global configurations, comments behaviors, and indexing rules.</p>
        </div>

        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:from-purple-500 hover:to-indigo-500 transition active:scale-95 shrink-0"
        >
          <Save className="mr-2 h-4.5 w-4.5" />
          Save Settings
        </button>
      </div>

      <div className="space-y-6">
        {/* General details */}
        <div className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 p-6 shadow-xl backdrop-blur-xl space-y-4">
          <h3 className="font-bold text-white flex items-center border-b border-[#161C2C] pb-3 text-sm uppercase tracking-wider">
            <Globe className="h-4 w-4 mr-2 text-purple-400" />
            General Branding
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="siteName" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Site Name
              </label>
              <input
                id="siteName"
                type="text"
                placeholder="e.g. TryCode"
                className="w-full rounded-xl border border-[#161C2C] bg-gray-950 py-2.5 px-4 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-purple-500"
                {...register('siteName')}
              />
              {errors.siteName && (
                <p className="mt-1 text-xs text-red-500">{errors.siteName.message}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="siteDescription" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Site Description / Tagline
              </label>
              <textarea
                id="siteDescription"
                placeholder="Meta description for home page index..."
                rows={3}
                className="w-full rounded-xl border border-[#161C2C] bg-gray-950 py-2.5 px-4 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-purple-500 resize-none"
                {...register('siteDescription')}
              />
            </div>
          </div>
        </div>

        {/* Global configurations */}
        <div className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 p-6 shadow-xl backdrop-blur-xl space-y-4">
          <h3 className="font-bold text-white flex items-center border-b border-[#161C2C] pb-3 text-sm uppercase tracking-wider">
            <Sliders className="h-4 w-4 mr-2 text-purple-400" />
            Registration Rules
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-white block">Allow Public Registrations</span>
              <span className="text-xs text-gray-500">Allow users to register custom Student roles</span>
            </div>
            <Controller
              name="allowRegistration"
              control={control}
              render={({ field }) => (
                <button
                  type="button"
                  onClick={() => field.onChange(!field.value)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    field.value ? 'bg-purple-600' : 'bg-gray-800'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      field.value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              )}
            />
          </div>
        </div>

        {/* Comments behavior */}
        <div className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 p-6 shadow-xl backdrop-blur-xl space-y-4">
          <h3 className="font-bold text-white flex items-center border-b border-[#161C2C] pb-3 text-sm uppercase tracking-wider">
            <MessageSquare className="h-4 w-4 mr-2 text-purple-400" />
            Feedback & Comments Settings
          </h3>

          {/* Enable comments toggle */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-white block">Enable Public Comments</span>
              <span className="text-xs text-gray-500">Allow guests to submit feedback on single blog posts</span>
            </div>
            <Controller
              name="allowComments"
              control={control}
              render={({ field }) => (
                <button
                  type="button"
                  onClick={() => field.onChange(!field.value)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    field.value ? 'bg-purple-600' : 'bg-gray-800'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      field.value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              )}
            />
          </div>

          {/* Require comment approval toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-[#161C2C]/50">
            <div>
              <span className="text-sm font-semibold text-white block">Require Comments Approval</span>
              <span className="text-xs text-gray-500">Comments will be held as Pending until approved in Moderation</span>
            </div>
            <Controller
              name="requireCommentApproval"
              control={control}
              render={({ field }) => (
                <button
                  type="button"
                  onClick={() => field.onChange(!field.value)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    field.value ? 'bg-purple-600' : 'bg-gray-800'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      field.value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              )}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
