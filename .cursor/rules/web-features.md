# Web Features Rules

## Context
This rule applies to feature components in the Web app (customer-facing storefront).

## Applies To
- `apps/web/src/features/**`

## Feature Architecture

The Web app features are organized by domain functionality.

### Feature Structure
```
features/
├── product/
│   ├── components/          # Product-specific components
│   │   ├── product-view-tracker.tsx
│   │   ├── order-section.tsx
│   │   ├── package-selector.tsx
│   │   └── delivery-zone-selector.tsx
│   └── hooks/
│       └── use-order-form.ts
├── shop/
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout flow
│   ├── home-page/          # Shop homepage
│   ├── landing-page/       # Landing pages
│   └── products/           # Product listing/details
└── landing/                # Landing page components
```

## Client Components

All interactive components must have `"use client"` directive:

```typescript
"use client";

import { useState } from "react";

export const InteractiveComponent = () => {
  const [state, setState] = useState();
  
  return <div>{/* JSX */}</div>;
};
```

## Custom Hooks Pattern

### Order Form Hook (use-order-form.ts)

The order form hook is a comprehensive example of managing form state, validation, and submission:

```typescript
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@workspace/ui/components/sonner";

type FormData = {
  name: string;
  address: string;
  phone: string;
};

type FormErrors = {
  name?: string;
  address?: string;
  phone?: string;
};

export const useOrderForm = (product: Product, shopSlug: string) => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    address: "",
    phone: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, Option>>({});

  // Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('checkout-form');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error on input
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "নাম লিখুন";
    if (!formData.address.trim()) newErrors.address = "ঠিকানা লিখুন";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        body: JSON.stringify({ ...formData, productId: product.id }),
      });
      
      if (!response.ok) {
        toast.error("অর্ডার তৈরিতে সমস্যা হয়েছে");
        return;
      }
      
      // Save form data
      localStorage.setItem('checkout-form', JSON.stringify(formData));
      
      toast.success("অর্ডার সফলভাবে সম্পন্ন হয়েছে! ✅");
      router.push(`/${shopSlug}/order-success`);
    } catch (error) {
      console.error("Error:", error);
      toast.error("অর্ডার তৈরিতে সমস্যা হয়েছে");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    selectedVariants,
    handleInputChange,
    setSelectedVariants,
    handleSubmit,
  };
};
```

## Form Components

### Simple Form Pattern (No React Hook Form)

```typescript
"use client";

import { useState } from "react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";

type FormData = {
  name: string;
  phone: string;
  address: string;
};

export const OrderForm = ({ onSubmit }: { onSubmit: (data: FormData) => void }) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "নাম লিখুন";
    if (!formData.phone.trim()) newErrors.phone = "ফোন নাম্বার লিখুন";
    if (!formData.address.trim()) newErrors.address = "ঠিকানা লিখুন";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="আপনার নাম"
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
      </div>
      
      <div>
        <Input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="ফোন নাম্বার"
        />
        {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
      </div>
      
      <div>
        <Input
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="ঠিকানা"
        />
        {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
      </div>
      
      <Button type="submit" className="w-full">
        অর্ডার করুন
      </Button>
    </form>
  );
};
```

## Product Variant Selection

### Variant Selector Component

```typescript
"use client";

import { ProductVariant, ProductVariantOption } from "@/types/product-type";

type Props = {
  variants: ProductVariant[];
  selectedVariants: Record<string, ProductVariantOption>;
  onVariantChange: (variantId: string, option: ProductVariantOption) => void;
};

export const ProductVariants = ({ 
  variants, 
  selectedVariants, 
  onVariantChange 
}: Props) => {
  return (
    <div className="space-y-4">
      {variants.map((variant) => (
        <div key={variant.id}>
          <label className="text-sm font-medium">
            {variant.name}
            {variant.isRequired && <span className="text-red-500">*</span>}
          </label>
          
          <div className="flex gap-2 mt-2 flex-wrap">
            {variant.options?.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => onVariantChange(variant.id, option)}
                className={`
                  px-4 py-2 border rounded-md transition-colors
                  ${
                    selectedVariants[variant.id]?.id === option.id
                      ? "border-primary bg-primary text-white"
                      : "border-gray-300 hover:border-primary"
                  }
                `}
              >
                {option.value}
                {option.extraPrice > 0 && (
                  <span className="ml-1 text-xs">
                    (+৳{option.extraPrice})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
```

## Tracking Implementation

### Page View Tracking

```typescript
"use client";

import { useEffect } from "react";
import { trackEventToBackend } from "@/lib/tracking-events";

export const PageViewTracker = ({ 
  shopId, 
  pageType 
}: { 
  shopId: string; 
  pageType: string;
}) => {
  useEffect(() => {
    // Track page view
    trackEventToBackend({
      event: "PageView",
      shopId,
      pageType,
      timestamp: new Date().toISOString(),
    });
  }, [shopId, pageType]);

  return null; // This component doesn't render anything
};
```

### Product View Tracking

```typescript
"use client";

import { useEffect } from "react";
import { trackTikTokPixel } from "@/lib/tracking-utils";
import { Product } from "@/types/product-type";

export const ProductViewTracker = ({ 
  product, 
  shopId 
}: { 
  product: Product; 
  shopId: string;
}) => {
  useEffect(() => {
    // Track product view for TikTok
    trackTikTokPixel("ViewContent", {
      content_type: "product",
      content_id: product.id,
      content_name: product.name,
      value: product.discountPrice,
      currency: "BDT",
    });
  }, [product]);

  return null;
};
```

## Shopping Cart Patterns

### Cart Context

