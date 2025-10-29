# Smart Link — Fullstack README

This document contains **complete README** files for both Backend and Frontend of the *Smart Link* project. Paste each section into the respective repo root (`backend/README.md`, `frontend/README.md`) or keep this single file for reference.

---

# Backend README (backend/README.md)

## Smart Link Website - Backend

A Node.js / Express backend for the Smart Link Website that allows admins to manage website links with AI-generated descriptions and image uploads.

### Features

* JWT-based authentication with role-based access (admin / user)
* CRUD for website links (siteUrl, title, coverImage, description, category)
* Google Gemini (or other LLM) integration to generate short descriptions
* Cloudinary image uploads for coverImage
* PostgreSQL persistence (SQL or via ORM like Prisma/TypeORM)
* Swagger (OpenAPI) documentation available at `/api-docs`
* Robust input validation & error handling
* Useful scripts for dev & production

### Tech stack

* Node.js, Express
* TypeScript
* PostgreSQL
* Prisma or TypeORM (suggested)
* Cloudinary
* JWT (jsonwebtoken)
* Swagger (swagger-ui-express + swagger-jsdoc)

---

## Quickstart

### Prerequisites

* Node.js v16+
* PostgreSQL running
* Cloudinary account
* Gemini (or LLM) API Key

### Install

```bash
git clone <repo-url>
cd backend
npm install
```

### Environment

Create `.env` with:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/smart_links_db
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
GEMINI_API_KEY=...
PORT=3001
NODE_ENV=development
```

### DB Setup (example SQL)

```sql
CREATE DATABASE smart_links_db;
-- Use your ORM migration instead of raw SQL in production
-- Users table
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     username VARCHAR(50) UNIQUE NOT NULL,
     email VARCHAR(100) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   
   -- Sites table
   CREATE TABLE sites (
     id SERIAL PRIMARY KEY,
     site_url VARCHAR(500) NOT NULL,
     title VARCHAR(200) NOT NULL,
     cover_image VARCHAR(500),
     description TEXT NOT NULL,
     category VARCHAR(50) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
```

   
   

### Run Dev

```bash
npm run dev
# uses ts-node-dev / nodemon to restart on change
```

### Build & Run Prod

```bash
npm run build
npm start
```

### Scripts

* `npm run dev` - start dev server
* `npm run build` - compile TypeScript
* `npm start` - start compiled server
* `npm run migrate` - run DB migrations (if using Prisma/TypeORM)

---

## API (high level)

* `POST /api/auth/signup` — create user
* `POST /api/auth/login` — login (returns JWT)
* `GET /api/sites` — list public sites
* `GET /api/sites/:id` — get site details
* `POST /api/sites` — create site (admin)
* `PUT /api/sites/:id` — update site (admin)
* `DELETE /api/sites/:id` — delete site (admin)
* `POST /api/sites/upload-image` — upload cover image (admin)
* `POST /api/ai/generate-description` — generate description using AI (admin)

All protected routes require `Authorization: Bearer <token>`.

---

## Swagger (OpenAPI)

We use `swagger-jsdoc` + `swagger-ui-express`.

* Swagger UI: `http://localhost:3001/api-docs`
* JSON: `http://localhost:3001/api-docs.json`

**Notes:** Add JSDoc comments above controllers or generate from routes to keep docs current.

---

## Security & Best Practices

* Hash passwords (bcryptjs) with salt
* Validate payloads (zod / joi / class-validator)
* Limit image upload sizes, validate mime types
* Rate limiting on auth endpoints
* Keep secrets in environment or a secrets manager

---

## Deployment

1. Build: `npm run build`
2. Set production env vars


---

## Troubleshooting

* If Cloudinary upload fails: check credentials and allowed file types
* If AI fails: check Gemini API key and request quotas
* DB connection: ensure `DATABASE_URL` points to reachable DB host

---

# Frontend README (frontend/README.md)

## Smart Link Website - Frontend

A Next.js + Tailwind CSS frontend for the Smart Link project. Uses React Query / SWR for caching, `next-themes` for dark mode, and Redux Toolkit for global state.

### Features

* Responsive UI (desktop, tablet, mobile)
* Dark mode with toggle (uses `next-themes`)
* Server-state caching (React Query) for fast UIs 
* Debounced search inputs to reduce API calls
* Card-based listing of links (coverImage, title, description, category)
* Accessibility-friendly (keyboard focus, alt text)
* Image lazy-loading and optimized sizes
* Basic client-side routing using Next.js
* Placeholder / skeleton loading states

---

## Quickstart

### Prerequisites

* Node.js v18+
* Environment variable: `NEXT_PUBLIC_API_URL` (e.g. `http://localhost:3001`)

### Install

```bash
git clone <repo-url>
cd frontend
npm install
```

### Local Run

```bash
npm run dev
# open http://localhost:3000
```

### Build & Start

```bash
npm run build
npm start
```

---

## Key Implementation Notes (how features were implemented)

### Dark Mode

* Uses `next-themes`.
* Wrap your app in `<ThemeProvider attribute="class" />`.
* Toggle sets `theme` -> adds `class="dark"` on `<html>`.
* Tailwind `darkMode: 'class'` is configured.

**Usage example**:

```tsx
import { useTheme } from 'next-themes';
const { theme, setTheme } = useTheme();
<button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>Toggle</button>
```

### Debounced Search

* Use `useDebounce` hook or lodash `debounce`.
* Debounce input to 300–500ms before firing API calls.

Example hook:

```ts
import { useEffect, useState } from 'react';
export function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
```

### Caching & Server State

* Recommended: **React Query** (TanStack Query) for caching, background refetching, and mutations.
* Alternative: **SWR**.

Example React Query use:

```ts
const queryClient = new QueryClient();
const { data } = useQuery(['sites', filters], () => fetchSites(filters));
```

###  PWA
create PWA for mobile devices 


### Accessibility & Performance

* Use `loading="lazy"` on images
* Use skeleton loaders for lists
* Provide `alt` text for images
* Use responsive images via `srcset` if possible

---




## Deployment

* Build static assets: `npm run build`
* Host on Vercel, Netlify, or any static host
* Ensure `NEXT_PUBLIC_API_URL` is set to backend production URL

