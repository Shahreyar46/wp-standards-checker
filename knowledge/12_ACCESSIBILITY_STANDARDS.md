# ♿ ACCESSIBILITY (A11Y) STANDARDS
> Source: WCAG 2.1/2.2, WP.org Accessibility Team, and "Plugin Check" standards.

WordPress is legally prioritizing accessibility. Rejections now happen for "obvious" accessibility failures in the admin dashboard.

---

## 🛑 1. ARIA & Screen Readers
- **Rule**: All interactive elements (buttons, links, inputs) must have a perceivable label.
- **Fix**: Use `aria-label` or `aria-labelledby` if the text isn't visible.
- **Rule**: Use `aria-expanded` for toggles/accordions.
- **Rule**: Use `aria-live="polite"` for dynamic content updates (like AJAX notices).

## ⌨️ 2. Keyboard Navigation
- **Rule**: Every setting and button MUST be reachable via the `Tab` key.
- **Rule**: Visible focus indicators are required. (Do NOT use `outline: none;` without a high-contrast replacement).
- **Rule**: "Skip to Content" links should be supported if the plugin adds a large custom UI.

## 🎨 3. Color Contrast
- **Rule**: Text color must have a contrast ratio of at least **4.5:1** against its background.
- **Focus**: Avoid light gray text on white backgrounds in admin settings.

## 🏷️ 4. Form Accessibility
- **Rule**: Every form input MUST have a `<label for="id">` tag.
- **Avoid**: Using `placeholder` as a replacement for labels. Screen readers often skip them.

## 🏗️ 5. Semantic HTML Hierarchy
- **Rule**: Use headings (`<h1>` to `<h6>`) in logical order. Don't skip levels (e.g., `<h1>` followed by `<h3>`).
- **Rule**: Use `<button>` for actions and `<a>` for navigation. Don't use `<div>` or `<span>` with click handlers.

---

## 🛠️ Code Fix Examples

### ❌ Bad - Inaccessible Toggle
```html
<div class="my-toggle" onclick="toggle()">Show Menu</div>
```

### ✅ Good - Accessible Toggle
```html
<button 
    type="button" 
    class="my-toggle" 
    aria-expanded="false" 
    aria-controls="my-menu">
    <?php _e( 'Show Menu', 'text-domain' ); ?>
</button>
```

### ❌ Bad - Missing Label
```html
<input type="text" name="setting" placeholder="Enter API Key" />
```

### ✅ Good - Standard Label
```html
<label for="my-setting"><?php _e( 'API Key', 'text-domain' ); ?></label>
<input type="text" id="my-setting" name="setting" />
```

---

## 📝 Checklist for AI Auditor
- [ ] Check every `echo '<input'` for an associated `<label>`.
- [ ] Check for `outline: none` or `outline: 0` in CSS.
- [ ] Check for `role="button"` on non-button elements (ensure `tabindex="0"` and keyboard events exist if used).
- [ ] Check for `aria-label` on icon-only buttons (like a trash can icon).
- [ ] Check heading hierarchy in admin view files.
