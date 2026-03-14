# 🔄 PHP & WORDPRESS VERSION COMPATIBILITY

AI agents must ensure code remains functional across the project's target environment, especially when supporting older versions of WordPress or PHP.

---

## 1. Environment Triage
Before generating code, identify:
- **Minimum PHP Version**: Found in `readme.txt` or `Plugin Name` header (`Requires PHP:`). Default to 7.2.24+ if unspecified.
- **Minimum WordPress Version**: Found in `readme.txt` or `Plugin Name` header (`Requires at least:`). Default to 6.0+ if unspecified.

---

## 2. Polyfilling & Safety Checks
If using a "modern" function in a project that might run on older versions, use conditional checks.

### 2.1 WordPress Core Functions
```php
if ( function_exists( 'wp_get_list_item_separator' ) ) {
    $sep = wp_get_list_item_separator();
} else {
    $sep = __( ', ', 'text-domain' ); // Fallback for older WP versions.
}
```

### 2.2 PHP Functions
Avoid using PHP 8.0+ features (like `str_contains`) if the plugin targets PHP 7.4.
```php
// ❌ WRONG (for PHP 7.4)
if ( str_contains( $string, 'needle' ) ) { ... }

// ✅ CORRECT (Safe for PHP 7.0+)
if ( false !== strpos( $string, 'needle' ) ) { ... }
```

---

## 3. Deprecation Handling
Always cross-reference `knowledge/10_DEPRECATED_FUNCTIONS.md`.
- **Golden Rule**: Never use a function that was deprecated *before* the project's "Requires at least" version.
- **Warning**: If a function is newly deprecated in the *latest* WP version, use the modern replacement immediately.

---

## 4. PHPCS Configuration
When running an audit, inform the tool of the target version to catch compatibility issues:
- `phpcs --runtime-set minimum_wp_version 5.6`
- `phpcs --runtime-set testVersion 7.2-`

---

## 5. Modernize vs. Stabilize
- **New Features**: Always write code using the most modern stable patterns that fit within the "Minimum Version" constraint.
- **Existing Code**: If you find old patterns (like `mysql_*` or pre-4.5 WP functions), offer to modernize them while maintaining the minimum version requirement.
