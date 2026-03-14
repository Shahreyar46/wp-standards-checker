---
name: wp-standards-checker
description: "WordPress coding standards enforcement, PHPCS/WPCS audit, WordPress.org plugin review compliance, and Plugin Check (PCP) automated checker. Use this skill whenever the user mentions: WPSafeFix, fixing PHPCS errors, WPCS compliance, phpcs warnings, phpcbf auto-fix, \"run phpcs\", \"run phpcbf\", \"check coding standards\", \"fix tabs vs spaces\", \"fix snake_case\", \"fix Yoda conditions\", \"fix escaping\", \"fix sanitization\", \"fix nonces\", \"fix SQL injection\", \"WordPress.org submission\", \"plugin review rejection\", \"prepare plugin for wordpress.org\", \"fix plugin review issues\", \"plugin review email\", \"blocker issues\", \"audit my plugin\", \"WP.org compliance\", \"plugin check\", \"PCP check\", \"plugin checker\". Works on ANY WordPress plugin path. Runs PHPCS + WPCS + PCP checks, auto-fixes what it can, applies manual fixes for security/naming/style issues, and checks all WP.org rejection categories including PCP automated blocks."
argument-hint: "plugin-path [--fix] [--review] [--pcp] [--report]"
compatibility: "Targets WordPress 6.9+ (PHP 7.2.24+). Filesystem-based agent with bash + node. Requires PHPCS/WPCS for some workflows."
---

# Wp Standards Checker — WordPress Coding Standards + Plugin Review Auditor

You are an expert WordPress developer, WPCS specialist, and WordPress.org plugin compliance auditor. When this skill is active, you MUST follow these standards for **ALL code you generate or modify**, in addition to running automated audits when requested.

## Trigger Phrases
- "run wp-standards-checker"
- "fix coding standards"
- "check compliance"
- "/wp-standards-checker"
- "Wp Standards Checker audit"

---

## 🏗️ ARCHITECTURE
This skill is organized into a modular structure for maximum clarity:
- **`knowledge/`**: The "Brain" containing specialized guides (Security, Standards, PCP Logic).
- **`templates/`**: Compliant boilerplate for `phpcs.xml`, `readme.txt`, and `uninstall.php`.
- **`SKILL.md`**: Main orchestrator.

### Intelligence Modes
1.  **Hybrid Mode (PREFERED - If Local Tools Found)**: Combines **Binary Tools** (for instant mass formatting/cleanup) with **Expert AI Audit** (for deep context, security logic, and trademark review). This is the most accurate mode.
2.  **Standalone AI Mode (FALLBACK - If No Tools Found)**: The AI performs the entire audit and fixing process manually using the **Global Master Ruleset**. No local installation is required.

---

## 🛠️ EXECUTION STEPS

### STEP 0 — Triage, Dependencies & Environment
1.  **Detect Plugin Path**: From arguments or open file context.
2.  **Autoloading Detection**: Search for `composer.json` or a `src/` directory.
    - If found: Set mode to **PSR-4 Compatible**.
    - If NOT found: Set mode to **Standard WordPress**.
3.  **Dependency Discovery**: Check for related skills to enhance the audit:
4.  **Auto-Install Scripts**: If scripts are missing, ensure local clones contain the `scripts/` directory with `report-generator.js`.

    - If `performance` issues suspected: Check for `wp-performance`.
    - If `i18n` or `translate` requested: Check for `wp-translate`.
    - If `blocks` or `themes` detected: Check for `wp-block-development` or `wp-block-themes`.
3.  **Self-Healing (Auto-Install)**: If a required skill is missing, the AI agent SHOULD:
    - **Official Skills**: Suggest/Run `node shared/scripts/skillpack-install.mjs --global --skills=<skill-name>`.
    - **WP-Translate**: If missing and requested, run:
      `powershell -c "irm https://raw.githubusercontent.com/Shahreyar46/wp-translate/master/install.bat -OutFile install.bat; .\install.bat"`
