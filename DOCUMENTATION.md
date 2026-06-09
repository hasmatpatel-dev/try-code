# TryCode — Project Documentation

## Project Concept

TryCode is a full-stack Blog CMS and Learning Management Foundation built on **Next.js 16**, **Supabase**, **Prisma**, and **Tailwind CSS v4**. It serves as a unified platform for publishing blog articles, managing AI tutorials, creating courses, and administering users — all from a single relational database backend.

The system features role-based access control (Admin, Editor, Author, Student), a Notion-style rich text editor (Tiptap), interactive media library with drag-and-drop (dnd-kit), comments moderation, SEO optimization per post, analytics dashboards (Recharts), and a public-facing blog with search, filters, and related posts.

TryCode is architected as a **layered monolith**:
- **Content Layer** — Posts, Categories, Tags, Comments, Media
- **Learning Layer** — Courses, Lessons, Modules, Enrollments, Certificates
- **AI Layer** — AI Tools, Recommendations, Assistants (future expansion)

---

## Project Inspiration

TryCode was inspired by a combination of production-grade tools and modern developer experiences:

| Inspiration | Why |
|---|---|
| **Vercel Dashboard** | Clean spacing, minimal layout, fast navigation |
| **Linear** | Minimal, speed-first UI philosophy |
| **Notion** | Content-first block-based editing experience |
| **shadcn/ui** | Composable, accessible component patterns |
| **Ghost CMS** | Headless CMS simplicity with modern tooling |
| **Medium** | Clean reading experience and author workflows |

The goal was to combine the **best UX patterns** from these platforms into a single, self-hosted, production-ready CMS that doesn't require a third-party service.

---

## Why We Need This

### 1. Unified Content Platform
Most blogging platforms (Medium, Dev.to, WordPress.com) lock content into their ecosystems. TryCode gives **full ownership** of data — posts, media, comments, and user data live in your own PostgreSQL database.

### 2. Foundation for Learning & AI
Unlike traditional CMS tools, TryCode is designed from day one to scale beyond blogging into **courses, certifications, and AI-powered learning features** — without needing a rewrite.

### 3. Modern Tech Stack
Built with the state of the art in 2026:
- **Next.js 16** (App Router, Server Actions, React Server Components)
- **Supabase** (Auth, PostgreSQL, Storage, Realtime — all managed)
- **Prisma** (type-safe ORM with auto-generated migrations)
- **Tailwind CSS v4** (utility-first, zero-runtime CSS)

This stack eliminates the traditional "CMS lag" — developers get a modern DX while content editors get a smooth, fast interface.

### 4. Production-First Features
- Role-based access control (RBAC) for teams
- SEO toolkit (meta tags, OG cards, JSON-LD, sitemaps)
- Analytics dashboards with real-time visualizations
- Media library with drag-and-drop uploads and CDN URLs
- Comments moderation with spam filtering

### 5. Extensible by Design
The architecture separates concerns cleanly (API layer, server state, forms, global state, tables, notifications, animations). Adding new modules (newsletter, paid courses, AI assistants) follows the same patterns, keeping the codebase predictable and maintainable.

### 6. Developer Productivity
- TypeScript end-to-end
- Zod validation integrated with React Hook Form
- TanStack Query for automatic caching and background sync
- Redux Toolkit for predictable global state
- TanStack Table for sortable, filterable data tables

---

## Summary

TryCode is not just a blog CMS — it is a **content and learning platform foundation** built with modern tools, inspired by the best UX in the industry, and designed to grow without limits.
