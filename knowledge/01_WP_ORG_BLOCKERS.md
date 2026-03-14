# 🛑 WP.org Submission Blockers & Review Logic

> This document lists the exact categories used by the WordPress.org Plugin Review team to reject plugins. 

---

## 🛑 CLASS A: SECURITY BLOCKERS (Instant Rejection)
1.  **Stored XSS**: Missing `esc_html` or `wp_kses_post` on data retrieved from DB.
2.  **SQL Injection**: Missing `$wpdb->prepare()` for any database query.
3.  **Missing Nonce**: State-changing actions (POST/AJAX) without `wp_verify_nonce`.
4.  **Missing Capability**: Admin actions without `current_user_can()`.
5.  **REST API Permissions**: Routes missing `permission_callback`.
6.  **Arbitrary Insertion**: Allowing users to save raw CSS/JS/PHP in settings.
7.  **Direct Access**: Missing `if ( ! defined( 'ABSPATH' ) ) exit;` guards in PHP files (Guideline 2/8).

---

## 🛑 CLASS B: COEXISTENCE BLOCKERS
1.  **Generic Prefixing**: Using prefixes shorter than 4 chars or common ones like `wp_`.
2.  **Namespace Collisions**: Not prefixing Global functions/classes.
3.  **Core Inclusion**: Including `wp-load.php` or `wp-config.php`.
4.  **Changing Other Plugins**: Calling `activate_plugins()` or modifying other plugin files.

---

## 🛑 CLASS C: COMPLIANCE & LEGAL
1.  **Trademark Infringement**: Plugin slug/name cannot **start** with a trademark (e.g., "Google Maps for WP" ✅, "Google Maps Plugin" ❌).
2.  **GPL Compatibility**: Missing `License: GPL-2.0-or-later` in header.
3.  **External Services**: Not declaring 3rd party API connections in `readme.txt`.
4.  **Tracking**: Telemetry/Tracking without explicit user opt-in.
5.  **Obfuscation**: Using `base64_decode`, obfuscators (p,a,c,k,e,r), or mangled code (e.g., `$x123`).
6.  **Powered By Links**: Non-opt-in credit links in the frontend.

---

## 🛑 CLASS D: TECHNICAL REQUIREMENTS
1.  **Tab Indentation**: Using tabs instead of spaces for PHP.
2.  **Snake Case**: Using `snake_case` for PHP variables/functions.
3.  **Minified Files**: Including `.min.js` without providing the un-minified source.
4.  **Enqueueing**: Manually outputting `<script>` tags instead of `wp_enqueue_script`.
5.  **Timezone**: Using `date_default_timezone_set()`.
6.  **PCP Automated Rejection**: Any "ERROR" in the "Plugin Repo" category from the auto-scanner.
7.  **Tag Limit**: Using over **5 tags** in `readme.txt`.
8.  **Internal Assets**: Calling 3rd party CDNs for JS/CSS (must be local except for fonts).

---

## 🛑 CLASS E: ACCESSIBILITY (A11Y)
1.  **Missing Aria Labels**: Icon-only buttons or inputs without labels/aria-labels.
2.  **Keyboard Traps**: Elements that cannot be tabbed to or focused.
3.  **Color Contrast**: Text contrast below 4.5:1 (e.g., light gray on white).
4.  **Missing Labels**: `<input>` tags without associated `<label>` tags.

---

## 🛑 CLASS F: POLICY & USER EXPERIENCE
1.  **Trialware**: Locking local features behind a payment (Guideline 5).
2.  **Admin Hijacking**: Non-dismissible nags or "hijacking" the dashboard (Guideline 11).
3.  **Opt-in Tracking**: Telemetry or tracking without clear, explicit user consent (Guideline 7).
4.  **Credits Link**: Non-opt-in developer credits on the public site (Guideline 10).
5.  **Executable Code**: Sending executable code via 3rd party APIs (Guideline 8).
