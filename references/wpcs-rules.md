# WordPress Coding Standards (WPCS) - Complete Guide for AI Code Generation

## Overview

This document provides **comprehensive WordPress Coding Standards rules** for AI-assisted code generation. Use this guide when creating ANY WordPress plugin to ensure WPCS compliance from the start.

**Goal**: Write WPCS-compliant code that passes `phpcs --standard=WordPress` validation without requiring fixes.

---

## Checklist

Before writing any WordPress plugin code, ensure:

- [ ] Use **tabs** for indentation (never spaces)
- [ ] Use **snake_case** for variables, properties, and method names
- [ ] Use **strict comparisons** and avoid assignments in conditions; Yoda optional per ruleset
- [ ] End all comments with proper punctuation (`.`, `!`, `?`)
- [ ] Use `$wpdb->prepare()` for ALL database queries
- [ ] Escape all output (`esc_html()`, `esc_attr()`, `esc_url()`)
- [ ] Sanitize all input (`sanitize_text_field()`, `absint()`, etc.)
- [ ] Verify nonces for form submissions
- [ ] Check user capabilities before privileged actions
- [ ] Prefix all functions, hooks, and options with plugin prefix

---

## Table of Contents

1. [Indentation & Formatting](#indentation--formatting)
2. [Naming Conventions](#naming-conventions)
3. [Yoda Conditions](#yoda-conditions)
4. [Comments & Documentation](#comments--documentation)
5. [Database Queries](#database-queries)
6. [Security](#security)
7. [Escaping & Sanitization](#escaping--sanitization)
8. [Common PHPCS Issues & Fixes](#common-phpcs-issues--fixes)
9. [PSR-4 Autoloading](#psr-4-autoloading)

---

## 1. Indentation & Formatting

### Rule: Use Tabs Only

**Error Code**: `Generic.WhiteSpace.DisallowSpaceIndent.SpacesUsed`

**CRITICAL**: WordPress requires tabs for indentation, NOT spaces.


**Correct:**
```php
<?php
class Example {
→   public function method() {
→   →   if ( true ) {
→   →   →   return 'value';
→   →   }
→   }
}
```
(→ represents a tab character)

**Incorrect:**
```php
<?php
class Example {
    public function method() {  // 4 spaces - WRONG!
        if ( true ) {
            return 'value';
        }
    }
}
```

**Auto-Fix:**
```bash
phpcbf --standard=WordPress --sniffs=Generic.WhiteSpace.DisallowSpaceIndent src/
```

**Editor Configuration:**

VS Code (`.vscode/settings.json`):
```json
{
  "editor.insertSpaces": false,
  "editor.tabSize": 4,
  "editor.detectIndentation": false,
  "[php]": {
    "editor.insertSpaces": false,
    "editor.tabSize": 4
  }
}
```

PhpStorm:
- Settings → Editor → Code Style → PHP
- Check "Use tab character"
- Tab size: 4, Indent: 4

### Additional Formatting Rules
- Lowercase PHP open tag: use `<?php` (never `<?PHP`).
- Explicit boolean operator precedence: add parentheses to clarify complex boolean expressions.
- Multi-line function calls:
  - Opening parenthesis must be the last content on the line.
  - Only one argument per line.
  - Closing parenthesis goes on its own line.
  - Commas trail the argument line, not the closing parenthesis line.

---

## 2. Naming Conventions

### Rule: Use snake_case for Variables, Properties, and Methods

**Error Codes**: 
- `WordPress.NamingConventions.ValidVariableName`
- `WordPress.NamingConventions.ValidFunctionName.MethodNameInvalid`

**CRITICAL**: WordPress uses snake_case, NOT camelCase (unlike PSR standards).


### Naming Rules Summary

| Type | Format | Example |
|------|--------|---------|
| Classes | `StudlyCaps` | `ProductRepository` |
| Methods | `snake_case` | `find_by_id()` |
| Properties | `snake_case` | `$product_repository` |
| Local Variables | `snake_case` | `$user_id` |
| Functions | `snake_case` | `leetcampaign_init()` |
| Constants | `UPPER_SNAKE_CASE` | `PLUGIN_VERSION` |
| Hooks | `snake_case` | `leetcampaign_init` |

### Global Namespace Prefixing
- Prefix functions, classes, hooks, options, and globals with a plugin-specific prefix (≥4 characters).
- Example: `wpdm_`, `dmgr_`.

**✅ CORRECT:**
```php
class ProductRepository {
    private $wpdb;
    private $products_table;
    private $campaign_repository;
    
    public function find_by_id( $product_id ) {
        $table_name = $this->products_table;
        $max_order = $this->get_max_order();
        $display_order = null !== $max_order ? (int) $max_order + 1 : 0;
        
        return $result;
    }
    
    private function get_max_order() {
        // Implementation.
    }
}
```

**❌ INCORRECT:**
```php
class ProductRepository {
    private $wpdb;
    private $productsTable;           // Wrong: should be $products_table
    private $campaignRepository;      // Wrong: should be $campaign_repository
    
    public function findById( $productId ) {  // Wrong: should be find_by_id( $product_id )
        $tableName = $this->productsTable;    // Wrong: should be $table_name
        $maxOrder = $this->getMaxOrder();     // Wrong: should be get_max_order()
        $displayOrder = $maxOrder !== null ? (int) $maxOrder + 1 : 0;
        
        return $result;
    }
    
    private function getMaxOrder() {  // Wrong: should be get_max_order()
        // Implementation
    }
}
```

**Manual Fix Required** (cannot be auto-fixed):
1. Rename all properties: `$camelCase` → `$snake_case`
2. Rename all methods: `camelCase()` → `snake_case()`
3. Rename all local variables: `$camelCase` → `$snake_case`
4. Update all references throughout the codebase

**Check Command:**
```bash
phpcs --standard=WordPress --sniffs=WordPress.NamingConventions src/
```

---

## 3. Yoda Conditions

### Rule: Constant on Left, Variable on Right

**Error Code**: `WordPress.PHP.YodaConditions.NotYoda`

**Guidance**: Prefer strict comparisons and disallow assignments in conditions. Many modern WPCS setups discourage mandatory Yoda; if your ruleset enforces Yoda, follow it.


### Why Yoda Conditions?

1. **Prevents accidental assignment**: focus on disallowing assignments in conditions.
2. **Strict comparisons**: use `===`/`!==` and avoid `==`/`!=`.
3. **Consistency**: teams may choose Yoda or non-Yoda; adhere to the project ruleset.

### Yoda Comparison Table

| Operator | Yoda Format | Example |
|----------|-------------|---------|
| `===` | `value === $var` | `null === $result` |
| `!==` | `value !== $var` | `false !== $is_valid` |
| `==` | `value == $var` | `5 == $count` |
| `!=` | `value != $var` | `0 != $id` |
| `<` | `value < $var` | `0 < $id` |
| `>` | `value > $var` | `100 > $limit` |
| `<=` | `value <= $var` | `0 <= $count` |
| `>=` | `value >= $var` | `10 >= $min` |

**✅ CORRECT - Yoda Conditions:**
```php
// Null checks.
if ( null === $variable ) { }
if ( null !== $variable ) { }

// Boolean checks.
if ( true === $is_enabled ) { }
if ( false === $result ) { }

// Numeric comparisons.
if ( 0 < $id ) { }
if ( 0 === $count ) { }
if ( 100 > $limit ) { }

// String comparisons.
if ( 'active' === $status ) { }
if ( 'POST' === $_SERVER['REQUEST_METHOD'] ) { }
if ( '' !== $name ) { }

// Array checks.
if ( array() === $data ) { }

// Function returns.
if ( false === $wpdb->insert() ) { }
if ( null === $product ) { }

// Ternary operators.
$value = null !== $max_order ? (int) $max_order + 1 : 0;

// Complex conditions.
if ( null !== $product && 0 < $product->get_id() ) { }
```

**❌ INCORRECT - Not Yoda:**
```php
// Null checks.
if ( $variable === null ) { }
if ( $variable !== null ) { }

// Boolean checks.
if ( $is_enabled === true ) { }
if ( $result === false ) { }

// Numeric comparisons.
if ( $id > 0 ) { }
if ( $count === 0 ) { }
if ( $limit < 100 ) { }

// String comparisons.
if ( $status === 'active' ) { }
if ( $_SERVER['REQUEST_METHOD'] === 'POST' ) { }
if ( $name !== '' ) { }

// Array checks.
if ( $data === array() ) { }

// Function returns.
if ( $wpdb->insert() === false ) { }
if ( $product === null ) { }

// Ternary operators.
$value = $max_order !== null ? (int) $max_order + 1 : 0;

// Complex conditions.
if ( $product !== null && $product->get_id() > 0 ) { }
```

**Exception**: Variable-to-variable comparisons don't require Yoda:
```php
// ✅ ACCEPTABLE (both are variables).
if ( $user_id === $author_id ) { }
if ( $start_date < $end_date ) { }
```

**Manual Fix Required** (cannot be auto-fixed):
```bash
phpcs --standard=WordPress --sniffs=WordPress.PHP.YodaConditions src/
```

**Quick Memory Aid**: "Constant on the left, variable on the right"

---

## 4. Comments & Documentation

### Rule: All Comments Must End with Punctuation

**Error Codes**:
- `Squiz.Commenting.InlineComment.InvalidEndChar`
- `Squiz.Commenting.FunctionComment.ParamCommentFullStop`


### Inline Comments

Comments must end with: `.` (period), `!` (exclamation), or `?` (question mark)

**✅ CORRECT:**
```php
// This is a proper comment.
// This comment ends correctly!
// Is this comment formatted correctly?

/* This is also correct. */

// Handle user authentication.
$user = wp_get_current_user();

// Initialize admin components.
$this->admin_menu = new AdminMenu();
```

**❌ INCORRECT:**
```php
// This comment has no punctuation
// This is wrong too

/* This is also wrong */

// Handle user authentication
$user = wp_get_current_user();

// Initialize admin components
$this->admin_menu = new AdminMenu();
```

**Auto-Fix:**
```bash
phpcbf --standard=WordPress --sniffs=Squiz.Commenting.InlineComment.InvalidEndChar src/
```

### DocBlock Comments

All DocBlock descriptions must end with a period (`.`)

**✅ CORRECT:**
```php
/**
 * Create a new product.
 *
 * @param string $name Product name.
 * @param string $slug Product slug.
 * @param int    $order Display order.
 * @return Product Created product instance.
 * @throws Exception If validation fails.
 */
public function create_product( $name, $slug, $order ) {
    // Implementation.
}
```

**❌ INCORRECT:**
```php
/**
 * Create a new product
 *
 * @param string $name Product name
 * @param string $slug Product slug
 * @param int    $order Display order
 * @return Product Created product instance
 * @throws Exception If validation fails
 */
public function create_product( $name, $slug, $order ) {
    // Implementation
}
```

**Applies to**: `@param`, `@return`, `@throws`, `@var`, `@since`, `@deprecated`

**Auto-Fix:**
```bash
phpcbf --standard=WordPress --sniffs=Squiz.Commenting.FunctionComment.ParamCommentFullStop src/
```

### Hook Documentation
- Document actions and filters with proper DocBlocks describing parameters and usage.
- Use consistent `@param` types and descriptions and include `@since`.

### File-Level DocBlocks

Every PHP file should have a file-level DocBlock:

```php
<?php
/**
 * Product Repository
 *
 * @package YourPlugin
 */

namespace YourPlugin;
```

---

## 5. Database Queries

### Rule: Always Use $wpdb->prepare()

**Error Code**: `WordPress.DB.PreparedSQL.NotPrepared`

**CRITICAL**: NEVER use variables directly in SQL queries. Always use prepared statements.


**✅ CORRECT:**
```php
// Using $wpdb->prepare() with placeholders.
$results = $wpdb->get_results(
	$wpdb->prepare(
		"SELECT * FROM {$this->table} WHERE id = %d",
		$id
	),
	ARRAY_A
);

$result = $wpdb->get_row(
	$wpdb->prepare(
		"SELECT * FROM {$this->table} WHERE product_slug = %s AND id != %d",
		$slug,
		$exclude_id
	),
	ARRAY_A
);

// Multiple placeholders.
$wpdb->query(
	$wpdb->prepare(
		"UPDATE {$this->table} SET name = %s, count = %d WHERE id = %d",
		$name,
		$count,
		$id
	)
);
```

**Incorrect – Unprepared SQL:**
```php
// Direct variable usage - DANGEROUS!
$results = $wpdb->get_results(
	"SELECT * FROM {$this->table} WHERE id = $id",
	ARRAY_A
);

// String concatenation - DANGEROUS!
$result = $wpdb->get_row(
	"SELECT * FROM {$this->table} WHERE product_slug = '$slug'",
	ARRAY_A
);

// Variables in query - DANGEROUS!
$wpdb->query(
	"UPDATE {$this->table} SET name = '$name', count = $count WHERE id = $id"
);
```

### Placeholder Types

| Placeholder | Type | Example |
|-------------|------|---------|
| `%s` | String | `'hello'`, `'user@email.com'` |
| `%d` | Integer | `42`, `0`, `-5` |
| `%f` | Float | `3.14`, `0.5` |

**Manual Fix Required** (cannot be auto-fixed):
```bash
phpcs --standard=WordPress --sniffs=WordPress.DB.PreparedSQL src/
```

### LIKE Queries with esc_like
- Escape wildcard characters with `$wpdb->esc_like()`.
- Build the LIKE pattern, then pass via `%s` to `$wpdb->prepare()`.

**Correct:**
```php
$term   = isset( $_GET['s'] ) ? sanitize_text_field( wp_unslash( $_GET['s'] ) ) : '';
$search = '%' . $wpdb->esc_like( $term ) . '%';

$sql = $wpdb->prepare(
	"SELECT id FROM {$table} WHERE name LIKE %s",
	$search
);
$ids = $wpdb->get_col( $sql );
```

### Insert/Update/Delete with Formats
- Use `$wpdb->insert()`, `$wpdb->update()`, `$wpdb->delete()` with format arrays.
- Check return values and `$wpdb->last_error` for error handling.

**Correct:**
```php
$inserted = $wpdb->insert(
	$table,
	array(
		'name'  => $name,
		'count' => $count,
	),
	array( '%s', '%d' )
);

if ( false === $inserted ) {
	$error = $wpdb->last_error;
	wp_die( esc_html( $error ) );
}

$updated = $wpdb->update(
	$table,
	array( 'name' => $name ),
	array( 'id' => $id ),
	array( '%s' ),
	array( '%d' )
);
```

### Identifiers Placeholder `%i`
- On WordPress 6.2+, `%i` can be used for identifiers (like table names).
- Do not use `%s` for identifiers; prefer interpolation with `phpcs:ignore` or `%i`.

**Correct:**
```php
$sql = $wpdb->prepare( 'SELECT * FROM %i WHERE id = %d', $table, $id );
```

### Meta Retrieval `$single`
- Always pass the `$single` parameter in `get_*_meta()`.
- Enforced by `WordPress.WP.GetMetaSingle`.

**Correct:**
```php
$value = get_post_meta( $post_id, 'key', true );
$values = get_post_meta( $post_id, 'key', false );
```

### Caching
- Use `wp_cache_get()` before expensive queries.
- Cache results with `wp_cache_set()`; clear with `wp_cache_delete()` after mutations or table creation.

### Meta Retrieval
- Always pass `$single` to `get_*_meta()` and `get_metadata*()` to avoid type surprises.

---

## 6. Security

### Rule: Prevent Direct File Access

Add to the top of ALL PHP files:

```php
<?php
/**
 * File description
 *
 * @package YourPlugin
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
```

### Rule: Verify Nonces

**Error Code**: `WordPress.Security.NonceVerification`

Always verify nonces for form submissions:

```php
// Form submission.
if ( ! isset( $_POST['_wpnonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['_wpnonce'] ) ), 'action_name' ) ) {
	wp_die( 'Security check failed' );
}

// AJAX request.
check_ajax_referer( 'action_name', '_wpnonce' );

// REST API (automatic via X-WP-Nonce header).
'permission_callback' => array( $this, 'check_permission' )
```

#### Nonce Creation and Verification Patterns
- Create nonces with `wp_create_nonce( 'action_name' )` or use `wp_nonce_field( 'action_name' )` in forms.
- Verify with `wp_verify_nonce()` for general requests, `check_admin_referer()` for admin forms, and `check_ajax_referer()` for AJAX.
- Sanitize nonce values with `sanitize_key()`; unslashing is not required for nonces.

**Correct:**
```php
// In a form.
wp_nonce_field( 'save_settings' );

// On submit.
if (
	! isset( $_POST['_wpnonce'] ) ||
	! wp_verify_nonce( sanitize_key( $_POST['_wpnonce'] ), 'save_settings' )
) {
	wp_die( 'Security check failed' );
}

// Admin page helper.
check_admin_referer( 'save_settings' );

// AJAX helper.
check_ajax_referer( 'save_settings', '_wpnonce' );
```

#### Superglobal Access
- Check existence before access: `isset()`, `empty()`, `array_key_exists()`, or null coalescing `??`.
- Always `wp_unslash()` input before sanitization.

**Correct:**
```php
$name = isset( $_POST['name'] ) ? sanitize_text_field( wp_unslash( $_POST['name'] ) ) : '';
```

### Rule: Check User Capabilities

Always check capabilities before privileged operations:

```php
if ( ! current_user_can( 'manage_options' ) ) {
	wp_die( 'Insufficient permissions' );
}

// REST API.
public function check_permission( WP_REST_Request $request ) {
	if ( ! current_user_can( 'manage_options' ) ) {
		return new WP_Error(
			'rest_forbidden',
			__( 'You do not have permission to access this resource.', 'plugin-slug' ),
			array( 'status' => 403 )
		);
	}
	return true;
}
```

Common capabilities:
- `manage_options` - Admin settings
- `edit_posts` - Edit posts
- `publish_posts` - Publish posts
- `delete_posts` - Delete posts
- `edit_others_posts` - Edit others' posts

---

## 7. Escaping & Sanitization

### Rule: Escape Output, Sanitize Input

**Error Codes**:
- `WordPress.Security.EscapeOutput`
- `WordPress.Security.ValidatedSanitizedInput`


### Escaping Output

| Context | Function | Example |
|---------|----------|---------|
| HTML content | `esc_html()` | `echo esc_html( $title );` |
| HTML attributes | `esc_attr()` | `<div class="<?php echo esc_attr( $class ); ?>">` |
| URLs | `esc_url()` | `<a href="<?php echo esc_url( $link ); ?>">` |
| JavaScript | `esc_js()` | `var name = '<?php echo esc_js( $name ); ?>';` |
| Textarea | `esc_textarea()` | `<textarea><?php echo esc_textarea( $content ); ?></textarea>` |

**✅ CORRECT:**
```php
// HTML output.
echo '<h1>' . esc_html( $title ) . '</h1>';
echo '<p>' . esc_html( $description ) . '</p>';

// Attributes.
echo '<div class="' . esc_attr( $class ) . '" id="' . esc_attr( $id ) . '">';
echo '<input type="text" value="' . esc_attr( $value ) . '">';

// URLs.
echo '<a href="' . esc_url( $link ) . '">Click here</a>';
echo '<img src="' . esc_url( $image_url ) . '" alt="' . esc_attr( $alt ) . '">';

// Internationalization with escaping.
echo '<h1>' . esc_html__( 'Welcome', 'plugin-slug' ) . '</h1>';
echo '<a href="' . esc_url( $url ) . '">' . esc_html__( 'Click here', 'plugin-slug' ) . '</a>';
```

**❌ INCORRECT:**
```php
// No escaping - XSS RISK!
echo '<h1>' . $title . '</h1>';
echo '<div class="' . $class . '">';
echo '<a href="' . $link . '">Click</a>';
```

### Sanitizing Input

| Input Type | Function | Example |
|------------|----------|---------|
| Text field | `sanitize_text_field()` | `sanitize_text_field( $_POST['name'] )` |
| Textarea | `sanitize_textarea_field()` | `sanitize_textarea_field( $_POST['description'] )` |
| Email | `sanitize_email()` | `sanitize_email( $_POST['email'] )` |
| URL | `esc_url_raw()` | `esc_url_raw( $_POST['website'] )` |
| Integer | `absint()` | `absint( $_POST['id'] )` |
| Integer (any) | `intval()` | `intval( $_POST['count'] )` |
| Key/slug | `sanitize_key()` | `sanitize_key( $_POST['slug'] )` |
| Title | `sanitize_title()` | `sanitize_title( $_POST['title'] )` |
| Hex color | `sanitize_hex_color()` | `sanitize_hex_color( $_POST['color'] )` |

**✅ CORRECT:**
```php
// Sanitize and validate input.
$name = isset( $_POST['name'] ) ? sanitize_text_field( wp_unslash( $_POST['name'] ) ) : '';
$email = isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) ) : '';
$id = isset( $_POST['id'] ) ? absint( $_POST['id'] ) : 0;
$url = isset( $_POST['url'] ) ? esc_url_raw( wp_unslash( $_POST['url'] ) ) : '';

// Validate after sanitizing.
if ( empty( $name ) ) {
	wp_die( 'Name is required' );
}

if ( ! is_email( $email ) ) {
	wp_die( 'Invalid email' );
}

if ( 0 >= $id ) {
	wp_die( 'Invalid ID' );
}
```

**❌ INCORRECT:**
```php
// No sanitization - SECURITY RISK!
$name = $_POST['name'];
$email = $_POST['email'];
$id = $_POST['id'];
```

### Date & Time
- Use `wp_date()` to format timestamps for site timezone.
- Use `current_time( 'mysql' )` when storing MySQL-style datetime.
- Avoid `current_time( 'timestamp' )` for a real Unix timestamp; use `time()` for UTC timestamps.
- Sniff: `WordPress.DateTime.CurrentTimeTimestamp` flags misuse of `current_time( 'timestamp' )`.

### Sanitizing Arrays
- Always `wp_unslash()` before sanitizing.
- Sanitize recursively using `array_map()` or a custom walker.

**Correct:**
```php
$fields = isset( $_POST['fields'] ) && is_array( $_POST['fields'] ) ? wp_unslash( $_POST['fields'] ) : array();
$fields = array_map( static function ( $value ) {
	return is_string( $value ) ? sanitize_text_field( $value ) : $value;
}, $fields );
```

### wp_kses for HTML Content
- For user-provided HTML, use `wp_kses()` with allowed tags or use helpers:
  - `wp_kses_post()` for post-like content
  - `wp_kses_data()` for limited comment-like content

**Correct:**
```php
$allowed = array( 'a' => array( 'href' => array(), 'title' => array() ) );
echo wp_kses( $html, $allowed );
echo wp_kses_post( $post_like_html );
```

### Building URLs Safely
- Use `add_query_arg()` to construct URLs; escape with `esc_url()` on output.
- Prefer `rawurlencode()` over `urlencode()` for parameter values if manually encoding.
- Use `wp_nonce_url()` to add a nonce to links.

**Correct:**
```php
$url = add_query_arg( array( 'page' => 'settings', 'id' => absint( $id ) ), admin_url( 'admin.php' ) );
echo '<a href="' . esc_url( wp_nonce_url( $url, 'save_settings' ) ) . '">Save</a>';
```

### REST API Validation and Sanitization
- Define `permission_callback` for capability checks.
- Validate and sanitize via schema callbacks or in handlers.
- Use REST sanitizers, e.g., `rest_sanitize_boolean()`.

**Correct:**
```php
register_rest_route( 'plugin/v1', '/item/(?P<id>\d+)', array(
	'methods'             => WP_REST_Server::READABLE,
	'callback'            => array( $this, 'get_item' ),
	'permission_callback' => function () { return current_user_can( 'manage_options' ); },
	'args'                => array(
		'id' => array(
			'required'          => true,
			'validate_callback' => 'is_numeric',
			'sanitize_callback' => 'absint',
		),
		'active' => array(
			'sanitize_callback' => 'rest_sanitize_boolean',
		),
	),
) );
```

---

## 8. Common PHPCS Issues & Fixes

### Issue 1: Tabs vs Spaces

**Error**: "Tabs must be used to indent lines; spaces are not allowed"

**Code**: `Generic.WhiteSpace.DisallowSpaceIndent.SpacesUsed`

**Fix**:
```bash
phpcbf --standard=WordPress --sniffs=Generic.WhiteSpace.DisallowSpaceIndent src/
```

**Prevention**: Configure editor to use tabs (see section 1)

---

### Issue 2: Variable Naming

**Error**: "Variable is not in valid snake_case format"

**Code**: `WordPress.NamingConventions.ValidVariableName`

**Fix**: Manual - rename all variables from camelCase to snake_case

**Examples**:
- `$userId` → `$user_id`
- `$productName` → `$product_name`
- `$maxOrder` → `$max_order`

---

### Issue 3: Method Naming

**Error**: "Method name is not in valid snake_case format"

**Code**: `WordPress.NamingConventions.ValidFunctionName.MethodNameInvalid`

**Fix**: Manual - rename all methods from camelCase to snake_case

**Examples**:
- `findById()` → `find_by_id()`
- `createProduct()` → `create_product()`
- `updateOrder()` → `update_order()`

---

### Issue 4: Yoda Conditions

**Error**: "Use Yoda Condition checks, you must"

**Code**: `WordPress.PHP.YodaConditions.NotYoda`

**Fix**: Manual - reverse comparison order

**Examples**:
- `$value === null` → `null === $value`
- `$result === false` → `false === $result`
- `$id > 0` → `0 < $id`

---

### Issue 5: Comment Punctuation

**Error**: "Inline comments must end in full-stops"

**Code**: `Squiz.Commenting.InlineComment.InvalidEndChar`

**Fix**:
```bash
phpcbf --standard=WordPress --sniffs=Squiz.Commenting.InlineComment.InvalidEndChar src/
```

---

### Issue 6: Parameter Comment Punctuation

**Error**: "Parameter comment must end with a full stop"

**Code**: `Squiz.Commenting.FunctionComment.ParamCommentFullStop`

**Fix**:
```bash
phpcbf --standard=WordPress --sniffs=Squiz.Commenting.FunctionComment.ParamCommentFullStop src/
```

---

### Issue 7: Unprepared SQL

**Error**: "Use of unprepared SQL detected"

**Code**: `WordPress.DB.PreparedSQL.NotPrepared`

**Fix**: Manual - wrap all queries with `$wpdb->prepare()`

**Example**:
```php
// Before.
$results = $wpdb->get_results( "SELECT * FROM {$table} WHERE id = $id" );

// After.
$results = $wpdb->get_results(
	$wpdb->prepare(
		"SELECT * FROM {$table} WHERE id = %d",
		$id
	)
);
```

---

## 9. Additional Best Practices

### Array Formatting

**✅ CORRECT:**
```php
$data = array(
	'product_id'    => $product_id,
	'campaign_name' => $campaign_name,
	'display_order' => $display_order,
	'is_enabled'    => $is_enabled,
);
```

**❌ INCORRECT:**
```php
// Not aligned.
$data = array(
	'product_id' => $product_id,
	'campaign_name' => $campaign_name,
);

// Multiple items on one line.
$data = array( 'key1' => 'value1', 'key2' => 'value2' );
```

### Multi-line Function Calls

**✅ CORRECT:**
```php
$result = $wpdb->get_results(
	$wpdb->prepare(
		"SELECT * FROM {$table} WHERE id = %d",
		$id
	),
	ARRAY_A
);
```

**❌ INCORRECT:**
```php
$result = $wpdb->get_results( $wpdb->prepare(
	"SELECT * FROM {$table} WHERE id = %d",
	$id
), ARRAY_A );
```

### Boolean Precedence
```php
// ✅ CORRECT: Parentheses clarify precedence.
if ( ( $is_enabled && 'active' === $status ) || $force ) {
    // ...
}

// ❌ INCORRECT: Ambiguous precedence.
if ( $is_enabled && 'active' === $status || $force ) {
    // ...
}
```

### Lowercase PHP Tag
```php
// ✅ CORRECT
<?php

// ❌ INCORRECT
<?PHP
```

### `in_array()` Strict Mode
```php
// ✅ CORRECT
if ( in_array( $needle, $haystack, true ) ) {
    // ...
}

// ❌ INCORRECT
if ( in_array( $needle, $haystack ) ) {
    // ...
}
```

### Use WP Alternative Functions
- Prefer `wp_remote_get()`/`wp_remote_post()` over `file_get_contents()` for HTTP.
- Prefer `wp_safe_redirect()` over `header( 'Location: ...' )`.
- Prefer `wp_json_encode()` over `json_encode()`.

### Deprecated APIs
- Avoid deprecated functions, hooks, parameters; adhere to minimum WP version.

## References
- WordPressCS/WPCS: https://github.com/WordPress/WordPress-Coding-Standards
- Customizable sniff properties: https://github.com/WordPress/WordPress-Coding-Standards/wiki/Customizable-sniff-properties
- Releases (new sniffs and defaults): https://github.com/WordPress/WordPress-Coding-Standards/releases
- Yoda and assignments: https://make.wordpress.org/core/2022/06/14/upcoming-disallow-assignments-in-conditions-and-remove-the-yoda-condition-requirement-for-php/

### Internationalization

```php
// Simple string.
__( 'Hello World', 'plugin-slug' );
_e( 'Hello World', 'plugin-slug' );

// With HTML escaping.
esc_html__( 'Hello World', 'plugin-slug' );
esc_html_e( 'Hello World', 'plugin-slug' );

// With placeholders.
sprintf(
	/* translators: %s: user name */
	__( 'Welcome, %s!', 'plugin-slug' ),
	esc_html( $user_name )
);
```

---

## 10. Quick Reference Commands

### Check for Issues
```bash
# Check all files.
phpcs --standard=WordPress .

# Check specific directory.
phpcs --standard=WordPress src/

# Check specific file.
phpcs --standard=WordPress src/Plugin.php

# Check specific sniff.
phpcs --standard=WordPress --sniffs=WordPress.PHP.YodaConditions src/

# Generate report.
phpcs --standard=WordPress --report=summary .
```

### Auto-Fix Issues
```bash
# Fix all auto-fixable issues.
phpcbf --standard=WordPress .

# Fix specific directory.
phpcbf --standard=WordPress src/

# Fix specific sniff.
phpcbf --standard=WordPress --sniffs=Generic.WhiteSpace.DisallowSpaceIndent src/
```

---

## 11. Summary Checklist

Before committing WordPress plugin code:

- [ ] Run `phpcbf --standard=WordPress .` to auto-fix issues
- [ ] Run `phpcs --standard=WordPress .` to check remaining issues
- [ ] Verify all variables/properties/methods use snake_case
- [ ] Verify all comparisons use Yoda conditions
- [ ] Verify all comments end with punctuation
- [ ] Verify all database queries use `$wpdb->prepare()`
- [ ] Verify all output is escaped
- [ ] Verify all input is sanitized
- [ ] Verify nonces are checked
- [ ] Verify capabilities are checked
- [ ] Test plugin functionality

---

## 12. Resources

- **WordPress Coding Standards**: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/
- **WPCS GitHub**: https://github.com/WordPress/WordPress-Coding-Standards
- **PHP_CodeSniffer**: https://github.com/squizlabs/PHP_CodeSniffer
- **PHPCS Installation**: https://github.com/WordPress/WordPress-Coding-Standards#installation

---

**Last Updated**: Based on fixes applied to LeetCampaign plugin (2025)

**Status**: This guide reflects real-world WPCS compliance experience, including 900+ fixes across:
- Tab indentation (269 errors)
- Parameter comments (103 errors)
- Snake_case refactoring (534 errors)
- Yoda conditions (11 errors)

Use this guide to write WPCS-compliant code from the start! 🎉


---

## 13. Assignment Alignment

### Rule: Align Equals Signs in Consecutive Assignments

**Error Code**: `Generic.Formatting.MultipleStatementAlignment.NotSame`

**Rule**: When you have multiple consecutive assignment statements, the equals signs should be aligned vertically for better readability.

**✅ CORRECT:**
```php
// Aligned equals signs.
$product_id    = $data['product_id'];
$campaign_name = $data['campaign_name'];
$display_order = $data['display_order'];
$is_enabled    = $data['is_enabled'];

// Another example.
$max_order      = $this->wpdb->get_var( $query );
$display_order  = null !== $max_order ? (int) $max_order + 1 : 0;
$insert_data    = array( /* ... */ );

// Short variable names aligned.
$id   = $request->get_param( 'id' );
$data = $request->get_json_params();
```

**❌ INCORRECT:**
```php
// Not aligned.
$product_id = $data['product_id'];
$campaign_name = $data['campaign_name'];
$display_order = $data['display_order'];
$is_enabled = $data['is_enabled'];

// Another example.
$max_order = $this->wpdb->get_var( $query );
$display_order = null !== $max_order ? (int) $max_order + 1 : 0;
$insert_data = array( /* ... */ );

// Short variable names not aligned.
$id = $request->get_param( 'id' );
$data = $request->get_json_params();
```

**Auto-Fix:**
```bash
# Fix all alignment issues.
phpcbf --standard=WordPress src/

# Check for alignment issues.
phpcs --standard=WordPress src/ | grep "aligned"
```

**Note**: This rule applies to consecutive assignment statements. If assignments are separated by blank lines or other code, they don't need to be aligned with each other.

**Example with separation:**
```php
// These don't need to align with each other (separated by blank line).
$product_id = $data['product_id'];

$campaign_name = $data['campaign_name'];
$display_order = $data['display_order'];
```

**Benefits**:
- Improves code readability
- Makes it easier to scan variable assignments
- Creates visual structure in the code
- Follows WordPress coding style conventions



---

## 14. Translators Comments for Placeholders

### Rule: Add Translators Comments for i18n Functions with Placeholders

**Error Code**: `WordPress.WP.I18n.MissingTranslatorsComment`

**Rule**: When using translation functions (`__()`, `_e()`, `_x()`, etc.) with placeholders (`%s`, `%d`, `%f`), you MUST add a `/* translators: */` comment on the line above to explain what each placeholder represents.

**Why**: Translators need context to understand what the placeholders will be replaced with, so they can properly translate the text and adjust word order for different languages.

**✅ CORRECT:**
```php
// Single placeholder.
sprintf(
	/* translators: %s: user name */
	__( 'Welcome, %s!', 'plugin-slug' ),
	$user_name
);

// Multiple placeholders.
sprintf(
	/* translators: 1: product name, 2: price */
	__( 'Buy %1$s for only %2$s', 'plugin-slug' ),
	$product_name,
	$price
);

// Comma-separated list.
sprintf(
	/* translators: %s: comma-separated list of missing field names */
	__( 'Missing required fields: %s', 'plugin-slug' ),
	implode( ', ', $missing )
);

// Date format.
sprintf(
	/* translators: %s: date in Y-m-d format */
	__( 'Published on %s', 'plugin-slug' ),
	$date
);

// Count/number.
sprintf(
	/* translators: %d: number of items */
	__( 'You have %d items in your cart', 'plugin-slug' ),
	$count
);
```

**❌ INCORRECT:**
```php
// Missing translators comment - WRONG!
sprintf(
	__( 'Welcome, %s!', 'plugin-slug' ),
	$user_name
);

// Missing translators comment - WRONG!
sprintf(
	__( 'Missing required fields: %s', 'plugin-slug' ),
	implode( ', ', $missing )
);

// Vague comment - NOT HELPFUL!
sprintf(
	/* translators: placeholder */
	__( 'Welcome, %s!', 'plugin-slug' ),
	$user_name
);
```

### Translators Comment Format

**Single Placeholder:**
```php
/* translators: %s: description of what the placeholder represents */
```

**Multiple Placeholders (numbered):**
```php
/* translators: 1: first placeholder description, 2: second placeholder description */
```

**Multiple Placeholders (different types):**
```php
/* translators: %s: string description, %d: number description */
```

### Common Patterns

#### User Names
```php
sprintf(
	/* translators: %s: user display name */
	__( 'Hello, %s!', 'plugin-slug' ),
	$user_name
);
```

#### Counts
```php
sprintf(
	/* translators: %d: number of products */
	__( 'Found %d products', 'plugin-slug' ),
	$count
);
```

#### Lists
```php
sprintf(
	/* translators: %s: comma-separated list of items */
	__( 'Selected items: %s', 'plugin-slug' ),
	implode( ', ', $items )
);
```

#### Dates and Times
```php
sprintf(
	/* translators: %s: date in Y-m-d H:i:s format */
	__( 'Last updated: %s', 'plugin-slug' ),
	$date
);
```

#### Multiple Values
```php
sprintf(
	/* translators: 1: product name, 2: quantity, 3: price */
	__( 'Added %2$d × %1$s to cart for %3$s', 'plugin-slug' ),
	$product_name,
	$quantity,
	$price
);
```

### When Translators Comments Are Required

**Required:**
- `__()` with placeholders
- `_e()` with placeholders
- `_x()` with placeholders
- `esc_html__()` with placeholders
- `esc_attr__()` with placeholders
- Any translation function used with `sprintf()` or `printf()`

**Not Required:**
- Translation functions without placeholders
- `sprintf()` used with non-translatable strings (like error_log)
- Hardcoded strings without translation

### Manual Fix Required

This cannot be auto-fixed. You must manually add the comment.

**Check Command:**
```bash
phpcs --standard=WordPress --sniffs=WordPress.WP.I18n.MissingTranslatorsComment src/
```

### Best Practices

1. **Be Specific**: Describe what the placeholder represents, not just "placeholder"
2. **Include Format**: If the placeholder has a specific format (date, currency), mention it
3. **Use Numbered Placeholders**: For multiple placeholders, use `%1$s`, `%2$s` for clarity
4. **One Line Above**: Place the comment immediately above the translation function
5. **Use Block Comments**: Always use `/* */` style, not `//`

### Example from Real Code

**Before (Missing Comment):**
```php
return $this->send_error(
	'missing_required_fields',
	sprintf(
		__( 'Missing required fields: %s', 'leetcampaign' ),
		implode( ', ', $missing )
	),
	400
);
```

**After (With Comment):**
```php
return $this->send_error(
	'missing_required_fields',
	sprintf(
		/* translators: %s: comma-separated list of missing field names */
		__( 'Missing required fields: %s', 'leetcampaign' ),
		implode( ', ', $missing )
	),
	400
);
```

### Why This Matters

1. **Translation Quality**: Translators can provide better translations with context
2. **Word Order**: Different languages have different word orders; context helps
3. **Professionalism**: Shows attention to detail and respect for translators
4. **WordPress Standards**: Required by WPCS for all plugins in the repository



---
## 15. Database Security - Prepared SQL Statements
### Rule: Always Use $wpdb->prepare() for Dynamic SQL
**Error Code**: `WordPress.DB.PreparedSQL.NotPrepared`, `WordPress.DB.PreparedSQL.InterpolatedNotPrepared`

**Rule**: ALL database queries with dynamic values MUST use `$wpdb->prepare()` with placeholders. Table names from variables require special handling with phpcs:ignore comments.

**✅ CORRECT:**

```php
// Simple query with placeholder
$result = $wpdb->get_row(
	$wpdb->prepare(
		'SELECT * FROM wp_posts WHERE ID = %d',
		$post_id
	)
);

// Multiple placeholders
$results = $wpdb->get_results(
	$wpdb->prepare(
		'SELECT * FROM wp_posts WHERE post_type = %s AND post_status = %s',
		$post_type,
		$post_status
	)
);

// Table name from variable (safe when constructed from $wpdb->prefix)
// Table name is safe - constructed from $wpdb->prefix in constructor.
$results = $wpdb->get_results(
	$wpdb->prepare(
		"SELECT * FROM {$this->table} WHERE id = %d", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$id
	)
);

// Multiple table names
// Table names are safe - constructed from $wpdb->prefix in constructor.
$results = $wpdb->get_results(
	$wpdb->prepare(
		"SELECT c.* FROM {$this->campaigns_table} c
		INNER JOIN {$this->products_table} p ON c.product_id = p.id
		WHERE p.slug = %s", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$slug
	)
);

// Query without variables (no prepare needed)
// Table name is safe - constructed from $wpdb->prefix in constructor.
$max_order = $wpdb->get_var(
	"SELECT MAX(display_order) FROM {$this->table}" // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
);

// DROP TABLE (requires phpcs:ignore)
// Table name is safe - constructed from $wpdb->prefix in constructor.
$wpdb->query( "DROP TABLE IF EXISTS {$this->table}" ); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
```

**❌ INCORRECT:**

```php
// Direct variable interpolation - SQL INJECTION RISK!
$result = $wpdb->get_row(
	"SELECT * FROM wp_posts WHERE ID = {$post_id}"
);

// Concatenation - SQL INJECTION RISK!
$result = $wpdb->get_row(
	'SELECT * FROM wp_posts WHERE ID = ' . $post_id
);

// Missing prepare() - SQL INJECTION RISK!
$results = $wpdb->get_results(
	"SELECT * FROM wp_posts WHERE post_type = '{$post_type}'"
);

// Table name without phpcs:ignore comment
$results = $wpdb->get_results(
	$wpdb->prepare(
		"SELECT * FROM {$this->table} WHERE id = %d",
		$id
	)
);
```

### Placeholder Types

| Placeholder | Type | Description | Example |
|-------------|------|-------------|---------|
| `%s` | String | Any string value | `WHERE name = %s` |
| `%d` | Integer | Whole number | `WHERE id = %d` |
| `%f` | Float | Decimal number | `WHERE price = %f` |

### When to Use phpcs:ignore

**ONLY use `phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared` when:**

1. **Table names from variables** - When table name is constructed safely from `$wpdb->prefix`
2. **Column names from variables** - When column name is from a controlled list
3. **ORDER BY/LIMIT clauses** - When values are validated/sanitized

**ALWAYS add a comment explaining WHY it's safe:**

```php
// Table name is safe - constructed from $wpdb->prefix in constructor.
$wpdb->query( "SELECT * FROM {$this->table}" ); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
```

### Common Patterns

#### Pattern 1: Simple SELECT with ID
```php
public function find_by_id( int $id ) {
	// Table name is safe - constructed from $wpdb->prefix in constructor.
	$result = $this->wpdb->get_row(
		$this->wpdb->prepare(
			"SELECT * FROM {$this->table} WHERE id = %d", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			$id
		),
		ARRAY_A
	);
	
	return $result;
}
```

#### Pattern 2: SELECT with Multiple Conditions
```php
public function find_by_criteria( string $status, int $user_id ) {
	// Table name is safe - constructed from $wpdb->prefix in constructor.
	$results = $this->wpdb->get_results(
		$this->wpdb->prepare(
			"SELECT * FROM {$this->table} 
			WHERE status = %s 
			AND user_id = %d 
			ORDER BY created_at DESC", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			$status,
			$user_id
		),
		ARRAY_A
	);
	
	return $results;
}
```

#### Pattern 3: JOIN with Multiple Tables
```php
public function find_with_relation( string $slug ) {
	// Table names are safe - constructed from $wpdb->prefix in constructor.
	$results = $this->wpdb->get_results(
		$this->wpdb->prepare(
			"SELECT c.*, p.name 
			FROM {$this->campaigns_table} c
			INNER JOIN {$this->products_table} p ON c.product_id = p.id
			WHERE p.slug = %s", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			$slug
		),
		ARRAY_A
	);
	
	return $results;
}
```

#### Pattern 4: Query Without Variables
```php
public function get_max_order() {
	// Table name is safe - constructed from $wpdb->prefix in constructor.
	$max_order = $this->wpdb->get_var(
		"SELECT MAX(display_order) FROM {$this->table}" // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
	);
	
	return $max_order;
}
```

#### Pattern 5: Conditional Query Building
```php
public function slug_exists( string $slug, ?int $exclude_id = null ) {
	// Table name is safe - constructed from $wpdb->prefix in constructor.
	if ( null !== $exclude_id ) {
		$query = $this->wpdb->prepare(
			"SELECT COUNT(*) FROM {$this->table} 
			WHERE slug = %s AND id != %d", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			$slug,
			$exclude_id
		);
	} else {
		$query = $this->wpdb->prepare(
			"SELECT COUNT(*) FROM {$this->table} 
			WHERE slug = %s", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			$slug
		);
	}
	
	return (int) $this->wpdb->get_var( $query ) > 0;
}
```

#### Pattern 6: INSERT with $wpdb->insert()
```php
public function create( array $data ) {
	$inserted = $this->wpdb->insert(
		$this->table, // No phpcs:ignore needed - $wpdb->insert() handles it
		array(
			'name'   => sanitize_text_field( $data['name'] ),
			'email'  => sanitize_email( $data['email'] ),
			'status' => sanitize_text_field( $data['status'] ),
		),
		array( '%s', '%s', '%s' ) // Format specifiers
	);
	
	return $inserted ? $this->wpdb->insert_id : false;
}
```

#### Pattern 7: UPDATE with $wpdb->update()
```php
public function update( int $id, array $data ) {
	$updated = $this->wpdb->update(
		$this->table, // No phpcs:ignore needed - $wpdb->update() handles it
		array(
			'name'   => sanitize_text_field( $data['name'] ),
			'status' => sanitize_text_field( $data['status'] ),
		),
		array( 'id' => $id ), // WHERE clause
		array( '%s', '%s' ),  // Data formats
		array( '%d' )         // WHERE format
	);
	
	return false !== $updated;
}
```

#### Pattern 8: DELETE with $wpdb->delete()
```php
public function delete( int $id ) {
	$deleted = $this->wpdb->delete(
		$this->table, // No phpcs:ignore needed - $wpdb->delete() handles it
		array( 'id' => $id ),
		array( '%d' )
	);
	
	return false !== $deleted && $deleted > 0;
}
```

#### Pattern 9: DROP TABLE
```php
public function drop_table() {
	// Table name is safe - constructed from $wpdb->prefix in constructor.
	$this->wpdb->query( 
		"DROP TABLE IF EXISTS {$this->table}" // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
	);
}
```

#### Pattern 10: SHOW TABLES
```php
public function table_exists() {
	$table_exists = $this->wpdb->get_var(
		$this->wpdb->prepare(
			'SHOW TABLES LIKE %s',
			$this->table
		)
	) === $this->table;
	
	return $table_exists;
}
```

### Security Best Practices

1. **ALWAYS use $wpdb->prepare()** for queries with user input
2. **NEVER concatenate** user input directly into SQL
3. **NEVER use string interpolation** for user input
4. **Sanitize before prepare()** - Use `sanitize_text_field()`, `sanitize_email()`, etc.
5. **Validate data types** - Cast to int, check enums, validate formats
6. **Use format specifiers** - Always specify `%s`, `%d`, or `%f`
7. **Escape table names** - Only when constructed from `$wpdb->prefix`
8. **Document safety** - Add comments explaining why phpcs:ignore is safe

### Why This Matters

**SQL Injection Prevention:**
```php
// VULNERABLE - SQL Injection possible!
$wpdb->get_results( "SELECT * FROM wp_posts WHERE author = {$_GET['author']}" );

// SAFE - SQL Injection prevented
$wpdb->get_results(
	$wpdb->prepare(
		'SELECT * FROM wp_posts WHERE author = %d',
		absint( $_GET['author'] )
	)
);
```

**Real Attack Example:**
```php
// If $_GET['author'] = "1 OR 1=1"
// VULNERABLE query becomes:
"SELECT * FROM wp_posts WHERE author = 1 OR 1=1"
// Returns ALL posts!

// SAFE query becomes:
"SELECT * FROM wp_posts WHERE author = '1 OR 1=1'"
// Returns nothing (no author with that exact string)
```

### Common Mistakes to Avoid

```php
// ❌ WRONG - prepare() with no placeholders
$wpdb->prepare( "SELECT * FROM {$this->table}" );

// ✅ CORRECT - No prepare() needed, use phpcs:ignore
$wpdb->get_results( "SELECT * FROM {$this->table}" ); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared

// ❌ WRONG - Placeholder in table name
$wpdb->prepare( 'SELECT * FROM %s WHERE id = %d', $this->table, $id );

// ✅ CORRECT - Table name interpolated, value as placeholder
$wpdb->prepare(
	"SELECT * FROM {$this->table} WHERE id = %d", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
	$id
);

// ❌ WRONG - Missing phpcs:ignore comment
$wpdb->get_results( "SELECT * FROM {$this->table}" );

// ✅ CORRECT - With explanatory comment
// Table name is safe - constructed from $wpdb->prefix in constructor.
$wpdb->get_results( "SELECT * FROM {$this->table}" ); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
```

### Check Command

```bash
# Check for PreparedSQL issues
phpcs --standard=WordPress --sniffs=WordPress.DB.PreparedSQL src/

# Check all database issues
phpcs --standard=WordPress --sniffs=WordPress.DB src/
```

### Quick Reference

**Remember**: User input = `$wpdb->prepare()`, Table names = `phpcs:ignore` with comment

```php
// ✅ GOOD - User input with prepare()
$wpdb->prepare( 'SELECT * FROM wp_posts WHERE ID = %d', $post_id )

// ✅ GOOD - Table name with phpcs:ignore
// Table name is safe - constructed from $wpdb->prefix.
$wpdb->query( "SELECT * FROM {$this->table}" ); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared

// ❌ BAD - User input without prepare()
$wpdb->query( "SELECT * FROM wp_posts WHERE ID = {$post_id}" )

// ❌ BAD - Table name without phpcs:ignore
$wpdb->query( "SELECT * FROM {$this->table}" )
```

### WordPress 6.2+ Identifier Placeholders (REQUIRED for WordPress.org)

**IMPORTANT**: For WordPress.org plugin submission, you MUST use `%i` placeholder for table/column names. Do NOT use phpcs:ignore comments.

```php
// ✅ CORRECT - Use %i for table names (WordPress 6.2+)
$wpdb->prepare( 'SELECT * FROM %i WHERE id = %d', $this->table, $id );

// ✅ CORRECT - Multiple table names
$wpdb->prepare(
	'SELECT c.* FROM %i c INNER JOIN %i p ON c.product_id = p.id WHERE p.slug = %s',
	$this->campaigns_table,
	$this->products_table,
	$slug
);

// ❌ WRONG - Do NOT use esc_sql() with interpolation
$table = esc_sql( $this->table );
$wpdb->get_results( "SELECT * FROM {$table}" );

// ❌ WRONG - Do NOT use phpcs:ignore for WordPress.org submission
$wpdb->prepare(
	"SELECT * FROM {$this->table} WHERE id = %d", // phpcs:ignore
	$id
);
```

**Minimum WordPress Version**: If using `%i`, your plugin must require WordPress 6.2+. Add this to your main plugin file:

```php
/**
 * Requires at least: 6.2
 */
```
## PSR-4 Autoloading

- Class files follow PSR-4 (`Namespace/ClassName.php`).
- Filename checks for hyphenated lowercase and CamelCase are ignored for class files.
- Ensure namespaces, class names, and directory structure match the autoloader.