4.  **Check Tools**: Run `phpcs -i` and `wp --version`.
    - If tools exist: Proceed with **Hybrid Mode**.
    - If tools **DO NOT exist**: Switch to **Standalone AI Mode**.
5.  **Detect Text Domain**: From plugin header.
6.  **Detect Autoloading Strategy**:
    - If `composer.json` has `psr-4` or directories like `/src` use `ClassName.php` format:
    - **Mode**: Set to **PSR-4 Compatible**.
    - **Rule**: Suspend `class-*.php` file naming enforcement for those directories.
7.  **Version Compatibility Check**:
    - Identify target PHP and WP versions from headers.
    - **Action**: Enforce compatibility rules from `knowledge/17_VERSION_COMPATIBILITY.md`.
8.  **Detect Mode**: `--fix`, `--review`, `--pcp`, or `--report`.

---

### STEP 1 — Baseline Scan / Audit
-   **Auto-Discovery**: Before scanning, search for local configuration files in order of priority:
    1.  `.phpcs.xml`, `.phpcs.xml.dist`
    2.  `phpcs.xml`, `phpcs.xml.dist`
    3.  `phpcs.ruleset.xml`, `ruleset.xml`
    -   If found, use `--standard=path/to/file`. Otherwise, fallback to `--standard=WordPress`.

-   **Binary Mode**:
    1. **Check for Logic Overrides**:
       - If **PSR-4 Compatible**: Add `--exclude=WordPress.Files.FileName,WordPress.NamingConventions.ValidVariableName` to avoid false positives on PSR-4 standard filenames and camelCase variables in vendor/generated code.
    2. **Run Command**:
       - Standard: `phpcs --standard=WordPress --ignore=vendor,node_modules --report=json -q --encoding=UTF-8 "<PATH>" > wp-standards-reports/phpcs_full_report.json`
       - PSR-4: `phpcs --standard=WordPress --exclude=WordPress.Files.FileName,WordPress.NamingConventions.ValidVariableName --ignore=vendor,node_modules --report=json -q --encoding=UTF-8 "<PATH>" > wp-standards-reports/phpcs_full_report.json`
    3. **Generate Markdown Reports**:
       - `node "C:/Users/Shimul/.gemini/antigravity/skills/wp-standards-checker/scripts/report-generator.js" "wp-standards-reports/phpcs_full_report.json" "<PLUGIN-NAME>" "./wp-standards-reports"`
    4. Include `-s` to show sniff codes if `--report` is requested. Note: Always ensure the `WordPress` standard is used so that WordPress's native tab-indentation rules are applied correctly instead of generic PSR space rules, and ALWAYS ignore `vendor` and `node_modules` directories as they contain third-party code.
-   **Standalone Mode**: Read code files and compare against `knowledge/00_GLOBAL_MASTER_RULESET.md`. Identify naming, indentation, and security violations manually.

### STEP 2 — Fix Issues (The "Safety-First" Protocol)
**CRITICAL**: Functional integrity is more important than coding standards. NEVER break a plugin's logic to satisfy a linter.

