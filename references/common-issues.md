# WordPress Plugin Development - Universal Master Standards & Fix Guide (Ultimate Merged Edition)

This document is the **Ultimate Single Source of Truth** for WordPress development. It merges 100% of the rules from all sources:
1.  **WP.org Plugin Review Team Rejection Logs** (Real email feedback).
2.  **Plugin Check (PCP) Source Code** (Exact detection logic and regex patterns).
3.  **Your /Rules Folder** (The specialized coding standards and checklists you provided).
4.  **WordPress Coding Standards (WPCS)** (Naming, Formatting, Yoda, Comments).
5.  **Official WordPress Security & Database APIs** (Sanitization, Escaping, Prepared SQL).

---

## 🔝 THE CORE CHECKLIST (High Priority)
Before writing or auditing, verify these basic structural rules:
- [ ] **Prefixing**: Are ALL functions, classes, hooks, options, and constants prefixed with a unique plugin slug (>= 4 characters)?
- [ ] **Tab Indentation**: Are tabs used for indentation instead of spaces?
- [ ] **Snake Case**: Are variables, properties, and methods in `snake_case`?
- [ ] **Security Guards**: Is `if ( ! defined( 'ABSPATH' ) ) exit;` at the top of every PHP file?
- [ ] **Safe SQL**: Are all queries using `$wpdb->prepare()` with proper placeholders (`%d`, `%s`, `%f`, `%i`)?
- [ ] **Escaping Output**: Is every piece of data escaped at the moment of `echo` using the correct context (`esc_html`, `esc_attr`, etc.)?
- [ ] **Sanitization**: Is every input (`$_POST`, `$_GET`, etc.) unslashed and sanitized before use?

---

## 1. SUBMISSION BLOCKERS (PCP & Review Team Rules)

### 1.1 Direct File Access Guards
**Rule**: Every PHP file containing executable logic must have a die/exit guard.
- **✅ CORRECT**: `if ( ! defined( 'ABSPATH' ) ) exit;`
- **PCP Logic**: Safe for classes/interfaces; mandatory for files with `add_action`, `define`, or procedural code.

### 1.2 Binary / Minified Files without Source
**Rule**: If you include `.min.js`, `.min.css`, or webpack bundles, you **MUST** include the source files (e.g. `src/`) or provide a working, public link in `readme.txt`.
- **Blocker**: Rejection for files containing `webpackBootstrap` without corresponding source code.

### 1.3 Calling Core Files Directly
**Rule**: Never include `wp-load.php` or `wp-config.php`.
- **Fix**: Use action hooks (`init`, `admin_init`) or create REST/AJAX endpoints.

### 1.4 Hardcoded Paths & Constants
**Rule**: Use WordPress functions instead of hardcoded strings or internal constants like `WP_CONTENT_DIR`.
- **✅ CORRECT**: `plugin_dir_path( __FILE__ )` (for paths) or `plugins_url()` (for URLs).

### 1.5 Custom Updaters & Update URI
**Rule**: You cannot include custom update logic if hosted on WordPress.org.
- **PCP Check**: Blocks `Update URI` header, `plugin-update-checker` class, and `WP_GitHub_Updater`.

### 1.6 Trademark Infringement
**Rule**: Plugin Name must NOT start with a trademark (e.g. "Google", "Facebook").
- **✅ CORRECT**: `Importer for Google Maps` (Descriptive).
- **❌ WRONG**: `=== Google Maps Importer ===` (Implies official status).

### 1.7 Changing Other Plugins' Activation
**Rule**: Never activate or deactivate other plugins via code.
- **❌ FORBIDDEN**: `activate_plugin()`, `deactivate_plugins()`, `new Plugin_Upgrader()`.
- **Fix**: Use `Requires Plugins:` header for dependencies (WP 6.5+).

### 1.8 Arbitrary CSS/JS/PHP Insertion
**Rule**: Saving raw CSS, JS, or PHP in settings for frontend rendering is **strictly forbidden**.
- **❌ WRONG**: `update_option('custom_js', $_POST['js'])` + `echo '<script>' . get_option('custom_js') . ...`
- **Fix**: Use structured settings (color pickers, font selectors) and generate output programmatically.

### 1.9 Invalid Plugin/Author URLs
**Rule**: `Author URI` and `Plugin URI` must be live, public, and not placeholders (no `example.com` or `.local`).


---

## 2. SECURITY STANDARDS (The "Golden Trio")

### 2.1 Nonce Verification (Fail Early Pattern)
**Rule**: Nonces must be checked for ALL state-changing actions. The check must be **fail-early**.
- **❌ DANGEROUS (Bypassable)**: `if ( ! empty( $nonce ) && ! wp_verify_nonce(...) )` (If nonce is missing, logic continues!)
- **✅ SECURE**:
  ```php
  if ( ! isset( $_POST['my_nonce'] ) || ! wp_verify_nonce( sanitize_key( $_POST['my_nonce'] ), 'my_action' ) ) {
      wp_die( esc_html__( 'Security check failed.', 'text-domain' ) );
  }
  ```

### 2.2 Input Sanitization & Superglobals
**Rule**: Sanitize everything from `$_GET`, `$_POST`, `$_REQUEST`, and `$_SERVER`.
- **Wholesale Processing**: Never process entire arrays (e.g. `foreach( $_POST as... )`).
- **Mantra**: `wp_unslash()` → Sanitize (e.g. `sanitize_text_field()`) → Validate.

