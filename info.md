# 🚀 TryCode — Full-Stack Blog CMS
### Next.js + Supabase · Production-Ready Architecture

> A scalable CMS and Learning Management Foundation powering Blog Articles, AI Tutorials, Courses, and Student Dashboards — all from a single backend.

---

## 📦 Core Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js 16 (App Router) | Full-stack React framework |
| Language | TypeScript | Type safety across the entire app |
| Styling | Tailwind CSS v4 | Utility-first styling |
| UI Components | shadcn/ui | Accessible, composable components |
| Backend | Supabase | Auth · PostgreSQL · Storage · Realtime |
| Database | PostgreSQL (via Supabase) | Relational data |
| ORM | Prisma | Type-safe database access & migrations |
| Authentication | Supabase Auth | Email · Google · GitHub login |
| File Storage | Supabase Storage | Images, videos, avatars |

---

## 🛠️ Frontend Libraries

### API Communication
```bash
npm install axios
```
- Centralized API client
- Request/Response interceptors
- Auth token handling & error management

---

### Data Fetching & Caching
```bash
npm install @tanstack/react-query
```
- Server state management
- Data caching & background refetching
- Optimistic updates & infinite queries

---

### Form Management
```bash
npm install react-hook-form
```
- Controlled inputs & form state
- Better performance over uncontrolled forms

---

### Validation
```bash
npm install zod @hookform/resolvers
```
- Runtime API & form validation
- Type-safe Zod schemas integrated with React Hook Form

---

### Global State
```bash
npm install @reduxjs/toolkit react-redux
```

Recommended slices:
```
authSlice         → Auth state & session
userSlice         → Profile & preferences
postsSlice        → Post list & filters
categoriesSlice   → Category data
dashboardSlice    → UI state & filters
settingsSlice     → App-wide settings
```

---

### Data Tables
```bash
npm install @tanstack/react-table
```
- Sorting, filtering, pagination
- Column visibility, row selection, bulk actions

Used in: Posts · Users · Comments · Categories · Tags · Media Library

---

### Rich Text Editor
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder
```
- Notion-style block editing
- Image support, links, code blocks
- Markdown compatibility

---

### Notifications
```bash
npm install sonner
```
- Success, error, and warning toasts
- Async action feedback

---

### Icons
```bash
npm install lucide-react
```
- Primary icon system (optional: Phosphor, Font Awesome)

---

### Animations
```bash
# Already installed
# Framer Motion — https://motion.dev
```
- Page transitions, hover effects
- Modal animations, loading states

---

### Drag & Drop
```bash
# Already installed
# @dnd-kit/core · @dnd-kit/sortable
```
Used in: Media Library uploads

---

### Utilities
```bash
npm install date-fns slugify react-hot-toast
```

---

## 🔧 Backend & Infrastructure

### Supabase Setup

**Authentication Providers**
- Email/Password
- Google OAuth
- GitHub OAuth
- Magic Link
- Forgot Password flow

**Database Tables**
```
profiles        users         posts
categories      tags          post_tags
post_categories comments      media
seo
```

**Storage Buckets**
```
blog-images     avatars       course-images
```

---

### Prisma Models

```
User      Post       Category
Tag       Comment    Media
SEO
```

**Relationships**
```
User      → Posts (one-to-many)
Post      → Categories (many-to-many via post_categories)
Post      → Tags (many-to-many via post_tags)
Post      → Comments (one-to-many)
Post      → SEO (one-to-one)
```

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── (marketing)/          # Public-facing pages
│   │   ├── page.tsx
│   │   ├── blog/
│   │   ├── courses/
│   │   └── pricing/
│   │
│   ├── (dashboard)/          # CMS admin area
│   │   ├── dashboard/
│   │   ├── posts/
│   │   ├── categories/
│   │   ├── tags/
│   │   ├── media/
│   │   ├── comments/
│   │   ├── users/
│   │   └── settings/
│   │
│   └── api/                  # API routes
│
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── dashboard/            # Dashboard-specific components
│   └── editor/               # Tiptap editor components
│
├── features/                 # Feature-based modules
├── lib/
│   ├── supabase/
│   ├── prisma/
│   └── auth/
│
├── hooks/                    # Custom React hooks
├── types/                    # TypeScript types
├── actions/                  # Next.js Server Actions
├── services/                 # API service functions
└── utils/                    # Helper utilities
```

