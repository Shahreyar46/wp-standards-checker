# 🧠 WP-STANDARDS: GLOBAL MASTER RULESET (v2.0)

> This is the **Ultimate Single Source of Truth** for WordPress Development. It- **Sources**: This ruleset is a fusion of **WordPress-Core**, **WordPress-Extra**, **WordPress-Docs**, and the official **Plugin Check (PCP)** logic extracted from your machine.
- **Internalized Sniffs**: The AI has been trained on the following local sniff categories:
    - `WordPress.Arrays`: Key spacing, alignment, and long syntax.
    - `WordPress.CodeAnalysis`: Assignments in ternary/conditions.
    - `WordPress.DB`: Prepared SQL, restricted functions, placeholders.
    - `WordPress.DateTime`: Proper TZ handling and `current_time`.
    - `WordPress.Files`: Filename structure and include/require.
    - `WordPress.NamingConventions`: Prefixing, snake_case, hook naming.
    - `WordPress.PHP`: Strict in_array, type casts, restricted functions.
    - `WordPress.Security`: XSS, Sanitization, Nonces, CSRF.
    - `WordPress.WP`: I18n, CapitalPDangit, REST API, Cron.
    - `WordPress.WhiteSpace`: Operator/Object/ControlStructure spacing.

---

## 🔝 1. THE CORE CHECKLIST (High Priority)
Before writing or auditing, verify these basic structural rules:
- **Prefixing**: Are ALL functions, classes, hooks, options, and constants prefixed with a unique plugin slug (>= 4 characters)?
- **Tab Indentation**: Are tabs used for indentation instead of spaces?
- **Snake Case**: Are variables, properties, and methods in `snake_case`?
- **Uninstall Safety**: `uninstall.php` MUST check `defined( 'WP_UNINSTALL_PLUGIN' )`.
- **NEW (2025) - External Services**: If the plugin connects to a 3rd party API/Service, it **MUST** be declared in the `readme.txt` file.
- **NEW (2025) - Account Security**: All committers MUST have 2FA enabled on their WP.org account to push updates.
- **Automated Rejection**: Any item flagged as "ERROR" in the "Plugin Repo" category by the official PCP tool is an **Instant Rejection**.
- **Security Guards**: Is `if ( ! defined( 'ABSPATH' ) ) exit;` at the top of every PHP file?
- **Version Compatibility**: Is the code safe for the target PHP and WordPress versions? (Check `knowledge/17_VERSION_COMPATIBILITY.md`).
- **Documentation**: Does every file, class, and function have a DocBlock ending with a period? (Check `knowledge/06_DOCS_STANDARDS.md`).
- **Safe SQL**: Are all queries using `$wpdb->prepare()` with proper placeholders?
- **Late Escaping**: Is every piece of data escaped at the moment of `echo`?
- **Accessibility**: Does every input have a `<label>` and every icon-button an `aria-label`?
- **Policy**: Is tracking opt-in? are admin notices dismissible? no trial-locked local features?

---

## 🕵️ 2. INDEPENDENT AI AUDIT LOGIC
Use these detection patterns when tools like `phpcs` are missing:

| Requirement | Search Pattern | AI Audit Logic |
|---|---|---|
| **Early Exit** | `<?php\s+(?!\s*\/\*\*)` | Ensure first code is `ABSPATH` check. |
| **Escaping** | `echo\s+\$[\w\[\]'"]+(?!\s*[,;])` | Check for missing `esc_*` wrappers. |
| **Sanitization** | `\$(?:_GET\|_POST\|_REQUEST)\[.*\]` | Search for unsanitized superglobals. |
| **SQL Safety** | `\$wpdb->(?!prepare)` | Flag raw SQL method calls. |
| **Prefix Audit** | `function\s+(?![a-z0-9]{4,}_)` | Flag functions with short/shared prefixes. |
| **REST API** | `register_rest_route\(` | Verify `permission_callback` exists. |
| **Obfuscation** | `@Zend;\|ionCube\|sourceguardian` | **Immediate Blocker**. |
| **Updaters** | `Update URI:\|plugin-update-checker` | **Immediate Blocker**. |
| **SQL Placeholders** | `%s`, `%d`, `%f`, `%i` | Use `%i` for identifiers (table/column) in WP 6.2+. |
---

## 🔒 3. SECURITY STANDARDS

### 3.1 Nonce Verification
Must be checked for ALL state-changing actions. Use the **fail-early** pattern:
- ✅ **SECURE**: `if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce(...) ) wp_die();`

### 3.2 User Capability Checks
Capabilities protect against unauthorized users. Use `current_user_can( 'manage_options' )`.
- **AJAX/REST**: Always include a capability check in the handler. Nonce checks are NOT enough.

### 3.3 Late Escaping
Escape every single variable at the moment of `echo`. 
- **Functions**: `esc_html()`, `esc_attr()`, `esc_url()`, `esc_js()`, `wp_kses_post()`.

---

