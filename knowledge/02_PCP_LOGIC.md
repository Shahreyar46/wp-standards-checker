# 🧩 PLUGIN CHECK (PCP) — COMPLETE DETECTION LOGIC
> Source: Local `plugin-check` plugin source code + phpcs-rulesets.
> Updated: March 2026

The PCP tool has **5 categories**: `general`, `plugin_repo`, `security`, `performance`, `accessibility`.
Any "ERROR" in the `plugin_repo` category = **Instant WP.org Rejection**.

---

## 🔬 CATEGORY: PLUGIN REPO (Instant Rejection on Error)

### 1. Code Obfuscation (Severity 10)
Immediate failure if ANY of these are detected:
- `<?php @Zend;` — Zend encoder
- `ionCube` — ionCube loader
- `sourceguardian.com` / `function_exists('sg_load')` / `$__x=` — SourceGuardian
- `base64_decode` used for executable code (not data)

### 2. Custom Updaters (Severity 9)
Forbidden patterns in ANY file:
- `Update URI:` in plugin header
- `plugin-update-checker.php` inclusion
- `WP_GitHub_Updater` class usage
- `class [A-Z_]+_Plugin_Updater`
- Hooking into `site_transient_update_plugins`

### 3. Direct File Access Guard (Severity 8)
- Every PHP file MUST have: `if ( ! defined( 'ABSPATH' ) ) exit;`
- `uninstall.php` MUST have: `if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) exit;`

### 4. File Type Restrictions (Severity 8)
Forbidden files in the plugin ZIP:
- **Compressed**: `.zip`, `.gz`, `.tgz`, `.rar`, `.tar`, `.7z`
- **PHAR**: `.phar` files
- **VCS Directories**: `.git`, `.svn`, `.hg`, `.bzr`
- **Hidden Files**: Any file starting with `.` (outside `vendor/`, `node_modules/`)
  - Exception: `.distignore` and `.gitignore` are allowed
- **Application Files**: `.exe`, `.sh`, `.so`, `.a`, `.bin`, `.deploy`, `.dist`, `.dmg`, `.pkg`, `.obj`, etc.
- **AI Instruction Dirs**: `.cursor`, `.claude`, `.aider`, `.continue`, `.windsurf`, `.ai`
- **GitHub CI Directory**: `.github/` directory (severity 9 warning)
- **Unexpected Markdown**: Any `.md` file in plugin root that is NOT: `README.md`, `readme.txt`, `LICENSE`, `LICENSE.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`

### 5. WP Core Library Files (Severity 8)
Forbidden to bundle files already in WP core:
- `jquery*.js`, `jquery-ui*.js`, `backbone.min.js`, `lodash.min.js`, `moment.min.js`, `underscore*.js`
- `clipboard.min.js`, `codemirror.min.js`, `thickbox.min.js`, `twemoji.min.js`
- `getid3.php`, `pclzip.lib.php`, `PasswordHash.php`, `PHPMailer.php`, `SimplePie.php`
- ...and 20+ other WP-bundled libraries

