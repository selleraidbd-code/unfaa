# Portal Redux Rules

## Context
This rule applies to Redux-related files in the Portal app.

## Applies To
- `apps/portal/src/redux/**`

## State Management Architecture

### Store Structure
The Portal app uses Redux Toolkit with the following structure:
```
redux/
├── api/              # RTK Query API endpoints
├── slices/           # Redux slices for local state
├── listeners/        # Redux listeners for side effects
├── store/            # Store configuration
└── type.ts          # Shared Redux types
```

### Base API Configuration

The base API is configured with:
- Automatic token refresh on 401 errors
- Authorization header injection
- 2-minute timeout
- Retry logic disabled (maxRetries: 0)

**Location**: `apps/portal/src/redux/api/index.ts`

## RTK Query Patterns

### Creating API Endpoints

Always use `api.injectEndpoints()` to extend the base API:

```typescript
import { api } from "@/redux/api";
import { METHOD, PaginatedResponse, QueryParams, ResponseObject, TagType } from "@/redux/type";
import { EntityType, CreatePayload, UpdatePayload } from "@/types/entity-type";

const entityApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Query endpoints (GET)
    getEntities: builder.query<PaginatedResponse<EntityType>, QueryParams>({
      query: (queryParams) => ({
        url: '/entity',
        method: METHOD.GET,
        params: queryParams,
      }),
      providesTags: [TagType.Entity],
    }),
    
    getEntityById: builder.query<ResponseObject<EntityType>, { id: string }>({
      query: ({ id }) => ({
        url: `/entity/${id}`,
        method: METHOD.GET,
      }),
      providesTags: [TagType.Entity],
    }),
    
    // Mutation endpoints (POST, PATCH, DELETE)
    createEntity: builder.mutation<void, CreatePayload>({
      query: (payload) => ({
        url: '/entity',
        method: METHOD.POST,
        body: payload,
      }),
      invalidatesTags: [TagType.Entity],
    }),
    
    updateEntity: builder.mutation<void, { id: string; payload: Partial<UpdatePayload> }>({
      query: ({ id, payload }) => ({
        url: `/entity/${id}`,
        method: METHOD.PATCH,
        body: payload,
      }),
      invalidatesTags: [TagType.Entity],
    }),
    
    deleteEntity: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/entity/${id}`,
        method: METHOD.DELETE,
      }),
      invalidatesTags: [TagType.Entity],
    }),
  }),
});

// Export hooks
export const {
  useGetEntitiesQuery,
  useGetEntityByIdQuery,
  useLazyGetEntityByIdQuery,
  useCreateEntityMutation,
  useUpdateEntityMutation,
  useDeleteEntityMutation,
} = entityApi;
```

### Key Conventions

#### File Naming
- API files: `{entity}-api.ts` (e.g., `product-api.ts`, `order-api.ts`)
- Slice files: `{entity}-slice.ts`

#### Endpoint Naming
- Queries: `get{Entity}`, `get{Entity}ById`, `get{Entity}By{Criteria}`
- Mutations: `create{Entity}`, `update{Entity}`, `delete{Entity}`

#### Hook Exports
Always export the generated hooks at the bottom of the file:
```typescript
export const {
  useGetProductsQuery,          // Auto-fetch query
  useLazyGetProductsQuery,      // Manual trigger query
  useCreateProductMutation,     // Mutation
} = productApi;
```

## Method Types

Use the `METHOD` enum from `@/redux/type`:
```typescript
enum METHOD {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  DELETE = "DELETE",
}
```

## Response Types

### Standard Response
```typescript
type ResponseObject<T> = {
  success: boolean;
  message: string;
  data: T;
};
```

### Paginated Response
```typescript
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

### Query Parameters
```typescript
type QueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: any;
};
```

## Tag Types for Cache Invalidation

Add new tag types to `apps/portal/src/redux/type.ts`:

```typescript
export enum TagType {
  Product = "Product",
  Order = "Order",
  Category = "Category",
  // Add new tags here
}

export const tagTypes = Object.values(TagType);
```

### Cache Invalidation Rules

- **Queries**: Use `providesTags` to mark data
- **Mutations**: Use `invalidatesTags` to clear cache
- Invalidating a tag refetches all queries with that tag

## Redux Slices

### Creating Slices

```typescript
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SliceState = {
  // State shape
};

const initialState: SliceState = {
  // Initial values
};

const entitySlice = createSlice({
  name: "entity",
  initialState,
  reducers: {
    setEntity: (state, action: PayloadAction<EntityType>) => {
      state.entity = action.payload;
    },
    clearEntity: (state) => {
      state.entity = null;
    },
  },
});

export const { setEntity, clearEntity } = entitySlice.actions;
export default entitySlice.reducer;
```

### Async Thunks

