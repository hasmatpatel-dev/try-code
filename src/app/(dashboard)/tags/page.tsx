'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  X,
  FileText,
} from 'lucide-react';

const tagSchema = z.object({
  name: z.string().min(1, 'Tag name is required'),
});

type TagInputs = z.infer<typeof tagSchema>;

export default function TagsPage() {
  const queryClient = useQueryClient();
  const [editingTag, setEditingTag] = useState<any | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<TagInputs>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: '',
    },
  });

  // Fetch tags
  const { data: tags, isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data } = await axios.get('/api/tags');
      return data;
    },
  });

  // Create Tag Mutation
  const createMutation = useMutation({
    mutationFn: async (values: TagInputs) => {
      const { data } = await axios.post('/api/tags', values);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success('Tag created successfully');
      reset();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to create tag');
    },
  });

  // Update Tag Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: TagInputs }) => {
      const { data } = await axios.put(`/api/tags/${id}`, values);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success('Tag updated successfully');
      setEditingTag(null);
      reset();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to update tag');
    },
  });

  // Delete Tag Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/tags/${id}`);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success('Tag deleted successfully');
      if (editingTag?.id === id) {
        setEditingTag(null);
        reset();
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to delete tag');
    },
  });

  const onSubmit = (data: TagInputs) => {
    if (editingTag) {
      updateMutation.mutate({ id: editingTag.id, values: data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEditClick = (tg: any) => {
    setEditingTag(tg);
    setValue('name', tg.name);
  };

  const handleCancelEdit = () => {
    setEditingTag(null);
    reset();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this tag?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Tags Directory</h1>
        <p className="text-sm text-gray-400">Define search indexing tags, keywords, and topics.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Side: List Table */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : !tags || tags.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#161C2C] bg-[#090D1A]/20 py-12 text-center">
              <Tag className="h-10 w-10 text-gray-600 mx-auto mb-3" />
              <h3 className="text-md font-semibold text-white">No tags found</h3>
              <p className="text-xs text-gray-500 mt-1">Create one using the form on the right.</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 shadow-xl overflow-hidden backdrop-blur-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#161C2C] bg-[#090D1A]/70 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    <th className="p-4 pl-6">Tag Name</th>
                    <th className="p-4">Slug Reference</th>
                    <th className="p-4 text-center">Associated Posts</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#161C2C] text-sm">
                  {tags.map((tg: any) => (
                    <tr key={tg.id} className="hover:bg-[#0E1325]/30 transition group">
                      <td className="p-4 pl-6 font-semibold text-white">
                        <div className="flex items-center space-x-2">
                          <span className="text-purple-400 font-bold text-base">#</span>
                          <span>{tg.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-400 font-mono text-xs">
                        {tg.slug}
                      </td>
                      <td className="p-4 text-center font-bold text-white">
                        <div className="flex items-center justify-center space-x-1">
                          <FileText className="h-3.5 w-3.5 text-gray-500" />
                          <span>{tg._count?.posts || 0}</span>
                        </div>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEditClick(tg)}
                            className="p-1.5 rounded-lg border border-[#161C2C] bg-[#090D1A] text-gray-400 hover:text-white hover:bg-gray-800 transition"
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(tg.id)}
                            className="p-1.5 rounded-lg border border-red-500/10 bg-red-500/5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Side: Form Panel */}
        <div className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 p-6 shadow-xl backdrop-blur-xl h-fit">
          <div className="flex items-center justify-between border-b border-[#161C2C] pb-3 mb-4">
            <h2 className="font-bold text-white flex items-center text-sm uppercase tracking-wider">
              {editingTag ? (
                <>
                  <Edit2 className="h-4 w-4 mr-2 text-purple-400" />
                  Edit Tag
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2 text-purple-400" />
                  Create Tag
                </>
              )}
            </h2>
            {editingTag && (
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Tag Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="e.g. typescript"
                className="w-full rounded-xl border border-[#161C2C] bg-gray-950 py-2.5 px-4 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-purple-500"
                {...register('name')}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg transition duration-200 hover:from-purple-500 hover:to-indigo-500 focus:outline-none disabled:opacity-50 active:scale-95"
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : editingTag ? (
                'Save Changes'
              ) : (
                'Create Tag'
              )}
            </button>

            {editingTag && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="w-full text-center text-xs text-gray-400 hover:text-white transition hover:underline"
              >
                Cancel editing
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
