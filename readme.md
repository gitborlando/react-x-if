# React X-If

A Vite plugin for React that enables Vue-like conditional rendering with `x-if` directive.

## Installation

```bash
pnpm add vite-plugin-react-x-if
```

## Usage

### 1. Configure Vite Plugin

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reactXIfPlugin from 'vite-plugin-react-x-if'

export default defineConfig({
  plugins: [
    react(),
    reactXIfPlugin('x-if'), // Optional: customize directive name
  ],
})
```

### 2. Use in Your Components

```tsx
// Before: Traditional React conditional rendering
function MyComponent({ show, user }) {
  return (
    <div>
      {show && <h1>Welcome!</h1>}
      {user && <p>Hello, {user.name}!</p>}
    </div>
  )
}

// After: Using x-if directive
function MyComponent({ show, user }) {
  return (
    <div>
      <h1 x-if={show}>Welcome!</h1>
      <p x-if={user}>Hello, {user.name}!</p>
    </div>
  )
}
```

## How It Works

The plugin transforms your JSX at compile time:

**Input:**

```tsx
<div x-if={condition}>Content</div>
```

**Output:**

```tsx
{
  Boolean(condition) && <div>Content</div>
}
```

## Configuration

### Custom Directive Name

You can customize the directive name:

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    react(),
    reactXIfPlugin('show-if'), // Now use 'show-if' instead of 'x-if'
  ],
})
```

```tsx
// Usage with custom directive
<div show-if={condition}>Content</div>
```

## Examples

### Basic Conditional Rendering

```tsx
function UserProfile({ user, isLoggedIn }) {
  return (
    <div>
      <h1 x-if={isLoggedIn}>Welcome back!</h1>
      <div x-if={user}>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
      </div>
    </div>
  )
}
```

### Nested Conditional Rendering

```tsx
function ProductList({ products, showDetails }) {
  return (
    <div>
      <h2>Products</h2>
      {products.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <div x-if={showDetails}>
            <p>{product.description}</p>
            <span>Price: ${product.price}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
```

### Fragment Usage

```tsx
function ConditionalFragment({ items }) {
  return (
    <>
      <h1>Items</h1>
      <div x-if={items.length > 0}>
        {items.map((item) => (
          <p key={item.id}>{item.name}</p>
        ))}
      </div>
      <p x-if={items.length === 0}>No items found</p>
    </>
  )
}
```

## Supported File Types

- `.js` - JavaScript files
- `.jsx` - JavaScript JSX files
- `.ts` - TypeScript files
- `.tsx` - TypeScript JSX files

## Development

```bash
# Install dependencies
pnpm install

# Development mode
pnpm dev

# Build
pnpm build

# Run tests
pnpm test

# Run tests with UI
pnpm test:ui
```

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
