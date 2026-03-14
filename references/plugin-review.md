# WordPress.org Plugin Review — All 27 Rejection Categories

> These are **real** review rejection emails received from the WordPress.org Plugin Review Team.
> Real code examples are included for each category.

---

## 🔴 BLOCKERS — Will Cause Rejection

---

### 1. Missing composer.json

**Review team message:**
> We noticed your plugin is using Composer to handle library dependencies. The composer.json file describes the dependencies of your project. As one of the strengths of open source is the ability to review, observe, and adapt code, we would like to ask you to include that file in your plugin.

**Detection:**
- `vendor/` directory exists (i.e. loaded with `require 'vendor/autoload.php'`)
- But no `composer.json` in plugin root

**Fix:** Add `composer.json` to git and include it in the plugin zip. Even if only used for development.

---

### 2. No Publicly Documented Source for Minified Content

**Review team message:**
> We cannot find a non-compiled version of your javascript and/or css related source code. We require you to include the source code and/or a link to the non-compressed developer libraries in your readme.

**Real plugin examples:**
```
build/admin-archiving-notice.js:1  /******/ (() => { // webpackBootstrap
build/index.js:1  /******/ (() => { // webpackBootstrap
build/admin.js:1  /******/ (() => { // webpackBootstrap
```

**Fix options:**
1. Include full `src/` directory in the plugin package, OR
2. Add to `readme.txt`: a link to your public GitHub repo + build instructions (`npm install && npm run build`)

**Guideline:** https://developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/#4-code-must-be-mostly-human-readable

---

### 3. Calling Core Loading Files Directly

**Review team message:**
> Calling core files like wp-config.php, wp-blog-header.php, wp-load.php directly via an include is not permitted. These calls are prone to failure as not all WordPress installs have the exact same file structure. In addition it opens your plugin to security issues.

**Real plugin examples:**
```php
includes/Appsero/Insights.php:613       include ABSPATH . '/wp-admin/includes/plugin.php';
includes/Migrator/WordPressInstaller.php:33  require_once(ABSPATH . 'wp-load.php');
includes/Migrator/DatabaseSwitcher.php:92    include_once ABSPATH . 'wp-admin/edit.php';
```

**Fix:** Use action hooks, AJAX endpoints, or REST API endpoints instead.

---

### 4. Incorrect File/Directory Path References

**Review team message:**
> We detected that the way your plugin references some files, directories and/or URLs may not work with all WordPress setups. There are hardcoded references or you're using the WordPress internal constants.

**Real plugin examples:**
```php
includes/Appsero/Client.php:191  if ( strpos( $this->file, WP_CONTENT_DIR . '/themes/' ) === false ) {
includes/Appsero/Client.php:203  $this->basename = str_replace( WP_CONTENT_DIR . '/themes/', '', $this->file );
```

**Fix:**
```php
plugin_dir_path( __FILE__ )  // Where your plugin lives
plugin_dir_url( __FILE__ )   // URL to your plugin
plugins_url( 'file.php', __FILE__ )
wp_upload_dir()              // For writing files (write here, not in plugin dir)
```

---

### 5. Unsafe SQL Calls

**Review team message:**
> When making database calls, it's highly important to protect your code from SQL injection vulnerabilities. You need to update your code to use wpdb calls and prepare() with your queries.

**Real plugin examples:**
```php
// Direct mysqli — completely forbidden
includes/Helpers/DBHelper.php:44  new mysqli($this->main_db_host, ...);

// Interpolated variables in SQL — SQL injection risk
"SELECT * FROM $table_name LIMIT $offset, $per_page"
// PHPCS output: ERROR WordPress.DB.PreparedSQL.InterpolatedNotPrepared

// IN clause without placeholders
$wpdb->prepare( "UPDATE $table_name SET deleted_at = %s WHERE id IN (" . implode(',', $ids) . ")", $val );
// PHPCS output: ERROR WordPress.DB.PreparedSQL.NotPrepared
```

