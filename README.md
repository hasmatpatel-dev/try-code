# 🚀 TryCode — Full-Stack Blog CMS

A scalable, production-ready Blog CMS and Learning Management Foundation built on Next.js 16, Supabase, Prisma, and Tailwind CSS. Powering articles, courses, and user management from a unified relational database.

---

## 📦 Core Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | React Server Components & API routing |
| **Styling** | Tailwind CSS v4 · shadcn/ui | Premium, fluid modern layouts |
| **Database** | PostgreSQL (via Supabase) | Managed relational database |
| **ORM** | Prisma | Type-safe query builder & DDL operations |
| **Auth** | Supabase Auth | Email logins, Magic Link, and OAuth (Google, GitHub) |
| **Storage** | Supabase Storage | Dynamic media & avatar storage buckets |
| **Email** | Resend | Welcome & authentication emails |
| **State** | Redux Toolkit · React Query | Unified client & server-state caching |

---

## ✨ Features

* **🎭 Role-Based Access Control (RBAC):** Distinct dashboards for **Admins** (full control), **Editors** (content moderators), **Authors** (personal article publishers), and **Students** (read-only/learning views).
* **📝 Notion-Style Rich Text Editor:** Powered by **Tiptap** supporting custom block types, markdown shortcuts, media insertion, and links.
* **🖼️ Interactive Media Library:** Drag-and-drop media uploading using `@dnd-kit`, grid browsing, dynamic asset listing, and instant CDN link copying.
* **💬 Comments System:** Full moderation interface to approve, spam-mark, or delete guest comments under blog articles.
* **📊 Analytics Dashboard:** Interactive data visualizations (views trends, categories, and tags distribution) using **Recharts**.
* **🔍 Public Blog Frontend:** Full search capabilities, dynamic filters (categories/tags), reading-time calculations, table of contents, and related posts recommendations.
* **🏷️ SEO Optimizer:** Per-post titles, meta descriptions, canonical URLs, OG card previews, Twitter summaries, and automated JSON-LD schema markup.

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory and configure the following variables:
```env
# Database Connection URLs (Supabase PostgreSQL)
DATABASE_URL="postgresql://<username>:<password>@<host>:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://<username>:<password>@<host>:5432/postgres"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Supabase SDK Configurations
NEXT_PUBLIC_SUPABASE_URL="https://<project-id>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<your-anon-key>"
SUPABASE_SERVICE_ROLE_KEY="<your-service-role-key>"

# Resend Email Integration
RESEND_API_KEY="re_<your-resend-key>"
RESEND_FROM_EMAIL="no-reply@yourdomain.com"
RESEND_FROM_NAME="TryCode"
```

> [!IMPORTANT]
> If your database password contains special characters (like `@`, `#`, `/`, `:`), you must URL-encode them in `DATABASE_URL` and `DIRECT_URL` (e.g. `@` becomes `%40`).

### 3. Sync Database Schema
To create the necessary database tables (Users, Posts, Categories, Comments, SEO) in your Supabase project:
```bash
npx prisma db push
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🗂️ Directory Structure

```
try-code/
├── prisma/                  # Prisma schema & local SQLite backup
├── supabase/                # Local Supabase configurations
├── src/
│   ├── app/                 # Next.js Pages & Routes (marketing & dashboard routes)
│   ├── components/          # Reusable UI component layers (shadcn/ui & editor templates)
│   ├── features/            # Redux Slices (Auth, User Preferences, CMS states)
│   ├── lib/                 # Core Initializations (PrismaClient, SupabaseClient server/client)
│   ├── hooks/               # Custom React Hooks
│   ├── types/               # TypeScript Type declarations
│   └── utils/               # App helper modules
```