For complex async logic:
```typescript
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchEntityThunk = createAsyncThunk(
  "entity/fetch",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/entity/${id}`);
      return await response.json();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
```

## Redux Persist

For persisting state across sessions:

```typescript
import { persistReducer } from "redux-persist";
import { storage } from "./storage";

const persistConfig = {
  key: "unfaa_entity",
  storage: storage,
  whitelist: ["field1", "field2"], // Fields to persist
};

const persistedReducer = persistReducer(persistConfig, entityReducer);
```

## Using Redux in Components

### Queries
```typescript
import { useGetProductsQuery } from "@/redux/api/product-api";

const Component = () => {
  const { data, isLoading, error, refetch } = useGetProductsQuery({ 
    page: 1, 
    limit: 10 
  });
  
  if (isLoading) return <Loading />;
  if (error) return <Error />;
  
  return <div>{data?.data.map(item => ...)}</div>;
};
```

### Lazy Queries
```typescript
const [trigger, result] = useLazyGetProductByIdQuery();

const handleClick = async (id: string) => {
  const response = await trigger({ id });
  // Handle response
};
```

### Mutations
```typescript
const [createProduct, { isLoading }] = useCreateProductMutation();

const handleSubmit = async (data: CreatePayload) => {
  try {
    await createProduct(data).unwrap();
    toast.success("Product created successfully");
  } catch (error) {
    toast.error("Failed to create product");
  }
};
```

### Selectors
```typescript
import { useAppSelector } from "@/redux/store/hook";

const accessToken = useAppSelector((state) => state.auth.accessToken);
```

### Dispatch
```typescript
import { useAppDispatch } from "@/redux/store/hook";
import { setEntity } from "@/redux/slices/entity-slice";

const dispatch = useAppDispatch();
dispatch(setEntity(data));
```

## Error Handling

### API Errors
RTK Query errors are automatically typed:
```typescript
const { error } = useGetProductsQuery();

if (error) {
  if ('status' in error) {
    // FetchBaseQueryError
    const errMsg = 'error' in error ? error.error : JSON.stringify(error.data);
  } else {
    // SerializedError
    const errMsg = error.message;
  }
}
```

### Mutation Errors
```typescript
try {
  await createProduct(data).unwrap();
} catch (err) {
  if ('data' in err) {
    toast.error(err.data.message);
  } else {
    toast.error("An unexpected error occurred");
  }
}
```

## Token Refresh Flow

The base query automatically handles token refresh:
1. Request fails with 401
2. Attempts to refresh using refresh token
3. If successful, retries original request
4. If failed, logs out user and shows error

## Best Practices

1. **Always export hooks** - Never use `.endpoints.{name}.useQuery()` directly
2. **Use specific types** - Avoid `any` for response types
3. **Tag properly** - Use specific tags for fine-grained cache control
4. **Handle loading states** - Always show loading indicators
5. **Error messages** - Show user-friendly error messages
6. **Optimistic updates** - Use for better UX when appropriate
7. **Lazy queries** - Use for conditional/manual fetching
8. **Avoid over-fetching** - Use query params to limit data
9. **Invalidate wisely** - Only invalidate what's necessary
10. **Type everything** - Leverage TypeScript for safety

## Common Patterns

### Conditional Queries
```typescript
const { data } = useGetProductQuery(
  { id },
  { skip: !id } // Skip if no id
);
```

### Polling
```typescript
const { data } = useGetOrdersQuery(undefined, {
  pollingInterval: 30000, // Poll every 30 seconds
});
```

### Transforming Response
```typescript
getProducts: builder.query({
  query: () => '/products',
  transformResponse: (response: RawResponse) => response.data,
}),
```

### Optimistic Updates
```typescript
updateProduct: builder.mutation({
  query: ({ id, ...patch }) => ({
    url: `/product/${id}`,
    method: 'PATCH',
    body: patch,
  }),
  async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
    const patchResult = dispatch(
      productApi.util.updateQueryData('getProducts', undefined, (draft) => {
        const product = draft.data.find(p => p.id === id);
        if (product) Object.assign(product, patch);
      })
    );
    try {
      await queryFulfilled;
    } catch {
      patchResult.undo();
    }
  },
}),
```

## File Structure

```typescript
// {entity}-api.ts
import { api } from "@/redux/api";
import { METHOD, /* types */ } from "@/redux/type";
import { /* entity types */ } from "@/types/{entity}-type";

const entityApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoints
  }),
});

export const { /* hooks */ } = entityApi;
```

## Integration with Components

Always use typed hooks from `@/redux/store/hook`:
```typescript
import { useAppDispatch, useAppSelector } from "@/redux/store/hook";
```

Never use raw Redux hooks:
```typescript
// ❌ Don't do this
import { useDispatch, useSelector } from "react-redux";

// ✅ Do this
import { useAppDispatch, useAppSelector } from "@/redux/store/hook";
```
