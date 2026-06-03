export type UserRole = 'Admin' | 'Editor' | 'Author' | 'Student';

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  parent?: Category | null;
  children?: Category[];
  _count?: {
    posts: number;
  };
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  _count?: {
    posts: number;
  };
}

export interface Comment {
  id: string;
  content: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Spam';
  postId: string;
  post?: Post;
  authorName: string;
  authorEmail: string;
  authorAvatar: string | null;
  createdAt: string;
}

export interface SEO {
  id: string;
  postId: string;
  title: string | null;
  description: string | null;
  canonicalUrl: string | null;
  ogImage: string | null;
  twitterCard: string | null;
  schemaMarkup: string | null;
}

export interface Media {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  bucket: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  publishedAt: string | null;
  scheduledAt: string | null;
  featured: boolean;
  authorId: string;
  author?: User;
  views: number;
  coverImage: string | null;
  createdAt: string;
  updatedAt: string;
  categories?: Category[];
  tags?: Tag[];
  comments?: Comment[];
  seo?: SEO | null;
}

export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalCategories: number;
  totalTags: number;
  totalViews: number;
  viewsTrend: { date: string; views: number }[];
  topPosts: { id: string; title: string; views: number; slug: string }[];
  categoryDistribution: { name: string; value: number }[];
}
