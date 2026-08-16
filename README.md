# Phoenix Mall — web client

React + TypeScript frontend for the Phoenix Mall marketplace. Talks to the Rust
API in `../Phoenix-Mall-Server`.

Built with Vite, Tailwind and [shadcn/ui](https://ui.shadcn.com) components,
React Router for routing and TanStack Query for server state.

## Running

```sh
npm install
npm run dev          # http://localhost:8080
```

The API server must be running separately (`cargo loco start --all` in
`../Phoenix-Mall-Server`).

| Script | What it does |
| --- | --- |
| `npm run dev` | dev server with HMR |
| `npm run build` | production build into `dist/` |
| `npm run preview` | serve the production build |
| `npm run lint` | eslint |
| `npx tsc --noEmit -p tsconfig.app.json` | type check (Vite does **not** type check) |

## Configuration

`.env` holds a single variable:

```
VITE_API_BASE_URL=http://localhost:5150/api
```

Import it from `src/lib/api/config.ts` — never read `import.meta.env` inline:

```ts
import { API_BASE_URL, API_ORIGIN, getAssetUrl } from "@/lib/api/config";

fetch(`${API_BASE_URL}/products/list`);   // API calls
getAssetUrl(product.image_url);           // avatars, product images
```

`API_BASE_URL` includes the `/api` prefix; `API_ORIGIN` is the bare server
origin, which is where uploaded files are served from. A hardcoded
`http://localhost:5150` fallback works in development and silently breaks every
deployed build, so keep those strings in this one module.

## Layout

```
src/
  pages/         route components (see the route table in App.tsx)
  components/    shared components; components/ui is shadcn, mostly untouched
  contexts/      AuthContext (session), ProfileContext (profile),
                 OnlineStatusContext (presence + the single heartbeat loop)
  hooks/         reusable hooks
  lib/api/       one module per API resource; client.ts wraps fetch and
                 attaches the bearer token, config.ts owns the base URLs
```

## Conventions

- **Auth**: the JWT lives in `localStorage.access_token`; `backendRequest`
  attaches it. Role and verification state come from `/api/auth/current` on
  every session check — do not cache them client-side, since anything in
  `localStorage` is user-editable and would only be a cosmetic check anyway.
- **Presence**: `OnlineStatusContext` owns the single 30-second heartbeat. Do
  not add a second one; the server ages users out five minutes after the last
  heartbeat.
- **Types**: `src/lib/api/types.ts` mirrors the server's response shapes. When
  the API changes, update it there — `strictNullChecks` and `noImplicitAny` are
  on, so mismatches surface at build time.

## Known gaps

- Social login buttons, the admin header's settings/logout items and the contact
  form are placeholders that only `console.log`.
- `npm run lint` reports pre-existing findings, mostly `no-explicit-any` on API
  response types and `react-hooks/exhaustive-deps` warnings.
