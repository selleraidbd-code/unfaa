# UI Components Rules

## Context
This rule applies to shared UI components in the workspace UI package.

## Applies To
- `packages/ui/src/components/**`

## UI Package Architecture

The UI package provides shared components for all apps in the monorepo.

### Structure
```
packages/ui/src/
├── components/
│   ├── ui/                # Base shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   └── custom/            # Custom form components
│       ├── custom-form-input.tsx
│       ├── custom-form-select.tsx
│       └── ...
├── lib/
│   ├── utils.ts          # cn() utility
│   └── formateDate.ts    # Date formatting
└── styles/
    └── globals.css       # Global Tailwind styles
```

## Base Component Patterns

### shadcn/ui Component Structure

All base components follow this pattern:

```typescript
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@workspace/ui/lib/utils";

// Define variants using CVA
const componentVariants = cva(
  "base-classes", // Base classes always applied
  {
    variants: {
      variant: {
        default: "variant-default-classes",
        destructive: "variant-destructive-classes",
        outline: "variant-outline-classes",
      },
      size: {
        default: "size-default-classes",
        sm: "size-sm-classes",
        lg: "size-lg-classes",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Component props interface
export interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {
  // Additional props
}

// Component implementation
export const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(componentVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

Component.displayName = "Component";
```

## Custom Form Components

### CustomFormInput Pattern

```typescript
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Control, FieldValues, Path, PathValue } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";

type TCustomFormInput<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  placeholder: string;
  description?: string;
  disabled?: boolean;
  defaultValue?: PathValue<T, Path<T>>;
  type?: "email" | "password" | "text" | "number" | "url";
  control: Control<T>;
  required?: boolean;
  min?: number;
  max?: number;
  className?: string;
};

export const CustomFormInput = <T extends FieldValues>({
  label,
  disabled,
  name,
  placeholder,
  type,
  description,
  control,
  defaultValue,
  required,
  min,
  max,
  className,
}: TCustomFormInput<T>) => {
  const [show, setShow] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      rules={{
        required: required ? `${label || name} is required` : false,
      }}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <FormItem className={cn("w-full h-fit", className)}>
          {label && (
            <FormLabel className="gap-1">
              {label}
              {required && <span className="text-red-500">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative">
              <Input
                placeholder={placeholder}
                type={
                  (type === "password" ? (show ? "text" : "password") : type) ||
                  "text"
                }
                {...field}
                value={
                  type === "number"
                    ? field.value
                      ? Number(field.value)
                      : ""
                    : field.value
                }
                onChange={(e) =>
                  field.onChange(
                    type === "number" ? Number(e.target.value) : e.target.value
                  )
                }
                disabled={disabled}
                min={min}
                max={max}
              />
              {type === "password" &&
                (show ? (
                  <Eye
                    onClick={() => setShow((prev) => !prev)}
                    className="absolute right-4 top-[30%] cursor-pointer"
                    size={16}
                  />
                ) : (
                  <EyeOff
                    onClick={() => setShow((prev) => !prev)}
                    className="absolute right-4 top-[30%] cursor-pointer"
                    size={16}
                  />
                ))}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage>{error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
};
```

### CustomFormSelect Pattern

```typescript
import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { cn } from "@workspace/ui/lib/utils";

type Option = {
  id: string;
  name: string;
};

type TCustomFormSelect<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  placeholder: string;
  options: Option[];
  disabled?: boolean;
  control: Control<T>;
  required?: boolean;
  className?: string;
};

export const CustomFormSelect = <T extends FieldValues>({
  name,
  label,
  placeholder,
  options,
  disabled,
  control,
  required,
  className,
}: TCustomFormSelect<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      rules={{
        required: required ? `${label || name} is required` : false,
      }}
      render={({ field }) => (
        <FormItem className={cn("w-full", className)}>
          {label && (
            <FormLabel>
              {label}
              {required && <span className="text-red-500">*</span>}
            </FormLabel>
          )}
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
```

## Component Composition

### Using cn() Utility

Always use the `cn()` utility for conditional classes:

```typescript
import { cn } from "@workspace/ui/lib/utils";

export const Component = ({ className, variant, ...props }: Props) => {
  return (
    <div
      className={cn(
        "base-classes",
        variant === "primary" && "primary-classes",
        variant === "secondary" && "secondary-classes",
        className // User's custom classes override defaults
      )}
      {...props}
    />
  );
};
```

### Forwarding Refs

Always forward refs for better component composition:

```typescript
import * as React from "react";

export const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("base-classes", className)} {...props} />
    );
  }
);

Component.displayName = "Component";
```

## Accessibility

### ARIA Labels

```typescript
<button
  aria-label="Close dialog"
  aria-expanded={isOpen}
  aria-controls="dialog-content"
>
  <X size={16} />
</button>
```

### Keyboard Navigation

```typescript
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === "Escape") {
    onClose();
  }
  if (e.key === "Enter" || e.key === " ") {
    onSelect();
  }
};

<div
  role="button"
  tabIndex={0}
  onKeyDown={handleKeyDown}
  onClick={onClick}
>
  {children}
</div>
```

### Semantic HTML

```typescript
// Good: Use semantic elements
<nav>
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

// Bad: Generic divs
<div>
  <div>
    <div><a href="/">Home</a></div>
  </div>
</div>
```

## Responsive Design