**Fix:**
```php
// Use %i for table names (WordPress 6.2+) — best approach
$results = $wpdb->get_results(
    $wpdb->prepare( 'SELECT * FROM %i LIMIT %d, %d', $this->table, $offset, $per_page ),
    ARRAY_A
);

// IN clause with correct placeholders
$placeholders = implode( ', ', array_fill( 0, count( $ids ), '%d' ) );
$results = $wpdb->get_results( // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
    $wpdb->prepare( "SELECT * FROM {$wpdb->prefix}table WHERE id IN ($placeholders)", $ids ) // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
);
```

---

### 6. Text Domain Mismatch with Plugin Slug

**Review team message:**
> The "text domain" must be the same as your plugin slug so that the plugin can be translated by the community. If this plugin slug is "archive-master-archive-content-auto-archive-orders-for-woocommerce" then all i18n functions should use that as the text domain.

**Real example:**
```
Plugin slug:  archive-master-archive-content-auto-archive-orders-for-woocommerce
Code uses:    __( 'Hello', 'archive-master' )  ← WRONG — must match slug exactly
```

**Fix:** `Text Domain:` in plugin header + all `__()`, `_e()`, `esc_html__()` etc. must ALL use the exact plugin slug.

---

### 7. Processing Whole Input Stack

**Review team message:**
> We strongly recommend you never attempt to process the whole $_POST/$_REQUEST/$_GET stack. Instead, you should only be attempting to process the items within that are required for your plugin to function.

**Real plugin examples:**
```php
includes/Helpers/Io.php:49  $input = file_get_contents( 'php://input' );  // entire raw body
includes/Helpers/Io.php:54  $input = $_REQUEST;  // entire superglobal
```

**Fix:**
```php
// Only access the specific keys you need
$name = isset( $_POST['name'] ) ? sanitize_text_field( wp_unslash( $_POST['name'] ) ) : '';
$id   = isset( $_GET['id'] )   ? absint( $_GET['id'] ) : 0;
```

---

### 8. Variables and Options Not Escaped When Echo'd

**Review team message:**
> All variables that are echoed need to be escaped when they're echoed. We call this 'escaping late.' Besides protecting from XSS, escaping late keeps the future you safe.

**Real plugin examples:**
```php
includes/wppool/class-plugin.php:1003  wp_add_inline_script( 'wppool-plugins', $this->get_inline_scripts() );
includes/Export/ClassExportXml.php:87  echo $xml->asXML();  // XML not escaped!
includes/wppool/class-plugin.php:1008  wp_add_inline_style( 'wppool-plugins', $this->get_inline_styles() );
```

**Fix:**
```php
echo esc_html( $variable );
echo esc_attr( $attr );
echo esc_url( $url );
echo wp_json_encode( $data );  // use this instead of json_encode for output
wp_add_inline_script( 'handle', wp_json_encode( $data ) );  // must be pre-encoded safely
echo wp_kses_post( $xml->asXML() );  // sanitize XML/HTML output
```

---

### 9. Generic / Short Prefix Names

**Review team message:**
> All plugins must have unique function names, namespaces, defines, class and option names. Don't try to use two (2) or three (3) letter prefixes anymore. The prefix "wa" is too short — we require prefixes to be over 4 characters.

**Real plugin examples:**
```php
archive-master.php:77  define('WA_PLUGIN_VERSION', ...);  // "WA" = 2 chars — WRONG
archive-master.php:78  define('WA_PLUGIN_FILE', __FILE__);
includes/wppool/class-plugin.php:23  class WPPOOL_Plugin  // "wppool" prefix OK but inconsistent
includes/Installer.php:28  update_option('_master_archive_installed', ...); // underscore prefix — WRONG
```

**Rules:**
- Prefix must be **≥ 4 characters**, unique, and specific to your plugin
- Forbidden as standalone prefix: `wp_`, `_`, `__` (reserved for WordPress)
- Choose ONE prefix and use it everywhere consistently
- Options/transients MUST also be prefixed

---

### 10. Stored XSS from External Data (Unsanitized Imported Links)

**Review team message:**
> The plugin does not sanitise and escape the imported links from Google Sheet cells, which could allow high privilege users such as admin to perform Stored Cross-Site Scripting attacks even when the unfiltered_html capability is disallowed.

