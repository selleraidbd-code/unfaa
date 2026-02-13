# TypeScript Types Rules

## Context
This rule applies to TypeScript type definitions across the project.

## Applies To
- `**/types/**/*.ts`
- `**/*-type.ts` files

## Type Organization

### File Structure

Each domain should have its own type file:

```
types/
├── product-type.ts
├── order-type.ts
├── category-type.ts
├── shop-type.ts
├── user-type.ts
└── index.ts  # Barrel exports
```

### Naming Conventions

#### Type Files
- Suffix with `-type.ts` (e.g., `product-type.ts`, `order-type.ts`)
- Use singular form (e.g., `product-type.ts` not `products-type.ts`)

#### Type Names
- Use PascalCase for all type and interface names
- Suffix main entity types with `Type` (e.g., `ProductType`, `OrderType`)
- Suffix payloads with `Payload` (e.g., `CreateOrderPayload`)
- Suffix responses with `Response` (e.g., `ProductResponse`)
- Use descriptive names (e.g., `UpdateProductPayload` not `ProductUpdate`)

## Entity Type Pattern

### Main Entity Type

```typescript
// product-type.ts

// Main entity type - represents database model
export type Product = {
  id: string;
  shopId: string;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  stock: number;
  images: string[];
  categoryId: string;
  brandId?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  category?: Category;
  brand?: Brand;
  productVariant?: ProductVariant[];
  delivery?: Delivery;
};

// Variant type
export type ProductVariant = {
  id: string;
  productId: string;
  name: string;
  isRequired: boolean;
  options: ProductVariantOption[];
};

export type ProductVariantOption = {
  id: string;
  productVariantId: string;
  value: string;
  extraPrice: number;
  stock: number;
};
```

## Payload Types

### Create Payload

Omit auto-generated fields:

```typescript
// Fields that backend generates
export type ProductCreatePayload = Omit<
  Product, 
  "id" | "createdAt" | "updatedAt" | "category" | "brand"
> & {
  // Override types if needed
  images?: string[]; // Make optional if not required on create
};
```

### Update Payload

Make all fields optional:

```typescript
export type ProductUpdatePayload = Partial<
  Omit<Product, "id" | "createdAt" | "updatedAt">
>;

// Or be more specific
export type ProductUpdatePayload = {
  name?: string;
  description?: string;
  price?: number;
  discountPrice?: number;
  stock?: number;
  isPublished?: boolean;
};
```

### Complex Payloads

```typescript
export type CreateOrderPayload = {
  shopId: string;
  customerName: string;
  customerPhoneNumber: string;
  customerAddress: string;
  deliveryZoneId: string;
  orderStatus: OrderStatus;
  orderSource: OrderSource;
  orderItems: OrderItemPayload[];
  trackingData?: TrackingData;
  discountedPrice?: number | null;
};

export type OrderItemPayload = {
  productId: string;
  quantity: number;
  orderItemVariant: OrderItemVariantPayload[];
};

export type OrderItemVariantPayload = {
  productVariantId: string;
  productVariantOptionId: string;
};
```

## Response Types

### Standard Response

```typescript
export type ResponseObject<T> = {
  success: boolean;
  message: string;
  data: T;
};

// Usage
export type ProductResponse = ResponseObject<Product>;
export type ProductsResponse = ResponseObject<Product[]>;
```

### Paginated Response

```typescript
export type PaginatedResponse<T> = {
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

// Usage
export type PaginatedProducts = PaginatedResponse<Product>;
```

### Error Response

```typescript
export type ErrorResponse = {
  success: false;
  message: string;
  error?: {
    code: string;
    details?: Record<string, any>;
  };
};
```

## Enum Types

### String Enums

Preferred for better type safety:

```typescript
export enum OrderStatus {
  PLACED = "PLACED",
  CONFIRMED = "CONFIRMED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  RETURNED = "RETURNED",
}

export enum OrderSource {
  WEBSITE = "WEBSITE",
  WEBSITE_FACEBOOK = "WEBSITE_FACEBOOK",
  WEBSITE_TIKTOK = "WEBSITE_TIKTOK",
  MANUAL = "MANUAL",
}

export enum METHOD {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  DELETE = "DELETE",
  PUT = "PUT",
}
```

