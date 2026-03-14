# WordPress Database APIs (Options, Transients, Metadata)

> Source: https://developer.wordpress.org/apis/database/

## 1. Options API
- Store persistent settings.
- Prefix all option names with your plugin prefix.
- Use `register_setting()` with a `sanitize_callback` for automatic sanitization.
- Functions: `get_option()`, `update_option()`, `add_option()`, `delete_option()`.

## 2. Transients API
- Store temporary, cached data.
- Always check if `get_transient()` returns `false` (meaning it expired or doesn't exist).
- Do NOT assume transient data persists.
- Functions: `set_transient()`, `get_transient()`, `delete_transient()`.

## 3. Metadata API
- Store extra data for posts, users, comments, or terms.
- Always pass the `$single` parameter (`true` or `false`) to avoid unexpected array returns.
- Functions: `get_post_meta()`, `update_post_meta()`, `add_post_meta()`, `delete_post_meta()`.

## 4. $wpdb Direct Queries
- ONLY use when core functions (`get_posts`, `get_metadata`) don't suffice.
- ALWAYS use `$wpdb->prepare()`.
- Use `%i` for table/column names (WP 6.2+).
- Use `%s` (string), `%d` (integer), `%f` (float) for values.
- Check return values (`false` on failure).
- Use `$wpdb->insert()`, `$wpdb->update()`, `$wpdb->delete()` for standard CRUD (handles preparation).

## 5. Caching
- Use the Object Cache (`wp_cache_*`) for expensive calculations or query results within a single request.
- Use Transients for data meant to survive across requests.
