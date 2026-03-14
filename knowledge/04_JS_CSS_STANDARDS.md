# 🎨 WP FRONTEND STANDARDS: JS & CSS

---

## 📜 JavaScript Standards
Sourced from official WordPress.org JS Coding Standards.

### 1. Structure & Indentation
- **Tabs for Indentation**: Use tabs, not spaces.
- **Semicolons**: Mandatory. Never rely on Automatic Semicolon Insertion (ASI).

### 2. Variables & Equality
- **Variable Names**: `camelCase` (Note: PHP is `snake_case`, but JS is `camelCase` in WP).
- **Equality**: Always use strict equality `===` and `!==`.
- **Global Variables**: Minimize usage. Use local scope or closures.

### 3. AJAX in JS
- **No Hardcoding**: Never hardcode `/wp-admin/admin-ajax.php`.
- **Localization**: Pass the URL from PHP using `wp_localize_script()`.

---

## 🖌️ CSS Standards
Sourced from official WordPress.org CSS Coding Standards.

### 1. General Rules
- **Tabs for Indentation**: Use tabs for nesting.
- **Lowercase**: All selectors, properties, and values must be lowercase.
- **Selectors**: Be descriptive but concise. Prefer hyphens over underscores (`.my-selector`).

### 2. Values & Units
- **Zero Units**: Never specify units for zero values (use `0` not `0px`).
- **HEX Colors**: Use lowercase hex codes (`#fff` or `#cccccc`). Use shorthand where possible.

### 3. Media Queries
- **Placement**: Place media queries at the bottom of the stylesheet or directly after the relevant rule.
