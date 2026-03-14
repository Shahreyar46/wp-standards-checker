# 📁 PLUGIN FILE & STRUCTURE RULES
> Source: `plugin-check` File_Type_Check.php + 18 official guidelines

These rules apply to the ZIP you submit to WordPress.org.

---

## 🚫 Forbidden File Types (Causes Rejection)

### Compressed Files
Do NOT include: `.zip`, `.gz`, `.tgz`, `.rar`, `.tar`, `.7z`
- Bundle source code only, not pre-packaged archives.

### PHAR Files
Do NOT include: `.phar` files
- PHP Archives are not allowed.

### Application Binaries
Do NOT include: `.exe`, `.sh`, `.so`, `.a`, `.bin`, `.deploy`, `.dist`, `.dmg`, `.dump`, `.elc`, `.iso`, `.lha`, `.lrf`, `.lzh`, `.o`, `.obj`, `.pkg`

### VCS Directories
Do NOT include: `.git/`, `.svn/`, `.hg/`, `.bzr/`
- Run `git archive` or a build process to strip these before releasing.

### Hidden Files (Outside vendor/node_modules)
Do NOT include files starting with `.` in your plugin's root or src directories.
- **Allowed exceptions**: `.distignore`, `.gitignore`

### AI Instruction Directories
**NEW (2025)**: Do NOT include these in any released plugin:
- `.cursor/` `.claude/` `.aider/` `.continue/` `.windsurf/` `.ai/`
- `.github/` (CI workflows - warning severity 9)
- Any unexpected `.md` files in root (only `README.md`, `readme.txt`, `LICENSE`, `LICENSE.md`, `CHANGELOG.md`, `CONTRIBUTING.MD`, `SECURITY.MD` are allowed)

---

## 🚫 WP Core Library File Bundling (Forbidden - Guideline 13)

Do NOT bundle these (WP core already provides them):
- **JS Libraries**: `jquery.js`, `jquery-ui.js`, `backbone.js`, `underscore.js`, `moment.js`, `lodash.js`, `clipboard.js`, `codemirror.js`, `thickbox.js`, `twemoji.js`, `iris.js`, `mediaelement.js`, `plupload.js`.
- **PHP Libraries**: `PHPMailer.php`, `SimplePie.php`, `class-simplepie.php`, `PasswordHash.php` (PHPass), `getid3.php`, `pclzip.lib.php`, `atomlib.php`.

**Use the WP registered handle instead:**
```php
// ❌ WRONG - bundling own jQuery
wp_enqueue_script( 'my-jquery', plugin_url() . '/js/jquery.min.js' );

// ✅ CORRECT - depend on WP's jQuery
wp_enqueue_script( 'my-script', $src, array( 'jquery' ), '1.0.0', true );
```

---

## 📛 File Naming Rules

- File and folder names MUST NOT contain spaces.
- File and folder names MUST NOT contain special chars: `!@#$%^&*()+=[]{};:"'<>,?/\|`~`
- File and folder names are case-sensitive — duplicate names with different cases will error.

---

## ✅ Required File Structure

```
plugin-slug/
├── plugin-slug.php         ← Main plugin file (with header)
├── readme.txt              ← REQUIRED for multi-file plugins
├── uninstall.php           ← REQUIRED if you create any DB tables/options
├── includes/
│   └── class-feature.php   ← Kebab-case class files
├── assets/
│   ├── js/
│   └── css/
└── languages/              ← .pot, .po, .mo files
```

### Naming Conventions
- Plugin main file: Must match folder slug exactly (e.g., `my-plugin/my-plugin.php`)
- Class files: `class-{classname}.php` (e.g., `class-my-feature.php`)
- General files: `lowercase-with-hyphens.php`
- No camelCase file names in PHP (outside PSR-4 directories)

---

## 📦 PSR-4 Autoloading vs WPCS Naming

Professional plugins often use **PSR-4 Autoloading** (via Composer or a custom autoloader). In these cases, PSR-4 naming requirements take precedence over standard WordPress file naming rules.

### Recognition Logic
The suite considers a directory to be under PSR-4 if:
1. A `composer.json` file in the root defines a `psr-4` autoload mapping.
2. The directory (usually `src/` or `app/`) contains class files using `StudlyCaps.php` naming without the `class-` prefix.

### Naming Exceptions
If PSR-4 is detected for a directory:
- **Exempt from `class-*.php`**: File names MUST match the class name exactly (e.g., `MyClass.php` for `class MyClass`).
- **Exempt from kebab-case**: StudlyCaps is mandatory for file names to match the namespace/class.
- **Enforcement Suspension**: The AI will NOT attempt to rename these files to `class-my-class.php`.

---

## Composer/Vendor Notes

If you use Composer:
- Include `composer.json` if you have a `/vendor` directory with `autoload.php`.
- Omit `composer.lock` from the release (add to `.distignore`).
- Prefix ALL vendor namespaces to avoid conflicts using tools like [PHP-Scoper](https://github.com/humbug/php-scoper).
