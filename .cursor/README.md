# Cursor AI Configuration Guide

This directory contains configuration files that help Cursor AI provide better code suggestions and maintain consistency across your project.

## Files Overview

### Root Level

#### `.cursorrules`
Global coding standards and conventions that apply across the entire project.
- TypeScript conventions
- Naming patterns
- Import organization
- Code style preferences
- General best practices

#### `PROJECT_CONTEXT.md`
High-level project architecture and overview.
- Monorepo structure
- Tech stack details
- App responsibilities (portal vs web)
- State management approaches
- Development workflow

### Context-Specific Rules (`.cursor/rules/`)

These rules automatically activate based on the file you're editing:

#### `portal-redux.md`
**Activates in:** `apps/portal/src/redux/**`

Covers:
- RTK Query endpoint patterns
- Redux slice creation
- Cache invalidation strategies
- Token refresh flow
- Error handling in Redux

#### `portal-features.md`
**Activates in:** `apps/portal/src/features/**`

Covers:
- React Hook Form + Zod patterns
- Custom form components usage
- Dialog patterns (create/update)
- Data table implementation
- Loading and error states

#### `web-server-actions.md`
**Activates in:** `apps/web/src/actions/**`

Covers:
- Next.js Server Actions patterns
- CustomFetch utility usage
- Caching strategies
- Revalidation patterns
- Error handling in server actions

#### `web-features.md`
**Activates in:** `apps/web/src/features/**`

Covers:
- Client component patterns
- Custom hooks for forms
- Local storage management
- Tracking implementation
- Shopping cart patterns

#### `ui-components.md`
**Activates in:** `packages/ui/src/components/**`

Covers:
- shadcn/ui component patterns
- Custom form component creation
- Component composition with cn()
- Accessibility standards
- Responsive design patterns

#### `types.md`
**Activates in:** `**/types/**/*.ts` and `**/*-type.ts`

Covers:
- Type naming conventions
- Entity type patterns
- Payload type creation
- Response type patterns
- Enum and union types

## How It Works

### Automatic Context Loading

Cursor AI automatically loads relevant rules based on your current file location:

1. **Global Rules** (`.cursorrules` + `PROJECT_CONTEXT.md`) - Always active
2. **Context Rules** (`.cursor/rules/*.md`) - Activate when path matches

### Example Workflow

**Working on Portal Redux API:**
```
File: apps/portal/src/redux/api/product-api.ts

Active Rules:
✓ .cursorrules (global standards)
✓ PROJECT_CONTEXT.md (project overview)
✓ portal-redux.md (Redux patterns)
✓ types.md (type conventions)
```

**Working on Web Features:**
```
File: apps/web/src/features/product/components/order-section.tsx

Active Rules:
✓ .cursorrules (global standards)
✓ PROJECT_CONTEXT.md (project overview)
✓ web-features.md (client patterns)
```

**Working on UI Components:**
```
File: packages/ui/src/components/custom/custom-form-input.tsx

Active Rules:
✓ .cursorrules (global standards)
✓ PROJECT_CONTEXT.md (project overview)
✓ ui-components.md (component patterns)
```

## Benefits

### 1. Less Context Needed
You don't need to explain your tech stack or patterns every time. The AI already knows your:
- Project structure
- Naming conventions
- Preferred libraries
- Code patterns

### 2. Consistent Code
AI suggestions automatically follow your:
- Coding standards
- File organization
- Import patterns
- Error handling

### 3. Faster Development
- Get accurate code suggestions immediately
- Less back-and-forth explaining patterns
- Fewer manual corrections needed
- Better autocomplete suggestions

### 4. Team Alignment
- New team members see the same patterns
- Consistent code across features
- Documented standards
- Easier code reviews

## Using AI Effectively

### Good Prompts (With Configuration)

❌ **Before:**
> "Create a new product API endpoint with RTK Query that fetches products from /product endpoint, supports pagination, uses POST method, caches for 1 hour, and invalidates the Product tag"

✅ **After:**
> "Create a getProducts endpoint in product-api.ts"

The AI knows from `portal-redux.md`:
- RTK Query patterns
- Endpoint structure
- Caching strategy
- Tag invalidation
- Response types

### Example Scenarios

#### Creating a New Form

**You:** "Add a create category dialog"

**AI knows from `portal-features.md`:**
- Use React Hook Form + Zod
- Create dialog pattern with state
- Use CustomFormInput components
- Handle submission with toast
- Close dialog on success

#### Adding a Server Action

**You:** "Create a getCategoryById action"

**AI knows from `web-server-actions.md`:**
- Use CustomFetch utility
- Add proper caching with revalidate
- Use cache tags
- Handle errors gracefully
- Type the response

#### Creating a Component

**You:** "Create a ProductCard component"

**AI knows from context:**
- Use shadcn/ui patterns
- Import from @workspace/ui
- Use cn() for classes
- Forward refs properly
- Mobile-first design

## Maintaining Configuration

### When to Update

Update these files when you:
1. Add new architectural patterns
2. Change coding standards
3. Adopt new libraries
4. Introduce new conventions
5. Update tech stack

### Best Practices

1. **Keep rules specific** - Focus on patterns unique to your project
2. **Include examples** - Show actual code from your project
3. **Update regularly** - Keep in sync with codebase changes
4. **Test AI responses** - Verify rules are being followed
5. **Share with team** - Make sure everyone knows about the config

## Testing Your Configuration

### Before and After Comparison

**Without Configuration:**
- AI suggests generic patterns
- May use different libraries
- Inconsistent with your style
- Requires detailed explanations

**With Configuration:**
- AI suggests your patterns
- Uses your exact libraries
- Matches your style automatically
- Minimal explanation needed

### Quick Test

Ask AI to:
1. "Create a new Redux API endpoint" → Should match your RTK Query pattern
2. "Add a form with validation" → Should use React Hook Form + Zod
3. "Create a server action" → Should use CustomFetch
4. "Add a new type" → Should follow your naming conventions

## Troubleshooting

### AI Not Following Rules

1. Check file location matches rule triggers
2. Verify rule file syntax is correct
3. Try being more explicit in prompts
4. Reference the rule file directly if needed

### Conflicting Patterns

If AI suggests conflicting approaches:
1. Be more specific in your prompt
2. Reference the exact file/pattern you want
3. Update rules to be more clear
4. Remove ambiguous guidance

## Additional Resources

- [Cursor Documentation](https://cursor.sh/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

## Questions?

If you have questions about:
- **How rules work** → Check Cursor documentation
- **What patterns to use** → See relevant rule file
- **Project architecture** → Read PROJECT_CONTEXT.md
- **Specific conventions** → Check .cursorrules

---

Last Updated: 2026-02-11
Configuration Version: 1.0