### Mobile-First Classes

```typescript
<div className="
  text-sm md:text-base lg:text-lg
  p-2 md:p-4 lg:p-6
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
">
  {children}
</div>
```

### Container Queries (when needed)

```typescript
<div className="@container">
  <div className="@lg:grid-cols-2 @xl:grid-cols-3">
    {children}
  </div>
</div>
```

## Custom Components

### CustomAlertDialogue

```typescript
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  isLoading?: boolean;
  triggerButton?: React.ReactNode;
};

export const CustomAlertDialogue = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  isLoading,
  triggerButton,
}: Props) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {triggerButton && (
        <AlertDialogTrigger asChild>{triggerButton}</AlertDialogTrigger>
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Processing..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
```

### CustomLoading

```typescript
import { Loader2 } from "lucide-react";

type Props = {
  size?: "sm" | "md" | "lg";
  text?: string;
};

export const CustomLoading = ({ size = "md", text }: Props) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4">
      <Loader2 className={`${sizeClasses[size]} animate-spin`} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
};
```

## Form Components Best Practices

### Type Safety

Always use generic types for form components:

```typescript
type TCustomFormInput<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  // ...
};

export const CustomFormInput = <T extends FieldValues>({...}: TCustomFormInput<T>) => {
  // Implementation
};
```

### Error Display

Show errors below the field:

```typescript
<FormMessage>{error?.message}</FormMessage>
```

### Required Indicator

Show asterisk for required fields:

```typescript
{label && (
  <FormLabel>
    {label}
    {required && <span className="text-red-500">*</span>}
  </FormLabel>
)}
```

## Component Export Pattern

### Named Exports

Always use named exports:

```typescript
// Good
export const Button = ({ ...props }) => { /* ... */ };

// Bad
export default Button;
```

### Barrel Exports

Create index files for easier imports:

```typescript
// components/custom/index.ts
export { CustomFormInput } from "./custom-form-input";
export { CustomFormSelect } from "./custom-form-select";
export { CustomFormTextarea } from "./custom-form-textarea";
// ...

// Usage
import { 
  CustomFormInput, 
  CustomFormSelect 
} from "@workspace/ui/components/custom";
```

## Styling Guidelines

### Tailwind Classes

Use Tailwind utility classes:

```typescript
<div className="flex items-center justify-between gap-4 p-4 rounded-lg border">
  {children}
</div>
```

### Custom Classes (when needed)

Add custom CSS in globals.css:

```css
@layer components {
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-gray-300 rounded-full;
  }
}
```

### Dark Mode Support

Use Tailwind's dark mode classes:

```typescript
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  {children}
</div>
```

## Animation Patterns

### Tailwind Animations

```typescript
<div className="
  transition-all duration-300 ease-in-out
  hover:scale-105 hover:shadow-lg
">
  {children}
</div>
```

### Custom Animations

```css
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
```

## Component Testing Considerations

### Testable Props

Design components with testing in mind:

```typescript
type Props = {
  onSubmit: (data: FormData) => void; // Easy to mock
  isLoading?: boolean; // Easy to test different states
  testId?: string; // For testing
};

<button data-testid={testId} onClick={handleClick}>
  {isLoading ? "Loading..." : "Submit"}
</button>
```

## Performance Optimization

### React.memo

Memoize expensive components:

```typescript
import { memo } from "react";

export const ExpensiveComponent = memo(({ data }: Props) => {
  // Expensive rendering logic
  return <div>{/* ... */}</div>;
});
```

### Lazy Loading

```typescript
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./heavy-component"), {
  loading: () => <CustomLoading />,
  ssr: false, // Disable SSR if needed
});
```

## Best Practices

1. **Always forward refs** for better composition
2. **Use cn() utility** for conditional classes
3. **Export named components** not default
4. **Type everything** with TypeScript
5. **Support all variants** (sizes, colors, states)
6. **Include accessibility** (ARIA labels, keyboard nav)
7. **Mobile-first design** with responsive classes
8. **Show loading states** in buttons/forms
9. **Display errors clearly** below inputs
10. **Keep components focused** - single responsibility

## Common Component Types

### Button Variants

```typescript
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

### Input Types

```typescript
<Input type="text" placeholder="Text input" />
<Input type="email" placeholder="Email" />
<Input type="password" placeholder="Password" />
<Input type="number" placeholder="Number" />
<Input type="tel" placeholder="Phone" />
<Input type="url" placeholder="URL" />
```

### Dialog Sizes

```typescript
<DialogContent className="max-w-sm">Small</DialogContent>
<DialogContent className="max-w-lg">Medium</DialogContent>
<DialogContent className="max-w-2xl">Large</DialogContent>
<DialogContent className="max-w-4xl">Extra Large</DialogContent>
```

## Utils Library

### cn() Utility

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Date Formatting

```typescript
export const formatDate = (
  date: string | Date,
  format: "short" | "long" = "short"
): string => {
  const d = new Date(date);
  
  if (format === "short") {
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
```

## Package Usage

### Importing Components

```typescript
// From apps
import { Button } from "@workspace/ui/components/button";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { cn } from "@workspace/ui/lib/utils";
import "@workspace/ui/styles/globals.css"; // In layout/app
```

### Adding New Components

```bash
# From app directory
pnpm dlx shadcn@latest add button -c apps/web
# Components are added to packages/ui automatically
```