```typescript
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type CartItem = {
  productId: string;
  quantity: number;
  variantOptions: Record<string, string>;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
```

## Local Storage Patterns

### Persistent Form Data

```typescript
"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "checkout-form";

type FormData = {
  name: string;
  phone: string;
  address: string;
};

export const useCheckoutForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    address: "",
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to parse saved form data:", error);
      }
    }
  }, []);

  // Save to localStorage on change
  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => {
      const updated = { ...prev, ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearFormData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setFormData({ name: "", phone: "", address: "" });
  };

  return {
    formData,
    updateFormData,
    clearFormData,
  };
};
```

### Order Limit Tracking

```typescript
"use client";

export const useOrderDataManageLocally = () => {
  const MAX_ORDERS_PER_PHONE = 3;
  const RESET_HOURS = 24;

  const checkOrderLimit = (phoneNumber: string) => {
    const key = `order-count-${phoneNumber}`;
    const data = localStorage.getItem(key);
    
    if (!data) {
      return { isLimitReached: false, count: 0 };
    }
    
    const { count, timestamp } = JSON.parse(data);
    const hoursPassed = (Date.now() - timestamp) / (1000 * 60 * 60);
    
    if (hoursPassed >= RESET_HOURS) {
      localStorage.removeItem(key);
      return { isLimitReached: false, count: 0 };
    }
    
    return {
      isLimitReached: count >= MAX_ORDERS_PER_PHONE,
      count,
    };
  };

  const incrementOrderCount = (phoneNumber: string) => {
    const key = `order-count-${phoneNumber}`;
    const data = localStorage.getItem(key);
    
    const current = data ? JSON.parse(data) : { count: 0, timestamp: Date.now() };
    
    localStorage.setItem(
      key,
      JSON.stringify({
        count: current.count + 1,
        timestamp: current.timestamp || Date.now(),
      })
    );
  };

  return {
    checkOrderLimit,
    incrementOrderCount,
  };
};
```

## Dialog Components

### Buy Now Dialog

```typescript
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";

export const BuyNowDialog = ({ product }: { product: Product }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">এখনই কিনুন</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>অর্ডার করুন</DialogTitle>
        </DialogHeader>
        <OrderForm 
          product={product} 
          onSuccess={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};
```

## Image Gallery

### Product Image Gallery

```typescript
"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@workspace/ui/components/dialog";

export const ProductImageGallery = ({ images }: { images: string[] }) => {
  const [selectedImage, setSelectedImage] = useState(images[0] || "");
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      {/* Main Image */}
      <div 
        className="aspect-square relative cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <Image
          src={selectedImage}
          alt="Product"
          fill
          className="object-cover rounded-lg"
        />
      </div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-4 gap-2 mt-4">
        {images.map((image, index) => (
          <div
            key={index}
            className={`
              aspect-square relative cursor-pointer border-2 rounded-md
              ${selectedImage === image ? "border-primary" : "border-transparent"}
            `}
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image}
              alt={`Product ${index + 1}`}
              fill
              className="object-cover rounded-md"
            />
          </div>
        ))}
      </div>

      {/* Fullscreen Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl">
          <div className="relative aspect-square">
            <Image
              src={selectedImage}
              alt="Product"
              fill
              className="object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
```

## Contact Buttons

### Floating Contact Buttons

```typescript
"use client";

import { Phone, MessageCircle } from "lucide-react";

export const ContactButtons = ({ 
  phoneNumber, 
  whatsappNumber 
}: { 
  phoneNumber?: string; 
  whatsappNumber?: string;
}) => {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      {phoneNumber && (
        <a
          href={`tel:${phoneNumber}`}
          className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors"
        >
          <Phone size={24} />
        </a>
      )}
      
      {whatsappNumber && (
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors"
        >
          <MessageCircle size={24} />
        </a>
      )}
    </div>
  );
};
```

## Loading States

### Skeleton Loaders

```typescript
import { Skeleton } from "@workspace/ui/components/skeleton";

export const ProductCardSkeleton = () => (
  <div className="border rounded-lg p-4 space-y-4">
    <Skeleton className="aspect-square w-full" />
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-10 w-full" />
  </div>
);

export const ProductListSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {[...Array(8)].map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);
```

## Best Practices

1. **Always use "use client"** for interactive components
2. **Use custom hooks** for complex state logic
3. **Implement proper validation** for all forms
4. **Handle loading states** with skeletons or spinners
5. **Track user events** for analytics (TikTok, Facebook)
6. **Persist form data** in localStorage for better UX
7. **Use Bengali text** for customer-facing content
8. **Optimize images** with Next.js Image component
9. **Mobile-first design** - most users are on mobile
10. **Error handling** with user-friendly messages in Bengali

## Common Patterns

### Conditional Rendering

```typescript
{isLoading ? (
  <LoadingSkeleton />
) : error ? (
  <ErrorState />
) : data?.length === 0 ? (
  <EmptyState />
) : (
  <DataDisplay data={data} />
)}
```

### Responsive Grid

```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {items.map(item => <ItemCard key={item.id} {...item} />)}
</div>
```

### Phone Number Formatting

```typescript
import { formatPhoneNumber } from "@/lib/format-number-utils";

const normalizedPhone = formatPhoneNumber(phoneInput); // Removes +88, spaces, etc.
```

### Price Display

```typescript
const formatPrice = (price: number) => `৳${price.toLocaleString('bn-BD')}`;
```

## Multi-tenant Link Generation

```typescript
import { getLink } from "@/lib/get-link";

// Generate shop-specific links
const productLink = getLink({
  shopSlug: "my-shop",
  path: "/products/123",
});
// Result: /my-shop/products/123
```