### 2.3 Output Escaping (Late Escaping)
**Rule**: Escape every single variable at the moment of `echo`. Even if it was sanitized on input.
- **Functions**: `esc_html()`, `esc_attr()`, `esc_url()`, `esc_js()`, `wp_kses_post()`.
- **JSON Output**: For inline script data, use `wp_json_encode()`.

### 2.4 User Capability Checks
**Rule**: Capabilities protect against unauthorized users. Use `current_user_can( 'manage_options' )`.
- **AJAX/REST**: Always include a capability check in the handler. Nonce checks are NOT enough.

### 2.5 REST API Permissions Callback
**Rule**: `register_rest_route()` **MUST** have a `permission_callback`.
- **❌ BLOCKER**: Key missing entirely.
- **❌ HIGH RISK**: Setting `permission_callback` to `__return_true` on POST/PUT endpoints or sensitive GET data.
- **✅ CORRECT**:
  ```php
  'permission_callback' => function() { return current_user_can( 'manage_options' ); }
  ```

### 2.6 Sensitive Data Exposure
**Rule**: Never leave debug output or secrets in production.
- **Search for**: `var_dump`, `print_r`, `error_log` (with dynamic data), hardcoded API keys.
- **Fix**: Use logging only in development; never store plain-text passwords.


---

## 3. DATABASE & OPTIONS

### 3.1 Prepared SQL Calls
**Rule**: All raw queries must use `$wpdb->prepare()`. Direct `mysqli` or `PDO` is strictly forbidden.
- **Placeholders**: `%d`, `%s`, `%f`.
- **Table Names**: Use `%i` for identifiers (WP 6.2+) or interpolate with a prefix and `phpcs:ignore`.

### 3.2 Option & Transient Prefixing
**Rule**: Options and Transients MUST be uniquely prefixed with your plugin slug.
- **❌ WRONG**: `get_option( 'cache' )`.
- **✅ CORRECT**: `get_option( 'my_plugin_prefix_cache' )`.

---

## 4. WPCS CODING STANDARDS (Your /Rules Logic)

### 4.1 Yoda Conditions
**Rule**: Constant on the left, variable on the right.
- **✅ CORRECT**: `if ( null === $result )`, `if ( 'active' === $status )`.

### 4.2 Naming Conventions
**Rule**: `snake_case` for functions/variables, `StudlyCaps` for classes, `UPPER_SNAKE` for constants.
- **Method Names**: `find_by_id()` ✅, `findById()` ❌.

### 4.3 Comments & PHPDoc
**Rule**: Inline comments and DocBlocks must end with a period (`.`).
- **Hook Documentation**: Always document actions and filters with descriptions of params.

### 4.4 Indentation
**Rule**: TABS for indentation. No spaces.

---

## 5. COMPLIANCE & PERFORMANCE

### 5.1 "Powered By" & Credit Links
**Rule**: attribution links on the front-end **MUST BE OPT-IN**. Default to off.
- **Check**: Look for "Powered by", "Built with" in PHP, JS, or JSX/React templates.
- **Requirement**: Must have an unchecked-by-default checkbox in settings to enable.

### 5.2 Hardcoded URLs in JavaScript
**Rule**: Never hardcode `admin-ajax.php` or `wp-admin` paths in scripts.
- **❌ WRONG**: `const url = '/wp-admin/admin-ajax.php';`
- **✅ CORRECT**: Localize from PHP:
  ```php
  wp_localize_script( 'handle', 'myObj', [ 'ajax_url' => admin_url('admin-ajax.php') ] );
  ```


### 5.3 PHP Code Obfuscation (PCP Source Logic)
**Rule**: Forbidden: `@Zend;`, `ionCube`, `sourceguardian.com`, `eval(base64_decode(`. All code must be human-readable.

### 5.4 Enqueue vs Direct Output
**Rule**: Never `echo <script>` or `<style>` tags directly. Use `wp_enqueue_script()` and `wp_enqueue_style()`.

### 5.5 Remote Resource Loading
**Rule**: Offloading JS/CSS to CDNs is disallowed (except for Google Fonts). All files must be bundled locally.

### 5.6 PHP Short Tags
**Rule**: Always use `<?php`. Never use `<?` or `<?=`.

### 5.7 Keyword Stuffing (Readme)
**Rule**: No more than 5 tags in `readme.txt`. Avoid repetitive keyword dumps.


---

## 6. SEARCH PATTERNS FOR AUDIT

| Search Pattern | Identifies |
|---|---|
| `echo \$|print \$` | Missing escaping (late escaping audit) |
| `\$_POST| \$_GET| \$_REQUEST` | Missing sanitization (input audit) |
| `\$wpdb->.*[\"']` | Interpolated SQL (injection audit) |
| `!empty.*nonce.*wp_verify_nonce` | Bypassable nonce patterns |
| `date_default_timezone_set` | Timezone violations |
| `@(?!zend_)([a-z_]+)\(` | Error suppression audit (`@` operator) |
| `ob_start\(\)` | Potential unclosed buffer audit |
| `register_rest_route` | REST permission callback audit |
| `window\.location\.origin.*wp-admin` | Hardcoded AJAX URLs in JS |
| `var_dump\(|print_r\(` | Production debug output |
| `activate_plugin\(|deactivate_plugins\(` | Plugin activation hijacking |
| `Powered by|Built with` | Attribution opt-in audit |
| `<textarea.*custom_js` | Arbitrary code insertion audit |

