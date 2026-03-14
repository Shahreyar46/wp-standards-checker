# Plugin Check (PCP) - Learned Logic & Patterns

This reference contains the *exact* detection logic extracted from the WordPress.org Plugin Check (PCP) source code. Use these patterns to identify and fix blockers early.

---

## 1. PLUGIN REPO CATEGORY (Repo Blockers)

### 1.1 Direct File Access (`Direct_File_Access_Check.php`)
PCP classifies files into "Safe for direct access" and "Procedural" (Must have guard).

**Procedural Traits (Needs Guard):**
- Contains `define(`
- Contains `add_action(` or `add_filter(`
- Contains function definitions: `function name(`
- Contains procedural logic (variable assignments, loops, echo)

**Safe Traits (No Guard Needed):**
- Contains ONLY `class`, `interface`, or `trait` definitions.
- Asset files (files that only return an array, e.g., configuration files).

**Valid Guard Patterns:**
1. `defined( 'ABSPATH' ) || exit;`
2. `defined( 'WPINC' ) || exit;`
3. `if ( ! defined( 'ABSPATH' ) ) exit;`
4. `if ( ! defined( 'WPINC' ) ) exit;`
5. `if ( ! defined( 'ABSPATH' ) ) { die(); }`

---

### 1.2 Code Obfuscation (`Code_Obfuscation_Check.php`)
PCP uses regex to find signatures of known obfuscators.

**Patterns to find:**
- **Zend Guard**: `(\<\?php \@Zend;)|(This file was encoded by)`
- **Source Guardian**: `(sourceguardian\.com)|(function_exists\('sg_load'\))|(\$__x=)`
- **IonCube**: `ionCube` (anywhere in file)
- **Base64 Execution**: `eval(base64_decode(` (highly suspicious)

---

### 1.3 Plugin Updater (`Plugin_Updater_Check.php`)
PCP blocks any code that alters the core WordPress update routine.

**Blocked Header:**
- `Update URI:` or `UpdateURI` in the main plugin file header.

**Blocked Strings/Classes:**
- `'plugin-update-checker'` (string or file name)
- `WP_GitHub_Updater` or `WPGitHubUpdater`
- Any class matching `[A-Z_]+_Plugin_Updater`
- `updater\.\w+\.\w{2,5}` (e.g. `updater.php`)
- Hooks: `site_transient_update_plugins`, `auto_update_plugin`, `pre_set_site_transient_update_\w+`

---

### 1.4 Trademark Infringement (`Trademarks_Check.php`)
PCP checks for trademarked names at the START of titles or slugs to avoid implying "official" status.

**Check logic:**
- Is the slug prefixed with a trademark (e.g. `google-`, `facebook-`)?
- Does the title start with the trademark (e.g. `Google Sheets Importer`)?
- **Allowed:** `Importer for Google Sheets` (descriptive use).

---

### 1.5 Localhost Check (`Localhost_Check.php`)
PCP warns about hardcoded dev environments.

**Patterns:**
- `localhost`
- `127.0.0.1`

---

## 2. SECURITY CATEGORY

### 2.1 Bypassable Nonce Patterns (`VerifyNonceSniff.php`)
PCP looks for logical errors that make `wp_verify_nonce` ineffective.

**❌ LOGIC ERRORS (Blockers):**
```php
// Error: If nonce is missing, the whole condition is false, and code skips the check!
if ( isset( $_POST['nonce'] ) && ! wp_verify_nonce( $_POST['nonce'], 'action' ) ) {
    wp_die();
}

// Error: If nonce EXISTS, the !isset is false, skipping the check!
if ( ! isset( $_POST['nonce'] ) && ! wp_verify_nonce( $_POST['nonce'], 'action' ) ) {
    wp_die();
}

// Warning: If first condition is true, nonce verification is skipped
if ( current_user_can('admin') || wp_verify_nonce( $_POST['nonce'], 'action' ) ) { ... }
```

**✅ CORRECT PATTERN:**
```php
if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], 'action' ) ) {
    wp_die();
}
```

---

### 2.2 Setting Sanitization (`Setting_Sanitization_Check.php`)
PCP checks that settings saved via the Settings API are sanitized.

**Logic:**
- Scans `register_setting( $group, $option, $args )`.
- Flags an error if `$args` array is missing or does NOT have a `sanitize_callback` key.

---

### 2.3 Late Escaping (`Late_Escaping_Check.php`)
PCP uses `WordPress.Security.EscapeOutput` but specifically highlights:
- `OutputNotEscaped`: Variables echoed without escaping.
- `UnsafePrintingFunction`: Use of `_e()` or `__()` inside `echo` without escaping.
- `UnsafeSearchQuery`: Use of `get_search_query()` without `esc_attr()`.

---

## 3. PERFORMANCE CATEGORY

### 3.1 Option Autoloading (`Autoload_Check.php`)
PCP warns if you save large amounts of data to a single option with `autoload` set to `yes` (default).

**Patterns:**
- `update_option( 'key', $large_data, 'yes' )`
- **Recommendation:** Use `autoload` => `false` for data not needed on every page load.

### 3.2 Remote Requests (`Remote_Request_Check.php`)
- Warns against `wp_remote_get()` calls without a `timeout` argument.
- Warns against calls that don't check `is_wp_error()` on the response.

---

## 4. GENERAL CATEGORY

### 4.1 PHP Short Tags (`PHP_Short_Tags_Check.php`)
- Blocked: `<?` and `<?=`.
- Must use `<?php`.

### 4.2 Error Suppression (`Error_Suppression_Check.php`)
- Blocked: `@function_call()`.
- PCP considers this a blocker for the public repo.

---

## Summary of PCP Implementation Rules
When fixing code, do not just "run PCP". Instead, apply these logic rules derived directly from the Plugin Check source code. This ensures the code will pass PCP successfully when the user eventually runs it.