**Proof of Concept:**
1. Add `https://example.com?s=<script>alert('XSS')</script>` to a Google Sheet cell
2. Import the sheet link into the plugin
3. Enable "Import links from sheet" and save
4. Access page with shortcode → JS payload executes

**Fix:**
```php
// On save (sanitize input)
$url = esc_url_raw( wp_unslash( $_POST['sheet_url'] ) );

// On output (escape for context)
echo esc_url( $url );          // in href, src attributes
echo esc_html( $url );         // in text content
echo wp_kses_post( $content ); // for imported HTML content
```

---

### 11. Allowing Direct File Access

**Review team message:**
> Direct file access occurs when someone directly queries a PHP file. You can prevent this by adding the following code at the beginning of all PHP files that could potentially execute code if accessed directly.

**Real plugin examples:**
```
templates/setting.php:15  ← missing ABSPATH check, has executable code
```

**Fix — add to the TOP of every PHP file (after `<?php` and after `namespace` if present):**
```php
<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}
```

**Detection command:**
```powershell
Get-ChildItem "<PATH>" -Recurse -Filter "*.php" | Where-Object {
    (Get-Content $_.FullName -Raw) -notmatch "defined\s*\(\s*['\`"]ABSPATH['\`"]"
} | Select-Object FullName
```

---

### 12. Data Not Sanitized, Escaped, and Validated (Unsanitized `$_SERVER`)

**Review team message:**
> When you include POST/GET/REQUEST/FILE calls in your plugin, it's important to sanitize, validate, and escape them. Mantra: Sanitize early, Escape Late, Always Validate.

**Real plugin examples:**
```php
init.php:63  $ip = $_SERVER['HTTP_CLIENT_IP'];    // unsanitized server var
init.php:65  $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
init.php:67  $ip = $_SERVER['REMOTE_ADDR'];
inc/class-rest.php:726  $tags = explode(',', $_GET['tag']);  // unsanitized GET
admin/subscribers-export.php:8  $col = $_GET['col'];
admin/subscribers-export.php:31  $file = $_GET['download_file'];
```

**Fix:**
```php
$ip   = isset( $_SERVER['REMOTE_ADDR'] )     ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';
$tags = isset( $_GET['tag'] )                ? array_map( 'sanitize_text_field', explode( ',', wp_unslash( $_GET['tag'] ) ) ) : [];
$col  = isset( $_GET['col'] )                ? sanitize_key( wp_unslash( $_GET['col'] ) ) : '';
$file = isset( $_GET['download_file'] )      ? sanitize_file_name( wp_unslash( $_GET['download_file'] ) ) : '';
```

---

### 13. Outdated Libraries

**Review team message:**
> At least one of the 3rd party libraries you're using is out of date. Please upgrade to the latest stable version for better support and security. We do not recommend you use beta releases.

**Real plugin examples:**
```
gutenberg/blocks/dist/blocks.build.js:17679: * Chart.js v3.7.1  ← outdated
gutenberg/blocks/dist/blocks.build.js:28438: * Chart.js v3.7.1
```

**Fix:** Update to latest stable (e.g. Chart.js 4.x). Track versions and update before each WP.org submission.

---

### 14. Bundling/Renaming Core JS Libraries

**Review team message:**
> Renaming files, combining them, or enqueuing them with your own unique names (like 'myplugin-jquery-ui'), may cause WordPress to download the same javascript file multiple times.

**Real plugin examples:**
```
gutenberg/blocks/dist/blocks.build.js — bundles Chart.js instead of declaring as dependency
easy-video-reviews/...  — bundles Vue.js
```

**Fix:**
```php
wp_enqueue_script( 'my-plugin-charts', plugins_url( 'js/my-charts.js', __FILE__ ), [ 'jquery' ], '1.0.0', true );
// Declare dependencies properly, never bundle core libraries
```

---

### 15. Using cURL Instead of WP HTTP API

**Review team message:**
> WordPress comes with an extensive HTTP API that should be used instead of creating your own curl calls. It's both faster and more extensive.

**Real plugin examples:**
```php
easy-video-reviews/inc/class/single-video.php:21  $response = json_decode(curl_exec($ch));
```

