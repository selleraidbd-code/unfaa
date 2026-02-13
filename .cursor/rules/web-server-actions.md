# Web Server Actions Rules

## Context
This rule applies to Server Actions in the Web app.

## Applies To
- `apps/web/src/actions/**`

## Server Actions Architecture

The Web app uses Next.js Server Actions for server-side data fetching and mutations.

### File Structure
```
actions/
├── index.ts                    # Barrel exports
├── product-actions.ts          # Product-related actions
├── category-actions.ts         # Category-related actions
├── order-actions.ts           # Order-related actions
└── shop-actions.ts            # Shop-related actions
```

## CustomFetch Utility

All server actions use the `CustomFetch` utility for API calls.

### Location
`apps/web/src/lib/CustomFetch.ts`

### Usage Pattern

```typescript
"use server";

import { CustomFetch } from "@/lib/CustomFetch";
import { ResponseObject, PaginatedResponse } from "@/types";
import { Product } from "@/types/product-type";

export const getProducts = async (shopId: string, params?: QueryParams) => {
  return await CustomFetch<PaginatedResponse<Product>>(
    `/product?shopId=${shopId}`,
    {
      method: "GET",
      next: {
        revalidate: 3600, // Cache for 1 hour
        tags: ['products', `shop-${shopId}`],
      },
    }
  );
};
```

## Server Action Patterns

### GET Requests (Read Operations)

```typescript
"use server";

import { CustomFetch } from "@/lib/CustomFetch";

// Get list with caching
export const getProducts = async (shopId: string) => {
  return await CustomFetch<PaginatedResponse<Product>>(
    `/product?shopId=${shopId}`,
    {
      method: "GET",
      next: {
        revalidate: 3600, // Cache for 1 hour
        tags: ['products'],
      },
    }
  );
};

// Get single item
export const getProductById = async (id: string) => {
  return await CustomFetch<ResponseObject<Product>>(
    `/product/${id}`,
    {
      method: "GET",
      next: {
        revalidate: 3600,
        tags: [`product-${id}`],
      },
    }
  );
};

// Get with no cache (always fresh)
export const getRealtimeOrders = async (shopId: string) => {
  return await CustomFetch<PaginatedResponse<Order>>(
    `/order?shopId=${shopId}`,
    {
      method: "GET",
      next: {
        revalidate: 0, // No cache
      },
    }
  );
};
```

### POST Requests (Create Operations)

```typescript
"use server";

import { revalidateTag } from "next/cache";
import { CustomFetch } from "@/lib/CustomFetch";

export const createOrder = async (payload: CreateOrderPayload) => {
  const response = await CustomFetch<ResponseObject<Order>>(
    "/order",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
  
  // Revalidate related caches
  revalidateTag('orders');
  revalidateTag(`shop-${payload.shopId}`);
  
  return response;
};
```

### PATCH Requests (Update Operations)

```typescript
"use server";

import { revalidateTag } from "next/cache";
import { CustomFetch } from "@/lib/CustomFetch";

export const updateProduct = async (
  id: string, 
  payload: Partial<Product>
) => {
  const response = await CustomFetch<ResponseObject<Product>>(
    `/product/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );
  
  // Revalidate specific product and list
  revalidateTag(`product-${id}`);
  revalidateTag('products');
  
  return response;
};
```

### DELETE Requests

```typescript
"use server";

import { revalidateTag } from "next/cache";
import { CustomFetch } from "@/lib/CustomFetch";

export const deleteProduct = async (id: string) => {
  const response = await CustomFetch<void>(
    `/product/${id}`,
    {
      method: "DELETE",
    }
  );
  
  revalidateTag('products');
  return response;
};
```

## Caching Strategy

### Cache Revalidation Times

```typescript
// Frequently changing data (orders, inventory)
next: { revalidate: 60 } // 1 minute

// Semi-static data (products, categories)
next: { revalidate: 3600 } // 1 hour

// Static data (shop settings, policies)
next: { revalidate: 86400 } // 24 hours

// Real-time data
next: { revalidate: 0 } // No cache

// Static, rarely changes
next: { revalidate: false } // Cache forever
```

### Cache Tags

Use descriptive tags for granular revalidation:

```typescript
// Entity-based tags
tags: ['products']
tags: ['orders']
tags: ['categories']

// ID-based tags
tags: [`product-${id}`]
tags: [`order-${id}`]

// Shop-based tags
tags: [`shop-${shopId}`]
tags: [`shop-${shopId}-products`]

// Multiple tags
tags: ['products', `shop-${shopId}`, 'featured']
```

## Error Handling

### CustomFetch Error Pattern

```typescript
"use server";

import { CustomFetch } from "@/lib/CustomFetch";