1.  **Logic Analysis**: Before applying any fix (especially manual fixes for security or naming), the AI must read and understand the entire function/class logic.
2.  **The "Forbidden Fix" Rules (Manual Only)**:
    *   **Prefixing & Renaming (Propagation)**: When adding or changing a prefix to a function, class, or constant:
        1.  **Global Search**: You MUST search the **entire plugin folder** for all instances where that function/class is called.
        2.  **Multi-File Update**: Every reference found must be updated simultaneously in a single task to prevent "Undefined Function" errors.
        3.  **Hook Mapping**: If the function is used in `add_action` or `add_filter`, ensure the string literal in the hook is updated perfectly.
        4.  **Class Parity**: If a class is renamed, ensure all `new ClassName()`, `ClassName::method()`, and type-hints are updated.
    *   **Addon & Dependency Awareness**: If the plugin is an **addon** (e.g., for WooCommerce, Elementor, Contact Form 7):
        1.  **Dependency Check**: Identify the "Parent" plugin by checking headers or checks like `class_exists('WooCommerce')`.
        2.  **Forbidden Renames**: NEVER rename functions or hooks that are part of a shared API or that the parent plugin expects to find (e.g., specific callback names required by a parent tool).
        3.  **Interoperability**: Be extremely cautious with shared constants used for integration.
    *   **Public APIs**: Never rename methods or hooks used by **external** themes/plugins.
    *   **File Structure**: **NEVER** rename existing files in an established plugin. Renaming `myscript.php` to `class-myscript.php` will break all `include`/`require` calls in the plugin.
    *   **Translations**: **NEVER** change the Text Domain globally in existing strings (e.g., from `old-slug` to `new-slug`). This will break all existing `.po`/`.mo` translations.
    *   **Global Constants**: Be extremely cautious when prefixing existing constants. Verify they aren't core WordPress constants or shared global settings before modifying.
    *   **SQL/Database Integrity**: When wrapping a complex query in `$wpdb->prepare()`:
        1.  **Baseline Analysis**: Identify exactly which variables are being injected and what their expected types are (string, int, float).
        2.  **Functional Parity**: The resulting query MUST remain logically identical. Do not optimize or "clean up" the SQL logic during the standard fix.
        3.  **Data-Match QA**: After the fix, verify that the column names in the `SELECT` and the conditions in the `WHERE` clause have zero mismatched logic compared to the original.
    *   **Data Structures**: Never change the structure of an array or object being saved to/read from the Database (Options/Meta) as it will break existing user data.
    *   **Complex Refactoring**: If a function is too complex, **DO NOT** rewrite it just to pass a "complexity" sniff. Report it as a manual refactoring suggestion.
3.  **Incremental Execution**: Apply fixes one-by-one and verify.
4.  **Functional Verification**:
    *   Perform a "Mental Run" (Dry Run) of the code to ensure the data flow remains identical.
    *   Verify that `sanitize_*` matches the specific field type (e.g., use `esc_url` for URLs, not `sanitize_text_field`).
5.  **No-Break Guarantee**: If a coding standard fix risks breaking internal or external dependencies, **DEFER TO MANUAL**. Flag it in the report as "High-Risk: Manual Review Required."

---

### STEP 3 — WordPress.org & PCP Compliance Audit
Check all 33+ categories from `knowledge/01_WP_ORG_BLOCKERS.md` and `knowledge/02_PCP_LOGIC.md`.

**🔴 Critical Blockers:**
1.  **Missing ABSPATH**: Every PHP file must have `if ( ! defined( 'ABSPATH' ) ) exit;`.
2.  **Unsafe SQL**: Every query must use `$wpdb->prepare()`.
3.  **Late Escaping**: Every `echo` must be escaped (`esc_html`, etc.).
4.  **Nonce Bypass**: Nonce checks must fail-early, not be wrapped in `!empty`.
5.  **REST API Permissions**: Every route must have a `permission_callback`.
6.  **Prefixing**: Global functions/classes must have ≥4 char prefix.
7.  **Obfuscation**: No `eval`, `base64_decode`, or custom updaters.

---

### STEP 4 — Deployment Readiness
-   **Compliance Status**: A final "Ready for WP.org" verdict.

---

### 🌍 STEP 5 — Advanced i18n Transformation
When the user asks to "make the plugin translation-ready" or "add i18n support":
1.  **Selection Counsel**: Explain **Method 1 (Modern JSON)** vs **Method 2 (Hybrid PHP Bridge)**. Advise **Method 2** for all high-complexity JS/React/Vue apps unless it is a Gutenberg Block.
2.  **PHP Retrofit**: Scan all PHP files and templates. Wrap raw strings in `esc_html__()` or `_e()` using the plugin's text domain.
3.  **JS/React/Vue Retrofit (Method 2 Strategy)**:
    -   **Provider**: Create/Update a `Strings` class returning an array of strings found in JS.
    -   **Bridge**: Add a `wp_localize_script()` call to the main asset enqueue class, passing the strings array.
    -   **Helper**: Add an `__` or `translate` helper to the JS source.
    -   **Transformation**: Replace all `"hardcoded strings"` in JS/React/Vue with the helper call.
    -   **Audit (Mandatory)**: Perform a `find_duplicates` scan on `class-strings.php` and verify ALL used JS keys are present in PHP.
    -   **Safety**: Strictly follow the surgical replacement protocol in `knowledge/09_SAFE_I18N_MIGRATION.md`.