**Fix:**
```php
$response = wp_remote_get( $url, [ 'timeout' => 15 ] );
if ( is_wp_error( $response ) ) {
    return $response->get_error_message();
}
$body = wp_remote_retrieve_body( $response );
$data = json_decode( $body, true );
```

> **Note:** cURL in vendor/third-party libraries IS permitted.

---

### 16. Not Using wp_enqueue Commands

**Review team message:**
> Your plugin is not correctly including JS and/or CSS. You should be using the built in functions for this.

**Real plugin examples:**
```php
// Direct echo of script tags — WRONG
functions.php:500  echo "<script src=\"" . plugin_dir_url(_WP_VIDEO) . "dist/js/vue.global.prod.js';\"></script>";
// Using home_url for wp-includes — WRONG
single-video.php:111  <script src="<?php echo home_url('wp-includes/js/jquery/jquery.min.js')">
```

**Fix:**
```php
add_action( 'wp_enqueue_scripts', function() {
    wp_enqueue_script( 'my-plugin-script', plugin_dir_url( __FILE__ ) . 'js/front.js', [ 'jquery' ], '1.0.0', true );
    wp_enqueue_style( 'my-plugin-style', plugin_dir_url( __FILE__ ) . 'css/style.css', [], '1.0.0' );
} );
// For inline JS — use wp_add_inline_script() instead of echo
```

---

### 17. Unprefixed Options and Transients

**Review team message:**
> Options and Transients must be prefixed. This is really important because the options are stored in a shared location. If two plugins use the same name for options, they will conflict.

**Real plugin examples:**
```php
includes/Installer.php:28  update_option('_master_archive_installed', time());  // leading _ = bad prefix
includes/Migrator/DatabaseSwitcher.php:93  set_transient('edit_php_included', true);  // no prefix at all
```

**Fix:**
```php
update_option( 'myplugin_installed', time() );          // ✅ plugin prefix
set_transient( 'myplugin_edit_included', true, HOUR_IN_SECONDS );  // ✅ prefixed
```

---

### 18. Display Name Infringes on Trademarks

**Review team message:**
> Your plugin display name may not begin with nor use trademarked terms in a manner that implies a relationship.

**Real plugin examples:**
```
readme.txt:1  === Google Spreadsheet to WP Table Live ===  ← "Google" at start is WRONG
```

**Fix:** Rename so the trademark is not at the beginning:
```
Spreadsheets from Google to WP Table Live  ← acceptable (descriptive, not leading)
```

