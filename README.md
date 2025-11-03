# AWAD-IA04 — Frontend

Short README — setup, run, build, and deploy instructions for the JWT auth SPA.

IMPORTANT: Replace the placeholder PUBLIC_URL below with your actual deployed site URL after you deploy (Netlify / Vercel / GitHub Pages).

Public URL: https://ia04-22120216.netlify.app/

---

## Description

This project is a React + TypeScript single-page application demonstrating JWT-based authentication (access + refresh). It uses:

- Vite + React + TypeScript
- Axios for HTTP requests (central client + refresh interceptor)
- React Query for server state and authentication mutations
- react-hook-form for login/register forms
- Tailwind CSS for styling

Key behaviors implemented:

- Access token stored in memory; refresh token persisted in localStorage
- Axios interceptor attaches access token and handles 401 → refresh → retry
- Logout clears tokens and redirects to login
- Route guards protect pages that require authentication

---

## Prerequisites

- Node.js 18+ (or compatible)
- npm
- Git (for cloning or connecting to Netlify/Vercel)

## Local setup

From the project root (`frontend`):

1. Install dependencies

```powershell
npm install
```

2. Run dev server

```powershell
npm run dev
```

Open the app at the URL Vite prints (usually http://localhost:5173).

3. Build for production

```powershell
npm run build
```

4. Preview the production build locally (optional)

```powershell
npm run preview
```

---

## Netlify deployment (recommended)

This repo already contains a `public/_redirects` file with the rule to support SPA routing on Netlify. When you deploy, Netlify will copy that file so client-side routes (e.g. `/login`) do not 404.

Steps to deploy:

1. Push your repository to GitHub (or connect from Netlify directly).
2. In Netlify, create a new site from Git and point to this repository.
3. Set the build command: `npm run build`
4. Set the publish directory: `dist`
5. Deploy — after deployment, note the published URL and replace the `PUBLIC_URL_GOES_HERE` placeholder above with that URL.

Alternative: use `netlify.toml` with a redirect, or host on Vercel (Vercel handles SPA routing by default) or GitHub Pages.

---

## Troubleshooting 404 on client routes (Netlify)

If you see a 404 on client routes like `/login` after deployment, ensure:

- `public/_redirects` exists (it was added to this project: `public/_redirects`).
- The file was included in the deployed site (Netlify build logs show files copied).
- Your logout logic uses client-side navigation (e.g. `navigate('/login')`) rather than `window.location`.

If you prefer, use Hash-based routing (not recommended for production) to avoid server rewrites.

---

## Key files and where to look

- `src/api/axiosClient.ts` — central axios instance, interceptor, refresh handling
- `src/api/authApi.ts` — login / refresh / profile endpoints wrappers
- `src/providers/AuthProvider.tsx` — auth state, login/logout, session restore logic
- `src/pages/Login.tsx` & `src/pages/Register.tsx` — react-hook-form usage
- `src/pages/Profile.tsx` — protected profile fetch using React Query
- `src/routes/guards.tsx` & `src/routes/AppRouter.tsx` — protected / guest routes
- `src/components/layout/Navbar.tsx` — top navigation; updated to requested design
- `public/_redirects` — Netlify rewrite rule for SPA routing

---

## How to include the public URL in README

After you deploy, edit this README and replace:

```
Public URL: PUBLIC_URL_GOES_HERE
```

with the actual site URL (for example `https://ia04-22120216.netlify.app/`).

---

## Notes / Next steps

- For improved UX you can implement silent pre-expiry refresh and multi-tab logout sync.
- Consider storing refresh tokens in secure cookies if your backend supports it (better XSS protection).

If you want, I can:

- Add a `netlify.toml` instead of `_redirects`.
- Run `npm run build` here and confirm `_redirects` exists in `dist/` before you deploy.

---

License: MIT (adapt as needed)

```

```
