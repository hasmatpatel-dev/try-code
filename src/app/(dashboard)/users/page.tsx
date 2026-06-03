'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Users,
  Shield,
  Trash2,
  Loader2,
  Calendar,
  Mail,
  ShieldAlert,
} from 'lucide-react';
import { format } from 'date-fns';
import { useAppSelector } from '@/lib/store';

export default function UsersPage() {
  const queryClient = useQueryClient();
  const currentUser = useAppSelector((state) => state.auth.user);

  // Fetch users list
  const { data: users, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await axios.get('/api/users');
      return data;
    },
  });

  // Change role mutation
  const roleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const { data } = await axios.put(`/api/users/${id}`, { role });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User role updated successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to update user role');
    },
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User profile deleted');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to delete user');
    },
  });

  const handleRoleChange = (id: string, newRole: string) => {
    if (currentUser?.id === id && newRole !== 'Admin') {
      toast.error('You cannot demote yourself. Demotions must be done by another Admin.');
      return;
    }
    roleMutation.mutate({ id, role: newRole });
  };

  const handleDelete = (id: string) => {
    if (currentUser?.id === id) {
      toast.error('You cannot delete your own account.');
      return;
    }
    if (confirm('Are you sure you want to delete this user permanently? This will delete all posts associated with them.')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center text-white">
        <ShieldAlert className="h-10 w-10 text-red-500 mb-2" />
        <p className="text-red-500">Access Denied. Only system administrators can view this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">User Accounts Manager</h1>
        <p className="text-sm text-gray-400">Control application permissions, roles, and user details.</p>
      </div>

      {/* Users table */}
      <div className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 shadow-xl overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#161C2C] bg-[#090D1A]/70 text-xs font-semibold uppercase tracking-wider text-gray-400">
                <th className="p-4 pl-6">Profile</th>
                <th className="p-4">Email</th>
                <th className="p-4">Authorization Role</th>
                <th className="p-4">Registered Date</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161C2C] text-sm">
              {users?.map((user: any) => {
                const isSelf = currentUser?.id === user.id;

                return (
                  <tr key={user.id} className="hover:bg-[#0E1325]/30 transition group">
                    {/* Profile details */}
                    <td className="p-4 pl-6 font-semibold text-white">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.email}`}
                          alt={user.name}
                          className="h-8 w-8 rounded-xl object-cover shrink-0 ring-2 ring-purple-500/10"
                        />
                        <div>
                          <span className="text-sm font-bold text-white block">
                            {user.name}
                            {isSelf && (
                              <span className="ml-2 text-[10px] bg-purple-500/15 border border-purple-500/20 text-purple-400 px-1.5 py-0.2 rounded-full uppercase tracking-wider font-semibold">
                                You
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="p-4 text-gray-300 font-mono text-xs">
                      <div className="flex items-center space-x-1.5">
                        <Mail className="h-3.5 w-3.5 text-gray-600" />
                        <span>{user.email}</span>
                      </div>
                    </td>

                    {/* Role select */}
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-purple-400 shrink-0" />
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="rounded-xl border border-[#161C2C] bg-[#090D1A] py-1 px-2.5 text-xs text-white outline-none focus:border-purple-500 transition appearance-none"
                        >
                          <option value="Student">Student (Read-only)</option>
                          <option value="Author">Author (Manage own posts)</option>
                          <option value="Editor">Editor (Manage all content)</option>
                          <option value="Admin">Admin (Full access)</option>
                        </select>
                      </div>
                    </td>

                    {/* Created at */}
                    <td className="p-4 text-gray-400 text-xs">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="h-3.5 w-3.5 text-gray-600" />
                        <span>{format(new Date(user.createdAt), 'MMM dd, yyyy')}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={isSelf}
                        className="p-1.5 rounded-lg border border-red-500/10 bg-red-500/5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition disabled:opacity-30 disabled:pointer-events-none"
                        title="Delete User Account"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
