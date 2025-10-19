# UI Components

## ButtonLoader

A small, elegant spinner specifically designed for buttons.

### Usage

```jsx
import ButtonLoader from './ui/ButtonLoader';

// In a button
<button disabled={loading}>
  {loading ? (
    <>
      <ButtonLoader size="sm" color="white" />
      <span className="ml-2">Loading...</span>
    </>
  ) : (
    'Click Me'
  )}
</button>
```

### Props

- **size**: `'xs' | 'sm' | 'md' | 'lg'` (default: `'sm'`)
  - `xs`: 12px (3x3)
  - `sm`: 16px (4x4)
  - `md`: 20px (5x5)
  - `lg`: 24px (6x6)

- **color**: `'white' | 'blue' | 'gray' | 'red' | 'green'` (default: `'white'`)

### Examples

```jsx
// Primary button with white loader
<button className="bg-blue-600 text-white">
  <ButtonLoader size="sm" color="white" />
  <span className="ml-2">Saving...</span>
</button>

// Secondary button with gray loader
<button className="bg-gray-100 text-gray-700">
  <ButtonLoader size="sm" color="gray" />
  <span className="ml-2">Loading...</span>
</button>

// Danger button with white loader
<button className="bg-red-600 text-white">
  <ButtonLoader size="sm" color="white" />
  <span className="ml-2">Deleting...</span>
</button>
```

---

## Button (Reusable Component)

A fully-featured button component with built-in loading states.

### Usage

```jsx
import Button from './ui/Button';
import { Save } from 'lucide-react';

<Button 
  loading={isLoading}
  loadingText="Saving..."
  icon={Save}
  variant="primary"
  size="md"
  onClick={handleSave}
>
  Save Changes
</Button>
```

### Props

- **loading**: `boolean` - Shows loader and disables button
- **disabled**: `boolean` - Disables button
- **variant**: `'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline' | 'ghost'`
- **size**: `'sm' | 'md' | 'lg' | 'xl'`
- **icon**: Lucide React icon component
- **loadingText**: Text to show when loading
- **className**: Additional CSS classes
- All standard button props (`onClick`, `type`, etc.)

### Examples

```jsx
// Primary button
<Button variant="primary" icon={Save}>
  Save
</Button>

// Loading state
<Button loading={true} loadingText="Saving...">
  Save
</Button>

// Danger button
<Button variant="danger" icon={Trash2}>
  Delete
</Button>

// Large success button
<Button variant="success" size="lg" icon={CheckCircle}>
  Approve Application
</Button>
```

---

## Loader (Page Loader)

A larger, more prominent loader for page-level loading states.

### Usage

```jsx
import Loader from './ui/Loader';

// Full screen loader
if (loading) {
  return <Loader text="Loading data..." fullScreen />;
}

// Inline loader
<Loader text="Loading..." size="md" />
```

### Props

- **size**: `'sm' | 'md' | 'lg' | 'xl'` (default: `'md'`)
- **text**: Loading message (optional)
- **fullScreen**: `boolean` - Use full screen height

---

## Best Practices

### 1. Button Loaders
- Always use `ButtonLoader` inside buttons
- Match the loader color to the button text color
- Add `ml-2` spacing between loader and text
- Use `justify-center` on button for proper centering

```jsx
<button className="flex items-center justify-center">
  {loading ? (
    <>
      <ButtonLoader size="sm" color="white" />
      <span className="ml-2">Processing...</span>
    </>
  ) : (
    <>
      <Icon className="w-4 h-4 mr-2" />
      Button Text
    </>
  )}
</button>
```

### 2. Reusable Button Component
- Use the `Button` component for consistency
- Let the component handle loading states automatically
- Provide meaningful `loadingText`

```jsx
<Button
  loading={submitting}
  loadingText="Submitting..."
  variant="primary"
  onClick={handleSubmit}
>
  Submit Form
</Button>
```

### 3. Page Loaders
- Use `Loader` for initial page loads
- Use `fullScreen` prop for full-page loading
- Provide contextual loading messages

```jsx
if (isLoading) {
  return <Loader text="Loading dashboard..." fullScreen />;
}
```

### 4. Size Guidelines
- **Buttons**: Use `sm` (16px) for most buttons
- **Large buttons**: Use `md` (20px) for xl-sized buttons
- **Icon buttons**: Use `xs` (12px) or `sm` (16px)
- **Pages**: Use `md` (32px) for page loaders

### 5. Color Guidelines
- **Primary/Blue buttons**: `white`
- **Gray/Secondary buttons**: `gray`
- **Success/Green buttons**: `white`
- **Danger/Red buttons**: `white`
- **Outline buttons**: Match the border color

