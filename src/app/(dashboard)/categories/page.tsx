'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Folder,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  FolderOpen,
  X,
  FileText,
} from 'lucide-react';

const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  parentId: z.string().nullable().optional(),
});

type CategoryInputs = z.infer<typeof categorySchema>;

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CategoryInputs>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      parentId: null,
    },
  });

  // Fetch categories
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await axios.get('/api/categories');
      return data;
    },
  });

  // Create Category Mutation
  const createMutation = useMutation({
    mutationFn: async (values: CategoryInputs) => {
      const { data } = await axios.post('/api/categories', values);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully');
      reset();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to create category');
    },
  });

  // Update Category Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: CategoryInputs }) => {
      const { data } = await axios.put(`/api/categories/${id}`, values);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully');
      setEditingCategory(null);
      reset();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to update category');
    },
  });

  // Delete Category Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/categories/${id}`);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully');
      if (editingCategory?.id === id) {
        setEditingCategory(null);
        reset();
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to delete category');
    },
  });

  const onSubmit = (data: CategoryInputs) => {
    const formattedData = {
      ...data,
      parentId: data.parentId === '' ? null : data.parentId,
    };
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, values: formattedData });
    } else {
      createMutation.mutate(formattedData);
    }
  };

  const handleEditClick = (cat: any) => {
    setEditingCategory(cat);
    setValue('name', cat.name);
    setValue('description', cat.description || '');
    setValue('parentId', cat.parentId || '');
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    reset();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this category? Sub-categories might be affected.')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Categories Management</h1>
        <p className="text-sm text-gray-400">Classify articles, define hierarchies, and nested collections.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Side: List Table (spanning 2 columns on desktop) */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : !categories || categories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#161C2C] bg-[#090D1A]/20 py-12 text-center">
              <FolderOpen className="h-10 w-10 text-gray-600 mx-auto mb-3" />
              <h3 className="text-md font-semibold text-white">No categories found</h3>
              <p className="text-xs text-gray-500 mt-1">Create one using the form on the right.</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 shadow-xl overflow-hidden backdrop-blur-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#161C2C] bg-[#090D1A]/70 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    <th className="p-4 pl-6">Name</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Parent Category</th>
                    <th className="p-4 text-center">Posts count</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#161C2C] text-sm">
                  {categories.map((cat: any) => (
                    <tr key={cat.id} className="hover:bg-[#0E1325]/30 transition group">
                      <td className="p-4 pl-6 font-semibold text-white">
                        <div className="flex items-center space-x-2">
                          <Folder className="h-4 w-4 text-purple-400" />
                          <span>{cat.name}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 block mt-0.5">/{cat.slug}</span>
                      </td>
                      <td className="p-4 text-gray-400 max-w-[200px] truncate">
                        {cat.description || <span className="italic text-gray-600 text-xs">No description</span>}
                      </td>
                      <td className="p-4 text-gray-400 font-medium">
                        {cat.parent ? (
                          <span className="text-xs bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
                            {cat.parent.name}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-600">—</span>
                        )}
                      </td>
                      <td className="p-4 text-center font-bold text-white">
                        <div className="flex items-center justify-center space-x-1">
                          <FileText className="h-3.5 w-3.5 text-gray-500" />
                          <span>{cat._count?.posts || 0}</span>
                        </div>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEditClick(cat)}
                            className="p-1.5 rounded-lg border border-[#161C2C] bg-[#090D1A] text-gray-400 hover:text-white hover:bg-gray-800 transition"
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
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
              {editingCategory ? (
                <>
                  <Edit2 className="h-4 w-4 mr-2 text-purple-400" />
                  Edit Category
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2 text-purple-400" />
                  Create Category
                </>
              )}
            </h2>
            {editingCategory && (
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
                Category Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="e.g. Engineering"
                className="w-full rounded-xl border border-[#161C2C] bg-gray-950 py-2.5 px-4 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-purple-500"
                {...register('name')}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Short description..."
                rows={3}
                className="w-full rounded-xl border border-[#161C2C] bg-gray-950 py-2.5 px-4 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-purple-500 resize-none"
                {...register('description')}
              />
            </div>

            <div>
              <label htmlFor="parentId" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Parent Category (Optional Nesting)
              </label>
              <select
                id="parentId"
                className="w-full rounded-xl border border-[#161C2C] bg-gray-950 py-2.5 px-3 text-sm text-white outline-none transition focus:border-purple-500 appearance-none"
                {...register('parentId')}
              >
                <option value="">None (Top Level)</option>
                {categories
                  ?.filter((c: any) => c.id !== editingCategory?.id) // Prevent infinite self-parenting loop
                  .map((cat: any) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg transition duration-200 hover:from-purple-500 hover:to-indigo-500 focus:outline-none disabled:opacity-50 active:scale-95"
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : editingCategory ? (
                'Save Changes'
              ) : (
                'Create Category'
              )}
            </button>

            {editingCategory && (
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