export const getProduct = async (id: string) => {
  try {
    return await CustomFetch<ResponseObject<Product>>(
      `/product/${id}`,
      {
        method: "GET",
        next: { revalidate: 3600 },
      }
    );
  } catch (error) {
    // CustomFetch throws with JSON error body
    console.error("Failed to fetch product:", error);
    
    // Return null or throw based on use case
    return null;
    
    // Or re-throw for component to handle
    // throw error;
  }
};
```

### Client-Side Error Handling

```typescript
// In component
const product = await getProduct(id);

if (!product) {
  return <ErrorState message="Product not found" />;
}
```

## Query Parameters

### Building Query Strings

```typescript
"use server";

import { CustomFetch } from "@/lib/CustomFetch";

type QueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  sortBy?: string;
};

export const getProducts = async (
  shopId: string, 
  params?: QueryParams
) => {
  // Build query string
  const queryParams = new URLSearchParams({
    shopId,
    ...(params?.page && { page: params.page.toString() }),
    ...(params?.limit && { limit: params.limit.toString() }),
    ...(params?.search && { search: params.search }),
    ...(params?.categoryId && { categoryId: params.categoryId }),
    ...(params?.sortBy && { sortBy: params.sortBy }),
  });
  
  return await CustomFetch<PaginatedResponse<Product>>(
    `/product?${queryParams.toString()}`,
    {
      method: "GET",
      next: {
        revalidate: 3600,
        tags: ['products', `shop-${shopId}`],
      },
    }
  );
};
```

## File Uploads (FormData)

### Image/File Upload

```typescript
"use server";

import { CustomFetch } from "@/lib/CustomFetch";

export const uploadProductImage = async (formData: FormData) => {
  return await CustomFetch<ResponseObject<{ url: string }>>(
    "/media/upload",
    {
      method: "POST",
      body: formData, // Don't stringify FormData
      formData: true, // Important: tells CustomFetch to skip Content-Type header
    }
  );
};
```

## Response Types

### Standard Response Format

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
    totalPages: number;
  };
};
```

## Revalidation Patterns

### Manual Revalidation

```typescript
"use server";

import { revalidateTag, revalidatePath } from "next/cache";

// Revalidate by tag
export const revalidateProducts = async () => {
  revalidateTag('products');
};

// Revalidate by path
export const revalidateShopPage = async (shopSlug: string) => {
  revalidatePath(`/${shopSlug}`);
};

// Revalidate multiple tags
export const revalidateShopData = async (shopId: string) => {
  revalidateTag(`shop-${shopId}`);
  revalidateTag(`shop-${shopId}-products`);
  revalidateTag(`shop-${shopId}-orders`);
};
```

### After Mutations

```typescript
"use server";

import { revalidateTag } from "next/cache";
import { CustomFetch } from "@/lib/CustomFetch";

export const createProduct = async (payload: CreateProductPayload) => {
  const response = await CustomFetch<ResponseObject<Product>>(
    "/product",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
  
  // Revalidate related data
  if (response?.success) {
    revalidateTag('products');
    revalidateTag(`shop-${payload.shopId}`);
    revalidateTag('featured-products');
  }
  
  return response;
};
```

## Complex Data Fetching

### Parallel Requests

```typescript
"use server";

import { CustomFetch } from "@/lib/CustomFetch";

export const getShopPageData = async (shopSlug: string) => {
  // Fetch shop data first
  const shop = await CustomFetch<ResponseObject<Shop>>(
    `/shop/slug/${shopSlug}`,
    {
      method: "GET",
      next: { revalidate: 3600 },
    }
  );
  
  if (!shop?.data?.id) {
    return null;
  }
  
  // Fetch related data in parallel
  const [products, categories, settings] = await Promise.all([
    CustomFetch<PaginatedResponse<Product>>(
      `/product?shopId=${shop.data.id}&limit=20`,
      {
        method: "GET",
        next: { revalidate: 3600, tags: [`shop-${shop.data.id}-products`] },
      }
    ),
    CustomFetch<ResponseObject<Category[]>>(
      `/category?shopId=${shop.data.id}`,
      {
        method: "GET",
        next: { revalidate: 3600, tags: [`shop-${shop.data.id}-categories`] },
      }
    ),
    CustomFetch<ResponseObject<ShopSettings>>(
      `/shop/${shop.data.id}/settings`,
      {
        method: "GET",
        next: { revalidate: 3600, tags: [`shop-${shop.data.id}-settings`] },
      }
    ),
  ]);
  
  return {
    shop: shop.data,
    products: products?.data || [],
    categories: categories?.data || [],
    settings: settings?.data,
  };
};
```

### Conditional Requests

