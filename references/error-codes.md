# WPCS Error Codes — Complete Catalogue

Quick lookup: error code → cause → fix → auto-fixable?

---

## Indentation & Formatting

| Code | Cause | Fix | Auto? |
|------|-------|-----|-------|
| `Generic.WhiteSpace.DisallowSpaceIndent.SpacesUsed` | Spaces used for indentation | Convert to tabs | ✅ yes |
| `WordPress.Arrays.ArrayIndentation` | Array not properly indented | Fix indentation | ✅ yes |
| `WordPress.Arrays.ArrayKeySpacingRestrictions` | Missing/extra spaces around array keys | Fix spacing | ✅ yes |
| `Squiz.WhiteSpace.SuperfluousWhitespace` | Trailing whitespace | Remove trailing spaces | ✅ yes |

**Fix command:**
```powershell
phpcbf --standard=WordPress --sniffs=Generic.WhiteSpace.DisallowSpaceIndent "<PATH>"
```

---

## Naming Conventions

| Code | Cause | Fix | Auto? |
|------|-------|-----|-------|
| `WordPress.NamingConventions.ValidVariableName.VariableNotSnakeCase` | Variable `$camelCase` | Rename to `$snake_case` | ❌ manual |
| `WordPress.NamingConventions.ValidVariableName.PropertyNotSnakeCase` | Property `$camelCase` | Rename to `$snake_case` | ❌ manual |
| `WordPress.NamingConventions.ValidFunctionName.MethodNameInvalid` | Method `camelCase()` | Rename to `snake_case()` | ❌ manual |
| `WordPress.NamingConventions.ValidFunctionName.FunctionNameInvalid` | Function `camelCase()` | Rename to `snake_case()` | ❌ manual |
| `WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound` | Function missing plugin prefix | Add `myplugin_` prefix | ❌ manual |
| `WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound` | Hook missing plugin prefix | Add `myplugin_` prefix | ❌ manual |
| `WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound` | Global variable not prefixed | Add prefix | ❌ manual |
| `WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound` | Constant not prefixed | Rename with prefix | ❌ manual |

**Before / After:**
```php
// WRONG
private $userId;
public function findById( $productId ) { }

// CORRECT
private $user_id;
public function find_by_id( $product_id ) { }
```

---

## Comments & Documentation

| Code | Cause | Fix | Auto? |
|------|-------|-----|-------|
| `Squiz.Commenting.InlineComment.InvalidEndChar` | Inline comment missing period | Add `.` to end | ✅ yes |
| `Squiz.Commenting.FunctionComment.ParamCommentFullStop` | `@param` missing period | Add `.` to `@param` descriptions | ✅ yes |
| `Squiz.Commenting.FunctionComment.ReturnCommentFullStop` | `@return` missing period | Add `.` to `@return` description | ✅ yes |
| `Squiz.Commenting.FunctionComment.ThrowsNoFullStop` | `@throws` missing period | Add `.` to description | ✅ yes |
| `Squiz.Commenting.FunctionComment.MissingParamTag` | Missing `@param` in DocBlock | Add `@param` tag | ❌ manual |
| `Squiz.Commenting.FunctionComment.Missing` | Missing DocBlock entirely | Add DocBlock | ❌ manual |
| `WordPress.WP.I18n.MissingTranslatorsComment` | No `/* translators: */` comment | Add translators comment | ❌ manual |

**Before / After:**
```php
// WRONG
// Initialize plugin
$this->init();

// CORRECT
// Initialize plugin.
$this->init();
```

---

## Yoda Conditions

| Code | Cause | Fix | Auto? |
|------|-------|-----|-------|
| `WordPress.PHP.YodaConditions.NotYoda` | Variable on left side of comparison | Put constant on left | ❌ manual |

**Before / After:**
```php
// WRONG
if ( $value === null ) { }
if ( $id > 0 ) { }
if ( $status === 'active' ) { }

// CORRECT
if ( null === $value ) { }
if ( 0 < $id ) { }
if ( 'active' === $status ) { }
```

**Exception:** Variable-to-variable comparisons are OK:
```php
if ( $start_date < $end_date ) { }  // ACCEPTABLE
```

---

## Database Security

