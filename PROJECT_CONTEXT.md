# Unfaa Store - Project Context

## Project Overview

Unfaa Store is a comprehensive e-commerce platform built as a **Turborepo monorepo**. The platform consists of two main applications:

1. **Portal** (`apps/portal`) - Admin dashboard for managing shops, products, orders, and customers
2. **Web** (`apps/web`) - Customer-facing storefront with multi-tenant shop support

## Architecture

### Monorepo Structure

```
unfaa-store2/
├── apps/
│   ├── portal/          # Admin dashboard (port 3001)
│   └── web/             # Customer storefront (port 3000)
├── packages/
│   ├── ui/              # Shared shadcn/ui components
│   ├── eslint-config/   # Shared ESLint configuration
│   └── typescript-config/ # Shared TypeScript configuration
├── .cursorrules         # Global AI coding rules
├── PROJECT_CONTEXT.md   # This file
└── .cursor/rules/       # Context-specific AI rules
```

### Technology Stack

- **Framework**: Next.js 15.5.9 with App Router
- **Language**: TypeScript 5.7+ (strict mode)
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Component Library**: shadcn/ui (customized)
- **Package Manager**: pnpm with workspaces
- **Monorepo Tool**: Turborepo
- **Forms**: React Hook Form + Zod validation
- **State Management**: 
  - Portal: Redux Toolkit + RTK Query
  - Web: React Context + Server Actions

## Application Details

### Portal App (`apps/portal`)

**Purpose**: Multi-tenant admin dashboard for shop owners and administrators

**Key Features**:
- Shop management (themes, settings, policies)
- Product management (variants, packages, bulk operations)
- Order management (status tracking, courier integration)
- Customer management
- Landing page builder
- Analytics dashboard
- Subscription management
- Tutorial/course system

**State Management**:
- Redux Toolkit for global state
- RTK Query for API calls with automatic caching
- Redux Persist for auth tokens and component state

**API Pattern**:
```typescript
// RTK Query endpoints inject into base API
import { api } from "@/redux/api";

const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<PaginatedResponse<Product>, QueryParams>({
      query: (params) => ({
        url: '/product',
        method: METHOD.GET,
        params,
      }),
      providesTags: [TagType.Product],
    }),
  }),
});
```

**Authentication**:
- JWT-based with access and refresh tokens
- Automatic token refresh on 401 errors
- Token stored in Redux with persistence

**Port**: 3001

### Web App (`apps/web`)

**Purpose**: Customer-facing multi-tenant e-commerce storefront

**Key Features**:
- Multi-tenant shop routing (`[domain]/[slug]`)
- Product browsing and search
- Shopping cart
- Order placement with tracking
- Landing pages (custom templates)
- Facebook & TikTok pixel integration
- Mobile-first responsive design

**State Management**:
- React Context for shop data
- Local state for cart and orders
- Server Components for data fetching

**Data Fetching Pattern**:
```typescript
// Server Actions with CustomFetch
"use server";
import { CustomFetch } from "@/lib/CustomFetch";

export const getProducts = async (shopId: string) => {
  return await CustomFetch<ProductResponse>(`/product?shopId=${shopId}`, {
    method: "GET",
    next: { revalidate: 3600, tags: ['products'] },
  });
};
```

**Routing**:
- `[domain]` - Dynamic shop domain/slug
- `[domain]/[slug]` - Product or category pages
- `[domain]/cart` - Shopping cart
- `[domain]/checkout` - Checkout flow
- `[domain]/order-success` - Order confirmation

**Port**: 3000

### UI Package (`packages/ui`)

**Purpose**: Shared component library based on shadcn/ui

**Contents**:
- Base shadcn/ui components (button, input, dialog, etc.)
- Custom form components (CustomFormInput, CustomFormSelect, etc.)
- Landing page components (banners, features, testimonials)
- Utility functions (cn, formatDate, etc.)
- Global styles (Tailwind configuration)

**Usage**:
```typescript
import { Button } from "@workspace/ui/components/button";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { cn } from "@workspace/ui/lib/utils";
```

## Development Workflow

### Installation
```bash
pnpm install
```

### Running Development Servers
```bash
# Run all apps
pnpm dev

# Run specific app
pnpm --filter portal dev
pnpm --filter web dev
```

### Building
```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter portal build
```

### Linting
```bash
pnpm lint
```

## API Conventions

### Backend Communication

**Base URL**: Configured via `config.serverUrl`
- Portal: Uses RTK Query with base query configuration
- Web: Uses CustomFetch utility with Next.js caching

### Request Methods
```typescript
enum METHOD {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  DELETE = "DELETE",
}
```

### Response Types
```typescript
type ResponseObject<T> = {
  success: boolean;
  message: string;
  data: T;
};

type PaginatedResponse<T> = {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
};
```

### Error Handling
- Portal: RTK Query automatically handles errors
- Web: CustomFetch throws errors with JSON body
- User feedback via toast notifications (sonner)

## State Management Patterns

### Portal (Redux)

**Store Structure**:
```typescript
{
  api: RTK Query cache,
  auth: { accessToken, refreshToken },
  landingPage: { current page data },
  components: { reusable component data }
}
```

