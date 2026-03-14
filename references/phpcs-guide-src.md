# PHPCS + WPCS Guide

## Overview
This document serves as a reference guide for AI code generation to ensure adherence to WordPress Coding Standards (WPCS) via PHP_CodeSniffer (PHPCS).

**Note:** This project uses globally installed PHPCS/WPCS. No local `phpcs.xml` configuration is needed.

## Installation
- Global (Windows):
  - Install Composer and add `%USERPROFILE%\AppData\Roaming\Composer\vendor\bin` to `PATH`.
  - Run:
    - `composer global config allow-plugins.dealerdirect/phpcodesniffer-composer-installer true`
    - `composer global require --dev wp-coding-standards/wpcs:"^3.0"`
- Project local install (if using Composer in this repo):
  - `composer config allow-plugins.dealerdirect/phpcodesniffer-composer-installer true`
  - `composer require --dev wp-coding-standards/wpcs:"^3.0"`
- Verify:
  - `phpcs -i` should list `WordPress`, `WordPress-Core`, `WordPress-Docs`, `WordPress-Extra`.

## Running Checks
- Use project ruleset:
  - From plugin root: `phpcs -p -s .`
- Explicit WPCS standard:
  - `phpcs -p -s --standard=WordPress .`
- Respect ignore patterns and extensions:
  - `phpcs -p -s --standard=WordPress --extensions=php --ignore=vendor,node_modules,tests,assets .`

## Auto-fixing
- `phpcbf -p -s .`
- Not all issues can be auto-fixed (especially security-related sniffs).

## IDE Integration

### VS Code
1. Install `phpcs` extension
2. Set `phpcs.standard` to `WordPress`
3. Configure tab settings in `.vscode/settings.json`:
```json
{
  "editor.insertSpaces": false,
  "editor.tabSize": 4,
  "editor.detectIndentation": false,
  "[php]": {
    "editor.insertSpaces": false,
    "editor.tabSize": 4
  }
}
```

### PhpStorm
1. Go to Settings → PHP → Quality Tools → PHP_CodeSniffer
2. Point to `vendor/squizlabs/php_codesniffer/bin/phpcs`
3. Select `WordPress` standard
4. Configure tab settings:
   - Settings → Editor → Code Style → PHP
   - Set "Use tab character" (not spaces)
   - Tab size: 4
   - Indent: 4

## CI Suggestions
- Fail builds on PHPCS violations.
- Example command: `phpcs -p -s --report=full --runtime-set minimum_wp_version 6.5 .`

## PSR-4 Autoloading
- Class files follow PSR-4 (`Namespace/ClassName.php`).
- Filename checks for hyphenated lowercase and CamelCase are ignored for class files.
- Ensure namespaces and directory structure match the autoloader.

## Ruleset Properties (Recommended)
- Text domain enforcement (`WordPress.WP.I18n`):
```
<rule ref="WordPress.WP.I18n">
  <properties>
    <property name="text_domain" type="array">
      <element value="wp-dark-mode"/>
    </property>
  </properties>
</rule>
```
- Minimum WordPress version:
  - Global config: `<config name="minimum_wp_version" value="6.5" />`
  - CLI runtime: `--runtime-set minimum_wp_version 6.5`
- Prefix all globals:
  - Configure `WordPress.NamingConventions.PrefixAllGlobals` with a plugin prefix (≥4 chars)
- Disregard class filename rules for PSR-4:
  - Configure `WordPress.Files.FileName` to ignore class filename checks for PSR-4 class files

## Common PHPCS Commands

### Check Specific Files
```bash
phpcs -ps src/Plugin.php
phpcs -ps src/API/
```

### Generate Reports
```bash
# Summary report
phpcs --report=summary .

# Full report
phpcs --report=full .

# JSON report (for CI)
phpcs --report=json .

# Multiple reports
phpcs --report=summary --report=source .
```

### Fix Specific Issues
```bash
# Fix only spacing issues
phpcbf --sniffs=WordPress.WhiteSpace .

# Fix tab/space indentation issues
phpcbf --sniffs=Generic.WhiteSpace.DisallowSpaceIndent .

# Fix specific file
phpcbf src/Plugin.php
```