| Code | Cause | Fix | Auto? |
|------|-------|-----|-------|
| `WordPress.DB.PreparedSQL.NotPrepared` | SQL with variables and no `prepare()` | Use `$wpdb->prepare()` | ❌ manual |
| `WordPress.DB.PreparedSQL.InterpolatedNotPrepared` | Table/column name as variable | Use `%i` or phpcs:ignore | ❌ manual |
| `WordPress.DB.DirectDatabaseQuery.DirectQuery` | Direct `$wpdb->query()` not cached | Add caching or phpcs:ignore | ❌ manual |
| `WordPress.DB.DirectDatabaseQuery.NoCaching` | Query result not cached | Use `wp_cache_get/set` | ❌ manual |
| `WordPress.WP.GetMetaSingle.MissingTrueFalse` | `get_*_meta()` missing `$single` param | Always pass `true` or `false` | ❌ manual |

**Before / After:**
```php
// WRONG — SQL injection risk!
$results = $wpdb->get_results( "SELECT * FROM {$table} WHERE id = $id" );

// CORRECT
$results = $wpdb->get_results(
    $wpdb->prepare(
        "SELECT * FROM {$table} WHERE id = %d", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
        $id
    ),
    ARRAY_A
);

// BEST (WordPress.org) — use %i for table names (WP 6.2+)
$results = $wpdb->get_results(
    $wpdb->prepare( 'SELECT * FROM %i WHERE id = %d', $this->table, $id ),
    ARRAY_A
);
```

---

## Security — Escaping Output

| Code | Cause | Fix | Auto? |
|------|-------|-----|-------|
| `WordPress.Security.EscapeOutput.OutputNotEscaped` | Unescaped echo/print | Use `esc_html()`, `esc_attr()`, etc. | ❌ manual |
| `WordPress.Security.EscapeOutput.UnsafePrintingFunction` | `_e()` with unescaped content | Use `esc_html_e()` | ❌ manual |

**Escaping functions by context:**
```php
echo esc_html( $title );           // HTML content
echo esc_attr( $class );           // HTML attributes
echo esc_url( $link );             // URLs
echo esc_js( $js_var );            // Inline JavaScript
echo esc_textarea( $content );     // Textarea values
echo wp_kses_post( $html );        // HTML with allowed tags
echo esc_html__( 'Text', 'slug' ); // Translated HTML text
```

---

## Security — Input Sanitization

| Code | Cause | Fix | Auto? |
|------|-------|-----|-------|
| `WordPress.Security.ValidatedSanitizedInput.InputNotSanitized` | `$_POST`/`$_GET` used without sanitization | Use `sanitize_*()` functions | ❌ manual |
| `WordPress.Security.ValidatedSanitizedInput.InputNotValidated` | Input not validated before use | Validate and sanitize | ❌ manual |
| `WordPress.Security.ValidatedSanitizedInput.MissingUnslash` | Input not unslashed before sanitization | Add `wp_unslash()` | ❌ manual |

**Sanitization functions:**
```php
$name  = isset( $_POST['name'] )  ? sanitize_text_field( wp_unslash( $_POST['name'] ) )  : '';
$email = isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) )        : '';
$id    = isset( $_GET['id'] )     ? absint( $_GET['id'] )                                  : 0;
$url   = isset( $_POST['url'] )   ? esc_url_raw( wp_unslash( $_POST['url'] ) )             : '';
$slug  = isset( $_POST['slug'] )  ? sanitize_key( wp_unslash( $_POST['slug'] ) )           : '';
$html  = isset( $_POST['html'] )  ? wp_kses_post( wp_unslash( $_POST['html'] ) )           : '';
```

---

## Security — Nonces

| Code | Cause | Fix | Auto? |
|------|-------|-----|-------|
| `WordPress.Security.NonceVerification.Missing` | No nonce check in form handler | Add `wp_verify_nonce()` | ❌ manual |
| `WordPress.Security.NonceVerification.Recommended` | Nonce check recommended | Add nonce field and verification | ❌ manual |

**Correct nonce patterns:**
```php
// In form:
wp_nonce_field( 'save_settings', '_wpnonce' );

// On submission:
if ( ! isset( $_POST['_wpnonce'] ) || ! wp_verify_nonce( sanitize_key( $_POST['_wpnonce'] ), 'save_settings' ) ) {
    wp_die( esc_html__( 'Security check failed.', 'plugin-slug' ) );
}

// AJAX:
check_ajax_referer( 'save_settings', '_wpnonce' );
```

