# Wp Standards Checker — The Intelligent WordPress Auditor & Engineering Toolkit

A high-performance AI skill engineered to enforce **WordPress Coding Standards (WPCS)**, perform **Deep-Tissue Security Audits**, and ensure **Professional-Grade Compliance** with official WordPress.org Repository guidelines.

---

## 📑 Table of Contents
- [🚀 Installation & Integration](#-installation--integration)
- [💎 Suite Overview & Benefits](#-suite-overview--benefits)
- [⏰ How it Saves Time & Makes Development Easy](#-how-it-saves-time--makes-development-easy)
- [📄 Scanning & Generating Audit Reports](#-scanning--generating-audit-reports)
- [📂 Detailed Developer Scenarios](#-detailed-developer-scenarios)
- [💡 The Prompt Library (Pro Skills)](#-the-prompt-library-pro-skills)
- [🤖 Developing Features with AI (The Blueprint Mode)](#-developing-features-with-ai-the-blueprint-mode)
- [📂 Knowledge Directory](#-knowledge-directory)
- [🛠️ Wp Standards Checker Ecosystem](#-wp-standards-checker-ecosystem)
- [❓ FAQ](#-faq)
- [🚀 Featured Tool: wp-translate](#-featured-tool-wp-translate)
- [🔗 Project & Updates](#-project--updates)

---

## 🚀 Installation & Integration

### One-Liner Install (Windows)
```powershell
powershell -c "irm https://raw.githubusercontent.com/Shahreyar46/wp-standards/master/install.bat -OutFile install.bat; .\install.bat"
```

### One-Liner Install (Mac/Linux)
```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/Shahreyar46/wp-standards/master/install.sh)"
```

### 🤖 AI Code Editor Integration (Cursor, Claude Code, Kiro, Antigravity, Gemini, Codex)

Wp Standards Checker is engineered to work natively in all modern AI-powered code editors. You can invoke the skill directly in your AI chat or workflow using the `@` mention or slash command system.

| Editor | Integration Method |
|---|---|
| **Cursor** | Use `@wp-standards-checker` to reference the skill in chat or composer. |
| **Claude Code** | Type `/wp-standards-checker` or mention the skill in your CLI prompt. |
| **Kiro / Codex** | Use the `@[/wp-standards-checker]` intent for automated auditing workflows. |
| **Antigravity** | Mention `@wp-standards-checker` to trigger the "Mother Skill" orchestration. |
| **Gemini** | Use slash commands `/wp-standards-checker` for instant compliance checks. |

- **Mention**: `@wp-standards-checker` (Refers to the skill's knowledge base)
- **Workflow / Intent**: `@[/wp-standards-checker]` or `/wp-standards-checker` (Triggers active auditing)
- **Prompt Example**: *"@[/wp-standards-checker] Perform a full audit on the current file and fix any security blockers."*
- **Slash Shortcut**: Just type `/wp-standards-checker` in supported editors to trigger the full auditing workflow immediately.

---

## 💎 Suite Overview & Benefits

Wp Standards Checker provides a professional-grade engineering environment for WordPress developers.

### Why Developers Trust This Suite:
*   **Zero-Dependency Integrity**: Functions autonomously using a built-in "Master Ruleset" when local tools like PHPCS are missing.
*   **Hybrid Power**: Seamlessly leverages local `phpcs` and `phpcbf` binaries for millisecond-speed formatting while layering AI contextual wisdom for security logic.
*   **Skill Orchestration (Mother Skill)**: Acts as a hub—automatically detects and installs related skills like `wp-performance`, `wp-block-development`, and `wp-translate`.
*   **Safety-First Protocol**: Performs "Functional Parity QA" to ensure audits never break your plugin's logic or database queries.
*   **Proactive Compliance**: Stays updated with the latest WordPress.org "Late Escaping" and "Direct Access" (ABSPATH) enforcement rules.
*   **High-Scale Optimization**: Enforces patterns required for high-traffic environments (Taxonomies over Meta, caching transients, and efficient DB queries).

---

## ⏰ How it Saves Time & Makes Development Easy

Building a professional WordPress plugin usually requires hours of manual linting, security checking, and refactoring. **Wp Standards Checker turns hours into seconds.**

1.  **Stop Guessing Standards**: No more looking up if it's `snake_case` or `camelCase`. The suite enforces the correct WordPress way automatically.
2.  **Instant Refactoring**: Need to rename 200 functions or add `ABSPATH` to 50 files? The suite does it in a single command, saving you a full workday of tedious manual edits.
3.  **One-Click Compliance**: Instead of manual audits, run `/wp-standards-checker . --pcp` and get a full report of everything that will cause a WP.org rejection.
4.  **Zero Setup Friction**: No need to spend 30 minutes configuring PHPCS, Composer, and WPCS rules. The suite works out-of-the-box with its built-in ruleset.
5.  **Focus on Logic, Not Syntax**: Spend your energy building features while the suite handles the "boring" work of escaping, sanitizing, and formatting.

---

## 📄 Scanning & Generating Audit Reports

Wp Standards Checker makes it easy to visualize your project's health with professional reports.

### 1. Full Project Scan
Run a recursive scan of your entire project to identify standards and security violations.
- **Workflow**: `@[/wp-standards-checker] Scan my entire plugin directory and identify all violations.`
- **Result**: The AI will output a summary of errors categorized by Security, Standards, and Performance.

### 2. Generating a Pre-Submission Report
Before submitting to WordPress.org, generate a definitive document that proves compliance.
- **Workflow**: `@[/wp-standards-checker] Generate a detailed AUDIT_REPORT.md file for this plugin. Focus on WP.org blockers.`
- **Result**: A markdown file is created containing a checklist of all 33+ blockers, your current status, and a "Ready for Submission" verdict.

### 3. The "Review-and-Fix" Loop
You can ask the AI to systematically fix issues found in the report:
- **Prompt**: *"Review the AUDIT_REPORT.md I just generated. One-by-one, fix every section marked as 'Violation' and update the report when done."*

---

## 📂 Detailed Developer Scenarios

### Scenario A: Cleaning Up Legacy Code
- **Problem**: You inherited an old plugin with mixed indentation (tabs/spaces), non-standard function naming, and hundreds of linting warnings.
- **The Process**: The skill uses `phpcbf` to fix formatting instantly and then uses AI to rename functions/variables to meet snake_case standards.
- **Example Prompt**: `"/wp-standards-checker ./path-to-plugin --fix"` or *"Clean up the coding standards in my /includes folder and fix all Yoda conditions."*

### Scenario B: Preparing for WordPress.org Submission
- **Problem**: Worried about rejection for trademark issues, missing `ABSPATH` guards, or improper script enqueuing.
- **The Process**: The skill performs an exhaustive audit against the **33+ Critical Blockers** and generates a detailed report.
- **Example Prompt**: `"/wp-standards-checker . --pcp"` or *"Check if my plugin is ready for WordPress.org. Generate a list of any potential blockers."*

### Scenario C: Safe SQL Security Retrofitting
- **Problem**: Raw SQL queries vulnerable to injection.
- **The Process**: The AI identifies every `raw` SQL query and wraps them in `$wpdb->prepare()` with a **Functional Parity Check**.
- **Example Prompt**: *"Find every raw SQL query in this plugin and fix it using $wpdb->prepare(). Ensure no logic is changed."*

### Scenario D: Professional Internationalization (i18n)
- **Problem**: Hardcoded English strings across 50+ files.
- **The Process**: The skill scans PHP and JS files and wraps literals in the correct translation functions using your project's text-domain.
- **Example Prompt**: *"Make my entire plugin translation-ready. Add translation functions to all hardcoded strings."*

### Scenario E: Surgical i18n for React/Vue Dashboards
- **Problem**: Complex JS dashboards where manual i18n might break template logic.
- **The Process**: Uses a **Surgical Protocol**—extracting to a PHP Bridge class and precisely replacing literals in JS/Vue components.
- **Example Prompt**: *"I need to add i18n support to my Vue dashboard. Follow the Surgical Migration Protocol and create a PHP provider class."*

### Scenario F: Collision & Conflict Audit
- **Problem**: Function name collisions with other popular plugins.
- **The Process**: Scans for global functions/classes lacking a unique prefix and safely renames them across the entire codebase.
- **Example Prompt**: *"Perform a Collision Audit. Ensure every global function has my 'wpsf_' prefix to avoid conflicts."*

### Scenario G: Accessibility (A11y) Retrofitting
- **Problem**: Admin screens aren't accessible (missing ARIA labels, poor focus management).
- **The Solution**: Audits markup against WCAG 2.1 standards and adds necessary hooks/labels.
- **Example Prompt**: *"Audit my admin views for accessibility. Add required ARIA labels and ensure all interactive elements are keyboard reachable."*

### Scenario H: High-Scale Database Optimization
- **Problem**: Inefficient `post_meta` queries slowing down high-traffic sites.
- **The Process**: Identifies non-scalable patterns and refactors them into custom taxonomies or cached transients.
- **Example Prompt**: *"Check my database logic for scaling issues. Refactor any heavy meta queries into cached transients or taxonomies."*

---

## 💡 The Prompt Library (Pro Skills)

Invoke these specific tasks using `/wp-standards-checker` followed by your request:

- `"/wp-standards-checker ./path --fix"` — *Instant binary formatting + AI logic fix.*
- `"/wp-standards-checker ./path --pcp"` — *Run the official Plugin Check logic.*
- *"@[/wp-standards-checker] Check for trademark violations in my readme and plugin name."*
- *"@[/wp-standards-checker] Perform a deep security audit for XSS and SQLi vulnerabilities."*
- *"@[/wp-standards-checker] If wp-translate is missing, install it and translate this plugin to French."*

---

## 🤖 Developing Features with AI (The Blueprint Mode)

When you mention **Wp Standards Checker** while developing a new feature, you aren't just getting a code snippet—you are triggering a **Full Engineering Audit** of the AI's generation process.

### How it works:
1. **Trigger the Mother Skill**: Begin your prompt with `@wp-standards-checker` or `/wp-standards-checker`.
2. **Deep Rule Analysis**: The AI is instructed to read **all 18+ modular knowledge files** (Security, A11y, Performance, WP.org Blockers) before writing a single line of code.
3. **Auto-Orchestration**: If your request involves specific domains (e.g., translation, database optimization, or Gutenberg blocks), the suite **automatically checks for and suggests/installs** missing specialized skills like `wp-translate` or `wp-performance` to ensure the logic is perfect.

### The AI Result (Advanced Compliance):
- **Universal Standards**: Enforces exact indentation (logical tabs), `ABSPATH` protection, and unique ≥4 char project prefixing.
- **Deep Security**: Implements late escaping, proper sanitization for every `$_POST`/`$_GET` variable, and mandatory nonce verification.
- **Performance-First**: Uses transients for caching, avoids heavy meta queries, and implements efficient database patterns from the start.
- **A11y Ready**: Generates semantic HTML with proper ARIA roles and keyboard accessibility.

**Result**: Your code is born in a state of institutional-grade compliance. No refactoring, no security patches, and no WP.org rejections.

---

## 📂 KNOWLEDGE DIRECTORY
Wp Standards Checker is powered by 18 modular knowledge files including:
- `knowledge/01_WP_ORG_BLOCKERS.md` — The "33+ Rejection Categories".
- `knowledge/02_PCP_LOGIC.md` — Logic from official `plugin-check`.
- `knowledge/15_WP_COM_MARKETPLACE.md` — High-scale Managed Hosting standards.
- `knowledge/16_AI_AGENT_BEST_PRACTICES.md` — The "Golden Rules" for AI teammates.

---

## 🛡️ Functional Safety Protocols
This skill strictly prohibits:
*   **Prohibited Renaming**: Will NEVER rename existing files or public methods.
*   **Translation Preservation**: Will NEVER change your Text Domain globally.
*   **Dependency Awareness**: Protects integration points for addons (WC/Elementor).

---

## 🛠️ Wp Standards Checker Ecosystem
Wp Standards Checker acts as a hub for the entire WordPress Agent Skill ecosystem. It automatically detects missing dependencies and suggests/installs them.

| Skill | What it teaches |
|---|---|
| **wordpress-router** | Classifies WordPress repos and routes to the right workflow. |
| **wp-project-triage** | Detects project type, tooling, and versions automatically. |
| **wp-block-development** | Gutenberg blocks: `block.json`, attributes, rendering, deprecations. |
| **wp-block-themes** | Block themes: `theme.json`, templates, patterns, style variations. |
| **wp-plugin-development** | Plugin architecture, hooks, settings API, security. |
| **wp-rest-api** | REST API routes/endpoints, schema, auth, and response shaping. |
| **wp-interactivity-api** | Frontend interactivity with `data-wp-*` directives and stores. |
| **wp-abilities-api** | Capability-based permissions and REST API auth. |
| **wp-wpcli-and-ops** | WP-CLI commands, automation, multisite, search-replace. |
| **wp-performance** | Profiling, caching, database optimization, Server-Timing. |
| **wp-phpstan** | PHPStan static analysis for WordPress projects. |
| **wp-playground** | WordPress Playground for instant local environments. |
| **wpds** | WordPress Design System. |

---

## ❓ FAQ

**Q: Does this replace PHP_CodeSniffer (PHPCS)?**
A: No, it enhances it. It uses PHPCS as a core engine but layers AI logic on top for things PHPCS cannot detect (like business logic security risks or missing `ABSPATH`).

**Q: Can I use it on a single file or only whole projects?**
A: Both. You can invoke `/wp-standards-checker` on a folder, a file, or even just a snippet of selected code.

**Q: What if I don't have PHPCS installed locally?**
A: No problem. The suite has a built-in "Standalone AI Mode" that performs audits using its knowledge base even without local binaries.

**Q: Will it break my plugin logic when renaming things?**
A: The suite follows a "Safety-First" protocol and performs functional parity checks. However, we always recommend reviewing changes before committing.

**Q: Can it help me migrate a plugin to the WordPress.com Marketplace?**
A: Yes! It includes specific rulesets for WP.com's high-scale and managed hosting environments.

---

## 🚀 Featured Tool: [wp-translate](https://github.com/Shahreyar46/wp-translate)
**Built by: [Shahreyar46](https://github.com/Shahreyar46)**

The definitive automation tool for WordPress internationalization (i18n). While **Wp Standards Checker** audits your code, **wp-translate** handles the heavy lifting of localization. It is designed to work in perfect harmony with the standards suite for all localization requirements:

*   **Auto-Translation**: Uses AI to translate your entire plugin into 16+ languages in seconds.
*   **Zero API Keys**: No external services or paid APIs required—the AI translates directly.
*   **Full Pipeline**: Scans PHP/JS, generates `.pot`, writes `.po`, and compiles binary `.mo` files automatically.
*   **Perfect Pair**: The best way to implement "Method 2" i18n strategy documented above.

---

## 🔗 Project & Updates
`git pull origin master` in your local skill directory.

**Maintained by**: [Shahreyar46](https://github.com/Shahreyar46/wp-standards)