Trademarks also apply to: plugin banner/icon images, plugin permalink (can't contain trademark as slug).

---

### 19. Incorrect Stable Tag

**Review team message:**
> Your 'Stable Tag' does not match the Plugin Version as indicated in your main plugin file. Those values need to be the same or your plugin will not download properly.

**Real plugin examples:**
```
readme.txt:7       Stable tag: trunk      ← WRONG
plugin-file.php:14  * Version: 1.0.0     ← these don't match
```

**Fix:** Always use SemVer. Keep `Stable tag:` in readme.txt and `Version:` in plugin header in sync:
```
Stable tag: 1.0.0
Version: 1.0.0
```

> Using `Stable tag: trunk` is NOT a supported method and causes update issues.

---

### 20. Changing Active Plugins

**Review team message:**
> It is not allowed for plugins to change the activation status of other plugins. This is an action that must be performed by the user.

**Real plugin examples:**
```php
includes/class-aisk-admin.php:363  activate_plugin($found_path);
includes/class-aisk-admin.php:335  new Plugin_Upgrader($skin);
```

**Fix:** Use **WordPress 6.5 Plugin Dependencies** header in your plugin header instead:
```php
/**
 * Requires Plugins: woocommerce
 */
```

---

### 21. Unclosed ob_start()

**Review team message:**
> Using ob_start() without explicitly closing the buffer within the same logical flow can lead to unpredictable behaviour. WordPress is a shared environment. If another component opens or closes a buffer that doesn't align with yours, the buffer stack can become misaligned.

**Real plugin examples:**
```php
aisk-ai-chat-fluentcart.php:31  ob_start();  // never closed in same scope
```

**Fix:**
```php
// Always close in same function scope
ob_start();
// ... output ...
$output = ob_get_clean();  // or ob_end_flush()
return $output;
```

> Since WordPress 6.9: use the template enhancement output buffer for modifying the entire response.

---

### 22. Nonces and User Permissions — Bypassable Nonce Pattern

**Review team message:**
> Please add a nonce check to your input calls. Make sure the nonce logic is correct and cannot be bypassed. A nonce checked only if other conditions are true is bypassable.

**Real plugin examples (bypassable — WRONG):**
```php
// If $nonce is missing/empty, the nonce check is SKIPPED entirely
includes/class-chat-handler.php:273:
if ( ! empty( $nonce ) && ! wp_verify_nonce( $nonce, 'wp_rest' ) ) { ... }

// isset() before verify — also bypassable
if (isset($_GET['page']) && !wp_verify_nonce( ... )) { ... }
```

**Fix — fail early/fail closed:**
```php
// Pattern 1: fail early (recommended)
if ( ! isset( $_POST['_wpnonce'] ) || ! wp_verify_nonce( sanitize_key( $_POST['_wpnonce'] ), 'my_action' ) ) {
    wp_die( esc_html__( 'Security check failed.', 'plugin-slug' ) );
}
if ( ! current_user_can( 'manage_options' ) ) {
    wp_die( esc_html__( 'Insufficient permissions.', 'plugin-slug' ) );
}

// Pattern 2: AND condition (nonce must be present AND valid)
if ( isset( $_POST['_wpnonce'] ) && wp_verify_nonce( sanitize_key( $_POST['_wpnonce'] ), 'my_action' ) ) {
    // safe to process
}
```

---

### 23. Keyword Stuffing

**Review team message:**
> Your plugin has been flagged for keyword stuffing, which is a violation of our guidelines.

**What it means:** readme.txt sections with repetitive keyword lists, excessive tags, or descriptions that read like SEO spam.

**Fix:** Write natural descriptions. Max ~12 tags. No repeated phrases.

---

### 24. Setting Default Timezone

**Review team message:**
> This is rarely a good idea. WordPress explicitly sets and expects the default timezone to be UTC. date_default_timezone_set() can break get_post_time() and other GMT-based functions.

**Real plugin examples:**
```php
spreadsheet-to-wp-table-live/Includes/Classes/global_class.php:287:
date_default_timezone_set('Asia/Dhaka');  // WRONG — breaks WP
```

**Fix:** **Remove entirely.** Use WP timezone-safe functions:
```php
wp_date( 'Y-m-d H:i:s' );              // Site timezone-aware
current_time( 'mysql' );               // Site time
get_date_from_gmt( gmdate( 'Y-m-d H:i:s' ) ); // Convert GMT to site time
```

---

### 25. Remote CDN Loading / Including Libraries Already in Core

**Review team message (calling files remotely):**
> Offloading images, JS, CSS, and other scripts to your servers or any remote service (Google, MaxCDN, jQuery.com etc.) is disallowed. If the file is in WordPress core, call that instead.

**Real plugin examples:**
```html
<script type="text/javascript" src="https://code.jquery.com/jquery-3.5.1.js"></script>  ← WRONG
<script src="https://cdn.datatables.net/1.10.22/js/dataTables.semanticui.min.js"></script>  ← WRONG
<link href="https://cdn.datatables.net/1.10.22/css/dataTables.semanticui.min.css">  ← WRONG
```

**Permitted exceptions:** Google Fonts (GPL compatible CDN), Akismet API calls, Disqus, oEmbed (YouTube, Twitter)

**Fix:** Bundle locally and use `wp_enqueue_script()`. Use WP's built-in jQuery via `[ 'jquery' ]` dependency.

---

### 26. Allowing Arbitrary Script Insertion (Custom CSS/JS/PHP)

**Review team message:**
> We no longer permit plugins to allow users to save arbitrary custom CSS, JavaScript, or PHP within the plugin. WordPress includes its own robust CSS editor in the Customizer already. You should never be asking users to paste in arbitrary JavaScript. Instead have them paste in the values custom to their scripts, and generate the rest programmatically.

**What to remove:**
- Free-text `<textarea>` fields where users paste raw CSS or JavaScript
- Eval, exec, or passthru of user-provided PHP

**Fix:**
- For CSS customization → direct users to the WordPress Customizer
- For JS customization → create form fields for specific values, generate the script programmatically
- Remove any arbitrary code execution entirely

---

### 27. "Powered By" / Credit Links Without Opt-In

**Review team message:**
> The guidelines prohibit adding attribution — such as "Powered by" text or credit links — to user-facing interfaces without explicit permission. Attribution may only be displayed if the site administrator clearly opts in.

**Real plugin examples:**
```html
<span className="support-buddy-footer-text">
    Powered by <a href="https://aisk.chat" target="_blank">Aisk.chat</a>
</span>
```

**Rules:**
- ❌ WRONG: Show "Powered by" on front-end by default
- ✅ OK: Show in admin-only settings/options pages specific to your plugin
- ✅ OK: Show if admin explicitly enabled it via a checkbox opt-in
- ✅ OK: Attribution in code comments (encouraged for GPL)
- ✅ OK: Service-based attribution on the service's own platform (Disqus, Twitter embeds)

---

## Automated Plugin Check (PCP) — 2024/2025

> **Since October 1, 2024:** Plugin Check (PCP) runs automatically on ALL new submissions. If it finds ANY "Error" in the "Plugin Repo" category, the submission is **automatically blocked**.
> 
> **Since October 27, 2025:** Also runs on ALL plugin updates.

Types of errors it auto-detects:
- Mismatched `Version:` in plugin header vs `Stable tag:` in readme.txt
- Wrong text domain
- Invalid `Tested up to:` value (must be a real WP version)
- PHPCS errors (uses PHP_CodeSniffer with WordPress standard)
- Accessibility, performance, and security best practices

**Run PCP locally before submitting:**
```powershell
# Install Plugin Check plugin in your local WP install and test there
# Or use WP-CLI: wp plugin check your-plugin-slug
```

---

## WordPress.org Quick Audit Commands

```powershell
# All security sniffs
phpcs --standard=WordPress --sniffs=WordPress.Security,WordPress.DB "<PATH>"

# i18n text domain issues
phpcs --standard=WordPress --sniffs=WordPress.WP.I18n "<PATH>"

# Naming/prefix issues
phpcs --standard=WordPress --sniffs=WordPress.NamingConventions "<PATH>"

# Find files missing ABSPATH check
Get-ChildItem "<PATH>" -Recurse -Filter "*.php" | Where-Object {
    (Get-Content $_.FullName -Raw) -notmatch "defined\s*\(\s*['\`"]ABSPATH['\`"]"
} | Select-Object FullName

# Check for cURL usage
Select-String -Path "<PATH>\**\*.php" -Pattern "curl_init|curl_exec" -Recurse

# Check for dangerous nonce pattern
Select-String -Path "<PATH>\**\*.php" -Pattern "!empty.*nonce.*wp_verify_nonce" -Recurse

# Check for credit/powered-by text
Select-String -Path "<PATH>\**\*.php" -Pattern "Powered by|Credit Link" -Recurse -CaseInsensitive

# ob_start without ob_get_clean (rough check)
Select-String -Path "<PATH>\**\*.php" -Pattern "ob_start\(\)" -Recurse
```

## Official Resources

- Plugin Guidelines: https://developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/
- Security — Escaping: https://developer.wordpress.org/apis/security/escaping/
- Security — Nonces: https://developer.wordpress.org/plugins/security/nonces/
- HTTP API: https://developer.wordpress.org/plugins/http-api/
- Determining Paths: https://developer.wordpress.org/plugins/plugin-basics/determining-plugin-and-content-directories/
- WPDB Prepare: https://developer.wordpress.org/reference/classes/wpdb/#protect-queries-against-sql-injection-attacks
- Enqueue Scripts: https://developer.wordpress.org/reference/functions/wp_enqueue_script/
- Plugin Dependencies: https://make.wordpress.org/core/2024/03/05/introducing-plugin-and-theme-dependencies-in-wordpress-6-5/