### 6. Badly Named Files (Severity 8)
- File/folder names MUST NOT contain spaces or special characters: `!@#$%^&*()+=[]{};:"'<>,?/\|`~`
- Duplicate folder/file names with different cases (case-sensitive filesystem issue)

### 7. Plugin Header Validation (Severity 7-9)
Required and validated fields in the main PHP file:
| Field | Rule |
|---|---|
| `Plugin Name` | Must exist. Must have ≥5 alphanumeric chars. Not a placeholder name. |
| `Description` | Must exist. Must not be default placeholder text. |
| `Version` | Must exist. Must match pattern `[a-z0-9.-]+`. Must match `Stable Tag`. |
| `License` | Must exist. Must be GPL-2.0-or-later compatible. Must match readme license. |
| `Text Domain` | Must be `lowercase-with-hyphens`. Should match plugin folder slug. |
| `Domain Path` | If present, must start with `/` and point to an existing directory. |
| `Plugin URI` | Must be a valid URL. Must not use discouraged domains. |
| `Author URI` | Must be a valid URL. Must not use discouraged domains. |
| `Network` | If present, value must be exactly `true`. |
| `Requires at least` | Must be a valid WP version like `6.4`. |
| `Requires PHP` | Must be a valid PHP version like `7.4`. |
| `Requires Plugins` | Must be a comma-separated list of WP.org-formatted slugs. |
| `Update URI` | FORBIDDEN — causes instant rejection if present. |

### 8. readme.txt Validation (Severity 7-9)
Required sections and rules:
- **Must exist** — `readme.txt` (or `README.md`) is mandatory for all multi-file plugins.
- **Plugin Name** — `=== Plugin Name ===` header must exist at top.
- **Stable tag** — Must NOT be `trunk`. Must exactly match the plugin `Version` header.
- **Tested up to** — Must be current WP major.minor (e.g., `6.7`). NOT a patch version (`6.7.1` is wrong). Must not be outdated (<latest). Must not be future (>latest+0.1).
- **License** — Must exist. Must match GPL-2.0+ SPDX identifier. Must match plugin header license.
- **Contributors** — Must be comma-separated WP.org usernames (case-sensitive). No restricted usernames.
- **Tags** — Maximum 5 tags. No banned tag words.
- **Short Description** — Must exist. Must be ≤150 chars. Must not be default text ("Here is a short description...").
- **Upgrade Notice** — Each version's notice must be ≤300 chars.
- **Default Text** — Readme must not contain default placeholder text like `"tag1"`.

### 9. Trademarks (Severity varies)
Plugin name/slug must NOT start with brand trademarks like `Google`, `Facebook`, `YouTube`, `Twitter`, `Apple`, `Microsoft`, `Amazon`, `WordPress`, `Woo`, `WooCommerce`, `Elementor`, `Divi`, `Yoast`, `Gutenberg`, etc.

### 10. Prefixing (Severity 7)
- All global functions, classes, constants, options, hooks must use a unique prefix ≥4 characters.
- `PHPCS Sniff`: `WordPress.NamingConventions.PrefixAllGlobals`

### 11. Uninstall Cleanup (Severity 8)
- `uninstall.php` must contain `WP_UNINSTALL_PLUGIN` guard.
- The AI should ALSO verify that the uninstall routine actually DELETES options, transients, custom tables, and user meta created by the plugin — not just guard the file.

### 12. Setting Sanitization Check
- Admin settings must sanitize ALL input via the `sanitize_callback` in `register_setting()`.
- Checked by `Setting_Sanitization_Check`.

### 13. No Unfiltered Uploads
- `wp_handle_upload()` or equivalent must be used. Raw `move_uploaded_file()` is forbidden.

### 14. No Localhost References
- Production plugins must NOT hardcode `localhost` or `127.0.0.1` URLs.

### 15. No Offloading Files
- Plugin must not download external files during activation or in the main code path.

### 16. Plugin Content Check
- Plugin must have actual useful functionality. "Hello World" or demo-only plugins are rejected.

---

## 🔬 CATEGORY: PHPCS RULESETS (plugin-check.ruleset.xml)

| PHPCS Sniff | Severity | Notes |
|---|---|---|
| `WordPress.DB.PreparedSQL` | Error | Raw SQL queries |
| `WordPress.DB.PreparedSQLPlaceholders` | Error | Wrong `%s`/`%d` usage |
| `WordPress.Security.NonceVerification` | Warning | GET/POST without nonce |
| `WordPress.Security.ValidatedSanitizedInput` | Warning | Unsanitized input |
| `WordPress.Security.SafeRedirect` | Error | Use `wp_safe_redirect()` not `wp_redirect()` |
| `WordPress.WP.AlternativeFunctions` | Error | Use WP API instead of PHP native (curl→wp_remote_get, file→WP_Filesystem) |
| `WordPress.DB.RestrictedClasses` | Error (7) | No raw PHP DB classes (PDO, mysqli) |
| `WordPress.DB.RestrictedFunctions` | Error (7) | No `mysql_*` functions |
| `WordPress.WP.DeprecatedFunctions` | Error | Use of deprecated WP functions |
| `WordPress.WP.DeprecatedClasses` | Error | Use of deprecated WP classes |
| `WordPress.WP.DeprecatedParameters` | Error | Use of deprecated function parameters |
| `WordPress.WP.DeprecatedParameterValues` | Error (7) | Deprecated values for WP function args |
| `WordPress.WP.DiscouragedConstants` | Error (7) | Using deprecated WP constants |
| `WordPress.WP.DiscouragedFunctions` | Warning (6) | Discouraged WP functions |
| `WordPress.DateTime.RestrictedFunctions` | Error | `date_default_timezone_set()` forbidden |
| `WordPress.Security.PluginMenuSlug` | Warning (6) | Path disclosure in `add_theme_page()` |
| `WordPress.PHP.DevelopmentFunctions` | Warning | `var_dump`, `print_r`, `error_log` in code |
| `Generic.PHP.BacktickOperator` | Error (7) | Backtick shell execution forbidden |
| `PluginCheck.CodeAnalysis.Heredoc` | Error (7) | HEREDOC syntax forbidden |
| `PluginCheck.CodeAnalysis.ShortURL` | Warning (6) | Short redirected URLs (bit.ly etc.) |
| `Generic.PHP.DiscourageGoto` | Error (7) | `goto` statement forbidden |
| `Generic.PHP.DisallowShortOpenTag` | Error (7) | `<?` and `<?=` short tags forbidden |
| `Generic.PHP.DisallowAlternativePHPTags` | Error (7) | `<% %>` ASP tags forbidden |
| `Generic.Files.ByteOrderMark` | Error (7) | UTF-8 BOM in PHP files causes header issues |
| `Generic.PHP.ForbiddenFunctions` | Error (7) | `passthru`, `proc_open`, `eval`, `create_function`, `str_rot13`, `move_uploaded_file` |
| `Squiz.PHP.DiscouragedFunctions` | Warning | `set_time_limit`, `ini_set`, `ini_alter`, `dl` |
| `PluginCheck.CodeAnalysis.RequiredFunctionParameters` | Error (7) | Missing required params in WP function calls |
| `PluginCheck.CodeAnalysis.DiscouragedFunctions.load_plugin_textdomainFound` | Error (7) | Old-style `load_plugin_textdomain()` in init |

---

## 🔬 CATEGORY: SECURITY

| Check | Rule |
|---|---|
| `Late_Escaping_Check` | Every `echo` must escape output with `esc_html()`, `esc_attr()`, `esc_url()`, `wp_kses_post()`, etc. |
| `Nonce_Verification_Check` | All POST/AJAX state-changing actions must verify nonce. |
| `Direct_DB_Queries_Check` | All raw `$wpdb->query()` calls flagged for review. |
| `Safe_Redirect_Check` | Use `wp_safe_redirect()` instead of `wp_redirect()`. |
| Missing Capability Check | All admin actions must check `current_user_can()`. |
| REST API Permission Callback | Every `register_rest_route()` must define `permission_callback`. |
| REST API Sanitize Callback | Every REST arg must have a `sanitize_callback`. |

---

## 🔬 CATEGORY: PERFORMANCE

| Check | Threshold | Rule |
|---|---|---|
| `Enqueued_Scripts_Size_Check` | 300KB total | Cumulative plugin JS on page must be <300KB |
| `Enqueued_Styles_Size_Check` | 300KB total | Cumulative plugin CSS on page must be <300KB |
| `Enqueued_Scripts_In_Footer_Check` | — | Scripts should be enqueued in the footer |
| `Enqueued_Scripts_Scope_Check` | — | Scripts must not be enqueued globally (only on relevant pages) |
| `Enqueued_Styles_Scope_Check` | — | Styles must not be enqueued globally (only on relevant pages) |
| `Non_Blocking_Scripts_Check` | — | Scripts should use `defer` or `async` where possible |
| `Performant_WP_Query_Params_Check` | — | Use `no_found_rows => true` when pagination is not needed |
| `Enqueued_Resources_Check` | — | Resources must use `wp_enqueue_*` not direct `<script>`/`<link>` tags |

---

## 🔬 CATEGORY: GENERAL

| Check | Rule |
|---|---|
| `I18n_Usage_Check` | All user-facing strings MUST be wrapped in i18n functions (`__()`, `_e()`, `esc_html__()`, etc.). |

---

## 📝 Key Fix Patterns

```php
// ❌ WRONG - Raw redirect
wp_redirect( $url );

// ✅ CORRECT - Safe redirect
wp_safe_redirect( esc_url_raw( $url ) );
exit;

// ❌ WRONG — Scripts in header
wp_enqueue_script( 'my-script', $src );  // No position set

// ✅ CORRECT — Scripts in footer
wp_enqueue_script( 'my-script', $src, array(), '1.0.0', true );

// ❌ WRONG — Global CSS enqueue
add_action( 'wp_enqueue_scripts', 'my_enqueue_all' ); // Everywhere

// ✅ CORRECT — Scoped enqueue
add_action( 'wp_enqueue_scripts', function() {
    if ( is_singular( 'post' ) ) {
        wp_enqueue_style( 'my-style', $src );
    }
});
```
