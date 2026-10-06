# Project: fake-store

## Overview
E-commerce application project built with modern frontend technologies and structured according to **Feature-Sliced Design (FSD 2.1)** architecture.

## Technology Stack
- **Framework & Runtime**: React 19, TypeScript ~6.0
- **Bundler & Tooling**: Vite 8, Babel React Compiler preset
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Routing**: `react-router-dom` v7
- **Icons**: `lucide-react`
- **Linting**: Oxlint
- **Backend / Serverless**: Vercel Serverless Functions (`/api/orders`)
- **Database**: PostgreSQL (`Orders`, `Items`, `Payments` tables via SQL transactions)
- **Analytics & BI**: Power BI (combining live PostgreSQL data with historical Olist CSV dataset)

---

## Global System Architecture

```text
                    FAKE STORE
                 React + TypeScript
                        │
                        │ POST /api/orders
                        ▼
                VERCEL SERVERLESS
                        │
                        │ SQL Transaction
                        ▼
                    PostgreSQL
                 ┌──────┼───────┐
              Orders   Items  Payments
                 │        │       │
                 └────────┼───────┘
                          │
                          ▼
                       Power BI
                          ▲
                          │
                    Olist CSV
                 datos históricos
```

### Data Pipeline & Persistence
1. **Frontend (Fake Store)**: Dispatches order creation requests via `POST /api/orders`.
2. **Serverless Layer**: Vercel Serverless function executing an atomic SQL transaction across the PostgreSQL database.
3. **Database Entities**:
   - `Orders`: Order header, timestamps, customer info, status.
   - `Items`: Line items, product references, quantity, unit price, freight.
   - `Payments`: Payment type, installments, payment value.
4. **BI & Analytics**: Power BI integrates real-time transactional data from PostgreSQL with the historical Brazilian E-Commerce dataset (Olist CSV).

---

## Architecture: Feature-Sliced Design (FSD)

The codebase strictly adheres to standard FSD layer hierarchy in `src/`:

```text
src/
├── app/        # Global configuration, styles, and top-level providers (router, theme)
├── pages/      # Route/page views composition layer (e.g. home, product-detail)
├── widgets/    # Self-contained composite UI blocks (e.g. Header, Footer, ProductGrid)
├── features/   # User actions & interactions with business value (e.g. add-to-cart, filter-by-category)
├── entities/   # Business domain entities & models (e.g. product, cart, user)
├── shared/     # Domain-agnostic reusable code (ui kit, api client, lib, config, types)
└── main.tsx    # Application entry point
```

### Import Rules & Path Aliases
1. **Always use `@/*` for imports**:
   - Path alias `@/` points directly to `src/`.
   - Never use deep relative paths like `../../pages` or `../../../shared`.
   - Example: `import { HomePage } from '@/pages'`
2. **Layer Hierarchy Rule**:
   - Layers may only import from layers strictly below them:
     `app` ➔ `pages` ➔ `widgets` ➔ `features` ➔ `entities` ➔ `shared`.
   - Lower layers must never import from upper layers.
   - Slices within the same layer must not cross-import directly; cross-slice interactions must be composed by an upper layer.
3. **Public API**:
   - Each slice and layer must expose an `index.ts` file serving as its Public API.
   - Internal segments (e.g., `ui/`, `model/`, `api/`) should not be accessed from outside their slice.

---

## Project Structure Conventions

### `src/app`
- `styles/index.css`: Global styles, `@import "tailwindcss";` and base design resets.
- `providers/`: Context providers, router setup (`AppRouter.tsx`).
- `App.tsx`: Top-level application component.

### `src/pages`
- Each route has its own slice folder: `pages/<page-name>/ui/<PageName>.tsx` and `pages/<page-name>/index.ts`.
- Re-exported through `src/pages/index.ts`.

### `src/widgets`
- Autonomous composite blocks composed of features and entities (e.g. `Header`, `Sidebar`, `CartDrawer`).

### `src/features`
- Specific user flows that carry business value (e.g. `add-to-cart`, `search-products`, `checkout`).

### `src/entities`
- Core business data models, types, UI cards, and state (e.g. `product`, `category`, `cart`).

### `src/shared`
- `ui/`: Reusable UI components (buttons, badges, inputs, dialogs, loaders).
- `api/`: Base API client (e.g. Fake Store API fetchers / Axios / TanStack Query client).
- `lib/`: Formatters, utilities, custom generic hooks.
- `config/`: App constants, routes config, env variables.
- `types/`: Global shared TypeScript interfaces and types.

---

## Development Commands
- **Development server**: `npm run dev`
- **Build**: `npm run build` (`tsc -b && vite build`)
- **Lint**: `npm run lint` (`oxlint`)
- **Preview**: `npm run preview`

---

## Terminal & Environment Notes (CRITICAL)
- **PowerShell Profile Quirk**: The local PowerShell profile defaults the terminal directory to `C:\Users\yohan\myspace`. When executing any terminal commands via shell, always explicitly change directory first:
  ```powershell
  cd c:\Users\yohan\myspace\lab\active\fake-store ; <command>
  ```