### Union Types (Alternative)

```typescript
export type OrderStatus = 
  | "PLACED"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

// With const assertion for values
export const ORDER_STATUSES = [
  "PLACED",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
] as const;

export type OrderStatus = typeof ORDER_STATUSES[number];
```

## Query Parameter Types

```typescript
export type QueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: string | number | boolean | undefined;
};

// Specific query params
export type ProductQueryParams = QueryParams & {
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  isPublished?: boolean;
};
```

## Interface vs Type

### Use Type For

1. **Union types**
```typescript
export type Status = "active" | "inactive" | "pending";
```

2. **Intersection types**
```typescript
export type EnhancedProduct = Product & { score: number };
```

3. **Utility types**
```typescript
export type PartialProduct = Partial<Product>;
export type ReadonlyProduct = Readonly<Product>;
```

4. **Complex types**
```typescript
export type ProductOrCategory = Product | Category;
```

### Use Interface For

1. **Object shapes that might be extended**
```typescript
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product extends BaseEntity {
  name: string;
  price: number;
}
```

2. **When you need declaration merging** (rare)

## Utility Types

### Common Utility Types

```typescript
// Pick specific fields
export type ProductSummary = Pick<Product, "id" | "name" | "price" | "images">;

// Omit specific fields
export type ProductWithoutTimestamps = Omit<Product, "createdAt" | "updatedAt">;

// Make all fields optional
export type PartialProduct = Partial<Product>;

// Make all fields required
export type CompleteProduct = Required<Product>;

// Make all fields readonly
export type ImmutableProduct = Readonly<Product>;

// Extract type from array
export type ProductImage = Product["images"][number];

// Make some fields required
export type ProductWithRequiredName = Product & Required<Pick<Product, "name">>;
```

### Custom Utility Types

```typescript
// Nullable fields
export type Nullable<T> = T | null;

// Optional fields
export type Optional<T> = T | undefined;

// Deep partial
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Extract ID type
export type ID<T> = T extends { id: infer I } ? I : never;
```

## Generic Types

### Generic Response Types

```typescript
export type ApiResponse<T, E = ErrorResponse> = 
  | { success: true; data: T }
  | { success: false; error: E };

// Usage
export type GetProductResponse = ApiResponse<Product>;
```

### Generic Pagination

```typescript
export type PaginatedData<T> = {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
};

// Usage
export type PaginatedProducts = PaginatedData<Product>;
```

## Form Types

### Form Schema Types

```typescript
import { z } from "zod";

// Define Zod schema
export const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price must be positive"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  images: z.array(z.string()).min(1, "At least one image required"),
});

// Infer TypeScript type from schema
export type ProductFormData = z.infer<typeof productFormSchema>;
```

### Component Props Types

```typescript
import { Control } from "react-hook-form";

export type FormInputProps<T extends Record<string, any>> = {
  control: Control<T>;
  name: keyof T;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
};
```

## Discriminated Unions

### Tagged Unions

```typescript
export type PaymentMethod = 
  | { type: "cash_on_delivery"; }
  | { type: "bank_transfer"; accountNumber: string; }
  | { type: "mobile_banking"; provider: string; number: string; }
  | { type: "card"; last4: string; brand: string; };

// Type narrowing works automatically
function processPayment(payment: PaymentMethod) {
  switch (payment.type) {
    case "cash_on_delivery":
      // No additional fields
      break;
    case "bank_transfer":
      // payment.accountNumber is available
      console.log(payment.accountNumber);
      break;
    case "mobile_banking":
      // payment.provider and payment.number are available
      console.log(payment.provider, payment.number);
      break;
    case "card":
      // payment.last4 and payment.brand are available
      console.log(payment.last4, payment.brand);
      break;
  }
}
```

## Tracking Types

```typescript
export type TrackingData = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  fbclid?: string;
  ttclid?: string;
  clickId?: string;
  eventId?: string;
  phRaw?: string; // Raw phone number for tracking
};

export type TrackingEvent = {
  event: string;
  shopId: string;
  eventId?: string;
  timestamp: string;
  properties?: Record<string, any>;
  trackingData?: TrackingData;
};
```

## Component Prop Types

### React Component Props

