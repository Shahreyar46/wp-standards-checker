# ⚠️ DEPRECATED WORDPRESS FUNCTIONS, CLASSES & CONSTANTS
> PHPCS Sniffs: `WordPress.WP.DeprecatedFunctions`, `WordPress.WP.DeprecatedClasses`, `WordPress.WP.DeprecatedParameters`, `WordPress.WP.DeprecatedParameterValues`, `WordPress.WP.DiscouragedConstants`

Any use of items below will trigger a PHPCS error in the PCP scan. Replace with the modern equivalent.

---

## 🔴 Deprecated Functions (must fix for WP.org)

| Old Function | Replacement | Since |
|---|---|---|
| `get_currentuserinfo()` | `wp_get_current_user()` | WP 4.5 |
| `wp_get_user_contact_methods()` | `get_user_meta()` contact methods | WP 2.9 |
| `add_option_update_handler()` | `register_setting()` | WP 2.7 |
| `remove_option_update_handler()` | `unregister_setting()` | WP 2.7 |
| `the_author_description()` | `the_author_meta( 'description' )` | WP 2.8 |
| `the_author_aim()` | `the_author_meta( 'aim' )` | WP 2.8 |
| `get_the_author_aim()` | `get_the_author_meta( 'aim' )` | WP 2.8 |
| `get_the_author_email()` | `get_the_author_meta( 'email' )` | WP 2.8 |
| `wp_specialchars()` | `esc_html()` | WP 2.8 |
| `attribute_escape()` | `esc_attr()` | WP 2.8 |
| `js_escape()` | `esc_js()` | WP 2.8 |
| `wp_get_post_categories()` | `get_the_category()` | WP 2.8 |
| `is_blog_installed()` | `is_blog_installed()` (check) | WP 3.0 |
| `screen_meta()` | WP_Screen API | WP 3.3 |
| `get_usermeta()` | `get_user_meta()` | WP 3.0 |
| `update_usermeta()` | `update_user_meta()` | WP 3.0 |
| `delete_usermeta()` | `delete_user_meta()` | WP 3.0 |
| `get_user_metavalues()` | `get_user_meta()` | WP 3.0 |
| `sanitize_user_object()` | `sanitize_user()` | WP 3.0 |
| `get_user_by_email()` | `get_user_by( 'email', $email )` | WP 3.3 |
| `get_user_by_login()` | `get_user_by( 'login', $login )` | WP 3.3 |
| `fetch_rss()` | `fetch_feed()` | WP 2.8 |
| `load_plugin_textdomain()` in init | No longer needed for GlotPress | WP 4.6 |
| `add_contextual_help()` | `WP_Screen::add_help_tab()` | WP 3.3 |

---

## 🔴 Deprecated Classes

| Old Class | Replacement | Since |
|---|---|---|
| `WP_User_Search` | `WP_User_Query` | WP 3.1 |
| `WP_Query` usage with `caller_get_posts` | Use `ignore_sticky_posts` | WP 3.1 |
| `SimplePie_File` (custom bundled) | WP bundled SimplePie | — |

---

## 🔴 Discouraged Constants (do NOT use)

| Constant | Reason |
|---|---|
| `STYLESHEETPATH` | Replaced by `get_stylesheet_directory()` |
| `TEMPLATEPATH` | Replaced by `get_template_directory()` |

---

## 🔴 Deprecated Parameters

| Function | Deprecated Param | Notes |
|---|---|---|
| `wp_enqueue_script()` | 5th param `$in_footer` = `false` | Should be `true` (footer) |
| `get_posts()` | `caller_get_posts` | Use `ignore_sticky_posts` |
| `WP_Query` | `caller_get_posts` | Use `ignore_sticky_posts` |
| `query_posts()` | ANY use | Forbidden — use `WP_Query` instead |

---

## 🛠️ WP Alternative Functions (PCP forces these)

The PCP enforces **WP API use instead of PHP native functions** via `WordPress.WP.AlternativeFunctions`:

| PHP Native | WP Alternative |
|---|---|
| `curl_*` | `wp_remote_get()`, `wp_remote_post()` |
| `file_get_contents()` (remote URL) | `wp_remote_get()` |
| `json_decode()` / `json_encode()` | OK to use (excluded from rule) |
| `fopen()` / `fwrite()` / `file_put_contents()` | `WP_Filesystem` API |
| `header()` | `wp_redirect()` / `wp_safe_redirect()` |
| `setcookie()` | `wp_set_auth_cookie()` for auth, else raw is OK |
| `rand()` | `wp_rand()` |
| `preg_*` for emails | `is_email()` |
