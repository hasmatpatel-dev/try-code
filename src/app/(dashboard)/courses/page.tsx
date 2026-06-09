'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Search,
  Plus,
  BookOpen,
  Clock,
  Users,
  Star,
  Globe,
  Eye,
  Edit2,
  Trash2,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  lessons: number;
  duration: string;
  students: number;
  rating: number;
  published: boolean;
  featured: boolean;
  badge: string;
}

const initialCourses: Course[] = [
  {
    id: 'nextjs-16',
    title: 'Next.js 16 Production Architectures',
    description: 'Master React Server Components, Server Actions, App Router optimization, and edge deployment strategies.',
    category: 'Full-Stack',
    lessons: 16,
    duration: '8.5 hrs',
    students: 1840,
    rating: 4.9,
    published: true,
    featured: true,
    badge: 'Hot',
  },
  {
    id: 'supabase-postgres',
    title: 'Supabase & Postgres Masterclass',
    description: 'Learn PostgreSQL query optimization, row-level security, realtime databases, and edge function scripting.',
    category: 'Database',
    lessons: 12,
    duration: '6.2 hrs',
    students: 1204,
    rating: 4.8,
    published: true,
    featured: false,
    badge: 'Popular',
  },
  {
    id: 'ai-development',
    title: 'AI Code Assistant Integration',
    description: 'Build your own AI coder tool utilizing Gemini, Vercel AI SDK, and Anthropic APIs inside Next.js application.',
    category: 'AI',
    lessons: 8,
    duration: '4.8 hrs',
    students: 952,
    rating: 4.7,
    published: false,
    featured: false,
    badge: 'New',
  },
  {
    id: 'react-19-patterns',
    title: 'Advanced React 19 Patterns',
    description: 'Dive deep into Server Actions, useActionState, Suspense architectures, and the React Compiler compilation.',
    category: 'Frontend',
    lessons: 10,
    duration: '5.5 hrs',
    students: 1420,
    rating: 4.9,
    published: true,
    featured: false,
    badge: 'Updated',
  },
];

const categoryColors: Record<string, string> = {
  'Full-Stack': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  'Database': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'AI': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'Frontend': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'published' && course.published) || (statusFilter === 'draft' && !course.published);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const togglePublish = (id: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, published: !c.published } : c))
    );
    const course = courses.find((c) => c.id === id);
    toast.success(`Course ${course?.published ? 'unpublished' : 'published'} successfully`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
      toast.success('Course deleted successfully');
    }
  };

  const categories = [...new Set(courses.map((c) => c.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Courses</h1>
          <p className="text-sm text-gray-400">Manage bootcamps, lessons, and student progression.</p>
        </div>
        <Link
          href="/courses/create"
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:from-purple-500 hover:to-indigo-500 transition active:scale-95 shrink-0"
        >
          <Plus className="mr-2 h-4.5 w-4.5" />
          Create Course
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 p-4 shadow-md backdrop-blur-md flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search courses by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#161C2C] bg-[#090D1A] py-2 pl-9 pr-4 text-sm text-white outline-none placeholder:text-gray-500 transition focus:border-purple-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-[#161C2C] bg-[#090D1A] px-3.5 py-2 text-sm text-white outline-none transition focus:border-purple-500"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-[#161C2C] bg-[#090D1A] px-3.5 py-2 text-sm text-white outline-none transition focus:border-purple-500"
        >
          <option value="all">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
      </div>

      {/* Courses Table */}
      {filteredCourses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#161C2C] bg-[#090D1A]/20 py-16 text-center">
          <GraduationCap className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white">No courses found</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search or filters, or create a new bootcamp course.
          </p>
          <Link
            href="/courses/create"
            className="mt-4 inline-flex items-center rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 px-4 py-2 text-sm font-semibold hover:bg-purple-600/20 transition"
          >
            Create Your First Course
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/50 shadow-xl overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#161C2C] bg-[#090D1A]/70 text-xs font-semibold uppercase tracking-wider text-gray-400 select-none">
                  <th className="p-4 pl-6">Course</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 text-center">Lessons</th>
                  <th className="p-4 text-center">Students</th>
                  <th className="p-4 text-center">Rating</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#161C2C] text-sm">
                {filteredCourses.map((course, idx) => (
                  <motion.tr
                    key={course.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.03 }}
                    className="hover:bg-[#0E1325]/30 transition group"
                  >
                    <td className="p-4 pl-6 max-w-xs md:max-w-md">
                      <div className="truncate">
                        <span className="font-semibold text-white group-hover:text-purple-400 transition">
                          {course.title}
                        </span>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{course.description}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Clock className="h-3 w-3 text-gray-600" />
                          <span className="text-[10px] text-gray-500">{course.duration}</span>
                          {course.featured && (
                            <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 rounded">
                              Featured
                            </span>
                          )}
                          <span className="text-[10px] font-semibold text-gray-500 bg-gray-500/10 border border-gray-500/15 px-1.5 py-0.2 rounded">
                            {course.badge}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`inline-flex items-center rounded-lg px-2 py-1 text-xs font-semibold border ${categoryColors[course.category] || 'text-gray-400 bg-gray-500/10 border-gray-500/20'}`}>
                        {course.category}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-1.5 text-gray-300">
                        <BookOpen className="h-3.5 w-3.5 text-gray-500" />
                        <span>{course.lessons}</span>
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-1.5 text-gray-300">
                        <Users className="h-3.5 w-3.5 text-gray-500" />
                        <span>{course.students.toLocaleString()}</span>
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 stroke-amber-400" />
                        <span className="font-bold text-gray-200">{course.rating}</span>
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      {course.published ? (
                        <span className="inline-flex items-center rounded-lg bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                          <Globe className="h-3 w-3 mr-1.5" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-lg bg-amber-500/10 px-2 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20">
                          <Eye className="h-3 w-3 mr-1.5" />
                          Draft
                        </span>
                      )}
                    </td>

                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => togglePublish(course.id)}
                          className={`p-1.5 rounded-lg border text-xs font-semibold transition ${
                            course.published
                              ? 'border-amber-500/20 text-amber-400 bg-amber-500/5 hover:bg-amber-500/10'
                              : 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10'
                          }`}
                          title={course.published ? 'Set to Draft' : 'Publish Course'}
                        >
                          {course.published ? 'Draft' : 'Publish'}
                        </button>

                        <Link
                          href={`/courses/edit/${course.id}`}
                          className="p-2 rounded-xl border border-[#161C2C] bg-[#090D1A] text-gray-400 hover:text-white hover:bg-gray-800 transition"
                          title="Edit course"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="p-2 rounded-xl border border-red-500/10 bg-red-500/5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
                          title="Delete course"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t border-[#161C2C] bg-[#090D1A]/50 select-none">
            <span className="text-xs text-gray-500">
              Showing {filteredCourses.length} of {courses.length} courses
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