## 🚫 4. FORBIDDEN CONSTRUCTS
- **`extract()`**: Strictly forbidden.
- **`eval()`**: Strictly forbidden.
- **`create_function()`**: Strictly forbidden.
- **`date_default_timezone_set()`**: Forbidden (WP uses UTC).
- **Direct Core Calls**: Never include `wp-load.php` or `wp-config.php`.
- **High-Risk Forbidden Fixes**:
    - **No File Renaming**: Do not change filenames of existing files (breaks includes).
    - **No Global Text Domain Changes**: Do not modify text domains in bulk (breaks translations).
    - **No Public Hook/Method Renaming**: Preserve public-facing names to avoid 3rd party breakage.
    - **Prefix Propagation**: When renaming, you MUST update all references in all files (Global Search required).
    - **Addon Safety**: Do not rename items that the parent plugin (e.g., WC, Elementor) expects for integration.
- **No Standards Suppression**: Strictly FORBIDDEN to use `phpcs:ignore`, `phpcs:disable`, or any comment that bypasses coding standards. Every violation MUST be fixed according to WPCS.

---

## 📛 5. NAMING & STRUCTURE
- **Functions/Vars**: `snake_case`
- **Classes**: `StudlyCaps`
- **Constants**: `UPPER_SNAKE_CASE`
- **Yoda Conditions**: `if ( 'active' === $status )`
- **Indentation**: TABS (4 spaces wide).
- **PSR-4 Alert**: If PSR-4 autoloading is detected (e.g., in `/src`), StudlyCaps file naming is mandatory and overrides the `class-*.php` rule.

---

## 🌍 6. INTERNATIONALIZATION (I18N) STANDARDS

### 6.1 Priority Selection
When implementing i18n for JavaScript (React/Vue/Vanilla), ALWAYS offer the developer a choice between Method 1 and Method 2.

| Method | Best For | Requirement | Fail Risk |
|---|---|---|---|
| **Method 1 (Modern)** | Gutenberg Blocks | `.json` file with MD5 hash naming | HIGH (Silent failures if hash mismatch) |
| **Method 2 (Hybrid)** | Settings Panel, React/Vue | `wp_localize_script` & PHP Bridge | **ZERO** (Most reliable for Loco Translate) |

### 6.2 The Hybrid Implementation Pattern (Recommended)
1.  **PHP Provider**: Create a static `Strings` class (e.g., `includes/class-strings.php`) to return a large map of translated strings.
2.  **JS Bridge**: Enqueue the strings as part of a global object via `wp_localize_script`.
3.  **JS Helper**: 
    - **React**: Use a reactive `useTranslation` hook (preferred) or a global helper.
- **Vue**: Use a reactive `useTranslation` composable (preferred) or a global property.
4.  **Consistency**: Use the EXACT same key in both PHP and JS. Ensure the composable supports parameter interpolation (e.g., `t('key', { param: 'val' })`).

### 6.3 Cleanup Rules
- **No Hardcoded Strings**: Scan for `echo "Text"` or `<span>Text</span>` and replace with `esc_html__()`.
- **Text Domain**: Auto-detect the Text Domain from the main plugin file and use it strictly.
- **Variable Placeholders**: Use `%s` or `%d` in strings and handle with `sprintf()` in PHP or a formatting helper in JS.

### 6.4 The "Surgical" Accuracy Protocol (100% Reliability)
To prevent missing lines or breaking UI components in complex apps (Vue/React):
1.  **Component-by-Component**: Process only ONE component at a time. Never do bulk directory migrations.
2.  **Lookup Table First**: List all strings found in a file before editing it. Verify the list with the developer.
3.  **No Code Bloat**: Only add the translation helper and the keys. DO NOT change markup, classes, or logic.
4.  **PHP Parity**: Every key used in JS **MUST** exist in the corresponding PHP Provider class immediately.
5.  **Deduplication**: ALWAYS check for existing keys before creating a new one. If the same string exists under a different key, reuse it to prevent PHP file bloat.
6.  **Small Chunks**: For files >300 lines, use specific chunk-based edits to avoid AI truncation bugs.
---

## ♿ 7. ACCESSIBILITY RULES
Strictly follow `knowledge/12_ACCESSIBILITY_STANDARDS.md`.
- **Labels**: Every form field NEEDS a `<label>`.
- **Buttons**: Every icon-only button NEEDS an `aria-label`.
- **Focus**: Never use `outline: none` in CSS.
- **Contrast**: Maintain 4.5:1 ratio for all text.

---

## ⚖️ 8. WP.ORG POLICY & PRIVACY
Strictly follow `knowledge/13_POLICY_AND_PRIVACY.md`.
- **No Trialware**: Local functionality must NOT be locked.
- **Opt-in Only**: Tracking, usage data, and developer credits MUST be opt-in.
- **Nonces & Caps**: Every admin action MUST check nonces AND `current_user_can()`.
- **Admin Nags**: Notices MUST be dismissible and contextual.
- **Privacy Hooks**: Implements `wp_privacy_personal_data_exporters` and `wp_privacy_personal_data_erasers`.
- **Data Policy**: Minimizes data collection, prioritizes post meta/transients over custom tables.
- **Surgical I18n**: For full translation pipeline (POT/PO/MO) and auto-translation, CALL the `wp-translate` skill.