### Convert Spaces to Tabs
If your code uses spaces for indentation, convert to tabs:
```bash
# Auto-fix all space indentation to tabs
phpcbf --sniffs=Generic.WhiteSpace.DisallowSpaceIndent .

# Check for space indentation issues
phpcs --sniffs=Generic.WhiteSpace.DisallowSpaceIndent .
```

### Check Against Specific Standard
```bash
phpcs --standard=WordPress-Core .
phpcs --standard=WordPress-Extra .
phpcs --standard=WordPress-Docs .
```

## Common WPCS Issues and Fixes

### Parameter Comment Full Stop
**Issue:** `Squiz.Commenting.FunctionComment.ParamCommentFullStop`

All parameter comments in PHPDoc blocks must end with a full stop (period).

**Wrong:**
```php
/**
 * Create new product
 *
 * @param array $data Product data
 * @return Product|null
 */
```

**Correct:**
```php
/**
 * Create new product
 *
 * @param array $data Product data.
 * @return Product|null
 */
```

### Inline Comment Full Stop
**Issue:** `Squiz.Commenting.InlineComment.InvalidEndChar`

All inline comments must end with a full stop.

**Wrong:**
```php
// Initialize plugin
$plugin = new Plugin();
```

**Correct:**
```php
// Initialize plugin.
$plugin = new Plugin();
```

## Ignoring Specific Rules

### Inline Ignore (Single Line)
```php
// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery
$results = $wpdb->get_results( $query );
```

### Block Ignore (Multiple Lines)
```php
// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery
$results = $wpdb->get_results( $query1 );
$more = $wpdb->get_results( $query2 );
// phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery
```

### File-Level Ignore
```php
<?php
// phpcs:ignoreFile
```

### Ignore Specific Sniff for Entire File
```php
<?php
// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery
```

## Troubleshooting

### PHPCS Not Finding WordPress Standards
```bash
# Check installed standards
phpcs -i

# If WordPress not listed, reinstall
composer global remove wp-coding-standards/wpcs
composer global require --dev wp-coding-standards/wpcs:"^3.0"

# Set installed paths
phpcs --config-set installed_paths ~/.composer/vendor/wp-coding-standards/wpcs
```

### Performance Issues
```bash
# Use parallel processing
phpcs --parallel=8 .

# Limit file extensions
phpcs --extensions=php .

# Exclude large directories
phpcs --ignore=vendor,node_modules .
```

### Memory Limit Issues
```bash
# Increase PHP memory limit
php -d memory_limit=512M vendor/bin/phpcs .
```

## Pre-commit Hook

Create `.git/hooks/pre-commit`:
```bash
#!/bin/bash
# Run PHPCS on staged PHP files

FILES=$(git diff --cached --name-only --diff-filter=ACM | grep '\.php$')

if [ -n "$FILES" ]; then
    echo "Running PHPCS on staged files..."
    phpcs --standard=WordPress $FILES
    
    if [ $? -ne 0 ]; then
        echo "PHPCS found errors. Commit aborted."
        echo "Run 'phpcbf' to auto-fix issues or fix manually."
        exit 1
    fi
fi

exit 0
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

## PSR-4 Autoloading
- Class files follow PSR-4 (`Namespace/ClassName.php`).
- Filename checks for hyphenated lowercase and CamelCase are ignored for class files.
- Ensure namespaces and directory structure match the autoloader.

## Rule Sources
- WordPressCS/WPCS: https://github.com/WordPress/WordPress-Coding-Standards
- Packagist: https://packagist.org/packages/wp-coding-standards/wpcs
- Customizable properties: https://github.com/WordPress/WordPress-Coding-Standards/wiki/Customizable-sniff-properties
- Yoda and assignments context: https://make.wordpress.org/core/2022/06/14/upcoming-disallow-assignments-in-conditions-and-remove-the-yoda-condition-requirement-for-php/