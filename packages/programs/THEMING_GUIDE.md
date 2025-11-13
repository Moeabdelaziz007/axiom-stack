# 🎨 Axiom ID Theming Guide

## Overview

The Axiom ID landing page now uses a flexible theming system that combines CSS variables with Tailwind CSS. This allows you to easily customize colors, create variants, and maintain consistency across the entire application.

## 📁 Key Files

- **`tailwind.config.js`** - Tailwind configuration with custom color definitions
- **`src/app/globals.css`** - CSS variables and custom utility classes
- **Components** - Use the theming system via Tailwind classes

## 🎨 Color System

### CSS Variables (in `globals.css`)

All colors are defined as HSL values in CSS variables:

```css
:root {
  /* Brand colors */
  --primary: 217 91% 60%;        /* Main brand color (blue) */
  --primary-hover: 217 91% 53%;  /* Hover state */
  --secondary: 220 13% 18%;      /* Secondary color (dark gray) */
  --secondary-hover: 220 13% 13%; /* Secondary hover */
  --accent: 239 84% 67%;         /* Accent color (indigo) */
  
  /* Semantic colors */
  --card-bg: 220 13% 9%;         /* Card background */
  --card-bg-hover: 220 13% 13%;  /* Card hover state */
  --border: 220 13% 18%;         /* Border color */
}
```

### Available Tailwind Classes

#### Background Colors
- `bg-primary` - Main brand background
- `bg-secondary` - Secondary background
- `bg-card` - Card background
- `bg-card-hover` - Card hover background

#### Text Colors
- `text-primary` - Main brand text color

#### Border Colors
- `border-card` - Card border color

#### Hover Utilities
- `hover-primary` - Hover effect for primary buttons
- `hover-card` - Hover effect for cards

## 🔧 How to Change Colors

### Method 1: Update CSS Variables (Recommended)

Edit `src/app/globals.css` and change the HSL values:

```css
:root {
  /* Change primary from blue to purple */
  --primary: 270 91% 60%;        /* Purple hue */
  --primary-hover: 270 91% 53%;  /* Darker purple */
}
```

**HSL Format Guide:**
- First number (0-360): Hue (color wheel position)
  - 0/360 = Red
  - 120 = Green
  - 240 = Blue
  - 270 = Purple
  - 180 = Cyan
- Second number (0-100%): Saturation (color intensity)
- Third number (0-100%): Lightness (brightness)

### Method 2: Use Brand Colors

In `tailwind.config.js`, you can also use the predefined brand colors:

```javascript
colors: {
  brand: {
    primary: '#3B82F6',    // Change this hex value
    secondary: '#1F2937',
    accent: '#6366F1',
  },
}
```

Then use in components:
```tsx
className="bg-brand-primary text-white"
```

## 📝 Usage Examples

### Buttons

```tsx
// Primary button
<button className="bg-primary text-white px-8 py-3 rounded-lg hover-primary transition-colors">
  Click Me
</button>

// Secondary button
<button className="bg-secondary text-white px-8 py-3 rounded-lg hover:bg-secondary-hover transition-colors">
  Secondary Action
</button>
```

### Cards

```tsx
<div className="bg-card border border-card rounded-lg p-6 hover-card transition-colors">
  <h3 className="text-white">Card Title</h3>
  <p className="text-gray-300">Card content</p>
</div>
```

### Icons

```tsx
<Icon className="w-8 h-8 text-primary" />
```

## 🎯 Quick Color Changes

### Change to Purple Theme
```css
--primary: 270 91% 60%;
--primary-hover: 270 91% 53%;
```

### Change to Green Theme
```css
--primary: 142 76% 36%;
--primary-hover: 142 76% 30%;
```

### Change to Cyan Theme
```css
--primary: 189 94% 43%;
--primary-hover: 189 94% 37%;
```

### Change to Orange Theme
```css
--primary: 24 95% 53%;
--primary-hover: 24 95% 47%;
```

## 🔄 Testing Your Changes

1. **Start development server:**
   ```bash
   cd axiom_id
   npm run dev
   ```

2. **View at:** http://localhost:3000

3. **Make changes** to `globals.css` and see them update in real-time

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🌈 Color Palette Generator

Use these tools to find perfect color combinations:

- [Coolors.co](https://coolors.co/) - Color palette generator
- [Adobe Color](https://color.adobe.com/) - Color wheel tool
- [HSL Color Picker](https://hslpicker.com/) - Convert colors to HSL

## 💡 Best Practices

1. **Always use CSS variables** for colors instead of hardcoded values
2. **Test contrast ratios** for accessibility (use browser DevTools)
3. **Maintain hover states** for interactive elements
4. **Use semantic naming** (primary, secondary, accent) instead of color names
5. **Keep the color palette limited** (3-5 main colors) for consistency

## 🚀 Advanced Customization

### Adding New Color Variables

1. Add to `globals.css`:
```css
--success: 142 76% 36%;
--error: 0 84% 60%;
--warning: 38 92% 50%;
```

2. Add to `tailwind.config.js`:
```javascript
colors: {
  success: 'hsl(var(--success))',
  error: 'hsl(var(--error))',
  warning: 'hsl(var(--warning))',
}
```

3. Use in components:
```tsx
<div className="bg-success text-white">Success!</div>
```

## 📚 Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [HSL Color Model](https://en.wikipedia.org/wiki/HSL_and_HSV)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Need help?** Check the component files in `src/app/` for usage examples.