```typescript
"use server";

export const getProductDetails = async (
  productId: string,
  includeRelated: boolean = false
) => {
  const product = await CustomFetch<ResponseObject<Product>>(
    `/product/${productId}`,
    {
      method: "GET",
      next: { revalidate: 3600 },
    }
  );
  
  if (!product?.data) {
    return null;
  }
  
  let relatedProducts = null;
  
  if (includeRelated && product.data.categoryId) {
    relatedProducts = await CustomFetch<PaginatedResponse<Product>>(
      `/product?categoryId=${product.data.categoryId}&limit=4`,
      {
        method: "GET",
        next: { revalidate: 3600 },
      }
    );
  }
  
  return {
    product: product.data,
    relatedProducts: relatedProducts?.data || [],
  };
};
```

## Best Practices

1. **Always add "use server"** at the top of action files
2. **Use CustomFetch** for all API calls
3. **Implement proper caching** with revalidate times
4. **Use cache tags** for granular invalidation
5. **Handle errors gracefully** with try-catch
6. **Revalidate after mutations** to keep data fresh
7. **Type all responses** for type safety
8. **Log errors** for debugging
9. **Use parallel requests** when data is independent
10. **Keep actions focused** - one action per operation

## Common Patterns

### Search Action

```typescript
"use server";

import { CustomFetch } from "@/lib/CustomFetch";

export const searchProducts = async (
  shopId: string,
  searchTerm: string
) => {
  if (!searchTerm.trim()) {
    return { data: [], meta: { total: 0 } };
  }
  
  return await CustomFetch<PaginatedResponse<Product>>(
    `/product?shopId=${shopId}&search=${encodeURIComponent(searchTerm)}`,
    {
      method: "GET",
      next: {
        revalidate: 300, // 5 minutes cache for search
      },
    }
  );
};
```

### Filtered List Action

```typescript
"use server";

export const getFilteredProducts = async (filters: {
  shopId: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'newest';
  page?: number;
}) => {
  const params = new URLSearchParams({
    shopId: filters.shopId,
    ...(filters.categoryId && { categoryId: filters.categoryId }),
    ...(filters.minPrice && { minPrice: filters.minPrice.toString() }),
    ...(filters.maxPrice && { maxPrice: filters.maxPrice.toString() }),
    ...(filters.sortBy && { sortBy: filters.sortBy }),
    page: (filters.page || 1).toString(),
    limit: '20',
  });
  
  return await CustomFetch<PaginatedResponse<Product>>(
    `/product?${params.toString()}`,
    {
      method: "GET",
      next: {
        revalidate: 1800, // 30 minutes
        tags: ['products', `shop-${filters.shopId}`],
      },
    }
  );
};
```

### Public vs Protected Actions

```typescript
"use server";

// Public action - no auth required
export const getPublicProducts = async (shopId: string) => {
  return await CustomFetch<PaginatedResponse<Product>>(
    `/product?shopId=${shopId}&published=true`,
    {
      method: "GET",
      next: { revalidate: 3600 },
    }
  );
};

// Protected action - requires auth (handled by backend)
export const getAdminProducts = async (shopId: string, token: string) => {
  return await CustomFetch<PaginatedResponse<Product>>(
    `/product?shopId=${shopId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 0 }, // No cache for admin data
    }
  );
};
```

## Barrel Exports

Always export actions from `index.ts`:

```typescript
// actions/index.ts
export * from "./product-actions";
export * from "./category-actions";
export * from "./order-actions";
export * from "./shop-actions";
export * from "./delivery-actions";
export * from "./landing-page-actions";
```

## Usage in Components

### Server Components

```typescript
// Direct call in server component
import { getProducts } from "@/actions";

export default async function ProductsPage({ 
  params 
}: { 
  params: { domain: string } 
}) {
  const products = await getProducts(params.domain);
  
  return <ProductList products={products?.data || []} />;
}
```

### Client Components

```typescript
"use client";

import { useState, useEffect } from "react";
import { getProducts } from "@/actions";

export const ProductList = ({ shopId }: { shopId: string }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts(shopId);
      setProducts(data?.data || []);
      setLoading(false);
    };
    
    fetchProducts();
  }, [shopId]);
  
  if (loading) return <Loading />;
  
  return <div>{/* render products */}</div>;
};
```

### Form Actions

```typescript
"use client";

import { createOrder } from "@/actions";
import { useTransition } from "react";

export const OrderForm = () => {
  const [isPending, startTransition] = useTransition();
  
  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await createOrder({
        // payload from formData
      });
      
      if (result?.success) {
        // Handle success
      }
    });
  };
  
  return (
    <form action={handleSubmit}>
      {/* form fields */}
      <button disabled={isPending}>
        {isPending ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};
```