```typescript
import { ReactNode, HTMLAttributes } from "react";

// Basic props
export type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
};

// Extending HTML attributes
export type InputProps = HTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  required?: boolean;
};

// Generic component props
export type ListProps<T> = {
  items: T[];
  renderItem: (item: T) => ReactNode;
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
};
```

## Async Types

### Promise Types

```typescript
export type AsyncData<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

export type AsyncFunction<T, P extends any[] = []> = (
  ...args: P
) => Promise<T>;
```

## Redux Types

### RTK Query Types

```typescript
export type TagType = 
  | "Product"
  | "Order"
  | "Category"
  | "Shop"
  | "Customer";

export const tagTypes: TagType[] = [
  "Product",
  "Order",
  "Category",
  "Shop",
  "Customer",
];

// State types
export type RootState = {
  api: any; // RTK Query state
  auth: AuthState;
  ui: UIState;
};

export type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
};
```

## Best Practices

### DO's

1. **Export all types** - Make them reusable
```typescript
export type Product = { /* ... */ };
```

2. **Use descriptive names**
```typescript
// Good
export type CreateProductPayload = { /* ... */ };

// Bad
export type ProductCreate = { /* ... */ };
export type NewProduct = { /* ... */ };
```

3. **Group related types**
```typescript
// product-type.ts contains:
// - Product
// - ProductVariant
// - ProductCreatePayload
// - ProductUpdatePayload
// - etc.
```

4. **Use unions for limited values**
```typescript
export type OrderStatus = "pending" | "confirmed" | "shipped";
```

5. **Document complex types**
```typescript
/**
 * Represents a product in the system
 * @property id - Unique identifier
 * @property name - Product name (required)
 * @property price - Original price
 * @property discountPrice - Discounted price (if any)
 */
export type Product = {
  id: string;
  name: string;
  price: number;
  discountPrice: number;
};
```

### DON'Ts

1. **Don't use `any`** - Use `unknown` or proper types
```typescript
// Bad
export type Response = {
  data: any;
};

// Good
export type Response<T> = {
  data: T;
};
```

2. **Don't duplicate types** - Reuse existing types
```typescript
// Bad
export type ProductId = string;
export type OrderId = string;
export type CategoryId = string;

// Good
export type ID = string;
```

3. **Don't over-nest** - Keep types flat when possible
```typescript
// Bad
export type Product = {
  details: {
    info: {
      name: string;
    };
  };
};

// Good
export type Product = {
  name: string;
};
```

## Barrel Exports

Always create an `index.ts` file to export all types:

```typescript
// types/index.ts
export * from "./product-type";
export * from "./order-type";
export * from "./category-type";
export * from "./shop-type";
export * from "./user-type";
export * from "./tracking-type";

// Usage in other files
import { Product, Order, Category } from "@/types";
```

## Type Guards

### Custom Type Guards

```typescript
export function isProduct(obj: any): obj is Product {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    typeof obj.name === "string" &&
    typeof obj.price === "number"
  );
}

// Usage
if (isProduct(data)) {
  // TypeScript knows data is Product
  console.log(data.name);
}
```

### Discriminated Union Guards

```typescript
export function isErrorResponse(
  response: ResponseObject<any> | ErrorResponse
): response is ErrorResponse {
  return response.success === false;
}
```

## Advanced Patterns

### Conditional Types

```typescript
export type Flatten<T> = T extends Array<infer U> ? U : T;

// Usage
type StringArray = string[];
type FlatString = Flatten<StringArray>; // string
```

### Mapped Types

```typescript
export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type Optional<T> = {
  [P in keyof T]?: T[P];
};

// Usage
type NullableProduct = Nullable<Product>;
type OptionalProduct = Optional<Product>;
```

### Template Literal Types

```typescript
export type HTTPMethod = "GET" | "POST" | "PATCH" | "DELETE";
export type APIEndpoint = `/api/${string}`;

export type HTTPRequest = {
  method: HTTPMethod;
  url: APIEndpoint;
};
```

## Import Conventions

```typescript
// Import types from local types file
import type { Product, ProductCreatePayload } from "@/types/product-type";

// Import from barrel export
import type { Product, Order, Category } from "@/types";

// Import from workspace
import type { ButtonProps } from "@workspace/ui/components/button";
```