---

## 🧩 CMS Modules

### 📊 Dashboard — `/dashboard`
- Analytics cards: Total Posts · Published · Drafts · Categories · Tags · Views
- Charts: Views Trend · Top Posts · Categories Distribution
- Built with **Recharts** (already installed)

### 📝 Posts — `/dashboard/posts`
- Create · Edit · Delete · Publish · Draft · Schedule · Feature
- Table columns: Title · Author · Status · Views · Created · Actions

### 🗂️ Categories — `/dashboard/categories`
- Fields: Name · Slug · Description · Nested Categories

### 🏷️ Tags — `/dashboard/tags`
- Fields: Name · Slug

### 🖼️ Media Library — `/dashboard/media`
- Drag & Drop upload (dnd-kit)
- Grid view · Search · Copy URL
- Supabase Storage integration

### 💬 Comments — `/dashboard/comments`
- Approve · Reject · Delete · Spam Filter · Guest Comments

### 👥 Users — `/dashboard/users`
| Role | Access |
|------|--------|
| Admin | Full access |
| Editor | Manage all content |
| Author | Manage own posts |
| Student | Read only |

---

## 🌐 Public Blog

### Blog Listing — `/blog`
- Search, Category filters, Tag filters, Pagination

### Single Post — `/blog/[slug]`
- Reading Time · Table of Contents · Related Posts
- Author Box · Comments · Share Buttons

### SEO per Post
- Meta Title & Description
- Canonical URL · Open Graph Image
- Twitter Cards · Schema Markup

---

## 📐 Architecture Pattern

```
API Layer
  └── Axios (centralized client)
        │
Server State
  └── TanStack Query (caching & sync)
        │
Forms
  └── React Hook Form + Zod (validation)
        │
Global State
  └── Redux Toolkit (auth, UI, filters)
        │
Tables
  └── TanStack Table (posts, users, media)
        │
Notifications
  └── Sonner (toasts)
        │
Animations
  └── Framer Motion (transitions, interactions)
```

---

## 🗓️ Development Roadmap

| Phase | Focus |
|---|---|
| **Phase 1** | Supabase setup · Auth · Prisma · Dashboard layout |
| **Phase 2** | Posts CRUD · Categories CRUD · Tags CRUD |
| **Phase 3** | Media Library · SEO Management · Comments Moderation |
| **Phase 4** | Blog Frontend · Search · Filters |
| **Phase 5** | Analytics · User Roles · Settings |
| **Phase 6** | Courses Module · AI Learning Features · Student Dashboard |

---

## 🔭 Future Expansion

The CMS is designed to grow into a full Learning Management System:

```
Content Layer          Learning Layer         AI Layer
─────────────          ──────────────         ────────
Posts                  Courses                AI Tools
Categories             Lessons                Recommendations
Tags                   Modules                Assistants
Comments               Enrollments
Media                  Certificates
                       Student Dashboards
```

---

## 📋 Quick Install Reference

```bash
# Core
npm install @supabase/supabase-js @supabase/ssr @supabase/auth-helpers-nextjs

# ORM
npm install prisma @prisma/client
npx prisma init

# Forms & Validation
npm install react-hook-form zod @hookform/resolvers

# Data Fetching & Tables
npm install @tanstack/react-query @tanstack/react-table

# State & API
npm install @reduxjs/toolkit react-redux axios

# Editor
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder

# UI & Notifications
npm install sonner lucide-react

# Utilities
npm install date-fns slugify
```

---

## 🎨 Design Inspiration

- **Vercel Dashboard** — Clean spacing & layout
- **Linear** — Minimal, fast UI
- **Notion** — Content-first editing
- **ShadcnSpace** — Consistent card patterns

Focus on: Clean spacing · Minimal UI · Command palette · Modern tables · Responsive dashboard

---

> **Why this stack?**
> Supabase handles Auth, Storage, and PostgreSQL out of the box. Prisma adds type safety and clean migrations. Next.js Server Actions simplify backend APIs. Together, this is one of the strongest choices for a production-ready, reusable Blog CMS in 2026 — and the same backend scales to courses, documentation, newsletters, and AI learning features without a rewrite.