**Creating Slices**:
```typescript
import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "feature",
  initialState,
  reducers: {
    // Synchronous actions
  },
  extraReducers: (builder) => {
    // Async thunks
  },
});
```

**Using Hooks**:
```typescript
import { useGetProductsQuery } from "@/redux/api/product-api";

const { data, isLoading, error } = useGetProductsQuery({ page: 1 });
```

### Web (Context)

**Shop Context**:
```typescript
const { shop, isLoading } = useShop();
```

**Local Storage**:
- Cart data
- Order history
- Form data persistence

## Form Patterns

### Portal Forms

Uses React Hook Form + Zod + Custom Components:

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
});

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { name: "", email: "" },
});

<Form {...form}>
  <CustomFormInput
    control={form.control}
    name="name"
    label="Name"
    placeholder="Enter name"
    required
  />
</Form>
```

### Web Forms

Simpler client-side validation:

```typescript
const [formData, setFormData] = useState({ name: "", phone: "", address: "" });
const [errors, setErrors] = useState({});

const handleSubmit = async () => {
  // Validation
  if (!formData.name.trim()) {
    setErrors({ name: "নাম লিখুন" });
    return;
  }
  // Submit logic
};
```

## Routing Conventions

### Portal
- App Router with route groups
- Authentication middleware
- Role-based access control

### Web
- Dynamic routing: `[domain]/[slug]`
- Middleware for shop domain resolution
- Server-side data fetching

## Environment Variables

### Portal
- `NEXT_PUBLIC_SERVER_URL` - Backend API URL

### Web
- `NEXT_PUBLIC_SERVER_URL` - Backend API URL
- `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` - Facebook Pixel ID
- `NEXT_PUBLIC_TIKTOK_PIXEL_ID` - TikTok Pixel ID

## Type System

### Naming Conventions
- Types end with `Type` (e.g., `ProductType`, `OrderType`)
- Payloads end with `Payload` (e.g., `CreateOrderPayload`)
- Response types end with `Response` (e.g., `ProductResponse`)

### Type Location
- App-specific types: `apps/{app}/src/types/`
- Shared types: Could be in `packages/types/` (future consideration)

### Common Patterns
```typescript
// Entity Type
export type Product = {
  id: string;
  name: string;
  price: number;
  // ...
};

// Create Payload
export type ProductCreatePayload = Omit<Product, "id" | "createdAt">;

// Update Payload
export type ProductUpdatePayload = Partial<ProductCreatePayload>;

// Query Params
export type QueryParams = {
  page?: number;
  limit?: number;
  search?: string;
};
```

## Key Features Implementation

### Multi-Tenancy (Web)
- Shop data loaded via middleware
- Domain/slug-based routing
- Per-shop theming and customization

### Order Tracking
- Facebook Pixel events (PageView, ViewContent, Purchase)
- TikTok Pixel events
- UTM parameter tracking
- Order source attribution

### Landing Page Builder (Portal)
- Drag-and-drop interface
- Component-based sections
- Live preview
- Template system

### Product Variants
- Multi-dimensional variants (size, color, etc.)
- Option-specific pricing
- Stock management per variant
- Bulk variant creation

## Performance Considerations

### Next.js Optimizations
- Server Components by default
- Aggressive caching with `next` options
- Image optimization with `next/image`
- Code splitting by route

### Data Fetching
- Portal: RTK Query caching
- Web: Server-side rendering + revalidation
- Optimistic updates where applicable

### Bundle Size
- Workspace packages allow code sharing
- Tree-shaking for unused exports
- Dynamic imports for heavy components

## Common Utilities

### Portal
- `@/lib/format-number-utils.ts` - Number formatting
- `@/lib/qr-code-utils.ts` - QR code generation
- `@/lib/product-draft-utils.ts` - Product draft management

### Web
- `@/lib/CustomFetch.ts` - Server-side fetch wrapper
- `@/lib/format-number-utils.ts` - Number formatting
- `@/lib/tracking-utils.ts` - Tracking data collection
- `@/lib/get-link.ts` - Multi-tenant link generation

### Shared (UI Package)
- `@workspace/ui/lib/utils.ts` - cn() utility
- `@workspace/ui/lib/formateDate.ts` - Date formatting

## Testing Strategy

### Current State
- No formal testing setup (opportunity for improvement)

### Recommended Approach
- Unit tests for utilities and hooks
- Integration tests for API endpoints
- E2E tests for critical user flows

## Deployment

### Build Command
```bash
pnpm build
```

### Build Output
- `.next/` directory for each app
- Static assets optimized
- Server components rendered

## Team Collaboration

### Code Review
- Follow conventions in `.cursorrules`
- Check for proper TypeScript typing
- Ensure accessibility standards
- Test on mobile devices

### Documentation
- Update this file for architectural changes
- Document complex business logic
- Keep API types in sync with backend

## Future Considerations

- Shared types package
- Comprehensive testing setup
- Storybook for UI components
- CI/CD pipeline
- Performance monitoring
- Error tracking (Sentry)
