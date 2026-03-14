# 🛠️ DEVELOPER TOOLS SETUP

---

## 1. PHPCS & WPCS Installation

### Windows (One-liner)
```powershell
powershell -c "irm https://raw.githubusercontent.com/Shahreyar46/wp-standards/master/install.bat -OutFile install.bat; .\install.bat"
```

### Manual Configuration
1. Install [Composer](https://getcomposer.org/).
2. Run: `composer global require "squizlabs/php_codesniffer=*"`
3. Clone [WPCS](https://github.com/WordPress/WordPress-Coding-Standards).
4. Register: `phpcs --config-set installed_paths path/to/wpcs`

---

## 2. VS Code Integration
To see errors directly in your editor:
1. Install the **phpcs** extension by Ioannis Papikas.
2. In `settings.json`, set:
```json
"phpcs.standard": "WordPress",
"phpcs.enable": true
```

---

## 3. WP-CLI Reference
- `wp plugin check ./path` (Runs PCP logic)
- `wp i18n make-pot ./path` (Generates translation files)
