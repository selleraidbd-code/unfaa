## Unfaa Store

Unfaa Store is a multi-tenant e‑commerce and landing‑page platform built with Next.js (App Router) in a monorepo setup. It powers both an admin/portal application (for shop owners and operators) and a public storefront application (for customers), sharing common UI, configuration, and tooling packages.

### Why this project was built

- **Centralized shop management**: To give sellers and admins a single portal to manage products, orders, customers, subscriptions, and shop settings across multiple domains.
- **Fast shop onboarding**: To make it easy to launch a modern online shop quickly using ready-made landing page templates and a visual landing-page builder.
- **Consistent UX and design system**: To reuse a shared UI library across apps so that the portal and storefront have a consistent, high-quality experience.
- **Scalable architecture**: To use a monorepo and shared packages so new features and shops can be added without duplicating code.

### High-level architecture

- **Apps**
    - **`apps/portal`**: Admin dashboard where shop owners and staff sign in, configure their shop, manage products, orders, customers, subscriptions, domains, SEO, and marketing options.
    - **`apps/web`**: Public storefront that serves shop landing pages and product pages, including multi-domain and per‑shop routing.
- **Packages**
    - **`packages/ui`**: Shared UI component library (built on top of `shadcn/ui` and Tailwind CSS) used by both apps.
    - **Config packages**: Shared TypeScript and ESLint configuration for consistent tooling across the monorepo.

### Key features

- **Multi-tenant storefront**
    - Domain-based routing for different shops (e.g. `apps/web` serving pages under different `domain/slug` combinations).
    - Shop-specific layouts, branding, and landing pages.

- **Landing page builder**
    - Pre-built section templates (hero, FAQ, product highlights, etc.) for creating high-converting store landing pages.
    - Configurable layouts driven by data from `landing-builder` and related modules.

- **Product and order management**
    - Create and manage products, categories, and pricing from the portal.
    - Manage customer orders, delivery details, and payment information.

- **Shop configuration and marketing**
    - Manage shop domains, SEO metadata, social links, and marketing settings.
    - Configure payment gateways, delivery charges, and shop policies.

- **Authentication and onboarding**
    - Email-based sign‑up/sign‑in flows for admins and staff in the portal.
    - Onboarding flow to guide new shop owners through initial setup.

- **Shared UI and theming**
    - Component library for form controls, buttons, dialogs, navigation, and layout primitives.
    - Tailwind-based theming with global styles shared across apps.

### Tech stack

- **Framework**: Next.js (App Router) with React
- **Language**: TypeScript
- **Styling**: Tailwind CSS with `shadcn/ui` components via `packages/ui`
- **Package manager / monorepo**: `pnpm` workspaces

### Getting started (development)

From the repository root:

```bash
pnpm install

# Run the admin/portal app
pnpm dev:portal

# Run the public storefront app
pnpm dev:web
```

Check the scripts in `package.json` for the exact dev and build commands used in this repo.
