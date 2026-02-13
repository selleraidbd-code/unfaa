# Portal Features Rules

## Context
This rule applies to feature modules in the Portal app.

## Applies To
- `apps/portal/src/features/**`

## Feature Module Architecture

Each feature is a self-contained module with related components, hooks, and logic.

### Typical Feature Structure
```
features/
├── products/
│   ├── product-list.tsx          # Main list view
│   ├── product-details.tsx       # Detail view
│   ├── create-product-dialog.tsx # Create dialog
│   ├── update-product-dialog.tsx # Update dialog
│   ├── product-card.tsx          # Card component
│   └── use-product-form.ts       # Custom hook
```

## Form Patterns

### React Hook Form + Zod

All forms use React Hook Form with Zod validation:

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@workspace/ui/components/form";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";

// 1. Define Zod schema
const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.number().min(0, "Price must be positive"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
});

type ProductFormData = z.infer<typeof productSchema>;

// 2. Create form component
export const ProductForm = ({ defaultValues, onSubmit }: Props) => {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues || {
      name: "",
      price: 0,
      description: "",
      categoryId: "",
    },
  });

  const handleSubmit = async (data: ProductFormData) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <CustomFormInput
          control={form.control}
          name="name"
          label="Product Name"
          placeholder="Enter product name"
          required
        />
        
        <CustomFormInput
          control={form.control}
          name="price"
          label="Price"
          placeholder="0"
          type="number"
          min={0}
          required
        />
        
        <CustomFormSelect
          control={form.control}
          name="categoryId"
          label="Category"
          placeholder="Select category"
          options={categories}
          required
        />
        
        <CustomFormTextarea
          control={form.control}
          name="description"
          label="Description"
          placeholder="Enter description"
        />
        
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
};
```

## Custom Form Components

### Available Components (from `@workspace/ui`)

1. **CustomFormInput** - Text, email, password, number, url inputs
2. **CustomFormSelect** - Single select dropdown
3. **CustomFormMultiSelect** - Multiple selection
4. **CustomFormSearchSelect** - Searchable select
5. **CustomFormSearchMultiSelect** - Searchable multi-select
6. **CustomFormTextarea** - Multi-line text
7. **CustomFormSwitch** - Toggle switch
8. **CustomFormOTPInput** - OTP input fields

### Usage Example
```typescript
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";

<CustomFormInput
  control={form.control}
  name="email"
  type="email"
  label="Email Address"
  placeholder="user@example.com"
  description="We'll never share your email"
  required
  disabled={isLoading}
/>
```

### Form Select Options
```typescript
const options = [
  { id: "1", name: "Option 1" },
  { id: "2", name: "Option 2" },
];

<CustomFormSelect
  control={form.control}
  name="optionId"
  label="Choose Option"
  placeholder="Select an option"
  options={options}
  required
/>
```

## Dialog Patterns

### Create Dialog

```typescript
"use client";

import { useState } from "react";
import { useCreateProductMutation } from "@/redux/api/product-api";
import { toast } from "@workspace/ui/components/sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";

export const CreateProductDialog = () => {
  const [open, setOpen] = useState(false);
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const handleSubmit = async (data: ProductFormData) => {
    try {
      await createProduct(data).unwrap();
      toast.success("Product created successfully");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to create product");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Product</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
        </DialogHeader>
        <ProductForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
};
```

### Update Dialog

```typescript
export const UpdateProductDialog = ({ product }: { product: Product }) => {
  const [open, setOpen] = useState(false);
  const [updateProduct] = useUpdateProductMutation();

  const handleSubmit = async (data: ProductFormData) => {
    try {
      await updateProduct({ 
        id: product.id, 
        payload: data 
      }).unwrap();
      toast.success("Product updated successfully");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Edit</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Product</DialogTitle>
        </DialogHeader>
        <ProductForm 
          defaultValues={product} 
          onSubmit={handleSubmit} 
        />
      </DialogContent>
    </Dialog>
  );
};
```

## Data Table Patterns

### Using Tanstack Table

```typescript
import { useGetProductsQuery } from "@/redux/api/product-api";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";

export const ProductList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  
  const { data, isLoading } = useGetProductsQuery({
    page,
    limit: 10,
    search,
  });

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <CreateProductDialog />
      </div>
      
      <DataTable
        columns={columns}
        data={data?.data || []}
        pagination={{
          page,
          total: data?.meta.total || 0,
          onPageChange: setPage,
        }}
      />
    </div>
  );
};
```

### Table Columns

```typescript
import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/types/product-type";
import { UpdateProductDialog } from "./update-product-dialog";
import { DeleteButton } from "./delete-button";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => `৳${row.original.price}`,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <UpdateProductDialog product={row.original} />
        <DeleteButton productId={row.original.id} />
      </div>
    ),
  },
];
```

## Loading States

### Skeleton Loading
```typescript
import { Skeleton } from "@workspace/ui/components/skeleton";

export const ProductCardSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-40 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
  </div>
);

