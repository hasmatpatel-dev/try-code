import { z } from 'zod';

// Post creation/update schema
export const postInputSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional().nullable(),
  published: z.boolean().optional(),
  coverImage: z.string().optional().nullable(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  scheduledAt: z.string().optional().nullable(),
  seo: z.object({
    title: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    canonicalUrl: z.string().optional().nullable(),
    ogImage: z.string().optional().nullable(),
    twitterCard: z.string().optional().nullable(),
  }).optional().nullable(),
});

// Guest comment creation schema
export const commentCreateSchema = z.object({
  postId: z.string().uuid('Invalid post ID'),
  content: z.string().min(1, 'Comment content cannot be empty').max(1000, 'Comment too long (max 1000 characters)'),
  authorName: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  authorEmail: z.string().email('Invalid email address'),
});

// Comment status update schema
export const commentStatusSchema = z.object({
  status: z.enum(['Approved', 'Pending', 'Rejected', 'Spam']),
});

// Category schema
export const categoryInputSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
});

// Tag schema
export const tagInputSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
});

// User role schema
export const userRoleSchema = z.object({
  role: z.enum(['Admin', 'Editor', 'Author', 'Student']),
});

// Roadmap schema
export const roadmapInputSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  order: z.number().optional(),
  published: z.boolean().optional(),
});

// Recipe schema
export const recipeInputSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional().nullable(),
  language: z.string().optional().default('typescript'),
  code: z.string().optional().nullable(),
  dependencies: z.string().optional().nullable(),
  aiPrompt: z.string().optional().nullable(),
  bestPractices: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  published: z.boolean().optional(),
});

// FAQ schema
export const faqInputSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().optional().nullable(),
  order: z.number().optional(),
  published: z.boolean().optional(),
});
