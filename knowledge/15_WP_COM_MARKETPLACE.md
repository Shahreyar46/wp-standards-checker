# 🏙️ WordPress.com Marketplace & Managed Hosting Standards
> Source: WordPress.com Developer Resources + VIP Best Practices

These standards are required for plugins intended for high-scale managed environments like WordPress.com Marketplace or VIP.

---

## ⚡ 1. Performance & Scale

### Data Storage Architecture
- **Rule**: Avoid custom database tables (`CREATE TABLE`) unless absolutely necessary for complex relational data.
- **Priority 1**: Use **Custom Post Types** (CPT) and **Meta** (Post Meta).
- **Priority 2**: Use **Taxonomies** for sorting/categorizing.
- **Priority 3**: Use **Options API** (`wp_options`) for global configuration.
- **Caching**: 
    - Use **Transients** (`set_transient`, `get_transient`) for data that expires.
    - Use the **Object Cache** for persistent data that isn't always present.

### Query Optimization
- **Rule**: Avoid large `meta_query` or `tax_query` without proper indexing or caching.
- **Rule**: Never use `OFFSET` for pagination (use seek pagination/`paged` instead).

---

## 🔒 2. Safety & Security

### Direct Access Prevention
- **Requirement**: Every PHP file MUST prevent direct execution.
- **Check**: Add this at the top of every `.php` file:
```php
if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}
```

### Data Leaks
- **Rule**: Avoid logging sensitive information (passwords, tokens, PII) to `error_log` or custom files.
- **Requirement**: Use a structured logger like `WC_Logger` or `WP_Debug` selectively.

---

## 🎨 3. User Experience & Integration

### Plugin Action Links
- **Requirement**: Add a "Settings" link in the standard plugins list.
- **Hook**: Use `plugin_action_links_{$plugin_file}`.
```php
add_filter( "plugin_action_links_$plugin_basename", function( $links ) {
    $settings_link = '<a href="admin.php?page=my-settings">' . __( 'Settings' ) . '</a>';
    array_unshift( $links, $settings_link );
    return $links;
});
```

### Decoupling Logic
- **Rule**: Separate business logic (data processing) from presentation logic (UI/Admin pages).
- **Architecture**: Use a Predictable class-based structure with a dedicated loader.