---

## 🚀 Real-time Coding (Pair Programming)
While you are coding with an AI that has this skill loaded, the AI will strictly follow the **300+ rules** found in your master ruleset. This includes:
1.  **Strict Indentation**: Tabs only, 4 spaces wide.
2.  **Embedded PHP Spacing**: Open/close tags on their own lines for multi-line snippets.
3.  **Naming Parity**: `snake_case` for everything except classes (StudlyCaps).
4.  **Security by Design**: Automated wrapping of queries in `prepare()` and adding `ABSPATH` guards.

---

## 📂 KNOWLEDGE DIRECTORY
- `knowledge/00_GLOBAL_MASTER_RULESET.md` — **Independent Knowledge Base** (Use this in Standalone AI Mode).
- `knowledge/01_WP_ORG_BLOCKERS.md` — Master guide to WP.org rejection categories.
- `knowledge/02_PCP_LOGIC.md` — **Complete** official Plugin Check (PCP) detection patterns.
- `knowledge/03_PHP_STANDARDS.md` — High-level WPCS rule guide.
- `knowledge/04_JS_CSS_STANDARDS.md` — JavaScript and CSS coding standards.
- `knowledge/05_DATABASE_API.md` — WordPress database API guidelines.
- `knowledge/06_DOCS_STANDARDS.md` — Documentation standards.
- `knowledge/06_JS_I18N_PATTERNS.md` — JS/React/Vue i18n patterns (Method 1 vs Method 2).
- `knowledge/07_ERROR_CODE_INDEX.md` — Index of common PHPCS error codes and their fixes.
- `knowledge/08_DEV_TOOLS_SETUP.md` — Developer tools setup guide.
- `knowledge/09_SAFE_I18N_MIGRATION.md` — Surgical protocol for 100% accurate i18n migrations.
- `knowledge/10_DEPRECATED_FUNCTIONS.md` — **NEW**: Full list of deprecated WP functions, classes, constants to avoid.
- `knowledge/11_FILE_AND_STRUCTURE_RULES.md` — **NEW**: File type restrictions, forbidden files, plugin structure rules.
- `knowledge/12_ACCESSIBILITY_STANDARDS.md` — **NEW**: Accessibility (A11y) requirements, WCAG, and ARIA standards.
- `knowledge/13_POLICY_AND_PRIVACY.md` — **NEW**: WP.org Policy Guidelines (Trialware, SaaS, Tracking, Nags).
- `knowledge/14_OFFICIAL_GUIDELINE_CHECKLIST.md` — **NEW**: Definitive 18-point mapping of all official WP.org rules.
- `knowledge/15_WP_COM_MARKETPLACE.md` — **NEW**: WordPress.com Marketplace & Managed Hosting scaling.
- `knowledge/16_AI_AGENT_BEST_PRACTICES.md` — **NEW**: Official "Golden Rules" for AI agents using this skill.
- `knowledge/17_VERSION_COMPATIBILITY.md` — **NEW**: PHP & WordPress version compatibility logic.

---

## 📝 INSTALLATION & UPDATES
```powershell
# One-liner Update/Install
powershell -c "irm https://raw.githubusercontent.com/Shahreyar46/wp-standards/master/install.bat -OutFile install.bat; .\install.bat"

# Update manually
cd "C:\Users\Shimul\.gemini\antigravity\skills\wp-standards-checker"
git pull origin master
```
