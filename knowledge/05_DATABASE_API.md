# 🗄️ WORDPRESS DATABASE API

---

## 1. The $wpdb Object
For raw SQL queries, always use the global `$wpdb`.

### 1.1 Secure `prepare` QA Protocol
When fixing a raw query to use `$wpdb->prepare()`, follow this mandatory QA process:
1.  **Extract Original Query**: Look at the raw string (e.g., `"... WHERE id = $id AND status = '$status'"`).
2.  **Map Variable Types**:
    *   `$id` -> `%d` (integer)
    *   `$status` -> `%s` (string)
3.  **Cross-Verify Logic**: Ensure the `SELECT`, `FROM`, `JOIN`, and `WHERE` clauses remain unchanged.
4.  **Verification Check**: Compare the original and the new code side-by-side to ensure no columns or logic gates were accidentally deleted or modified.

### 🚨 Prepared Statements (Security)
**Rule**: Never interpolate variables directly into SQL.
```php
// ✅ CORRECT
$rows = $wpdb->get_results( $wpdb->prepare( 
	"SELECT * FROM %i WHERE user_id = %d", 
	$wpdb->prefix . 'my_table', 
	$user_id 
) );
```
- `%d`: Integer
- `%s`: String
- `%f`: Float
- `%i`: Identifier (Table/Column names - WP 6.2+)

---

## 2. Options API
Store simple, permanent settings.
- `get_option( $name, $default )`
- `update_option( $name, $value )`
- `delete_option( $name )`
- **Prefixing**: Always prefix option names with your plugin slug.

---

## 3. Transients API
Store temporary cached data.
- `set_transient( $name, $value, $expiration )`
- `get_transient( $name )`
- `delete_transient( $name )`
- **Prefixing**: Always prefix with your plugin slug.

---

## 4. Metadata API
Store additional data for core objects (Posts, Users, Comments).
- `get_post_meta( $post_id, $key, $single )`
- `update_post_meta( $post_id, $key, $value )`
- **Whitelisting**: Only use non-prefixed keys if you want other plugins to access them.