// Usage
{isLoading ? (
  <div className="grid grid-cols-3 gap-4">
    {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
  </div>
) : (
  <ProductGrid products={data?.data} />
)}
```

### Custom Loading Component
```typescript
import { CustomLoading } from "@workspace/ui/components/custom/custom-loading";

{isLoading && <CustomLoading />}
```

## Alert Dialogs

### Confirmation Dialog

```typescript
import { useState } from "react";
import { useDeleteProductMutation } from "@/redux/api/product-api";
import { CustomAlertDialogue } from "@workspace/ui/components/custom/custom-alert-dialogue";
import { toast } from "@workspace/ui/components/sonner";

export const DeleteProductButton = ({ productId }: { productId: string }) => {
  const [open, setOpen] = useState(false);
  const [deleteProduct, { isLoading }] = useDeleteProductMutation();

  const handleDelete = async () => {
    try {
      await deleteProduct({ id: productId }).unwrap();
      toast.success("Product deleted successfully");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <CustomAlertDialogue
      open={open}
      onOpenChange={setOpen}
      title="Delete Product"
      description="Are you sure? This action cannot be undone."
      onConfirm={handleDelete}
      isLoading={isLoading}
      triggerButton={
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      }
    />
  );
};
```

## Custom Hooks

### Form Hooks

```typescript
// use-product-form.ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateProductMutation } from "@/redux/api/product-api";

export const useProductForm = (defaultValues?: ProductFormData) => {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });
  
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const onSubmit = async (data: ProductFormData) => {
    try {
      await createProduct(data).unwrap();
      toast.success("Product created");
      form.reset();
    } catch (error) {
      toast.error("Failed to create product");
    }
  };

  return {
    form,
    onSubmit,
    isLoading,
  };
};

// Usage in component
const { form, onSubmit, isLoading } = useProductForm();
```

## File Upload Patterns

### Image Upload

```typescript
import { useState } from "react";
import Dropzone from "react-dropzone";
import { useUploadMediaMutation } from "@/redux/api/media-api";

export const ImageUpload = ({ onUpload }: { onUpload: (url: string) => void }) => {
  const [uploadMedia] = useUploadMediaMutation();
  const [uploading, setUploading] = useState(false);

  const handleDrop = async (files: File[]) => {
    if (!files[0]) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", files[0]);
      
      const response = await uploadMedia(formData).unwrap();
      onUpload(response.data.url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dropzone onDrop={handleDrop} accept={{ "image/*": [] }}>
      {({ getRootProps, getInputProps }) => (
        <div {...getRootProps()} className="border-2 border-dashed p-4">
          <input {...getInputProps()} />
          {uploading ? <p>Uploading...</p> : <p>Drop image here</p>}
        </div>
      )}
    </Dropzone>
  );
};
```

## Toast Notifications

Always use Sonner toast for user feedback:

```typescript
import { toast } from "@workspace/ui/components/sonner";

// Success
toast.success("Product created successfully");

// Error
toast.error("Failed to create product");

// Info
toast.info("Processing your request");

// Warning
toast.warning("Stock is low");

// Loading
const toastId = toast.loading("Creating product...");
// Later
toast.dismiss(toastId);
```

## Error Handling

### API Errors
```typescript
try {
  await createProduct(data).unwrap();
  toast.success("Success");
} catch (err) {
  if ('data' in err && typeof err.data === 'object' && err.data !== null) {
    const errorData = err.data as { message?: string };
    toast.error(errorData.message || "An error occurred");
  } else {
    toast.error("An unexpected error occurred");
  }
}
```

### Form Validation Errors
```typescript
// Handled automatically by React Hook Form
// Custom error display
{form.formState.errors.name && (
  <p className="text-sm text-red-500">
    {form.formState.errors.name.message}
  </p>
)}
```

## Responsive Design

### Mobile-First Approach
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {products.map(product => <ProductCard key={product.id} {...product} />)}
</div>
```

### Responsive Dialogs
```typescript
<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
  {/* Content */}
</DialogContent>
```

## Component Organization

### Page Component Structure
```typescript
// Feature page component
export const ProductsPage = () => {
  // State
  const [filters, setFilters] = useState({});
  
  // Queries
  const { data, isLoading } = useGetProductsQuery(filters);
  
  // Handlers
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  // Render
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <CreateProductDialog />
      </div>
      
      <ProductFilters onFilterChange={handleFilterChange} />
      
      {isLoading ? (
        <LoadingState />
      ) : (
        <ProductList products={data?.data} />
      )}
    </div>
  );
};
```

## Best Practices

1. **Always use "use client"** for interactive components
2. **Extract complex forms** into separate components
3. **Use custom form components** from workspace UI
4. **Show loading states** for all async operations
5. **Handle errors gracefully** with toast notifications
6. **Validate on both client and server** (client: Zod, server: backend)
7. **Keep dialogs responsive** with max-width and overflow
8. **Use TypeScript strictly** - no any types
9. **Extract reusable logic** into custom hooks
10. **Follow naming conventions** - {Entity}{Action}Dialog pattern

## Common Patterns

### Bulk Operations
```typescript
const [selectedIds, setSelectedIds] = useState<string[]>([]);
const [bulkDelete] = useBulkDeleteMutation();

const handleBulkDelete = async () => {
  await bulkDelete({ ids: selectedIds }).unwrap();
  setSelectedIds([]);
};
```

### Dependent Queries
```typescript
const { data: category } = useGetCategoryByIdQuery(
  { id: categoryId },
  { skip: !categoryId }
);

const { data: products } = useGetProductsQuery(
  { categoryId },
  { skip: !categoryId }
);
```

### Prefetching
```typescript
const dispatch = useAppDispatch();

const handleHover = (productId: string) => {
  dispatch(
    productApi.util.prefetch('getProductById', { id: productId }, { force: false })
  );
};
```