---

## Internationalization (i18n)

| Code | Cause | Fix | Auto? |
|------|-------|-----|-------|
| `WordPress.WP.I18n.MissingTranslatorsComment` | `sprintf()` with `__()` but no translators comment | Add `/* translators: */` | ❌ manual |
| `WordPress.WP.I18n.NonSingularStringLiteralDomain` | Variable used for text domain | Use string literal | ❌ manual |
| `WordPress.WP.I18n.TextDomainMismatch` | Text domain doesn't match plugin | Fix domain | ❌ manual |

**Before / After:**
```php
// WRONG
echo sprintf( __( 'Hello, %s!', 'plugin-slug' ), $name );

// CORRECT
echo sprintf(
    /* translators: %s: user display name */
    __( 'Hello, %s!', 'plugin-slug' ),
    esc_html( $name )
);
```

---

## Array Formatting

| Code | Cause | Fix | Auto? |
|------|-------|-----|-------|
| `WordPress.Arrays.MultipleStatementAlignment.DoubleArrowNotAligned` | `=>` not vertically aligned | Align `=>` with spaces | ✅ yes |
| `Generic.Formatting.MultipleStatementAlignment.NotSame` | `=` signs not aligned | Align `=` signs | ✅ yes |

**Before / After:**
```php
// WRONG
$data = array(
    'product_id' => $id,
    'campaign_name' => $name,
    'order' => $order,
);

// CORRECT
$data = array(
    'product_id'    => $id,
    'campaign_name' => $name,
    'order'         => $order,
);
```

---

## PHP Syntax

| Code | Cause | Fix | Auto? |
|------|-------|-----|-------|
| `Generic.PHP.DisallowShortOpenTag` | Using `<?` instead of `<?php` | Use `<?php` | ✅ yes |
| `WordPress.PHP.StrictInArray.MissingTrueStrict` | `in_array()` without strict mode | Add `true` as third argument | ❌ manual |
| `WordPress.PHP.DevelopmentFunctions` | `var_dump()`, `print_r()` in code | Remove debug code | ❌ manual |
| `WordPress.PHP.DisallowShortTernary` | Using `?:` (Elvis) operator | Use full ternary | ❌ manual |

```php
// WRONG
if ( in_array( $needle, $haystack ) ) { }

// CORRECT
if ( in_array( $needle, $haystack, true ) ) { }
```

---

## WordPress Best Practices

| Code | Cause | Fix | Auto? |
|------|-------|-----|-------|
| `WordPress.WP.AlternativeFunctions.curl_curl_init` | Using `curl_init()` | Use `wp_remote_get()` | ❌ manual |
| `WordPress.WP.AlternativeFunctions.json_encode_json_encode` | Using `json_encode()` | Use `wp_json_encode()` | ❌ manual |
| `WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents` | Using `file_get_contents()` for HTTP | Use `wp_remote_get()` | ❌ manual |
| `WordPress.DateTime.CurrentTimeTimestamp` | `current_time('timestamp')` misuse | Use `time()` for UTC | ❌ manual |
| `WordPress.WP.I18n.HardCodedStringInFunction` | Hardcoded string not translatable | Wrap with `__()` | ❌ manual |

---

## File Protection

| Code | Cause | Fix | Auto? |
|------|-------|-----|-------|
| `WordPress.Security.PluginMenuSlug` | Menu slug not sanitized | Use `sanitize_key()` | ❌ manual |
| `WordPress.Files.FileName.NotHyphenatedLowercase` | Class filename wrong format | Use hyphenated-lowercase OR configure PSR-4 | ❌ manual |

---

## Ignoring Rules Safely

```php
// Single line — always add reason comment first
// Table name is safe — constructed from $wpdb->prefix in constructor.
$wpdb->get_results( "SELECT * FROM {$this->table}" ); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared

// Multiple sniffs on one line
$wpdb->query( $sql ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery

// Block
// phpcs:disable WordPress.DB.DirectDatabaseQuery
$result1 = $wpdb->get_results( $query1 );
$result2 = $wpdb->get_results( $query2 );
// phpcs:enable WordPress.DB.DirectDatabaseQuery

// Entire file (use sparingly)
// phpcs:ignoreFile
```
