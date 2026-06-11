'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { toast } from 'sonner';
import {
  ChevronLeft,
  Loader2,
  Save,
  Globe,
  Settings,
  FileImage,
  Upload,
} from 'lucide-react';
import Link from 'next/link';
import TiptapEditor from '@/components/editor/TiptapEditor';

const postFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  excerpt: z.string().optional(),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  coverImage: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.startsWith('/') || val.startsWith('http://') || val.startsWith('https://'),
      { message: 'Must be a valid URL or path' }
    ),
  published: z.boolean(),
  featured: z.boolean(),
  scheduledAt: z.string().optional(),
  categories: z.array(z.string()),
  tags: z.array(z.string()),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  canonicalUrl: z.string().optional(),
});

type PostFormInputs = z.infer<typeof postFormSchema>;

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');

  // Fetch target post details
  const { data: post, isLoading: loadingPost, isError } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/posts/${id}`);
      return data;
    },
  });

  // Fetch filters list
  const { data: filtersData, isLoading: loadingFilters } = useQuery({
    queryKey: ['filtersData'],
    queryFn: async () => {
      const [cats, tgs] = await Promise.all([
        axios.get('/api/categories'),
        axios.get('/api/tags'),
      ]);
      return { categories: cats.data, tags: tgs.data };
    },
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PostFormInputs>({
    resolver: zodResolver(postFormSchema),
  });

  const watchCoverImage = watch('coverImage');

  // Load post details into form when fetched
  useEffect(() => {
    if (post) {
      reset({
        title: post.title || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        coverImage: post.coverImage || '',
        published: post.published || false,
        featured: post.featured || false,
        scheduledAt: post.scheduledAt ? new Date(post.scheduledAt).toISOString().slice(0, 16) : '',
        categories: post.categories?.map((c: any) => c.id) || [],
        tags: post.tags?.map((t: any) => t.id) || [],
        seoTitle: post.seo?.title || '',
        seoDescription: post.seo?.description || '',
        canonicalUrl: post.seo?.canonicalUrl || '',
      });
    }
  }, [post, reset]);

  // Update post mutation
  const updatePostMutation = useMutation({
    mutationFn: async (values: PostFormInputs) => {
      const payload = {
        title: values.title,
        content: values.content,
        excerpt: values.excerpt || null,
        published: values.published,
        featured: values.featured,
        scheduledAt: values.scheduledAt || null,
        coverImage: values.coverImage || null,
        categories: values.categories,
        tags: values.tags,
        seo: {
          title: values.seoTitle || null,
          description: values.seoDescription || null,
          canonicalUrl: values.canonicalUrl || null,
        },
      };
      const { data } = await axios.put(`/api/posts/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      toast.success('Post updated successfully!');
      router.push('/posts');
      router.refresh();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to update post');
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', 'blog-images');

    try {
      const { data } = await axios.post('/api/media/upload', formData);
      setValue('coverImage', data.fileUrl);
      toast.success('Cover image uploaded successfully!');
    } catch (err) {
      toast.error('Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = (data: PostFormInputs) => {
    updatePostMutation.mutate(data);
  };

  if (loadingPost) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center text-white">
        <p className="text-red-500">Failed to load the article details.</p>
        <Link href="/dashboard/posts" className="text-purple-400 mt-2 hover:underline">
          Go back to Posts list
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href="/posts"
            className="p-2 rounded-xl border border-[#161C2C] bg-[#090D1A] text-gray-400 hover:text-white transition"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Edit Article</h1>
            <p className="text-xs text-gray-500">Modify content and adjust catalog classifications.</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={updatePostMutation.isPending}
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:from-purple-500 hover:to-indigo-500 transition active:scale-95 disabled:opacity-50 shrink-0"
        >
          {updatePostMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4.5 w-4.5" />
          )}
          Save Changes
        </button>
      </div>

      {/* Editor & config layout */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Left main pane */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tabs */}
          <div className="flex border-b border-[#161C2C]">
            <button
              type="button"
              onClick={() => setActiveTab('content')}
              className={`pb-2.5 px-4 text-sm font-semibold border-b-2 transition ${
                activeTab === 'content'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Post Content
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('seo')}
              className={`pb-2.5 px-4 text-sm font-semibold border-b-2 transition ${
                activeTab === 'seo'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              SEO & Socials
            </button>
          </div>

          {activeTab === 'content' ? (
            <div className="space-y-6">
              {/* Title & excerpt */}
              <div className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 p-6 shadow-xl backdrop-blur-xl space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Post Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter an attention-grabbing title..."
                    className="w-full rounded-xl border border-[#161C2C] bg-gray-950 py-3 px-4 text-white outline-none placeholder:text-gray-600 transition focus:border-purple-500 font-bold text-lg"
                    {...register('title')}
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Post Excerpt
                  </label>
                  <textarea
                    placeholder="Provide a brief summary of the article..."
                    rows={2}
                    className="w-full rounded-xl border border-[#161C2C] bg-gray-950 py-2.5 px-4 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-purple-500 resize-none"
                    {...register('excerpt')}
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 p-6 shadow-xl backdrop-blur-xl space-y-4">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Featured Cover Image
                </label>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {watchCoverImage ? (
                    <div className="relative h-28 w-44 rounded-xl border border-[#161C2C] bg-gray-950 overflow-hidden shrink-0">
                      <img src={watchCoverImage} alt="Cover" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setValue('coverImage', '')}
                        className="absolute top-1.5 right-1.5 rounded-full bg-black/60 p-1 text-gray-400 hover:text-white hover:bg-black/90 transition text-[10px]"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="h-28 w-44 rounded-xl border border-dashed border-[#161C2C] bg-gray-950 flex flex-col items-center justify-center text-gray-600 shrink-0 select-none">
                      <FileImage className="h-8 w-8 mb-1" />
                      <span className="text-[10px]">No image selected</span>
                    </div>
                  )}

                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      placeholder="Paste cover image URL..."
                      className="w-full rounded-xl border border-[#161C2C] bg-gray-950 py-2 px-3 text-xs text-white outline-none placeholder:text-gray-600 transition focus:border-purple-500"
                      {...register('coverImage')}
                    />
                    {errors.coverImage && (
                      <p className="text-xs text-red-500">{errors.coverImage.message}</p>
                    )}
                    <div className="flex items-center space-x-2">
                      <label className="inline-flex items-center justify-center rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 px-3 py-2 text-xs font-semibold hover:bg-purple-600/20 transition cursor-pointer">
                        {uploadingImage ? (
                          <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Upload className="mr-2 h-3.5 w-3.5" />
                        )}
                        Upload cover
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                        />
                      </label>
                      <span className="text-[10px] text-gray-500">Supports PNG, JPG, WebP.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tiptap content editor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Content Editor
                  </label>
                  {errors.content && (
                    <span className="text-xs text-red-500 font-medium">{errors.content.message}</span>
                  )}
                </div>
                {/* Wait: Controller must render editor only when post.content is loaded in defaultValues, which we do via reset() */}
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    // We must destroy/recreate editor or update its contents, but rendering TiptapEditor with field value works perfectly
                    field.value !== undefined ? (
                      <TiptapEditor value={field.value} onChange={field.onChange} />
                    ) : (
                      <div className="h-64 flex items-center justify-center bg-gray-950 border border-gray-800 rounded-2xl animate-pulse" />
                    )
                  )}
                />
              </div>
            </div>
          ) : (
            /* SEO pane */
            <div className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 p-6 shadow-xl backdrop-blur-xl space-y-4">
              <h3 className="font-bold text-white flex items-center">
                <Globe className="h-4 w-4 mr-2 text-purple-400" />
                SEO Metadata
              </h3>
              <p className="text-xs text-gray-500">
                Optimize search index metadata and social share cards properties.
              </p>

              <div className="space-y-4 pt-4 border-t border-[#161C2C]">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">Meta Title</label>
                  <input
                    type="text"
                    placeholder="Default: Post Title"
                    className="w-full rounded-xl border border-[#161C2C] bg-gray-950 py-2.5 px-4 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-purple-500"
                    {...register('seoTitle')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">Meta Description</label>
                  <textarea
                    placeholder="Default: Post Excerpt"
                    rows={3}
                    className="w-full rounded-xl border border-[#161C2C] bg-gray-950 py-2.5 px-4 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-purple-500 resize-none"
                    {...register('seoDescription')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">Canonical URL</label>
                  <input
                    type="text"
                    placeholder="Default: https://trycode.com/blog/your-slug"
                    className="w-full rounded-xl border border-[#161C2C] bg-gray-950 py-2.5 px-4 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-purple-500"
                    {...register('canonicalUrl')}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Post settings card */}
          <div className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 p-6 shadow-xl backdrop-blur-xl space-y-4">
            <h3 className="font-bold text-white flex items-center border-b border-[#161C2C] pb-3 text-sm uppercase tracking-wider">
              <Settings className="h-4 w-4 mr-2 text-purple-400" />
              Settings
            </h3>

            {/* Published toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-white block">Status</span>
                <span className="text-[10px] text-gray-500">Live or draft mode</span>
              </div>
              <Controller
                name="published"
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

            {/* Featured toggle */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-sm font-semibold text-white block">Featured</span>
                <span className="text-[10px] text-gray-500">Pin to top of blog</span>
              </div>
              <Controller
                name="featured"
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

            {/* Scheduled publication */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-gray-400 block mb-1">
                Schedule Publication
              </label>
              <input
                type="datetime-local"
                className="w-full rounded-xl border border-[#161C2C] bg-gray-950 py-2 px-3 text-xs text-white outline-none transition focus:border-purple-500"
                {...register('scheduledAt')}
              />
            </div>
          </div>

          {/* Categories select list */}
          <div className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 p-6 shadow-xl backdrop-blur-xl space-y-4">
            <h3 className="font-bold text-white flex items-center border-b border-[#161C2C] pb-3 text-sm uppercase tracking-wider">
              Categories
            </h3>
            {loadingFilters ? (
              <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
            ) : !filtersData?.categories || filtersData.categories.length === 0 ? (
              <p className="text-xs text-gray-600">No categories found.</p>
            ) : (
              <div className="max-h-40 overflow-y-auto space-y-2">
                {filtersData.categories.map((cat: any) => (
                  <label key={cat.id} className="flex items-center space-x-2 text-sm text-gray-300 cursor-pointer">
                    <Controller
                      name="categories"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          className="rounded border-[#161C2C] bg-gray-950 text-purple-600 focus:ring-purple-500/20"
                          checked={field.value?.includes(cat.id) || false}
                          onChange={(e) => {
                            if (e.target.checked) {
                              field.onChange([...(field.value || []), cat.id]);
                            } else {
                              field.onChange((field.value || []).filter((id) => id !== cat.id));
                            }
                          }}
                        />
                      )}
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Tags list */}
          <div className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 p-6 shadow-xl backdrop-blur-xl space-y-4">
            <h3 className="font-bold text-white flex items-center border-b border-[#161C2C] pb-3 text-sm uppercase tracking-wider">
              Tags
            </h3>
            {loadingFilters ? (
              <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
            ) : !filtersData?.tags || filtersData.tags.length === 0 ? (
              <p className="text-xs text-gray-600">No tags found.</p>
            ) : (
              <div className="max-h-40 overflow-y-auto space-y-2">
                {filtersData.tags.map((tg: any) => (
                  <label key={tg.id} className="flex items-center space-x-2 text-sm text-gray-300 cursor-pointer">
                    <Controller
                      name="tags"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          className="rounded border-[#161C2C] bg-gray-950 text-purple-600 focus:ring-purple-500/20"
                          checked={field.value?.includes(tg.id) || false}
                          onChange={(e) => {
                            if (e.target.checked) {
                              field.onChange([...(field.value || []), tg.id]);
                            } else {
                              field.onChange((field.value || []).filter((id) => id !== tg.id));
                            }
                          }}
                        />
                      )}
                    />
                    <span>#{tg.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
