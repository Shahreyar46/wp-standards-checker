# 📟 WPCS + PCP ERROR CODE INDEX

> Use these codes to identify specific violations in `phpcs` output. Run `phpcs -s` to see codes.

---

## 🛑 Security Blockers (Must Fix)

| Error Code | Meaning | Fix Strategy |
|---|---|---|
| `WordPress.Security.EscapeOutput` | Missing escaping on echo. | Wrap variable in `esc_html()`, `esc_attr()`, `esc_url()`. |
| `WordPress.DB.PreparedSQL` | Raw SQL query. | Wrap in `$wpdb->prepare()`. |
| `WordPress.DB.PreparedSQLPlaceholders` | Wrong placeholder type or count. | Use `%s`, `%d`, `%f` correctly in prepare(). |
| `WordPress.Security.NonceVerification` | Missing/Insecure nonce. | Add `wp_verify_nonce` check. |
| `WordPress.Security.ValidatedSanitizedInput` | Unsanitized `$_GET`/`$_POST`. | Wrap in `sanitize_text_field()`, `absint()`, etc. |
| `WordPress.Security.SafeRedirect` | Using `wp_redirect()` | Replace with `wp_safe_redirect()` + `exit`. |
| `WordPress.PHP.DontExtract` | Use of `extract()`. | Replace with direct variable access. |
| `WordPress.NamingConventions.PrefixAllGlobals` | Missing Prefix on global. | Prepend a unique plugin prefix (≥4 chars). |
| `Generic.CodeAnalysis.AssignmentInCondition` | Assignment in `if`. | Move assignment above the `if`. |

---

## 🛑 PCP-Specific Blockers (Instant Rejection)

| Error Code | Meaning | Fix Strategy |
|---|---|---|
| `PluginCheck.CodeAnalysis.Heredoc` | HEREDOC syntax found. | Replace with regular strings or nowdoc. |
| `Generic.PHP.DiscourageGoto.Found` | `goto` statement found. | Refactor to use normal control flow. |
| `Generic.PHP.DisallowShortOpenTag` | `<?` short tag found. | Replace with `<?php`. |
| `Generic.PHP.BacktickOperator` | Backtick shell execution. | Use `exec()` via allowed pattern or remove. |
| `Generic.Files.ByteOrderMark` | UTF-8 BOM in PHP file. | Save file without BOM in your editor. |
| `PluginCheck.CodeAnalysis.ShortURL` | Short URL (bit.ly etc.) in code. | Replace with full canonical URL. |
| `Generic.PHP.ForbiddenFunctions.Found` | Forbidden function used. | Replace: `passthru`→remove, `eval`→remove, `create_function`→closure. |
| `Squiz.PHP.DiscouragedFunctions` | `ini_set`, `set_time_limit`, `dl`. | Remove these PHP config-altering calls. |
| `WordPress.WP.AlternativeFunctions` | PHP native instead of WP API. | Use WP equivalent (see `10_DEPRECATED_FUNCTIONS.md`). |
| `WordPress.DB.RestrictedClasses` | Direct PDO/mysqli usage. | Use `$wpdb` instead. |
| `WordPress.DB.RestrictedFunctions` | `mysql_*` functions. | Use `$wpdb->*` or PDO via WP's layer. |
| `WordPress.WP.DeprecatedFunctions` | Using deprecated WP function. | See `10_DEPRECATED_FUNCTIONS.md` for replacements. |
| `WordPress.WP.DeprecatedClasses` | Using deprecated WP class. | See `10_DEPRECATED_FUNCTIONS.md` for replacements. |
| `WordPress.WP.DeprecatedParameters` | Deprecated function parameter. | Update call signature. |
| `WordPress.WP.DiscouragedConstants` | Deprecated WP constant. | Use function equivalent instead. |
| `WordPress.DateTime.RestrictedFunctions` | `date_default_timezone_set()` | Remove — WP uses UTC globally. |
| `WordPress.Security.PluginMenuSlug` | Path disclosure in menu. | Use `plugin_basename()`. |
| `WordPress.PHP.DevelopmentFunctions` | `var_dump`, `error_log`. | Remove before release. |
| `PluginCheck.CodeAnalysis.DiscouragedFunctions.load_plugin_textdomainFound` | Old `load_plugin_textdomain` style. | Remove from `init` hook — WP loads it automatically since WP 4.6. |

---

## 🛠️ Style & Formatting

| Error Code | Meaning | Fix Strategy |
|---|---|---|
| `Generic.WhiteSpace.DisallowSpaceIndent` | Spaces used for indent. | Replace with Tabs. |
| `WordPress.NamingConventions.ValidVariableName` | `camelCase` found. | Rename to `snake_case`. |
| `WordPress.PHP.YodaConditions` | Non-Yoda logic. | Move constant to left side: `if ( true === $var )`. |
| `Squiz.PHP.EmbeddedPhp` | Poor tag spacing. | Start/end tags on own lines. |
| `WordPress.WP.I18n` | Poor translation call. | Add text domain or placeholders correctly. |

---

## 💡 Pro Tips
- Run `phpcs -s` to see these codes attached to every error in your terminal.
- Run `phpcbf` to auto-fix whitespace, indentation, and style codes.
- For PCP-specific checks, use: `wp plugin check <plugin-slug>` in WP-CLI.
